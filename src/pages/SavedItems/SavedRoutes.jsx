import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartFill, Trash, GeoAlt } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import MetroIcon from "../../assets/icons/Icon1.png";
import BusIcon from "../../assets/icons/Icon2.png";

const SavedRoutes = () => {
  return (
    <Container className="my-4">

      {/* Route Cards */}
      <Row className="g-3">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold">
                    <img src={BusIcon} alt="Bus" width="18" className="me-1" />
                    Downtown</h6>
                  <p className="text-muted mb-1">
                    <GeoAlt className="text-danger me-1" /> Airport
                  </p>
                  <div className="d-flex gap-3 flex-wrap mb-2">
                    <span>🕒 35 min</span>
                    <span>📏 12.5 km</span>
                    <span>🔄 1 transfer</span>
                    <span>💲2.50</span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge bg-danger">Red Line</span>
                    <span className="badge bg-primary">B 42</span>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Saved on 10/21/2025
                  </small>
                </div>
                <Button variant="light" className="text-danger">
                  <Trash />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold">Home</h6>
                  <p className="text-muted mb-1">
                    <GeoAlt className="text-danger me-1" /> Office
                  </p>
                  <div className="d-flex gap-3 flex-wrap mb-2">
                    <span>🕒 42 min</span>
                    <span>📏 10.8 km</span>
                    <span>🔄 2 transfers</span>
                    <span>💲2.00</span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge bg-info">M7</span>
                    <span className="badge bg-success">Green</span>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Saved on 10/23/2025
                  </small>
                </div>
                <Button variant="light" className="text-danger">
                  <Trash />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics */}
      <div className="mt-4">
        <h6 className="fw-bold mb-3">Statistics</h6>
        <Row className="g-3">
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h4>2</h4>
                <p className="text-muted mb-0">Saved Routes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h4>3</h4>
                <p className="text-muted mb-0">Saved Transport</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h4>5</h4>
                <p className="text-muted mb-0">Total Saved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h4>77</h4>
                <p className="text-muted mb-0">Total Minutes</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default SavedRoutes;
