import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "./TheHeader.module.css";

import EzmoveLogo from "./Icons/EzmoveLogo.svg";
import FindRoutesIcon from "./Icons/FindRoutesIcon.svg";
import SearchTransportIcon from "./Icons/SearchTransportIcon.svg";
import MetroGuideIcon from "./Icons/MetroGuideIcon.svg";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";

function TheHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ خدي بيانات المستخدم من Redux
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  function handleLogout() {
    dispatch(logout());
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
          <img
            src={EzmoveLogo}
            alt="Ezmove Logo"
            width="40"
            height="40"
            className={styles.logoImg}
          />
          <span className={styles.logoText}>Ezmove</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          className={styles.toggleBtn}
        />

        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav className={styles.navList}>
            <Nav.Link as={Link} to="/findroutes" className={styles.navLink}>
              <img
                src={FindRoutesIcon}
                alt="Find Routes"
                width="18"
                height="18"
                className={styles.icon}
              />
              find routes
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/searchfortransport"
              className={styles.navLink}
            >
              <img
                src={SearchTransportIcon}
                alt="Search Transport"
                width="18"
                height="18"
                className={styles.icon}
              />
              search transport
            </Nav.Link>

            <Nav.Link as={Link} to="/metroguide" className={styles.navLink}>
              <img
                src={MetroGuideIcon}
                alt="Metro Guide"
                width="18"
                height="18"
                className={styles.icon}
              />
              metro guide
            </Nav.Link>

            <Nav.Link as={Link} to="/saveditems" className={styles.navLink}>
              <img
                src={MetroGuideIcon}
                alt="Metro Guide"
                width="18"
                height="18"
                className={styles.icon}
              />
              saved items
            </Nav.Link>
          </Nav>

          <div className={styles.buttonContainer}>
            {isLoggedIn ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ color: "black" }}>
                  👋 Hello, <strong>{user?.name || "User"}</strong>
                </span>
                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                  className={styles.authButton}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                as={Link}
                to="/auth/login"
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
