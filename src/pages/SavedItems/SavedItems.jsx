import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";
import { HeartFill } from "react-bootstrap-icons";

const SavedItems = () => {
  return (
    <Container className="my-4">
      <h5 className="text-danger fw-bold mb-1">
        <HeartFill className="me-2" /> Saved Items
      </h5>
      <p className="text-muted">
        Your saved transport lines and routes for quick access
      </p>

      
      <div className="btn-group mb-4">
        <NavLink
          to="savedroutes"
          className={({ isActive }) =>
            `btn ${isActive ? "btn-primary" : "btn-outline-primary"}`
          }
        >
          🚏 Saved Routes
        </NavLink>

        <NavLink
          to="savedtransport"
          className={({ isActive }) =>
            `btn ${isActive ? "btn-primary" : "btn-outline-primary"}`
          }
        >
          🚍 Saved Transport
        </NavLink>
      </div>

      
      <Outlet />
    </Container>
  );
};

export default SavedItems;
