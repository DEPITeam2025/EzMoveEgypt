import React, { useState, useMemo } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  Collapse,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

//Buses data import
import busRoutesData from "/src/Data/bus/routes.json";
import busTripsData from "/src/Data/bus/trips.json";
import busStopTimesData from "/src/Data/bus/stop_times.json";
import busStopsData from "/src/Data/bus/stops.json";

//Metro data import
import metroRoutesData from "/src/Data/metro/routes.json";
import metroTripsData from "/src/Data/metro/trips.json";
import metroStopTimesData from "/src/Data/metro/stop_times.json";
import metroStopsData from "/src/Data/metro/stops.json";

// (Helper Functions)
const allRoutesData = [...busRoutesData, ...metroRoutesData];
const allTripsData = [...busTripsData, ...metroTripsData];
const allStopTimesData = [...busStopTimesData, ...metroStopTimesData];
const allStopsData = [...busStopsData, ...metroStopsData];

const getRouteTypeColor = (routeType) => {
  return routeType === 1 ? "danger" : "primary";
};

// --- React Query Wrappers for Data Fetching ---

// Async wrapper for findRouteDetails
const fetchRouteDetails = async ({ queryKey }) => {
  const [_, lineNumber, routeLongname] = queryKey;
  if (!lineNumber) return null;
  // Simulate network delay for a more realistic React Query experience
  await new Promise(resolve => setTimeout(resolve, 300));
  return findRouteDetails(lineNumber, routeLongname);
};

// Async wrapper for findRoutesByArea
const fetchRoutesByArea = async ({ queryKey }) => {
  const [_, areaName] = queryKey;
  if (!areaName || areaName.length < 3) {
    // React Query will catch this error and set the isError state
    throw new Error("Please enter at least 3 characters for the area search.");
  }
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return findRoutesByStopName(areaName);
};

//search for route details by line number
const findRouteDetails = (lineNumber, routeLongname) => {
  if (!lineNumber) return null;
  const trimedLineNumber = lineNumber.trim().toLowerCase();
  const routes = allRoutesData.filter(
    (r) => r.route_short_name.toLowerCase() === trimedLineNumber
  );

  if (routes.length === 0) return null;

  let route = null;
  if (routes.length === 1) {
    route = routes[0];
  } else {
    // Try to find exact long name match (case-insensitive) when provided
    if (routeLongname) {
      const normalizedLong = routeLongname.trim().toLowerCase();
      route = routes.find(
        (r) => r.route_long_name.trim().toLowerCase() === normalizedLong
      );
    }

    // Fallback: try partial match on long name, else pick the first route
    if (!route) {
      if (routeLongname) {
        const normalizedLong = routeLongname.trim().toLowerCase();
        route = routes.find((r) =>
          (r.route_long_name || "").toLowerCase().includes(normalizedLong)
        );
      }
    }

    if (!route) {
      route = routes[0];
    }
  }

  if (!route) return null;

  const trip = allTripsData.find((t) => t.route_id === route.route_id);
  if (!trip) return null;

  const routeStopTimes = allStopTimesData
    .filter((st) => st.trip_id === trip.trip_id)
    .sort((a, b) => a.stop_sequence - b.stop_sequence);

  if (routeStopTimes.length === 0) return null;

  const detailedStops = routeStopTimes.map((st) => {
    const stop = allStopsData.find((s) => s.stop_id === st.stop_id);
    const arrival = st.arrival_time || st.departure_time || "00:00:00";
    const [hours, minutes, seconds] = arrival.split(":").map(Number);
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
      stop_id: st.stop_id,
      name: stop ? stop.stop_name : `Stop ID: ${st.stop_id}`,
      time: arrival.substring(0, 5),
      isPassed,
    };
  });

  const firstStopId = detailedStops[0]?.stop_id;
  const dailySchedule = firstStopId
    ? allStopTimesData
        .filter((st) => st.stop_id === firstStopId)
        .map((st) => st.departure_time || st.arrival_time)
        .filter((value, index, self) => value && self.indexOf(value) === index)
        .sort()
        .map((time) => {
          const [hours, minutes, seconds] = (time || "00:00:00")
            .split(":")
            .map(Number);
          const now = new Date();
          const departureTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes,
            seconds || 0
          );
          return {
            time: (time || "").substring(0, 5),
            isPassed: departureTime < now,
          };
        })
    : [];

  return {
    number: route.route_short_name,
    name: route.route_long_name || route.route_short_name,
    description: route.route_desc,
    stops: detailedStops,
    schedule: dailySchedule.slice(0, 12),
    isMetro: route.route_type === 1,
    route_id: route.route_id,
  };
};

// Helper function to categorize routes by type
const categorizeRouteType = (routeNumber) => {
  if (routeNumber === "Microbus") {
    return "Microbus";
  } else if (routeNumber === "Tomnaya") {
    return "Tomnaya";
  } else if (routeNumber.includes("Minibus")) {
    return "Minibus";
  } else if (routeNumber.startsWith("M") && /^M\d+$/.test(routeNumber)) {
    // Match M followed by digits only (M1, M2, M3, etc.)
    return "Metro";
  } else {
    return "Bus";
  }
};

// Helper function to get filter color based on route type
const getFilterColor = (routeType) => {
  switch (routeType) {
    case "Metro":
      return "primary";
    case "Microbus":
      return "success";
    case "Minibus":
      return "info";
    case "Tomnaya":
      return "warning";
    case "Bus":
      return "secondary";
    case "All":
      return "dark";
    default:
      return "secondary";
  }
};

//دالة البحث بالمنطقة
const findRoutesByStopName = (areaName) => {
  const normalizedAreaName = areaName.toLowerCase().trim();

  const matchingStops = allStopsData.filter(
    (s) => s.stop_name && s.stop_name.toLowerCase().includes(normalizedAreaName)
  );

  if (matchingStops.length === 0) return [];

  const matchingStopIds = matchingStops.map((s) => s.stop_id);

  const uniqueTripIds = new Set(
    allStopTimesData
      .filter((st) => matchingStopIds.includes(st.stop_id))
      .map((st) => st.trip_id)
  );

  const uniqueRouteIds = new Set(
    allTripsData
      .filter((t) => uniqueTripIds.has(t.trip_id))
      .map((t) => t.route_id)
  );

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

// --- React Query Setup ---
const queryClient = new QueryClient();

// SearchForTransport Component
function SearchForTransportContent() {
  const [activeKey, setActiveKey] = useState("number");
  const [lineNumber, setLineNumber] = useState("");
  const [lineSearchQuery, setLineSearchQuery] = useState(null);

  const {
    data: searchResults,
    error: lineError,
    isLoading: isLineLoading,
    isFetching: isLineFetching,
  } = useQuery({
    queryKey: ["routeDetails", lineSearchQuery],
    queryFn: fetchRouteDetails,
    enabled: !!lineSearchQuery,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const [areaName, setAreaName] = useState("");
  const [areaSearchQuery, setAreaSearchQuery] = useState(null);

  const {
    data: areaResults,
    error: areaError,
    isLoading: isAreaLoading,
    isFetching: isAreaFetching,
    isError: isAreaError,
  } = useQuery({
    queryKey: ["routesByArea", areaSearchQuery],
    queryFn: fetchRoutesByArea,
    enabled: !!areaSearchQuery,
    staleTime: 5 * 60 * 1000,
  });
  const [selectedRoute, setSelectedRoute] = useState({ number: null, name: null });

  const {
    data: selectedAreaRouteDetails,
    isLoading: isSelectedRouteLoading,
  } = useQuery({
    queryKey: ["routeDetails", selectedRoute.number, selectedRoute.name],
    queryFn: fetchRouteDetails,
    enabled: !!selectedRoute.number,
    staleTime: 5 * 60 * 1000,
  });
  const [activeFilters, setActiveFilters] = useState({
    All: true,
    Metro: false,
    Microbus: false,
    Tomnaya: false,
    Minibus: false,
    Bus: false,
  });

  // دالة البحث برقم الخط
  const handleLineSearch = (e) => {
    e.preventDefault();
    if (lineNumber.trim()) {
      setLineSearchQuery(lineNumber.trim());
    }
  };

  // دالة البحث بالمنطقة
  const handleAreaSearch = (e) => {
    e.preventDefault();
    setSelectedRoute({ number: null, name: null }); // Clear route details when starting a new area search
    if (areaName.trim()) {
      setAreaSearchQuery(areaName.trim());
    }
  };

  const handleSelectAreaRoute = (routeNumber, routeName) => {
    // If the same route is clicked again, close the details view
    if (selectedRoute.number === routeNumber && selectedRoute.name === routeName) {
      setSelectedRoute({ number: null, name: null });
    } else {
      setSelectedRoute({ number: routeNumber, name: routeName });
    }
  };

  // Filter results based on active filters
  const getFilteredAreaResults = () => {
    if (!areaResults) return [];
    if (activeFilters.All) return areaResults;

    const activeFilterType = Object.keys(activeFilters).find(
      (key) => activeFilters[key] && key !== "All"
    );

    if (!activeFilterType) return areaResults;

    return areaResults.filter((route) => {
      const routeType = categorizeRouteType(route.number);
      return routeType === activeFilterType;
    });
  };

  const toggleFilter = (filterName) => {
    setActiveFilters({
      All: filterName === "All",
      Metro: filterName === "Metro",
      Microbus: filterName === "Microbus",
      Tomnaya: filterName === "Tomnaya",
      Minibus: filterName === "Minibus",
      Bus: filterName === "Bus",
    });
  };

  // Helper function to count routes by category
  const getRouteCounts = () => {
    if (!areaResults) {
      return { All: 0, Metro: 0, Microbus: 0, Tomnaya: 0, Minibus: 0, Bus: 0 };
    }

    const counts = {
      All: areaResults.length,
      Metro: 0,
      Microbus: 0,
      Tomnaya: 0,
      Minibus: 0,
      Bus: 0,
    };

    areaResults.forEach((route) => {
      const routeType = categorizeRouteType(route.number);
      counts[routeType]++;
    });

    return counts;
  };

  const routeCounts = getRouteCounts();

  // ✅ BusRouteDetails Component
  const renderBusRouteDetails = (route) => {
    const { name, stops, isMetro } = route;
    const startStop = stops[0]?.name || "Unknown Start";
    const endStop = stops[stops.length - 1]?.name || "Unknown End";
    const routeVariant = isMetro ? "danger" : "primary";

    return (
      <Card className="mt-4 border-0 shadow-lg">
        <Card.Header className={`bg-${routeVariant} text-white`}>
          <h4 className="mb-0">
            <i className={`bi bi-${isMetro ? "train-front" : "bus-front"} me-2`}></i>
            Line {route.number} - {name}
          </h4>
        </Card.Header>
        <Card.Body>
          {/* Route Info */}
          <Row className="mb-4 p-3 bg-light rounded border">
            <Col>
              <small className="text-muted d-block">From</small>
              <strong className="text-success">{startStop}</strong>
            </Col>
            <Col className="text-center">
              <i className="bi bi-arrow-right text-secondary"></i>
            </Col>
            <Col className="text-end">
              <small className="text-muted d-block">To</small>
              <strong className="text-danger">{endStop}</strong>
            </Col>
          </Row>

          {/* Stops List */}
          <h6 className="fw-bold mb-2">
            <i className="bi bi-pin-map me-2"></i>
            Stops ({stops.length})
          </h6>
          <ListGroup variant="flush" className="border rounded mb-4">
            {stops.map((stop, index) => (
              <ListGroup.Item
                key={index}
                className="py-3 px-3 d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center flex-grow-1">
                  <Badge
                    bg={
                      index === 0
                        ? "success"
                        : index === stops.length - 1
                        ? "danger"
                        : "secondary"
                    }
                    className="me-2"
                    pill
                  >
                    {index + 1}
                  </Badge>
                  <span className="text-truncate">{stop.name}</span>
                </div>
                <Badge bg="info" text="dark" className="ms-2">
                  {stop.time}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Daily Schedule */}
          <h6 className="fw-bold mb-3">
            <i className="bi bi-clock-history me-2"></i>
            Today's Schedule
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {route.schedule &&
              route.schedule.map((scheduleItem, idx) => (
                <OverlayTrigger
                  key={idx}
                  overlay={
                    <Tooltip id={`tooltip-${idx}`}>
                      {scheduleItem.isPassed ? "Passed" : "Upcoming"}
                    </Tooltip>
                  }
                >
                  <Badge
                    bg={scheduleItem.isPassed ? "secondary" : routeVariant}
                    className="p-2 cursor-pointer"
                  >
                    {scheduleItem.time}
                  </Badge>
                </OverlayTrigger>
              ))}
          </div>
        </Card.Body>
      </Card>
    );
  };

  // ✅ SearchByNumber Component -
  const renderSearchByNumber = () => (
    <Card className="p-4 shadow">
      <Card.Body>
        <h4 className="text-primary mb-3">
          <i className="bi bi-bus-front me-2"></i>Search By Line Number
        </h4>
        <p className="lead text-muted">
          Find the full route details and schedule for a specific line.
        </p>

        <Form onSubmit={handleLineSearch}>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={8}>
              <Form.Group controlId="formLineNumber" className="mb-0">
                <Form.Label className="fw-bold mb-2 d-block">
                  <i className="bi bi-hash me-2"></i>
                  Enter Line Number
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., M1, 354, 100"
                  value={lineNumber}
                  onChange={(e) => setLineNumber(e.target.value)}
                  size="lg"
                  required
                  style={{ height: "50px" }}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-100"
                style={{ height: "50px" }}
              >
                <i className="bi bi-search me-2"></i>Search
              </Button>
            </Col>
          </Row>
        </Form>

        {isLineLoading || isLineFetching ? (
          <Alert variant="info" className="mt-4">Searching for line {lineNumber}...</Alert>
        ) : lineError ? (
          <Alert variant="danger" className="mt-4" dismissible>
            <Alert.Heading>Search Error</Alert.Heading>
            <p>{lineError.message || `No route found or missing data for line: ${lineNumber}. Try M1 or CTA 354.`}</p>
          </Alert>
        ) : searchResults ? (
          <div className="mt-4">{renderBusRouteDetails(searchResults)}</div>
        ) : null}
      </Card.Body>
    </Card>
  );

  const renderSearchByArea = () => (
    <Card className="p-4 shadow">
      <Card.Body>
        <h4 className="text-success mb-3">
          <i className="bi bi-geo-alt me-2"></i>Search By Area
        </h4>
        <p className="lead text-muted">
          Find lines passing through a specific area or stop name.
        </p>

        <Form onSubmit={handleAreaSearch}>
          <Row className="g-3 align-items-center">
            <Col xs={12} md={8}>
              <Form.Group controlId="formAreaName" className="mb-0">
                <Form.Label className="fw-bold mb-2 d-block">
                  <i className="bi bi-pin-map me-2"></i>
                  Enter Stop or Area Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Sadat, Helwan, or Tahrir"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  size="lg"
                  required
                  style={{ height: "50px" }}
                />
                <Form.Text className="text-muted d-block mt-2">
                  Minimum 3 characters required
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Button
                variant="success"
                type="submit"
                size="lg"
                className="w-100"
                style={{ height: "50px" }}
              >
                <i className="bi bi-search me-2"></i>Find Lines
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Loading/Error State */}
        {isAreaLoading || isAreaFetching ? (
          <Alert variant="info" className="mt-4">Searching for routes in {areaName}...</Alert>
        ) : isAreaError ? (
          <Alert variant="danger" className="mt-4" dismissible>
            <Alert.Heading>Search Error</Alert.Heading>
            <p>{areaError.message}</p>
          </Alert>
        ) : null}

        {/* Results */}
        {areaResults && areaResults.length > 0 && !isAreaError && (
          <div className="mt-4">
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Found <strong>{areaResults.length}</strong> Lines near{" "}
              <strong>"{areaName}"</strong>
            </Alert>

            {/* Filter Buttons */}
            <div className="mb-4 p-3 bg-light rounded border">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-funnel me-2"></i>
                Filter by Transport Type
              </h6>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant={activeFilters.All ? "dark" : "outline-dark"}
                  size="sm"
                  onClick={() => toggleFilter("All")}
                  className="fw-bold"
                >
                  <i className="bi bi-list me-1"></i>All ({routeCounts.All})
                </Button>
                {routeCounts.Metro > 0 && (
                  <Button
                    variant={
                      activeFilters.Metro ? "primary" : "outline-primary"
                    }
                    size="sm"
                    onClick={() => toggleFilter("Metro")}
                    className="fw-bold"
                  >
                    <i className="bi bi-train-front me-1"></i>Metro (
                    {routeCounts.Metro})
                  </Button>
                )}
                {routeCounts.Microbus > 0 && (
                  <Button
                    variant={
                      activeFilters.Microbus ? "success" : "outline-success"
                    }
                    size="sm"
                    onClick={() => toggleFilter("Microbus")}
                    className="fw-bold"
                  >
                    <i className="bi bi-bus-front me-1"></i>Microbus (
                    {routeCounts.Microbus})
                  </Button>
                )}
                {routeCounts.Minibus > 0 && (
                  <Button
                    variant={activeFilters.Minibus ? "info" : "outline-info"}
                    size="sm"
                    onClick={() => toggleFilter("Minibus")}
                    className="fw-bold"
                  >
                    <i className="bi bi-bus-front me-1"></i>Minibus (
                    {routeCounts.Minibus})
                  </Button>
                )}
                {routeCounts.Tomnaya > 0 && (
                  <Button
                    variant={
                      activeFilters.Tomnaya ? "warning" : "outline-warning"
                    }
                    size="sm"
                    onClick={() => toggleFilter("Tomnaya")}
                    className="fw-bold"
                  >
                    <i className="bi bi-bus-front me-1"></i>Tomnaya (
                    {routeCounts.Tomnaya})
                  </Button>
                )}
                {routeCounts.Bus > 0 && (
                  <Button
                    variant={
                      activeFilters.Bus ? "secondary" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => toggleFilter("Bus")}
                    className="fw-bold"
                  >
                    <i className="bi bi-bus-front me-1"></i>Bus (
                    {routeCounts.Bus})
                  </Button>
                )}
              </div>
            </div>

            {/* Filtered Results */}
            {getFilteredAreaResults().length > 0 ? (
              <ListGroup className="mb-4">
                {getFilteredAreaResults().map((route, index) => (
                  <React.Fragment key={index}>
                    {/* Route Item */}
                    <ListGroup.Item
                      as="button"
                      onClick={() =>
                        handleSelectAreaRoute(route.number, route.name)
                      }
                      className="d-flex justify-content-between align-items-center text-start"
                      variant={
                        selectedRoute.name === route.name
                          ? "light"
                          : "white"
                      }
                      active={selectedRoute.name === route.name}
                    >
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <Badge
                            bg={getFilterColor(
                              categorizeRouteType(route.number)
                            )}
                            className="me-2"
                          >
                            {route.number}
                          </Badge>
                          <span className="text-dark">{route.name}</span>
                        </h6>
                        <small className="text-muted">{route.type}</small>
                      </div>
                      <i
                        className={`bi bi-chevron-${
                          selectedRoute.number === route.number
                            ? "up"
                            : "down"
                        } text-secondary`}
                      ></i>
                    </ListGroup.Item>

                    {/* Collapse Details */}
                    <Collapse
                      in={selectedRoute.name === route.name}
                    >
                      <div className="bg-light border-bottom p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0 text-info">
                            <i className="bi bi-bus-front me-2"></i>
                            Route Details
                          </h6>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setSelectedRoute({ number: null, name: null })}
                          >
                            <i className="bi bi-x-circle me-1"></i>Close
                          </Button>
                        </div>

                        {isSelectedRouteLoading ? (
                          <Alert variant="info">Loading route details...</Alert>
                        ) : selectedAreaRouteDetails ? (
                          <>
                            {/* Route Info */}
                            <Row className="mb-4 p-3 bg-white rounded border">
                              <Col>
                                <small className="text-muted d-block">
                                  From
                                </small>
                                <strong className="text-success">
                                  {selectedAreaRouteDetails.stops[0]?.name}
                                </strong>
                              </Col>
                              <Col className="text-center">
                                <i className="bi bi-arrow-right text-secondary"></i>
                              </Col>
                              <Col className="text-end">
                                <small className="text-muted d-block">To</small>
                                <strong className="text-danger">
                                  {
                                    selectedAreaRouteDetails.stops[
                                      selectedAreaRouteDetails.stops.length - 1
                                    ]?.name
                                  }
                                </strong>
                              </Col>
                            </Row>

                            {/* Stops List */}
                            <h6 className="fw-bold mb-2">
                              <i className="bi bi-pin-map me-2"></i>
                              Stops ({selectedAreaRouteDetails.stops.length})
                            </h6>
                            <div
                              style={{
                                maxHeight: "300px",
                                overflowY: "auto",
                              }}
                            >
                              <ListGroup
                                variant="flush"
                                className="border rounded"
                              >
                                {selectedAreaRouteDetails.stops.map(
                                  (stop, stopIndex) => (
                                    <ListGroup.Item
                                      key={stopIndex}
                                      className="py-2 px-3 d-flex justify-content-between align-items-center"
                                    >
                                      <div className="d-flex align-items-center flex-grow-1">
                                        <Badge
                                          bg={
                                            stopIndex === 0
                                              ? "success"
                                              : stopIndex ===
                                                selectedAreaRouteDetails.stops
                                                  .length -
                                                  1
                                              ? "danger"
                                              : "secondary"
                                          }
                                          className="me-2"
                                          pill
                                        >
                                          {stopIndex + 1}
                                        </Badge>
                                        <small className="text-truncate">
                                          {stop.name}
                                        </small>
                                      </div>
                                      <Badge
                                        bg="light"
                                        text="dark"
                                        className="ms-2"
                                      >
                                        {stop.time}
                                      </Badge>
                                    </ListGroup.Item>
                                  )
                                )}
                              </ListGroup>
                            </div>

                            {/* Daily Schedule */}
                            <h6 className="fw-bold mt-3 mb-2">
                              <i className="bi bi-clock-history me-2"></i>
                              Today's Schedule
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {selectedAreaRouteDetails.schedule &&
                                selectedAreaRouteDetails.schedule.map(
                                  (scheduleItem, idx) => (
                                    <OverlayTrigger
                                      key={idx}
                                      overlay={
                                        <Tooltip id={`tooltip-area-${idx}`}>
                                          {scheduleItem.isPassed
                                            ? "Passed"
                                            : "Upcoming"}
                                        </Tooltip>
                                      }
                                    >
                                      <Badge
                                        bg={
                                          scheduleItem.isPassed
                                            ? "secondary"
                                            : route.color
                                        }
                                        className="p-2"
                                      >
                                        {scheduleItem.time}
                                      </Badge>
                                    </OverlayTrigger>
                                  )
                                )}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </Collapse>
                  </React.Fragment>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="warning" className="mt-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                No transport types match your selected filters.
              </Alert>
            )}
          </div>
        )}

        {/* Initial Message */}
        {!areaSearchQuery && !areaResults && !isAreaError && (
          <Alert variant="info" className="mt-4">
            <i className="bi bi-info-circle me-2"></i>
            Search for a stop or area name to see available lines.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );

  // Return Statement
  return (
    <Container fluid className="my-5">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center text-dark fw-bold">
            <i className="bi bi-search me-2"></i>
            Transport Search Portal
          </h2>
          <p className="text-center text-muted">
            Search for transport routes by line number or area
          </p>
        </Col>
      </Row>

      {/* ✅ Tabs - Centered */}
      <Row className="mb-4">
        <Col className="text-center">
          <Tabs
            id="transport-search-tabs"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
            className="justify-content-center"
          >
            <Tab eventKey="number" title="Search By Line Number">
              <div className="mt-4">{renderSearchByNumber()}</div>
            </Tab>
            <Tab eventKey="area" title="Search By Area">
              <div className="mt-4">{renderSearchByArea()}</div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default function SearchForTransport() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchForTransportContent />
    </QueryClientProvider>
  );
}
