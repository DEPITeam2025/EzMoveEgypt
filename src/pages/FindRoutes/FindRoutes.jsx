import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import graphData from "../../Data/graph.json";
import { findShortestPath } from "../../utils/dijkstra";

export default function FindRoutes() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [routes, setRoutes] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [editRouteId, setEditRouteId] = useState(null);
  const [editSummary, setEditSummary] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const stops = Object.values(graphData.nodes);

  useEffect(() => {
    const saved = localStorage.getItem("savedRoutes");
    if (saved) setSavedRoutes(JSON.parse(saved));
  }, []);

  const selectOptions = useMemo(() => {
    const map = new Map();
    stops.forEach((s) => {
      if (!map.has(s.name)) map.set(s.name, { value: s.id, label: s.name });
    });
    return Array.from(map.values());
  }, [stops]);

  const startValue = selectOptions.find((opt) => opt.value === start);
  const endValue = selectOptions.find((opt) => opt.value === end);

  const handleSearch = () => {
    if (!start || !end) return;
    const result = findShortestPath(graphData, start, end);
    if (result) {
      setRoutes([result]);
    }
  };

  // Save custom route
  const addNewRoute = () => {
    if (!start || !end) {
      alert("Search for a route first!");
      return;
    }
    if (!newSummary.trim()) {
      alert("Enter route info first");
      return;
    }

    const routeObject = {
      id: Date.now(),
      startId: start,
      endId: end,
      startName: graphData.nodes[start]?.name,
      endName: graphData.nodes[end]?.name,
      userGenerated: true,
      summary: newSummary
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    const existing = JSON.parse(localStorage.getItem("savedRoutes") || "[]");
    const updated = [...existing, routeObject];
    localStorage.setItem("savedRoutes", JSON.stringify(updated));
    setSavedRoutes(updated);
    setNewSummary("");
    alert("Custom route added!");
  };

  // Save edited route
  const saveEditedRoute = (id) => {
    const updatedRoutes = savedRoutes.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          summary: editSummary
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        };
      }
      return r;
    });
    localStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes));
    setSavedRoutes(updatedRoutes);
    setEditRouteId(null);
    setEditSummary("");
    alert("Route updated successfully!");
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Cairo Transit Route Finder</h1>

      {/* Search Section */}
      <Card className="mb-4 p-3 shadow-sm">
        <Row className="align-items-center g-2 mb-2">
          <Col xs={12} md>
            <Select
              value={startValue}
              onChange={(opt) => setStart(opt ? opt.value : "")}
              options={selectOptions}
              placeholder="From: Choose starting point"
              isClearable
            />
          </Col>
          <Col xs="auto" className="text-center">
            <Button
              onClick={() => {
                const t = start;
                setStart(end);
                setEnd(t);
              }}
            >
              ⇅
            </Button>
          </Col>
          <Col xs={12} md>
            <Select
              value={endValue}
              onChange={(opt) => setEnd(opt ? opt.value : "")}
              options={selectOptions}
              placeholder="To: Choose destination"
              isClearable
            />
          </Col>
        </Row>
        <Button
          variant="primary"
          className="w-100 mt-2"
          onClick={handleSearch}
          disabled={!start || !end}
        >
          Find Routes
        </Button>
      </Card>

      {/* Main Route */}
      {routes.map((route, idx) => (
        <Card key={idx} className="mb-3 shadow-sm p-3 border-success">
          <Card>
            <h5>Main Route</h5>
            <div class="border-0">
              {route.summary.map((seg, i) => (
                <Row key={i} className="align-items-center mb-1">
                  <Col xs="auto">{seg.mode === "metro" ? "🚇" : "🚌"}</Col>
                  <Col>
                    Take {seg.line.replace(/ - | → |–/g, " → ")}{" "}
                    {/* ← هنا بنبدل أي شرط بـ سهم */}
                    {seg.stops ? `for ${seg.stops} stops` : ""}
                  </Col>
                </Row>
              ))}
            </div>
          </Card>
        </Card>
      ))}

      {/* User Routes */}
      {savedRoutes
        .filter(
          (r) => r.userGenerated && r.startId === start && r.endId === end
        )
        .map((route, idx) => (
          <Card key={route.id} className="mb-3 shadow-sm p-3 border-success">
            <Row className="align-items-center mb-2">
              <Col>
                <h5>User Route {idx + 1}</h5>
              </Col>
              <Col className="text-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setEditRouteId(route.id);
                    setEditSummary(route.summary.join("\n"));
                  }}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this route?"
                      )
                    )
                      return;
                    const updatedRoutes = savedRoutes.filter(
                      (r) => r.id !== route.id
                    );
                    localStorage.setItem(
                      "savedRoutes",
                      JSON.stringify(updatedRoutes)
                    );
                    setSavedRoutes(updatedRoutes);
                    if (editRouteId === route.id) {
                      setEditRouteId(null);
                      setEditSummary("");
                    }
                  }}
                >
                  Delete
                </Button>
              </Col>
            </Row>

            {/* Display each line */}
            <div>
              {route.summary.map((line, i) => (
                <Row key={i} className="align-items-center mb-1">
                  <Col style={{ whiteSpace: "pre-wrap" }}>{line}</Col>
                </Row>
              ))}
            </div>

            {/* Edit Section */}
            {editRouteId === route.id && (
              <div className="mt-2">
                <textarea
                  className="form-control"
                  rows={Math.max(route.summary.length, 3)}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                />
                <Button
                  className="mt-2 w-100 btn-primary"
                  onClick={() => saveEditedRoute(route.id)}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </Card>
        ))}

      {/* Add New Route */}
      <Card className="mt-4 p-3 shadow-sm border-success">
        <h4 className="text-center mb-3">Add Custom Route for This Trip</h4>
        <Row className="g-2 mb-2">
          <Col>
            <input
              className="form-control"
              value={graphData.nodes[start]?.name || ""}
              disabled
            />
          </Col>
          <Col>
            <input
              className="form-control"
              value={graphData.nodes[end]?.name || ""}
              disabled
            />
          </Col>
        </Row>
        <textarea
          className="form-control mt-2"
          rows={5}
          placeholder="Write your route freely, one line per segment"
          value={newSummary}
          onChange={(e) => setNewSummary(e.target.value)}
        />
        <Button className="w-100 mt-3 btn-success" onClick={addNewRoute}>
          Save Custom Route
        </Button>
      </Card>
    </Container>
  );
}
