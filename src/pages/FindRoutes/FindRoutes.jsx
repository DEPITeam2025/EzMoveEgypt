import React, { useState, useMemo } from "react";
import Select from "react-select";
import graphData from "../../Data/graph.json";
import { findShortestPath } from "../../utils/dijkstra";
import styles from "./FindRoutes.module.css";

export default function FindRoutes() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState(null);

  const stops = Object.values(graphData.nodes);

  const selectOptions = useMemo(() => {
    return stops.map((s) => ({
      value: s.id,
      label: s.name,
    }));
  }, [stops]);

  const startValue = selectOptions.find((option) => option.value === start);
  const endValue = selectOptions.find((option) => option.value === end);



  const handleSearch = () => {
    if (!start || !end) return;
    const res = findShortestPath(graphData, start, end);
    setResult(res);
  };

  const getLineColor = (line) => {
    if (!line) return styles.otherLine;
    if (line.includes("Line 1")) return styles.line1;
    if (line.includes("Line 2")) return styles.line2;
    if (line.includes("Line 3")) return styles.line3;
    return styles.otherLine;
  };

  return (
    <div className={`container mt-5 ${styles.container}`}>
      <h2 className="text-center mb-4">🗺️ Cairo Route Finder</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Select
            classNamePrefix="react-select"
            value={startValue}
            onChange={(selectedOption) => setStart(selectedOption ? selectedOption.value : "")}
            options={selectOptions}
            placeholder="Select Start Stop"
            isClearable={true}
          />
        </div>

        <div className="col-md-4">
          <Select
            classNamePrefix="react-select"
            value={endValue}
            onChange={(selectedOption) => setEnd(selectedOption ? selectedOption.value : "")}
            options={selectOptions}
            placeholder="Select Destination Stop"
            isClearable={true}
          />
        </div>

        <div className="col-md-4">
          <button
            onClick={handleSearch}
            className="btn btn-primary w-100 fw-bold"
          >
            Find Route
          </button>
        </div>
      </div>

      {result && (
        <>
          {/* --- Summary Section --- */}
          <div className={styles.summary}>
            <div className={styles.summaryIcons}>
              {result.summary.map((seg, idx) => (
                <div
                  key={idx}
                  className={`${styles.summaryIcon} ${getLineColor(seg.line)}`}
                >
                  {seg.mode === "metro" ? "🚇" : "🚌"}
                </div>
              ))}
            </div>
            <div className={styles.summaryText}>
              {result.summary.map((seg, idx) => (
                <span
                  key={idx}
                  className={`${styles.lineTag} ${getLineColor(seg.line)}`}
                >
                  {seg.mode === "metro"
                    ? seg.line
                    : seg.line
                    ? `${seg.line}`
                    : "Bus"}
                </span>
              ))}
            </div>
          </div>

          {/* --- Detailed Route --- */}
          <div className="mt-4">
            {result.summary.map((seg, idx) => (
              <div key={idx} className={styles.segment}>
                <div className={`${styles.icon} ${getLineColor(seg.line)}`}>
                  {seg.mode === "metro" ? "🚇" : "🚌"}
                </div>
                <div className={styles.segmentInfo}>
                  <div className="fw-bold">
                    {seg.mode === "metro" ? "Metro" : "Bus"}{" "}
                    <span
                      className={`${styles.lineName} ${getLineColor(seg.line)}`}
                    >
                      {seg.line}
                    </span>{" "}
                    • {seg.stops} stops
                  </div>
                  <div className="text-muted small">
                    Take {seg.line} towards {seg.direction || "destination"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Stop-by-stop List --- */}
          <div className={`mt-4 ${styles.detailedList}`}>
            {result.path.map((step, idx) => {
              const lineColor = getLineColor(step.line_name);
              return (
                <div key={idx} className={styles.stopItem}>
                  <div className={`${styles.stopBullet} ${lineColor}`}></div>
                  <div className={styles.stopText}>
                    {graphData.nodes[step.to]?.name}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
