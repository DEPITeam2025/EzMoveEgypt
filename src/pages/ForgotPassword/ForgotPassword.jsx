// src/pages/ForgotPassword.jsx
import "./ForgotPassword.css";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/firebase";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import EzmoveLogo from "@/assets/logo/ezmoveLogo.svg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // فاليديشن لصياغة الإيميل
    if (!EMAIL_REGEX.test(email)) {
      setError("❌ Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      // رسالة عامة بغض النظر عن وجود الإيميل في Firebase
      setMessage(
        "✅ If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      console.error(err);
      setError(
        "❌ Failed to send reset email. Make sure the email format is correct."
      );
    }

    setLoading(false);
  };

  return (
    <Container className="forgotPassword-page d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6}>
          <div className="text-center mb-3">
            <div className="logo-circle mb-2">
              <img
                src={EzmoveLogo}
                alt="logo"
                style={{ width: 50, height: 50 }}
              />
            </div>
            <h4>EZmove</h4>
          </div>

          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h4>Forgot Password</h4>
              <p className="text-muted">
                Enter your email to receive a password reset link.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="forgotPassword-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {error}
                  </Form.Control.Feedback>
                </Form.Group>

                {message && <p className="text-success">{message}</p>}

                <Button
                  type="submit"
                  className="w-100 send-button"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to="/auth/login">← Back to Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
