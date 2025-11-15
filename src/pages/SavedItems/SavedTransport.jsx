import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { HeartFill, Trash, GeoAlt } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const SavedTransport = () => {
  return (
    <Container className="my-4">
     

     
      {/* Cards */}
      <Row className="g-3">
        {/* Metro */}
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">Metro Line 1</h6>
                  <p className="text-muted mb-1">El Marg → Helwan</p>
                  <div className="d-flex gap-3 flex-wrap mb-2">
                    <span>🕒 45 min</span>
                    <span>📏 21 km</span>
                    <span>💲5 EGP</span>
                  </div>
                  <span className="badge bg-danger">Red Line</span>
                  <small className="text-muted d-block mt-2">
                    Saved on 10/22/2025
                  </small>
                </div>
                <Button variant="light" className="text-danger">
                  <Trash />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Bus */}
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">Bus 256</h6>
                  <p className="text-muted mb-1">Nasr City → Downtown</p>
                  <div className="d-flex gap-3 flex-wrap mb-2">
                    <span>🕒 30 min</span>
                    <span>📏 10 km</span>
                    <span>💲4 EGP</span>
                  </div>
                  <span className="badge bg-primary">Bus</span>
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

        {/* Minibus */}
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">Minibus 45</h6>
                  <p className="text-muted mb-1">Dokki → Mohandessin</p>
                  <div className="d-flex gap-3 flex-wrap mb-2">
                    <span>🕒 20 min</span>
                    <span>📏 7 km</span>
                    <span>💲3 EGP</span>
                  </div>
                  <span className="badge bg-success">Minibus</span>
                  <small className="text-muted d-block mt-2">
                    Saved on 10/25/2025
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

      {/* الإحصائيات */}
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
                <h4>95</h4>
                <p className="text-muted mb-0">Total Minutes</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default SavedTransport;
