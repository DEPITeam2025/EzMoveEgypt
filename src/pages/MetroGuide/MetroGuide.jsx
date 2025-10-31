import React, { useState } from 'react';
import './MetroGuide.css';
import { MapPin, Clock, Users, ChevronDown, ChevronUp, DollarSign, AlertCircle } from 'lucide-react';

// Metro Overview Component
function MetroOverview() {
  return (
    <section className="metro-overview">
      <div className="container">
        <h1 className="page-title">Metro Guide</h1>
        <p className="page-subtitle">Complete information about metro lines, stations, and schedules</p>

        <div className="overview-cards">
          <div className="overview-card">
            <div className="overview-icon">
              <span className="icon-number">4</span>
            </div>
            <div className="overview-content">
              <p className="overview-label">Metro Lines</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">
              <span className="icon-number">28</span>
            </div>
            <div className="overview-content">
              <p className="overview-label">All Stations</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">
              <Clock size={24} />
            </div>
            <div className="overview-content">
              <p className="overview-label">5:00 AM - 12:00 AM</p>
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
    <div className={`metro-line metro-line-${line.color}`}>
      <div className="line-header">
        <div className="line-info">
          <div className={`line-badge ${line.color}`}>{line.name}</div>
          <div className="line-details">
            <p className="line-direction">{line.direction}</p>
            <p className="line-schedule">{line.schedule}</p>
            <p className="line-frequency">{line.frequency}</p>
          </div>
        </div>
        <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="line-content">
          <div className="stations-section">
            <h4 className="stations-title">All Stations</h4>
            <div className="stations-list">
              {line.stations.map((station, index) => (
                <div key={index} className="station-item">
                  <div className={`station-badge ${line.color}`}></div>
                  <div className="station-info">
                    <p className="station-name">{station.name}</p>
                    {station.note && <p className="station-note">{station.note}</p>}
                  </div>
                  <div className="station-actions">
                    {station.hasWifi && <span className="action-badge">📶 WiFi</span>}
                    {station.hasParking && <span className="action-badge">🅿️ Amenities</span>}
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
      name: 'Red Line',
      color: 'red',
      direction: 'North to South',
      schedule: 'Operating Hours: 5:00 AM - 12:00 AM',
      frequency: '5-7 minutes during peak hours, 10-12 minutes off-peak',
      stations: [
        { name: 'North Terminal', hasWifi: true, hasParking: true },
        { name: 'Suburban Plaza', hasWifi: true },
        { name: 'Business Park', hasWifi: true },
        { name: 'Airport Junction', hasWifi: true },
        { name: 'Medical Center', hasWifi: true },
        { name: 'University', hasWifi: true },
        { name: 'City Hall', hasWifi: true },
        { name: 'Central Station', note: 'Interchange to Other Lines', hasWifi: true, hasParking: true },
      ]
    },
    {
      name: 'Blue Line',
      color: 'blue',
      direction: 'East to West',
      schedule: 'Operating Hours: 5:30 AM - 11:30 PM',
      frequency: '6-8 minutes during peak hours, 12-15 minutes off-peak',
      stations: [
        { name: 'East End', hasWifi: true },
        { name: 'Harbor View', hasWifi: true },
        { name: 'Downtown Plaza', hasWifi: true },
        { name: 'Financial District', hasWifi: true },
        { name: 'Central Station', note: 'Interchange to Other Lines', hasWifi: true, hasParking: true },
        { name: 'South Park', hasWifi: true },
        { name: 'Stadium', hasWifi: true },
        { name: 'Business Park', hasWifi: true },
        { name: 'East Terminal', hasWifi: true },
      ]
    },
    {
      name: 'Green Line',
      color: 'green',
      direction: 'Southwest to Northeast',
      schedule: 'Operating Hours: 5:30 AM - 12:00 AM',
      frequency: '7-8 minutes during peak hours, 12-15 minutes off-peak',
      stations: [
        { name: 'South Bay', hasWifi: true },
        { name: 'Coastal Avenue', hasWifi: true },
        { name: 'Shopping District', hasWifi: true },
        { name: 'Arts Center', hasWifi: true },
        { name: 'Central Station', note: 'Interchange to Other Lines', hasWifi: true, hasParking: true },
        { name: 'University', hasWifi: true },
        { name: 'Research Park', hasWifi: true },
        { name: 'Innovation Hub', hasWifi: true },
        { name: 'North Point', hasWifi: true },
      ]
    },
  ];

  return (
    <section className="metro-lines-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Metro Network</h2>
          <p className="section-subtitle">Explore all metro lines and their stations</p>
        </div>

        <div className="metro-lines-list">
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
    { type: 'Single Journey', price: '$2.50' },
    { type: 'Day Pass', price: '$8.00' },
    { type: 'Monthly Pass', price: '$75.00' },
  ];

  return (
    <section className="fares-section">
      <div className="container">
        <div className="fares-grid">
          <div className="fares-column">
            <div className="fares-header">
              <DollarSign size={24} />
              <h3 className="fares-title">Fares & Tickets</h3>
            </div>
            <div className="fares-list">
              {fares.map((fare, index) => (
                <div key={index} className="fare-item">
                  <p className="fare-type">{fare.type}</p>
                  <p className="fare-price">{fare.price}</p>
                </div>
              ))}
            </div>
            <button className="btn-purchase">Purchase Tickets</button>
          </div>

          <div className="info-column">
            <div className="info-header">
              <AlertCircle size={24} />
              <h3 className="info-title">Important Information</h3>
            </div>
            <ul className="info-list">
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
    <div className="metro-guide">
      <main className="main-content">
        <MetroOverview />
        <MetroLinesSection />
        <FaresTicketsSection />
      </main>
    </div>
  );
}
