import React, { useState } from "react";
import "./FindRoutes.css";

function FindRoutes() {
  const [searchDone, setSearchDone] = useState(false);

  const handleSearch = () => {
    setSearchDone(true);
  };

  const handleBack = () => {
    setSearchDone(false);
  };

  return (
    <div className="find-routes-container">
      {!searchDone ? (
        // الحالة الأولى: قبل البحث
        <div className="find-routes-main">
          <h2 className="title">Easy way to look for available routes</h2>

          <div className="info-cards">
            <div className="info-card blue">
              <span>📍</span>
              <p>Choose your starting point and destination</p>
            </div>
            <div className="info-card purple">
              <span>🔀</span>
              <p>Compare different route options</p>
            </div>
            <div className="info-card yellow">
              <span>⚡</span>
              <p>Find out the fastest and cheapest route</p>
            </div>
          </div>

          <div className="search-box">
            <div className="input-row">
              <label>Current Location</label>
              <input type="text" placeholder="Enter your current location" />
            </div>
            <div className="input-row">
              <label>Destination</label>
              <input type="text" placeholder="Enter your destination" />
            </div>
            <button className="find-btn" onClick={handleSearch}>
              🔍 Find Routes
            </button>
          </div>
        </div>
      ) : (
        // الحالة الثانية: بعد البحث
        <div className="results-section">
          <div className="results-header">
            <h3>Available Routes from Downtown to Airport</h3>
            <button className="back-btn" onClick={handleBack}>
              🔄 Find Another Routes
            </button>
          </div>

          <div className="stats">
            <div className="stat-card">
              <p>Fastest</p>
              <h4>35m</h4>
            </div>
            <div className="stat-card">
              <p>Cheapest</p>
              <h4>$2.00</h4>
            </div>
            <div className="stat-card">
              <p>Avg Time</p>
              <h4>42m</h4>
            </div>
          </div>

          <div className="route-card">
            <div className="route-header">
              <span>🚇 35 min • 12.5 km</span>
              <span>$2.50</span>
            </div>
            <ul>
              <li>Walk 5 min → Central Station</li>
              <li>Metro Red Line (18 min, 8 stops)</li>
              <li>Walk 3 min → Bus stop</li>
              <li>Bus 42 (9 min, 5 stops)</li>
            </ul>
            <button className="save-btn">❤️ Saved</button>
          </div>
          <div className="route-card">
            <div className="route-header">
              <span>🚈 42 min • 10.8 km</span>
              <span>$2.00</span>
            </div>
            <ul>
              <li>Walk 4 min → Oak Avenue</li>
              <li>Minibus M7 (12 min, 6 stops)</li>
              <li>Light Rail Green Line (20 min, 10 stops)</li>
              <li>Walk 4 min → destination</li>
            </ul>
            <button className="save-btn">♡ Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindRoutes;

