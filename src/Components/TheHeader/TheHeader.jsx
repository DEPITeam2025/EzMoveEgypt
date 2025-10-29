import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import EzmoveLogo from "./EzmoveLogo";
import FindRoutesIcon from "./FindRoutesIcon";
import SearchTransportIcon from "./SearchTransportIcon";
import MetroGuideIcon from "./MetroGuideIcon";
import styles from "./TheHeader.module.css";

function TheHeader() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <Navbar expand="lg" className={styles.header}>
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className={`${styles.logoBrand} d-flex align-items-center`}
        >
          <EzmoveLogo width={40} height={40} />
          <span className={styles.logoText}>Ezmove</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          className={styles.toggleBtn}
        />

        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav className={`${styles.navList}`}>
            <Nav.Link as={Link} to="/findroutes" className={styles.navLink}>
              <FindRoutesIcon /> find routes
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/searchfortransport"
              className={styles.navLink}
            >
              <SearchTransportIcon /> search transport
            </Nav.Link>
            <Nav.Link as={Link} to="/metroguide" className={styles.navLink}>
              <MetroGuideIcon /> metro guide
            </Nav.Link>
          </Nav>

          <div className={`${styles.buttonContainer}`}>
            {isLoggedIn ? (
              <Button
                variant="outline-danger"
                onClick={handleLogout}
                className={styles.authButton}
              >
                Logout
              </Button>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="primary"
                className={styles.authButton}
              >
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TheHeader;
