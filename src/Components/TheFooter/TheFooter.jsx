import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Envelope, GeoAlt, Github, Translate } from "react-bootstrap-icons";
import styles from "./TheFooter.module.css";

const getLinkPath = (text) => {
  switch (text) {
    case "Find Routes":
      return "/findroutes";
    case "Search Transport":
      return "/searchfortransport";
    case "Metro Guide":
      return "/metroguide";
    case "Saved List":
      return "/saveditems";
    case "Help Center":
      return "/help-center";
    case "FAQs":
      return "/faqs";
    case "Terms of Service":
      return "/terms-of-service";
    case "Privacy Policy":
      return "/privacy-policy";
    default:
      return "#";
  }
};

const EzmoveLogo = () => (
  <div className={styles.logoContainer}>
    <div className={styles.iconBox}>
      <img src="/src/assets/images/LogoFooter.png" alt="Ezmove Logo" />
    </div>
    <span className={styles.logoText}>Ezmove</span>
  </div>
);

const FooterLink = ({ children }) => (
  <ListGroup.Item as="li" className={styles.footerLink}>
    <a href={getLinkPath(children)} className={styles.linkText}>
      {children}
    </a>
  </ListGroup.Item>
);

const ContactItem = ({ Icon, text, href }) => (
  <a
    href={href}
    className={styles.contactItem}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className={styles.contactIcon} />
    <span className={styles.contactText}>{text}</span>
  </a>
);

const TheFooter = () => {

  // --- Smooth Scroll To Top ---
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // smooth = بدون خضة
    });
  };

  return (
    <footer className={styles.footer}>
      <Container className="py-5">
        <Row>
          {/* Column 1 */}
          <Col md={4} sm={12} className="mb-4 mb-md-0">
            <EzmoveLogo />
            <p className={styles.description}>
              Your smart companion for public transportation.
              <br />
              Find the best routes and travel with ease.
            </p>
          </Col>

          {/* Column 2 */}
          <Col xs={12} sm={6} md={2} className="mb-4 mb-md-0">
            <h5 className={styles.heading}>Quick Links</h5>
            <ListGroup as="ul" variant="flush" className={styles.listGroup}>
              <FooterLink>Find Routes</FooterLink>
              <FooterLink>Search Transport</FooterLink>
              <FooterLink>Metro Guide</FooterLink>
              <FooterLink>Saved List</FooterLink>
            </ListGroup>
          </Col>

          {/* Column 3 */}
          <Col xs={12} sm={6} md={3} className="mb-4 mb-md-0">
            <h5 className={styles.heading}>Resources</h5>
            <ListGroup as="ul" variant="flush" className={styles.listGroup}>
              <FooterLink>Help Center</FooterLink>
              <FooterLink>FAQs</FooterLink>
              <FooterLink>Terms of Service</FooterLink>
              <FooterLink>Privacy Policy</FooterLink>
            </ListGroup>
          </Col>

          {/* Column 4 */}
          <Col xs={12} sm={6} md={3}>
            <h5 className={styles.heading}>Contact</h5>
            <div className={styles.contactList}>
              <ContactItem
                Icon={Envelope}
                text="support@ezmove.com"
                href="mailto:support@ezmove.com"
              />
              <ContactItem Icon={GeoAlt} text="123 Transit Ave, City" href="#" />
              <ContactItem Icon={Github} text="GitHub" href="https://github.com/YourGitHubRepo" />
            </div>
          </Col>
        </Row>

        {/* Line */}
        <hr className={styles.divider} />

        {/* Scroll to Top */}
        <div className="d-flex justify-content-end mb-3">
          <button onClick={scrollToTop} className={styles.scrollToTopBtn}>
            ↑
          </button>
        </div>

        {/* Bottom row */}
        <Row className="align-items-center">
          <Col md={4}>
            <p className={styles.copyright}>
              &copy; 2025 Ezmove. All rights reserved.
            </p>
          </Col>

          <Col md={4} className="d-flex justify-content-md-end justify-content-start">
            <p className={styles.madeWith}>
              Made with <span className={styles.heart}>&hearts;</span> for better commuting
            </p>
          </Col>

          <Col md={4} className="d-flex justify-content-md-end justify-content-start">
            <button className={styles.languageButton}>
              <Translate className="me-1" /> English
            </button>
          </Col>
        </Row>

      </Container>
    </footer>
  );
};

export default TheFooter;
