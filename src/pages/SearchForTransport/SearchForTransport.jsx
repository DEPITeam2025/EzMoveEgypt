import React, { useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Form,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

//Buses data import
import busRoutesData from '/src/Data/bus/routes.json';
import busTripsData from '/src/Data/bus/trips.json';
import busStopTimesData from '/src/Data/bus/stop_times.json';
import busStopsData from '/src/Data/bus/stops.json';

//Metro data import
import metroRoutesData from '/src/Data/metro/routes.json';
import metroTripsData from '/src/Data/metro/trips.json';
import metroStopTimesData from '/src/Data/metro/stop_times.json';
import metroStopsData from '/src/Data/metro/stops.json';

// (Helper Functions) 
const allRoutesData = [...busRoutesData, ...metroRoutesData];
const allTripsData = [...busTripsData, ...metroTripsData];
const allStopTimesData = [...busStopTimesData, ...metroStopTimesData];
const allStopsData = [...busStopsData, ...metroStopsData];

const getRouteTypeColor = (routeType) => {
  // 1: Metro, 3: Bus
  return routeType === 1 ? "danger" : "primary";
};

//search for route details by line number
const findRouteDetails = (lineNumber) => {
  const normalizedLineNumber = lineNumber.toUpperCase().trim();
  const route = allRoutesData.find(
    (r) => r.route_short_name === normalizedLineNumber
  );
  if (!route) return null;

  const trip = allTripsData.find((t) => t.route_id === route.route_id);
  if (!trip) return null;

  const routeStopTimes = allStopTimesData
    .filter((st) => st.trip_id === trip.trip_id)
    .sort((a, b) => a.stop_sequence - b.stop_sequence);

  if (routeStopTimes.length === 0) return null;

  const detailedStops = routeStopTimes.map((st) => {
    const stop = allStopsData.find((s) => s.stop_id === st.stop_id);
    const [hours, minutes, seconds] = st.arrival_time.split(":").map(Number);
    const now = new Date();
    const departureTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      seconds || 0
    );
    const isPassed = departureTime < now;

    return {
      name: stop ? stop.stop_name : `Stop ID: ${st.stop_id}`,
      time: st.arrival_time.substring(0, 5),
      isPassed: isPassed,
    };
  });

  const dailySchedule = allStopTimesData
    .filter((st) => st.stop_id === detailedStops[0].stop_id)
    .map((st) => st.departure_time)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
    .map((time) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const now = new Date();
      const departureTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        seconds || 0
      );
      return { time: time.substring(0, 5), isPassed: departureTime < now };
    });

  return {
    number: route.route_short_name,
    name: route.route_long_name || route.route_short_name,
    description: route.route_desc,
    stops: detailedStops,
    schedule: dailySchedule.slice(0, 12),
    isMetro: route.route_type === 1,
    route_id: route.route_id, // مهم للبحث بالمنطقة
  };
};

//دالة البحث بالمنطقة
const findRoutesByStopName = (areaName) => {
  const normalizedAreaName = areaName.toLowerCase().trim();

  // 1. إيجاد المحطات المطابقة لاسم المنطقة
  const matchingStops = allStopsData.filter(
    (s) => s.stop_name && s.stop_name.toLowerCase().includes(normalizedAreaName)
  );

  if (matchingStops.length === 0) return [];

  const matchingStopIds = matchingStops.map((s) => s.stop_id);

  // 2. إيجاد كل الرحلات (Trips) التي تتوقف عند هذه المحطات
  const uniqueTripIds = new Set(
    allStopTimesData
      .filter((st) => matchingStopIds.includes(st.stop_id))
      .map((st) => st.trip_id)
  );

  // 3. إيجاد كل الخطوط (Routes) المتعلقة بهذه الرحلات
  const uniqueRouteIds = new Set(
    allTripsData
      .filter((t) => uniqueTripIds.has(t.trip_id))
      .map((t) => t.route_id)
  );

  // 4. تجميع تفاصيل الخطوط
  const results = allRoutesData
    .filter((r) => uniqueRouteIds.has(r.route_id))
    .map((r) => ({
      number: r.route_short_name,
      name: r.route_long_name || r.route_short_name,
      type: r.route_type === 1 ? "Metro" : "Bus/Microbus",
      route_id: r.route_id,
      color: getRouteTypeColor(r.route_type),
    }));

  return results;
};

// ----------------------------------------------------
//  SearchForTransport 
// ----------------------------------------------------
function SearchForTransport() {

  const [activeKey, setActiveKey] = useState("number");
  const [lineNumber, setLineNumber] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");

  // حالات جديدة للبحث بالمنطقة
  const [areaName, setAreaName] = useState("");
  const [areaResults, setAreaResults] = useState(null);
  const [areaError, setAreaError] = useState("");

  // دالة البحث برقم الخط
  const handleLineSearch = (e) => {
    e.preventDefault();
    setError("");
    setSearchResults(null);

    const data = findRouteDetails(lineNumber);

    if (data) {
      setSearchResults(data);
    } else {
      setError(
        `No route found or missing data for line: ${lineNumber}. Try M1 or CTA 354.`
      );
    }
  };

  // دالة البحث بالمنطقة
  const handleAreaSearch = (e) => {
    e.preventDefault();
    setAreaError("");
    setAreaResults(null);

    if (areaName.length < 3) {
      setAreaError("Please enter at least 3 characters for the area search.");
      return;
    }

    const results = findRoutesByStopName(areaName);

    if (results.length > 0) {
      setAreaResults(results);
    } else {
      setAreaError(`No lines found serving an area matching: ${areaName}`);
    }
  };
//BusRouteDetails Component
  const renderBusRouteDetails = (route) => {
    const { name, stops, isMetro } = route;
    const startStop = stops[0]?.name || "Unknown Start";
    const endStop = stops[stops.length - 1]?.name || "Unknown End";
    const routeColor = isMetro ? "#dc3545" : "#007bff";

    return (
      <Card className="mt-4 border-0 shadow-lg">
        <Card.Header
          style={{ backgroundColor: routeColor }}
          className="text-white"
        >
          <h5 className="mb-0">
            {name} ({route.number})
          </h5>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="fw-bold text-muted bg-light">
            Route: {startStop} to {endStop}
          </ListGroup.Item>
          {stops.map((stop, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center py-2"
            >
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      index === 0
                        ? routeColor
                        : index === stops.length - 1
                        ? "#28a745"
                        : "#6c757d",
                    marginRight: "10px",
                  }}
                ></div>
                {stop.name}
              </div>
              <Badge bg="info" className="text-dark">
                {stop.time}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Body className="border-top">
          <h6 className="fw-bold" style={{ color: routeColor }}>
            Departures from: {startStop} (Today's Schedule)
          </h6>
          {/* ... عرض الجدول ... */}
        </Card.Body>
      </Card>
    );
  };

  //SearchByNumber Component
  const renderSearchByNumber = () => (
    <Card className="p-4 shadow">
      <Form onSubmit={handleLineSearch}>
        {/* ... مكان البحث والزر كما في السابق ... */}
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <Form.Group controlId="formLineNumber" className="mb-3 mb-md-0">
              <Form.Label className="fw-bold text-secondary">
                Enter Transport Line Number (e.g., M1, M3, or CTA 354)
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Line Number..."
                value={lineNumber}
                onChange={(e) => setLineNumber(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Button variant="primary" type="submit" className="w-100 mt-md-3">
              <i className="bi bi-search me-2"></i>Search
            </Button>
          </Col>
        </Row>
      </Form>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {searchResults && (
        <div className="mt-4">{renderBusRouteDetails(searchResults)}</div>
      )}
    </Card>
  );

  // SearchByArea Component
  const renderSearchByArea = () => (
    <Card className="p-4 shadow">
      <h4 className="text-success">Search By Area (Stops Match)</h4>
      <p className="lead text-muted">
        Find lines passing through a specific area or stop name.
      </p>
      <Form onSubmit={handleAreaSearch}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold text-secondary">
            Enter Stop or Area Name
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Sadat, Helwan, or Tahrir"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit">
          <i className="bi bi-geo-alt me-2"></i>Find Lines
        </Button>
      </Form>

      {/* عرض رسالة الخطأ أو النتائج */}
      {areaError && (
        <Alert variant="danger" className="mt-3">
          {areaError}
        </Alert>
      )}

      {areaResults && areaResults.length > 0 && (
        <div className="mt-4">
          <h5 className="text-dark">
            Found {areaResults.length} Lines near "{areaName}"
          </h5>
          <ListGroup>
            {areaResults.map((route, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold" style={{ color: route.color }}>
                  {route.number} - {route.name}
                </span>
                <Badge bg={route.color}>{route.type}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Alert variant="info" className="mt-3">
            Click on any number above to search for details in the "By Transport
            Number" tab. (هذه الميزة تحتاج لمنطق إضافي للربط)
          </Alert>
        </div>
      )}
    </Card>
  );

  // Return Statement
  return (
    <Container className="my-5">
      <h2 className="text-center mb-5 text-dark">
        🔍 Transport Search Portal (Unified)
      </h2>

      <Tabs
        id="transport-search-tabs"
        activeKey={activeKey}
        onSelect={(k) => {
          setActiveKey(k);
          // مسح حالات البحث عند تغيير التبويب
          setSearchResults(null);
          setError("");
          setLineNumber("");
          setAreaResults(null);
          setAreaError("");
          setAreaName("");
        }}
        className="mb-4 justify-content-center"
      >
        <Tab
          eventKey="number"
          title={<span className="fw-bold">By Transport Number</span>}
        >
          {renderSearchByNumber()}
        </Tab>
        <Tab eventKey="area" title={<span className="fw-bold">By Area</span>}>
          {renderSearchByArea()}
        </Tab>
      </Tabs>

      {/* Footer Section (لم يتم تغييرها) */}
      <Row className="mt-5 border-top pt-4 text-secondary">
        {/* ... محتوى الفوتر ... */}
      </Row>
    </Container>
  );
}

export default SearchForTransport;