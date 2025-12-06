import React, { useState } from "react";
import {
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MetroRouteFinder from "./MetroRouteFinder";
import styles from "./MetroGuide.module.css";

// --- Fetch helpers (simulate API) ---
import stopsData from "../../Data/metro/stops.json";
import stoptimesData from "../../Data/metro/stop_times.json";
import tripsData from "../../Data/metro/trips.json";
import routesData from "../../Data/metro/routes.json";

const fetchStops = async () => stopsData;
const fetchStopTimes = async () => stoptimesData;
const fetchTrips = async () => tripsData;
const fetchRoutes = async () => routesData;

// --- Metro Overview Component ---
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
              <span className={styles["icon-number"]}>3</span>
            </div>
            <div className={styles["overview-content"]}>
              <p className={styles["overview-label"]}>Metro Lines</p>
            </div>
          </div>

          <div className={styles["overview-card"]}>
            <div className={styles["overview-icon"]}>
              <span className={styles["icon-number"]}>68</span>
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

// --- Metro Line Component ---
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Metro Lines Section ---
function MetroLinesSection() {
  const { data: stops } = useQuery({ queryKey: ["stops"], queryFn: fetchStops });
  const { data: stopTimes } = useQuery({ queryKey: ["stopTimes"], queryFn: fetchStopTimes });
  const { data: trips } = useQuery({ queryKey: ["trips"], queryFn: fetchTrips });
  const { data: routes } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  if (!stops || !stopTimes || !trips || !routes) return <p>Loading Metro Data...</p>;

  // Define line colors
  const lineColors = {
    L1: "blue",
    L2: "red",
    L3: "green",
  };

  // Build metro lines
  const metroLines = routes.map((route) => {
    const routeTrips = trips.filter((t) => t.route_id === route.route_id);
    const uniqueTrips = [0, 1]
      .map((dir) => routeTrips.find((t) => t.direction_id === dir))
      .filter(Boolean);

    const stations = uniqueTrips.flatMap((trip) =>
      stopTimes
        .filter((st) => st.trip_id === trip.trip_id)
        .sort((a, b) => a.stop_sequence - b.stop_sequence)
        .map((st) => {
          const stop = stops.find((s) => s.stop_id === st.stop_id);
          return stop ? { name: stop.stop_name, order: st.stop_sequence } : null;
        })
        .filter(Boolean)
    );

    // Remove duplicates
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

// --- Main MetroGuide Component ---
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
