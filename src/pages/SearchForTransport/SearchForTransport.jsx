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
  Collapse,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchByLineNumber, useSearchByArea } from '../hooks/useTransportQueries';

function SearchForTransport() {
  const [activeKey, setActiveKey] = useState("number");
  const [lineNumber, setLineNumber] = useState("");
  const [areaName, setAreaName] = useState("");
  const [selectedAreaRouteDetails, setSelectedAreaRouteDetails] = useState(null);

  // ✅ استخدام React Query
  const {
    data: searchResults,
    isLoading: lineLoading,
    error: lineError,
    isFetching: lineIsFetching,
  } = useSearchByLineNumber(lineNumber);

  const {
    data: areaResults,
    isLoading: areaLoading,
    error: areaError,
    isFetching: areaIsFetching,
  } = useSearchByArea(areaName);

  const handleLineSearch = (e) => {
    e.preventDefault();
    // لا نحتاج لعمل شيء - React Query تتولى البحث تلقائياً
  };

  const handleAreaSearch = (e) => {
    e.preventDefault();
    // لا نحتاج لعمل شيء - React Query تتولى البحث تلقائياً
    setSelectedAreaRouteDetails(null);
  };

  // ✅ BusRouteDetails Component
  const renderBusRouteDetails = (route) => {
    const { name, stops, isMetro } = route;
    const startStop = stops[0]?.name || "Unknown Start";
    const endStop = stops[stops.length - 1]?.name || "Unknown End";
    const routeVariant = isMetro ? "danger" : "primary";

    return (
      <Card className="mt-4 border-0 shadow-lg">
        <Card.Header className={`bg-${routeVariant} text-white`}>
          <Card.Title className="mb-0">
            <i className="bi bi-bus-front me-2"></i>
            {name} <Badge bg="light" text="dark">{route.number}</Badge>
          </Card.Title>
        </Card.Header>

        <Card.Body>
          {/* Route Info */}
          <Row className="mb-4 p-3 bg-light rounded">
            <Col>
              <small className="text-muted d-block">From</small>
              <strong className="text-success">{startStop}</strong>
            </Col>
            <Col className="text-center">
              <i className="bi bi-arrow-right text-secondary display-6"></i>
            </Col>
            <Col className="text-end">
              <small className="text-muted d-block">To</small>
              <strong className="text-danger">{endStop}</strong>
            </Col>
          </Row>

          {/* Stops List */}
          <h6 className="fw-bold mb-3">
            <i className="bi bi-pin-map me-2"></i>
            Route Stops ({stops.length})
          </h6>
          <ListGroup variant="flush" className="mb-4 border rounded overflow-hidden">
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

  // ✅ SearchByNumber Component - مع React Query
  const renderSearchByNumber = () => (
    <Card className="p-4 shadow">
      <Card.Body>
        <Form onSubmit={handleLineSearch}>
          <Row className="g-3 align-items-center">
            <Col xs={12} md={8}>
              <Form.Group controlId="formLineNumber" className="mb-0">
                <Form.Label className="fw-bold mb-2 d-block">
                  <i className="bi bi-bus-front me-2"></i>
                  Enter Transport Line Number
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., M1, M3, or CTA 354"
                  value={lineNumber}
                  onChange={(e) => setLineNumber(e.target.value)}
                  size="lg"
                  required
                  style={{ height: '50px' }}
                  disabled={lineLoading}
                />
                <Form.Text className="text-muted d-block mt-2">
                  Try M1, M3, M5, or CTA 354
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-100"
                style={{ height: '50px' }}
                disabled={lineLoading || !lineNumber.trim()}
              >
                {lineLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>Search
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Error Alert */}
        {lineError && (
          <Alert variant="danger" className="mt-4" dismissible>
            <Alert.Heading>Search Error</Alert.Heading>
            <p>{lineError.message}</p>
          </Alert>
        )}

        {/* Loading State */}
        {lineLoading && (
          <div className="text-center mt-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Searching for route...</p>
          </div>
        )}

        {/* Results */}
        {searchResults && !lineLoading && (
          <div className="mt-4">{renderBusRouteDetails(searchResults)}</div>
        )}

        {/* Refetching Indicator */}
        {lineIsFetching && !lineLoading && (
          <small className="text-muted d-block mt-2">
            <i className="bi bi-arrow-repeat me-1"></i>
            Updating...
          </small>
        )}
      </Card.Body>
    </Card>
  );

  // ✅ SearchByArea Component - مع React Query
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
                  style={{ height: '50px' }}
                  disabled={areaLoading}
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
                style={{ height: '50px' }}
                disabled={areaLoading || areaName.length < 3}
              >
                {areaLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>Find Lines
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Error Alert */}
        {areaError && (
          <Alert variant="danger" className="mt-4" dismissible>
            <Alert.Heading>No Results Found</Alert.Heading>
            <p>{areaError.message}</p>
          </Alert>
        )}

        {/* Loading State */}
        {areaLoading && (
          <div className="text-center mt-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Searching for areas...</p>
          </div>
        )}

        {/* Results */}
        {areaResults && areaResults.length > 0 && !areaLoading && (
          <div className="mt-4">
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Found <strong>{areaResults.length}</strong> Lines near{" "}
              <strong>"{areaName}"</strong>
            </Alert>

            <ListGroup className="mb-4">
              {areaResults.map((route, index) => (
                <React.Fragment key={index}>
                  <ListGroup.Item
                    as="button"
                    onClick={() => setSelectedAreaRouteDetails(route.number)}
                    className="d-flex justify-content-between align-items-center text-start"
                    active={selectedAreaRouteDetails === route.number}
                  >
                    <div className="flex-grow-1">
                      <h6 className="mb-1">
                        <Badge bg={route.color} className="me-2">
                          {route.number}
                        </Badge>
                        <span className="text-dark">{route.name}</span>
                      </h6>
                      <small className="text-muted">{route.type}</small>
                    </div>
                    <i
                      className={`bi bi-chevron-${
                        selectedAreaRouteDetails === route.number ? "up" : "down"
                      } text-secondary`}
                    ></i>
                  </ListGroup.Item>

                  {/* Collapse Details - مع Query للتفاصيل */}
                  <Collapse in={selectedAreaRouteDetails === route.number}>
                    <div className="bg-light border-bottom p-4">
                      <AreaRouteDetails routeNumber={route.number} />
                    </div>
                  </Collapse>
                </React.Fragment>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Initial Message */}
        {!areaResults && !areaError && !areaLoading && (
          <Alert variant="info" className="mt-4">
            <i className="bi bi-info-circle me-2"></i>
            Search for a stop or area name to see available lines.
          </Alert>
        )}

        {/* Refetching Indicator */}
        {areaIsFetching && !areaLoading && (
          <small className="text-muted d-block mt-2">
            <i className="bi bi-arrow-repeat me-1"></i>
            Updating...
          </small>
        )}
      </Card.Body>
    </Card>
  );

  // مكون منفصل لتفاصيل الخط
  const AreaRouteDetails = ({ routeNumber }) => {
    const { data: routeDetails, isLoading } = useSearchByLineNumber(routeNumber);

    if (isLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" size="sm" />
        </div>
      );
    }

    if (!routeDetails) return null;

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-info">
            <i className="bi bi-bus-front me-2"></i>
            Route Details
          </h6>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setSelectedAreaRouteDetails(null)}
          >
            <i className="bi bi-x-circle me-1"></i>Close
          </Button>
        </div>
        {renderBusRouteDetails(routeDetails)}
      </>
    );
  };

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

      {/* Tabs */}
      <Row className="mb-4">
        <Col className="text-center">
          <Tabs
            id="transport-search-tabs"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
            variant="pills"
            className="justify-content-center"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Tab
              eventKey="number"
              title={
                <span>
                  <i className="bi bi-bus-front me-2"></i>
                  By Line Number
                </span>
              }
            />
            <Tab
              eventKey="area"
              title={
                <span>
                  <i className="bi bi-geo-alt me-2"></i>
                  By Area
                </span>
              }
            />
          </Tabs>
        </Col>
      </Row>

      {/* Content Area */}
      <Row className="justify-content-center">
        <Col lg={10}>
          {activeKey === "number" && renderSearchByNumber()}
          {activeKey === "area" && renderSearchByArea()}
        </Col>
      </Row>

      {/* Footer */}
      <Row className="mt-5 pt-4 border-top text-muted">
        <Col md={6}>
          <h6 className="fw-bold">Popular Lines</h6>
          <small>M1, M2, M3, M5, CTA 354, CTA 147</small>
        </Col>
        <Col md={6} className="text-end">
          <small>© 2024 Transport Portal. All rights reserved.</small>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchForTransport;