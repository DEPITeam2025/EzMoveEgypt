import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Collapse } from "react-bootstrap";
import { Trash, HeartFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import styles from "./SavedItems.module.css"; // CSS MODULE

const SavedItems = () => {
  const { user } = useSelector((state) => state.auth);
  const [savedItems, setSavedItems] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    if (!user) return;
    const userKey = `savedItems-${user.uid}`;
    const items = JSON.parse(localStorage.getItem(userKey)) || [];
    setSavedItems(items);
  }, [user]);

  const handleDelete = (id) => {
    if (!user) return;

    const userKey = `savedItems-${user.uid}`;
    const updated = savedItems.filter((item) => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem(userKey, JSON.stringify(updated));

    setExpandedIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const stats = {
    total: savedItems.length,
    transport: savedItems.filter((i) => i.type === "stop").length,
    routes: savedItems.filter((i) => i.type === "segment").length,
    minutes: savedItems.reduce((acc, i) => acc + (i.duration || 0), 0),
  };

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center mb-3">
        <HeartFill className="text-danger me-2" size={28} />
        <h4 className="mb-0">Saved Items</h4>
      </div>

      <p className="text-muted mb-4">
        Your saved transport lines and routes for quick access
      </p>

      {savedItems.length === 0 ? (
        <p className="text-muted">You have no saved items yet.</p>
      ) : (
        <>
          <Row xs={1} sm={1} md={2} lg={3} className="g-4">
            {savedItems.map((route) => (
              <Col key={route.id}>
                <Card
                  className={`${styles.cardHover} shadow-sm border-0 rounded-4`}
                  onClick={() => toggleExpand(route.id)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">
                        {route.from} → {route.to}
                      </h6>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(route.id);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>

                    <Collapse in={expandedIds[route.id]}>
                      <div className={styles.expandBox}>
                        {route.steps.map((step, i) => (
                          <p key={i} className="mb-1">
                            {step.mode === "metro" ? "🚇" : "🚌"} {step.line} —{" "}
                            {step.stops || ""} stops
                          </p>
                        ))}
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Statistics */}
          <div className="mt-5">
            <h5 className="fw-bold mb-3">Statistics</h5>
            <Row className="g-3">
              <Col xs={6} md={3}>
                <Card
                  className={`${styles.statCard} text-center border-0 shadow-sm`}
                >
                  <Card.Body>
                    <h4>{stats.routes}</h4>
                    <p className="text-muted mb-0">Saved Routes</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={3}>
                <Card
                  className={`${styles.statCard} text-center border-0 shadow-sm`}
                >
                  <Card.Body>
                    <h4>{stats.transport}</h4>
                    <p className="text-muted mb-0">Saved Transport</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={3}>
                <Card
                  className={`${styles.statCard} text-center border-0 shadow-sm`}
                >
                  <Card.Body>
                    <h4>{stats.total}</h4>
                    <p className="text-muted mb-0">Total Saved</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={3}>
                <Card
                  className={`${styles.statCard} text-center border-0 shadow-sm`}
                >
                  <Card.Body>
                    <h4>{stats.minutes}</h4>
                    <p className="text-muted mb-0">Total Minutes</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Container>
  );
};

export default SavedItems;
