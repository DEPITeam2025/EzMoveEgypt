import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import graphData from "../../Data/graph.json";
import { findShortestPath } from "../../utils/dijkstra";
import styles from "./FindRoutes.module.css";

export default function FindRoutes() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [routes, setRoutes] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [saveStatus, setSaveStatus] = useState({});

  const stops = Object.values(graphData.nodes);

  // Load saved routes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRoutes');
    if (saved) {
      setSavedRoutes(JSON.parse(saved));
    }
  }, []);

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
    const result = findShortestPath(graphData, start, end);
    if (result) {
      const routeData = {
        ...result,
        estimatedTime: result.path.length * 2,
        transfers: result.summary.length - 1,
        startId: start,
        endId: end,
        startName: graphData.nodes[start]?.name,
        endName: graphData.nodes[end]?.name,
        id: Date.now(), // Unique ID for the route
        savedAt: null
      };
      setRoutes([routeData]);
    }
  };

  const handleSaveRoute = (route, index) => {
    const routeToSave = {
      ...route,
      savedAt: new Date().toISOString()
    };

    // Get existing saved routes
    const existing = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
    
    // Check if route already exists
    const existingIndex = existing.findIndex(r => 
      r.startId === route.startId && r.endId === route.endId
    );

    if (existingIndex === -1) {
      // Add new route
      const updated = [...existing, routeToSave];
      localStorage.setItem('savedRoutes', JSON.stringify(updated));
      setSavedRoutes(updated);
      
      // Show success status
      setSaveStatus({ ...saveStatus, [index]: 'success' });
      setTimeout(() => {
        setSaveStatus({ ...saveStatus, [index]: null });
      }, 2000);
    } else {
      // Already saved
      setSaveStatus({ ...saveStatus, [index]: 'exists' });
      setTimeout(() => {
        setSaveStatus({ ...saveStatus, [index]: null });
      }, 2000);
    }
  };

  const isRouteSaved = (route) => {
    return savedRoutes.some(r => 
      r.startId === route.startId && r.endId === route.endId
    );
  };

  const getLineColor = (line) => {
    if (!line) return styles.otherLine;
    if (line.includes("Line 1")) return styles.line1;
    if (line.includes("Line 2")) return styles.line2;
    if (line.includes("Line 3")) return styles.line3;
    return styles.otherLine;
  };

  const getLineIcon = (mode) => {
    return mode === "metro" ? "M" : "B";
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.searchSection}>
        <h1 className={styles.title}>Cairo Transit Route Finder</h1>
        
        <div className={styles.searchCard}>
          <div className={styles.searchInputs}>
            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>📍</div>
              <Select
                classNamePrefix="custom-select"
                className={styles.selectInput}
                value={startValue}
                onChange={(selectedOption) =>
                  setStart(selectedOption ? selectedOption.value : "")
                }
                options={selectOptions}
                placeholder="From: Choose starting point"
                isClearable={true}
              />
            </div>

            <div className={styles.swapButton}>
              <button 
                type="button"
                onClick={() => {
                  const temp = start;
                  setStart(end);
                  setEnd(temp);
                }}
              >
                ⇅
              </button>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>📍</div>
              <Select
                classNamePrefix="custom-select"
                className={styles.selectInput}
                value={endValue}
                onChange={(selectedOption) =>
                  setEnd(selectedOption ? selectedOption.value : "")
                }
                options={selectOptions}
                placeholder="To: Choose destination"
                isClearable={true}
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className={styles.searchButton}
            disabled={!start || !end}
          >
            Find Routes
          </button>
        </div>
      </div>

      {routes.length > 0 && (
        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>
            {routes.length} Route{routes.length > 1 ? 's' : ''} Found
          </h2>

          {routes.map((route, index) => (
            <div key={index} className={styles.routeCard}>
              {/* Header */}
              <div className={styles.routeHeader}>
                <div className={styles.routeTitle}>
                  <span className={styles.routeLabel}>Route {index + 1}</span>
                  <span className={styles.routeBadge}>Recommended</span>
                </div>
                <div className={styles.headerActions}>
                  <div className={styles.routeStats}>
                    <div className={styles.stat}>
                      <span className={styles.statIcon}>⏱</span>
                      <span className={styles.statValue}>{route.estimatedTime} min</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statIcon}>🔄</span>
                      <span className={styles.statValue}>{route.transfers} transfers</span>
                    </div>
                  </div>
                  <button
                    className={`${styles.saveButton} ${
                      saveStatus[index] === 'success' ? styles.saved : ''
                    } ${saveStatus[index] === 'exists' ? styles.exists : ''} ${
                      isRouteSaved(route) && !saveStatus[index] ? styles.alreadySaved : ''
                    }`}
                    onClick={() => handleSaveRoute(route, index)}
                    disabled={saveStatus[index] === 'success'}
                  >
                    {saveStatus[index] === 'success' ? (
                      <>✓ Saved</>
                    ) : saveStatus[index] === 'exists' ? (
                      <>ℹ Already Saved</>
                    ) : isRouteSaved(route) ? (
                      <><span className={styles.heart}>&hearts;</span> Saved</>
                    ) : (
                      <><span className={styles.heart}>&hearts;</span> Save Route</>
                    )}
                  </button>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className={styles.timeline}>
                <div className={styles.timelineTrack}>
                  {route.summary.map((segment, idx) => (
                    <div key={idx} className={styles.timelineSegment}>
                      <div className={`${styles.segmentLine} ${getLineColor(segment.line)}`}>
                        <div className={styles.segmentDots}>
                          {[...Array(Math.min(segment.stops, 5))].map((_, i) => (
                            <div key={i} className={styles.dot}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Details */}
              <div className={styles.routeDetails}>
                {route.summary.map((segment, idx) => (
                  <div key={idx} className={styles.segment}>
                    <div className={`${styles.lineIcon} ${getLineColor(segment.line)}`}>
                      {getLineIcon(segment.mode)}
                    </div>
                    <div className={styles.segmentInfo}>
                      <div className={styles.lineName}>{segment.line}</div>
                      <div className={styles.lineDetails}>
                        {segment.stops} stops • {segment.stops * 2} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className={styles.instructions}>
                <div className={styles.instruction}>
                  <div className={styles.instructionIcon}>🚶</div>
                  <div className={styles.instructionText}>
                    Walk to {route.startName}
                  </div>
                </div>
                
                {route.summary.map((segment, idx) => (
                  <React.Fragment key={idx}>
                    <div className={styles.instruction}>
                      <div className={`${styles.instructionIcon} ${getLineColor(segment.line)}`}>
                        {segment.mode === "metro" ? "🚇" : "🚌"}
                      </div>
                      <div className={styles.instructionText}>
                        Take {segment.line} for {segment.stops} stops
                      </div>
                    </div>
                    {idx < route.summary.length - 1 && (
                      <div className={styles.instruction}>
                        <div className={styles.instructionIcon}>🚶</div>
                        <div className={styles.instructionText}>
                          Transfer (2-5 min walk)
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                <div className={styles.instruction}>
                  <div className={styles.instructionIcon}>📍</div>
                  <div className={styles.instructionText}>
                    Arrive at {route.endName}
                  </div>
                </div>
              </div>

              {/* Show Details Button */}
              <button className={styles.detailsButton}>
                Show all stops →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}