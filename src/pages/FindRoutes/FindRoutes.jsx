import React, { useState, useMemo } from "react";
import Select from "react-select";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import graphData from "../../Data/graph.json";
import { findShortestPath } from "../../utils/dijkstra";
import styles from "./FindRoutes.module.css";

// --- Helpers to interact with localStorage ---
const getSavedRoutes = () => {
  return JSON.parse(localStorage.getItem("savedRoutes") || "[]");
};

const saveRoutesToLocalStorage = (routes) => {
  localStorage.setItem("savedRoutes", JSON.stringify(routes));
};

// --- Component ---
export default function FindRoutes() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [routes, setRoutes] = useState([]);
  const [editRouteId, setEditRouteId] = useState(null);
  const [editSummary, setEditSummary] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const queryClient = useQueryClient();

  // --- Load saved routes with React Query ---
  const { data: savedRoutes } = useQuery({
    queryKey: ["savedRoutes"],
    queryFn: getSavedRoutes,
  });

  // --- Mutations ---
  const addRouteMutation = useMutation({
    mutationFn: (route) => {
      const current = getSavedRoutes();
      const updated = [...current, route];
      saveRoutesToLocalStorage(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["savedRoutes"], data);
      setNewSummary("");
      alert("Custom route added!");
    },
  });

  const editRouteMutation = useMutation({
    mutationFn: ({ id, summary }) => {
      const updatedRoutes = savedRoutes.map((r) => {
        if (r.id === id) {
          return { ...r, summary };
        }
        return r;
      });
      saveRoutesToLocalStorage(updatedRoutes);
      return updatedRoutes;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["savedRoutes"], data);
      setEditRouteId(null);
      setEditSummary("");
      alert("Route updated successfully!");
    },
  });

  const deleteRouteMutation = useMutation({
    mutationFn: (id) => {
      const updated = savedRoutes.filter((r) => r.id !== id);
      saveRoutesToLocalStorage(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["savedRoutes"], data);
      if (editRouteId && !data.find((r) => r.id === editRouteId)) {
        setEditRouteId(null);
        setEditSummary("");
      }
    },
  });

  // --- Select Options ---
  const stops = Object.values(graphData.nodes);
  const selectOptions = useMemo(() => {
    const map = new Map();
    stops.forEach((s) => {
      if (!map.has(s.name)) map.set(s.name, { value: s.id, label: s.name });
    });
    return Array.from(map.values());
  }, [stops]);

  const startValue = selectOptions.find((opt) => opt.value === start);
  const endValue = selectOptions.find((opt) => opt.value === end);

  // --- Handlers ---
  const handleSearch = () => {
    if (!start || !end) return;
    const result = findShortestPath(graphData, start, end);
    if (result) setRoutes([result]);
  };

  const addNewRoute = () => {
    if (!start || !end) return alert("Search for a route first!");
    if (!newSummary.trim()) return alert("Enter route info first");

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

    addRouteMutation.mutate(routeObject);
  };

  const saveEditedRoute = (id) => {
    const summary = editSummary
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    editRouteMutation.mutate({ id, summary });
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Cairo Transit Route Finder</h1>

      {/* Search Section */}
      <Card className="mb-4 p-3 shadow-sm">
        <Row className="align-items-end g-2">
          <Col xs={12} lg={4}>
            <Select
              value={startValue}
              onChange={(opt) => setStart(opt ? opt.value : "")}
              options={selectOptions}
              placeholder="From: Choose starting point"
              isClearable
            />
          </Col>
          <Col xs={12} md={1} lg={1} className="text-center">
            <Button
              onClick={() => {
                const t = start;
                setStart(end);
                setEnd(t);
              }}
              className={styles.swapBtn}
            >
              ⇅
            </Button>
          </Col>
          <Col xs={12} md lg={4}>
            <Select
              value={endValue}
              onChange={(opt) => setEnd(opt ? opt.value : "")}
              options={selectOptions}
              placeholder="To: Choose destination"
              isClearable
            />
          </Col>
          <Col xs={12} lg={3}>
            <Button
              variant="primary"
              className={`w-100 ${styles.findButton}`}
              onClick={handleSearch}
              disabled={!start || !end}
            >
              Find Routes
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Route */}
      {routes.map((route, idx) => (
        <Card key={idx} className="mb-3 shadow-sm p-3 border-success">
          <h5>Main Route</h5>
          {route.summary.map((seg, i) => (
            <Row key={i} className="align-items-center mb-1">
              <Col xs="auto">{seg.mode === "metro" ? "🚇" : "🚌"}</Col>
              <Col>
                Take {seg.line.replace(/ - | → |–/g, " → ")}
                {seg.stops ? ` for ${seg.stops} stops` : ""}
              </Col>
            </Row>
          ))}
        </Card>
      ))}

      {/* User Routes */}
      {savedRoutes
        ?.filter((r) => r.userGenerated && r.startId === start && r.endId === end)
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
                  onClick={() => deleteRouteMutation.mutate(route.id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>

            <div>
              {route.summary.map((line, i) => (
                <Row key={i} className="align-items-center mb-1">
                  <Col style={{ whiteSpace: "pre-wrap" }}>{line}</Col>
                </Row>
              ))}
            </div>

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
        <Button
          className="w-100 mt-3 btn-success"
          onClick={addNewRoute}
          disabled={addRouteMutation.isLoading}
        >
          Save Custom Route
        </Button>
      </Card>
    </Container>
  );
}
