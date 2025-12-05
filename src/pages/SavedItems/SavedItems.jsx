import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Trash, HeartFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";

const SavedItems = () => {
  const { user } = useSelector((state) => state.auth);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const userKey = `savedItems-${user.uid}`;
    const items = JSON.parse(localStorage.getItem(userKey)) || [];
    setSavedItems(items);
  }, [user]);

  const handleDelete = (id) => {
    if (!user) return;
    const userKey = `savedItems-${user.uid}`;
    const updatedItems = savedItems.filter((item) => item.id !== id);
    setSavedItems(updatedItems);
    localStorage.setItem(userKey, JSON.stringify(updatedItems));
  };

  // Grouping by route: "from → to"
  const groupedItems = savedItems.reduce((acc, item) => {
    const key = `${item.from} → ${item.to}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const stats = {
    total: savedItems.length,
    transport: savedItems.filter((i) => i.type === "stop").length,
    routes: savedItems.filter((i) => i.type === "segment").length,
    minutes: savedItems.reduce((acc, i) => acc + (i.duration || 0), 0),
  };

  return (
    <Container className="my-4">
      {" "}
      <h5 className="text-danger fw-bold mb-1">
        {" "}
        <HeartFill className="me-2" /> Saved Items{" "}
      </h5>{" "}
      <p className="text-muted">
        Your saved transport lines and routes for quick access{" "}
      </p>
      {savedItems.length === 0 ? (
        <p className="text-muted">You have no saved items yet.</p>
      ) : (
        <>
          {Object.entries(groupedItems).map(([route, items]) => (
            <div key={route} className="mb-4">
              <h6 className="fw-bold mb-2">{route}</h6>
              {items.map((item) => (
                <Card key={item.id} className="mb-2 shadow-sm border-0">
                  <Card.Body className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <div className="d-flex gap-3 flex-wrap">
                        {item.duration && <span>🕒 {item.duration} min</span>}
                        {item.distance && <span>📏 {item.distance} km</span>}
                        {item.price && <span>💲{item.price} EGP</span>}
                      </div>
                      {item.line && (
                        <span
                          className={`badge ${
                            item.mode === "bus"
                              ? "bg-primary"
                              : item.mode === "metro"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {item.line}
                        </span>
                      )}
                      <small className="text-muted d-block mt-2">
                        Saved on{" "}
                        {item.savedAt || new Date().toLocaleDateString()}
                      </small>
                    </div>
                    <Button
                      variant="light"
                      className="text-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash />
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ))}

          {/* Statistics */}
          <div className="mt-4">
            <h6 className="fw-bold mb-3">Statistics</h6>
            <Row className="g-3">
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h4>{stats.routes}</h4>
                    <p className="text-muted mb-0">Saved Routes</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h4>{stats.transport}</h4>
                    <p className="text-muted mb-0">Saved Transport</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h4>{stats.total}</h4>
                    <p className="text-muted mb-0">Total Saved</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
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
