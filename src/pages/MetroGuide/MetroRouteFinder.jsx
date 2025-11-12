import React, { useState, useEffect } from "react";
import stopsData from "../../Data/metro/stops.json";
import stoptimesData from "../../Data/metro/stop_times.json";
import tripsData from "../../Data/metro/trips.json";
import routesData from "../../Data/metro/routes.json";
import {
  buildGraph,
  bfsShortestPath,
  mapStopsToRoutes,
} from "../../utils/findBestRoute";
import styles from "./MetroGuide.module.css";

function MetroRouteFinder() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState([]);
  const [routeSummary, setRouteSummary] = useState([]);
  const [graph, setGraph] = useState(null);
  const [stopRouteMap, setStopRouteMap] = useState({});
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);

  useEffect(() => {
    const g = buildGraph(stoptimesData, stopsData);
    const map = mapStopsToRoutes(stoptimesData, tripsData, routesData);
    setGraph(g);
    setStopRouteMap(map);
  }, []);

  const filteredStops = (query) =>
    stopsData.filter((s) =>
      s.stop_name.toLowerCase().includes(query.toLowerCase())
    );

  const handleSearch = () => {
    if (!source || !destination || !graph) return;
    const path = bfsShortestPath(graph, source, destination);
    if (path) {
      const readable = path.map((stopId) => {
        const stop = stopsData.find((s) => s.stop_id === stopId);
        const routes = stopRouteMap[stopId] || [];
        return {
          name: stop?.stop_name || stopId,
          routes,
        };
      });
      setRoute(readable);
      setRouteSummary(generateSummary(readable));
    } else {
      setRoute(["No route found"]);
      setRouteSummary([]);
    }
  };

  const getLineClass = (lineName) => {
    if (lineName.includes("Line 1")) return styles.line1;
    if (lineName.includes("Line 2")) return styles.line2;
    if (lineName.includes("Line 3")) return styles.line3;
    return "";
  };

  const getDirectionForLine = (lineName) => {
    const trip = tripsData.find((t) => {
      const route = routesData.find((r) => r.route_id === t.route_id);
      return route?.route_long_name === lineName;
    });
    if (!trip) return "";
    const dirParts = trip.trip_short_name.split(" - ");
    return dirParts.length > 1 ? `towards ${dirParts[1]}` : "";
  };

  const generateSummary = (detailedRoute) => {
    const segments = [];
    if (detailedRoute.length === 0) return [];

    let currentLine = detailedRoute[0].routes?.[0] || "Unknown Line";
    let segmentStart = detailedRoute[0].name;
    let segmentStops = 1;

    for (let i = 1; i < detailedRoute.length; i++) {
      const nextLine = detailedRoute[i].routes?.[0] || currentLine;
      if (nextLine !== currentLine) {
        const direction = getDirectionForLine(currentLine);
        segments.push({
          line: currentLine,
          from: segmentStart,
          to: detailedRoute[i - 1].name,
          stops: segmentStops,
          direction,
        });
        segmentStart = detailedRoute[i].name;
        segmentStops = 1;
        currentLine = nextLine;
      } else {
        segmentStops++;
      }
    }

    const direction = getDirectionForLine(currentLine);
    segments.push({
      line: currentLine,
      from: segmentStart,
      to: detailedRoute[detailedRoute.length - 1].name,
      stops: segmentStops,
      direction,
    });

    return segments;
  };

  const renderSummary = () => {
    if (routeSummary.length === 0) return null;
    return (
      <div className={`${styles.summaryBox} p-3 mb-4`}>
        <h5 className="fw-bold mb-3 text-center">🗺️ Route Summary</h5>
        {routeSummary.map((seg, i) => (
          <div key={i} className="mb-2">
            <span className={`${getLineClass(seg.line)} fw-bold`}>
              {seg.line}
            </span>{" "}
            from <b>{seg.from}</b> → <b>{seg.to}</b> <br />
            <span className="text-muted small">
              {seg.direction}, {seg.stops} stops
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderRoute = () => {
    if (typeof route[0] === "string") return <p>{route[0]}</p>;
    let currentLine = null;

    return (
      <div className="mt-4">
        {route.map((stop, i) => {
          const stopLine = stop.routes?.[0] || "Unknown Line";
          const lineClass = getLineClass(stopLine);

          let transferNote = null;
          if (currentLine && stopLine !== currentLine) {
            const dir = getDirectionForLine(stopLine);
            transferNote = (
              <div className={`text-center my-3 ${styles.transfer}`}>
                <span>🔁 Transfer to </span>
                <span className={`${getLineClass(stopLine)} fw-bold`}>
                  {stopLine}
                </span>{" "}
                <span className="text-muted small">({dir})</span>
              </div>
            );
          }

          currentLine = stopLine;

          return (
            <div
              key={i}
              className={`d-flex align-items-center ${styles.stopRow}`}
            >
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
    );
  };

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

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h1 className="text-center mb-4 text-primary fw-bold">
          Cairo Metro Route Finder 🚇
        </h1>

        {/* Source Input */}
        <div className="mb-4 position-relative">
          <label className="form-label fw-semibold">From:</label>
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
            <ul
              className={`list-group position-absolute w-100 ${styles.dropdownList}`}
            >
              {filteredStops(sourceQuery).map((stop) => (
                <li
                  key={stop.stop_id}
                  className={`list-group-item list-group-item-action`}
                  onClick={() => handleSelectSource(stop)}
                >
                  {stop.stop_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination Input */}
        <div className="mb-4 position-relative">
          <label className="form-label fw-semibold">To:</label>
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
            <ul
              className={`list-group position-absolute w-100 ${styles.dropdownList}`}
            >
              {filteredStops(destinationQuery).map((stop) => (
                <li
                  key={stop.stop_id}
                  className={`list-group-item list-group-item-action`}
                  onClick={() => handleSelectDestination(stop)}
                >
                  {stop.stop_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center">
          <button onClick={handleSearch} className="btn btn-primary px-4 py-2">
            Find Route
          </button>
        </div>

        {route.length > 0 && (
          <div className="mt-5">
            {renderSummary()}
            <h4 className="fw-bold mb-3 text-center">Best Route Details:</h4>
            <div className={`${styles.routeContainer} border rounded p-3`}>
              {renderRoute()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetroRouteFinder;
