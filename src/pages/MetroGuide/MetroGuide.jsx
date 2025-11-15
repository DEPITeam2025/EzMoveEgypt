import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import stopsData from "../../Data/metro/stops.json";
import stoptimesData from "../../Data/metro/stop_times.json";
import tripsData from "../../Data/metro/trips.json";
import routesData from "../../Data/metro/routes.json";
import MetroRouteFinder from "./MetroRouteFinder";
import styles from "./MetroGuide.module.css";

// Metro Overview Component
function MetroOverview() {
  return (
    <section className={styles["metro-overview"]}>
      <div className={styles.container}>
        <h1 className={styles["page-title"]}>Metro Guide</h1>
        <p className={styles["page-subtitle"]}>
          Complete information about metro lines, stations, and schedules
        </p>

        <div className={styles["overview-cards"]}>
          <div className={styles["overview-card"]}>
            <div className={styles["overview-icon"]}>
              <span className={styles["icon-number"]}>4</span>
            </div>
            <div className={styles["overview-content"]}>
              <p className={styles["overview-label"]}>Metro Lines</p>
            </div>
          </div>

          <div className={styles["overview-card"]}>
            <div className={styles["overview-icon"]}>
              <span className={styles["icon-number"]}>28</span>
            </div>
            <div className={styles["overview-content"]}>
              <p className={styles["overview-label"]}>All Stations</p>
            </div>
          </div>

          <div className={styles["overview-card"]}>
            <div className={styles["overview-icon"]}>
              <Clock size={24} />
            </div>
            <div className={styles["overview-content"]}>
              <p className={styles["overview-label"]}>5:00 AM - 12:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Metro Line Component
function MetroLine({ line }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${styles["metro-line"]} ${
        styles[`metro-line-${line.color}`]
      }`}
    >
      <div className={styles["line-header"]}>
        <div className={styles["line-info"]}>
          <div className={`${styles["line-badge"]} ${styles[line.color]}`}>
            {line.name}
          </div>
          <div className={styles["line-details"]}>
            <p className={styles["line-direction"]}>{line.direction}</p>
            <p className={styles["line-schedule"]}>{line.schedule}</p>
            <p className={styles["line-frequency"]}>{line.frequency}</p>
          </div>
        </div>
        <button
          className={styles["expand-btn"]}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className={styles["line-content"]}>
          <div className={styles["stations-section"]}>
            <h4 className={styles["stations-title"]}>All Stations</h4>
            <div className={styles["stations-list"]}>
              {line.stations.map((station, index) => (
                <div key={index} className={styles["station-item"]}>
                  <div
                    className={`${styles["station-badge"]} ${
                      styles[line.color]
                    }`}
                  ></div>
                  <div className={styles["station-info"]}>
                    <p className={styles["station-name"]}>{station.name}</p>
                    {station.note && (
                      <p className={styles["station-note"]}>{station.note}</p>
                    )}
                  </div>
                  <div className={styles["station-actions"]}>
                    {station.hasWifi && (
                      <span className={styles["action-badge"]}>📶 WiFi</span>
                    )}
                    {station.hasParking && (
                      <span className={styles["action-badge"]}>
                        🅿️ Amenities
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Metro Lines Section
function MetroLinesSection() {
  const [metroLines, setMetroLines] = useState([]);

  useEffect(() => {
    // Define color mapping for Cairo Metro lines
    const lineColors = {
      L1: "blue", // Helwan – El Marg
      L2: "red", // Shoubra – El Mounib
      L3: "green", // Adly Mansour – Kit Kat
    };

    const lines = routesData.map((route) => {
      // Get all trips (directions) for this route
      const routeTrips = tripsData.filter(
        (trip) => trip.route_id === route.route_id
      );

      // Use only one representative trip per direction (0 or 1)
      const uniqueTrips = [];
      for (const dir of [0, 1]) {
        const trip = routeTrips.find((t) => t.direction_id === dir);
        if (trip) uniqueTrips.push(trip);
      }

      // Gather stations from stop_times for each trip direction
      const stations = uniqueTrips.flatMap((trip) => {
        const stopTimes = stoptimesData
          .filter((st) => st.trip_id === trip.trip_id)
          .sort((a, b) => a.stop_sequence - b.stop_sequence);

        return stopTimes
          .map((st) => {
            const stop = stopsData.find((s) => s.stop_id === st.stop_id);
            return stop
              ? {
                  name: stop.stop_name,
                  hasWifi: false,
                  hasParking: false,
                  direction: trip.trip_short_name,
                  order: st.stop_sequence,
                }
              : null;
          })
          .filter(Boolean);
      });

      // Remove duplicates (same stop appearing in both directions)
      const uniqueStations = [];
      const seen = new Set();
      for (const s of stations) {
        if (!seen.has(s.name)) {
          seen.add(s.name);
          uniqueStations.push(s);
        }
      }

      return {
        name: route.route_long_name,
        color: lineColors[route.route_id] || "gray",
        direction: route.route_desc,
        schedule: "Operating Hours: 5:00 AM - 12:00 AM",
        frequency: "Every 5–10 minutes",
        stations: uniqueStations,
      };
    });

    setMetroLines(lines);
  }, []);

  return (
    <section className={styles["metro-lines-section"]}>
      <div className={styles.container}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Cairo Metro Network</h2>
          <p className={styles["section-subtitle"]}>
            Explore all Cairo Metro lines and their stations
          </p>
        </div>

        <div className={styles["metro-lines-list"]}>
          {metroLines.map((line, index) => (
            <MetroLine key={index} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}



// Main Component
export default function MetroGuide() {
  return (
    <div className={styles["metro-guide"]}>
      <main className={styles["main-content"]}>
        <MetroRouteFinder />
        <MetroOverview />
        <MetroLinesSection />
      </main>
    </div>
  );
}
