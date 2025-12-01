import React, { useState, useMemo } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import stopsData from "../../Data/metro/stops.json";
import stoptimesData from "../../Data/metro/stop_times.json";
import tripsData from "../../Data/metro/trips.json";
import routesData from "../../Data/metro/routes.json";
import { buildGraph, bfsShortestPath, mapStopsToRoutes } from "../../utils/findBestRoute";
import styles from "./MetroGuide.module.css";

export default function MetroRouteFinder() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);

  // --- Load data using React Query ---
  const { data: stops } = useQuery({ queryKey: ["stops"], queryFn: async () => stopsData });
  const { data: stopTimes } = useQuery({ queryKey: ["stopTimes"], queryFn: async () => stoptimesData });
  const { data: trips } = useQuery({ queryKey: ["trips"], queryFn: async () => tripsData });
  const { data: routes } = useQuery({ queryKey: ["routes"], queryFn: async () => routesData });

  const graph = useMemo(() => (stopTimes && stops ? buildGraph(stopTimes, stops) : null), [stopTimes, stops]);
  const stopRouteMap = useMemo(
    () => (stopTimes && trips && routes ? mapStopsToRoutes(stopTimes, trips, routes) : {}),
    [stopTimes, trips, routes]
  );

  // --- Filter stops by input query ---
  const filteredStops = (query) =>
    stops?.filter((s) => s.stop_name.toLowerCase().includes(query.toLowerCase())) || [];

  // --- Compute shortest path using React Query ---
  const { data: routeResult, refetch } = useQuery({
    queryKey: ["metroRoute", source, destination],
    queryFn: async () => {
      if (!source || !destination || !graph) return [];
      const path = bfsShortestPath(graph, source, destination);
      if (!path) return [];
      return path.map((stopId) => {
        const stop = stops.find((s) => s.stop_id === stopId);
        const routesForStop = stopRouteMap[stopId] || [];
        return { name: stop?.stop_name || stopId, routes: routesForStop };
      });
    },
    enabled: !!source && !!destination, // Only run when both selected
  });

  // --- Handle selection ---
  const handleSelectSource = (stop) => {
    setSource(stop.stop_id);
    setSourceQuery(stop.stop_name);
    setShowSourceList(false);
  };
  const handleSelectDestination = (stop) => {
    setDestination(stop.stop_id);
    setDestinationQuery(stop.stop_name);
    setShowDestinationList(false);
  };

  const getLineClass = (lineName) => {
    if (lineName.includes("Line 1")) return styles.line1;
    if (lineName.includes("Line 2")) return styles.line2;
    if (lineName.includes("Line 3")) return styles.line3;
    return "";
  };

  const getDirectionForLine = (lineName) => {
    const trip = trips?.find((t) => {
      const route = routes?.find((r) => r.route_id === t.route_id);
      return route?.route_long_name === lineName;
    });
    if (!trip) return "";
    const dirParts = trip.trip_short_name.split(" - ");
    return dirParts.length > 1 ? `towards ${dirParts[1]}` : "";
  };

  const generateSummary = (detailedRoute) => {
    const segments = [];
    if (!detailedRoute || detailedRoute.length === 0) return [];

    let currentLine = detailedRoute[0].routes?.[0] || "Unknown Line";
    let segmentStart = detailedRoute[0].name;
    let segmentStops = 1;

    for (let i = 1; i < detailedRoute.length; i++) {
      const nextLine = detailedRoute[i].routes?.[0] || currentLine;
      if (nextLine !== currentLine) {
        segments.push({
          line: currentLine,
          from: segmentStart,
          to: detailedRoute[i - 1].name,
          stops: segmentStops,
          direction: getDirectionForLine(currentLine),
        });
        segmentStart = detailedRoute[i].name;
        segmentStops = 1;
        currentLine = nextLine;
      } else {
        segmentStops++;
      }
    }

    segments.push({
      line: currentLine,
      from: segmentStart,
      to: detailedRoute[detailedRoute.length - 1].name,
      stops: segmentStops,
      direction: getDirectionForLine(currentLine),
    });

    return segments;
  };

  const routeSummary = useMemo(() => generateSummary(routeResult), [routeResult]);

  return (
    <Container className="py-5">
      <div className="card shadow p-4 mx-auto">
        <h1 className="text-center mb-4 text-primary fw-bold">Cairo Metro Route Finder 🚇</h1>

        {/* Inputs */}
        <Row className="align-items-end g-2 mb-4">
          <Col xs={12} lg={4}>
            <label className="form-label fw-semibold">From:</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                value={sourceQuery}
                placeholder="Type to search for a stop..."
                onChange={(e) => {
                  setSourceQuery(e.target.value);
                  setShowSourceList(true);
                }}
                onFocus={() => setShowSourceList(true)}
                onBlur={() => setTimeout(() => setShowSourceList(false), 150)}
              />
              {showSourceList && sourceQuery && (
                <ul className={`list-group position-absolute w-100 ${styles.dropdownList}`}>
                  {filteredStops(sourceQuery).map((stop) => (
                    <li
                      key={stop.stop_id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSelectSource(stop)}
                    >
                      {stop.stop_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>

          <Col xs={12} lg={4}>
            <label className="form-label fw-semibold">To:</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                value={destinationQuery}
                placeholder="Type to search for a stop..."
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setShowDestinationList(true);
                }}
                onFocus={() => setShowDestinationList(true)}
                onBlur={() => setTimeout(() => setShowDestinationList(false), 150)}
              />
              {showDestinationList && destinationQuery && (
                <ul className={`list-group position-absolute w-100 ${styles.dropdownList}`}>
                  {filteredStops(destinationQuery).map((stop) => (
                    <li
                      key={stop.stop_id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSelectDestination(stop)}
                    >
                      {stop.stop_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>

          <Col xs={12} lg={4}>
            <Button variant="primary" className="w-100" onClick={refetch} disabled={!source || !destination}>
              Find Route
            </Button>
          </Col>
        </Row>

        {/* Render Route */}
        {routeResult && routeResult.length > 0 && (
          <div className="mt-5">
            {/* Summary */}
            {routeSummary.length > 0 && (
              <div className={`${styles.summaryBox} p-3 mb-4`}>
                <h5 className="fw-bold mb-3 text-center">🗺️ Route Summary</h5>
                {routeSummary.map((seg, i) => (
                  <div key={i} className="mb-2">
                    <span className={`${getLineClass(seg.line)} fw-bold`}>{seg.line}</span> from{" "}
                    <b>{seg.from}</b> → <b>{seg.to}</b>
                    <br />
                    <span className="text-muted small">
                      {seg.direction}, {seg.stops} stops
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed route */}
            <h4 className="fw-bold mb-3 text-center">Best Route Details:</h4>
            <div className={`${styles.routeContainer} border rounded p-3`}>
              {routeResult.map((stop, i) => {
                const stopLine = stop.routes?.[0] || "Unknown Line";
                const lineClass = getLineClass(stopLine);
                let transferNote = null;

                if (i > 0 && stop.routes?.[0] !== routeResult[i - 1].routes?.[0]) {
                  transferNote = (
                    <div className={`text-center my-3 ${styles.transfer}`}>
                      🔁 Transfer to <span className={`${lineClass} fw-bold`}>{stopLine}</span> (
                      {getDirectionForLine(stopLine)})
                    </div>
                  );
                }

                return (
                  <div key={i} className={`d-flex align-items-center ${styles.stopRow}`}>
                    <div className={`${styles.lineCircle} ${lineClass}`}></div>
                    <div className="ms-3">
                      <div className="fw-semibold">{stop.name}</div>
                      <div className="text-muted small">
                        {stopLine} – {getDirectionForLine(stopLine)}
                      </div>
                    </div>
                    {transferNote}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {routeResult && routeResult.length === 0 && source && destination && (
          <p className="text-center mt-3">No route found for the selected stations.</p>
        )}
      </div>
    </Container>
  );
}
