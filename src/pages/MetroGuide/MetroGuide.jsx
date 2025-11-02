import React, { useState } from "react";
import styles from "./MetroGuide.module.css";
import {
  MapPin,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";

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
  const metroLines = [
    {
      name: "Red Line",
      color: "red",
      direction: "North to South",
      schedule: "Operating Hours: 5:00 AM - 12:00 AM",
      frequency: "5-7 minutes during peak hours, 10-12 minutes off-peak",
      stations: [
        { name: "North Terminal", hasWifi: true, hasParking: true },
        { name: "Suburban Plaza", hasWifi: true },
        { name: "Business Park", hasWifi: true },
        { name: "Airport Junction", hasWifi: true },
        { name: "Medical Center", hasWifi: true },
        { name: "University", hasWifi: true },
        { name: "City Hall", hasWifi: true },
        {
          name: "Central Station",
          note: "Interchange to Other Lines",
          hasWifi: true,
          hasParking: true,
        },
      ],
    },
    {
      name: "Blue Line",
      color: "blue",
      direction: "East to West",
      schedule: "Operating Hours: 5:30 AM - 11:30 PM",
      frequency: "6-8 minutes during peak hours, 12-15 minutes off-peak",
      stations: [
        { name: "East End", hasWifi: true },
        { name: "Harbor View", hasWifi: true },
        { name: "Downtown Plaza", hasWifi: true },
        { name: "Financial District", hasWifi: true },
        {
          name: "Central Station",
          note: "Interchange to Other Lines",
          hasWifi: true,
          hasParking: true,
        },
        { name: "South Park", hasWifi: true },
        { name: "Stadium", hasWifi: true },
        { name: "Business Park", hasWifi: true },
        { name: "East Terminal", hasWifi: true },
      ],
    },
    {
      name: "Green Line",
      color: "green",
      direction: "Southwest to Northeast",
      schedule: "Operating Hours: 5:30 AM - 12:00 AM",
      frequency: "7-8 minutes during peak hours, 12-15 minutes off-peak",
      stations: [
        { name: "South Bay", hasWifi: true },
        { name: "Coastal Avenue", hasWifi: true },
        { name: "Shopping District", hasWifi: true },
        { name: "Arts Center", hasWifi: true },
        {
          name: "Central Station",
          note: "Interchange to Other Lines",
          hasWifi: true,
          hasParking: true,
        },
        { name: "University", hasWifi: true },
        { name: "Research Park", hasWifi: true },
        { name: "Innovation Hub", hasWifi: true },
        { name: "North Point", hasWifi: true },
      ],
    },
  ];

  return (
    <section className={styles["metro-lines-section"]}>
      <div className={styles.container}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Metro Network</h2>
          <p className={styles["section-subtitle"]}>
            Explore all metro lines and their stations
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

// Fares & Tickets Section
function FaresTicketsSection() {
  const fares = [
    { type: "Single Journey", price: "$2.50" },
    { type: "Day Pass", price: "$8.00" },
    { type: "Monthly Pass", price: "$75.00" },
  ];

  return (
    <section className={styles["fares-section"]}>
      <div className={styles.container}>
        <div className={styles["fares-grid"]}>
          <div className={styles["fares-column"]}>
            <div className={styles["fares-header"]}>
              <DollarSign size={24} />
              <h3 className={styles["fares-title"]}>Fares & Tickets</h3>
            </div>
            <div className={styles["fares-list"]}>
              {fares.map((fare, index) => (
                <div key={index} className={styles["fare-item"]}>
                  <p className={styles["fare-type"]}>{fare.type}</p>
                  <p className={styles["fare-price"]}>{fare.price}</p>
                </div>
              ))}
            </div>
            <button className={styles["btn-purchase"]}>Purchase Tickets</button>
          </div>

          <div className={styles["info-column"]}>
            <div className={styles["info-header"]}>
              <AlertCircle size={24} />
              <h3 className={styles["info-title"]}>Important Information</h3>
            </div>
            <ul className={styles["info-list"]}>
              <li>All stations are equipped with accessible facilities</li>
              <li>Keep your ticket until the end of your journey</li>
              <li>Trains are frequent during peak hours (7-9 AM & 5-7 PM)</li>
              <li>Service may be adjusted on public holidays</li>
              <li>WiFi available at all major stations</li>
            </ul>
          </div>
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
        <MetroOverview />
        <MetroLinesSection />
        <FaresTicketsSection />
      </main>
    </div>
  );
}
