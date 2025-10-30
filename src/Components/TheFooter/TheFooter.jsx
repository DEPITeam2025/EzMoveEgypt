import React from "react";
import { Container, Row, Col, Nav, Stack, Badge, Image } from "react-bootstrap";
import { BiMailSend, BiMap, BiLogoGithub } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { MdTranslate } from "react-icons/md"; // new icon
import classes from "./TheFooter.module.css";

function TheFooter() {
  return (
    <footer className={`${classes.footer} pt-4 pb-2 mt-5`}>
      <Container fluid>
        <Row className="gy-4 justify-content-between">
          <Col xs={12} sm={6} md={3} lg={3}>
            <Stack direction="horizontal" gap={2} className="mb-2">
              <Image
                roundedCircle
                width={36}
                height={36}
                src="../../assets/images/ezmovelogo.jpg"
                alt="Ezmove logo"
              />
              <strong>Ezmove</strong>
            </Stack>
            <div className="small text-start">
              Your smart companion for public transportation. Find the best
              routes and travel with ease.
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <h6 className="mb-3 text-start">Quick Links</h6>
            <Nav className="flex-column small text-start">
              <Nav.Link href="#routes" className="px-0 text-white-50">
                Find Routes
              </Nav.Link>
              <Nav.Link href="#search" className="px-0 text-white-50">
                Search Transport
              </Nav.Link>
              <Nav.Link href="#metro" className="px-0 text-white-50">
                Metro Guide
              </Nav.Link>
              <Nav.Link href="#saved" className="px-0 text-white-50">
                Saved List
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <h6 className="mb-3 text-start">Resources</h6>
            <Stack gap={2} className="small text-start">
              <a href="#help" className="text-white-50 text-decoration-none">
                Help Center
              </a>
              <a href="#faqs" className="text-white-50 text-decoration-none">
                FAQs
              </a>
              <a href="#terms" className="text-white-50 text-decoration-none">
                Terms of Service
              </a>
              <a href="#privacy" className="text-white-50 text-decoration-none">
                Privacy Policy
              </a>
            </Stack>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <h6 className="mb-3 text-start">Contact</h6>

            {/* add classes.contactStack – remove text-white-50            */}
            <Stack
              gap={2}
              className={`small text-start ${classes.contactStack}`}
            >
              <div className="d-flex align-items-center gap-2">
                <BiMailSend /> support@ezmove.com
              </div>
              <div className="d-flex align-items-center gap-2">
                <BiMap /> 123 Transit Ave, City
              </div>
              <div className="d-flex align-items-center gap-2">
                <BiLogoGithub /> GitHub
              </div>
            </Stack>
          </Col>
        </Row>
      </Container>

      <Container
        fluid
        className={`py-5 ${classes.footerBottom}`} // ← no border utils here
      >
        {/* inner wrapper: draws the shorter border */}
        <div
          className={`${classes.footerBottom}  mx-auto`}
        >
          <Row className="align-items-center">
            {/* ── left ── */}
            <Col md="auto" className="text-start">
              <div className="small">
                © {new Date().getFullYear()} Ezmove. All rights reserved.
              </div>
            </Col>

            {/* ── centre ── */}
            <Col className="text-center">
              <div className="small d-flex justify-content-center align-items-center gap-1">
                Made with&nbsp;
                <AiFillHeart className={classes.heartIcon} />
                &nbsp;for better commuting
              </div>
            </Col>

            {/* ── right ── */}
            <Col md="auto" className="text-end">
              <Badge
                bg="light"
                text="dark"
                className={`border rounded-pill py-2 px-3 ${classes.langBadge}`}
              >
                <MdTranslate className="me-1" /> English
              </Badge>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}

export default TheFooter;
