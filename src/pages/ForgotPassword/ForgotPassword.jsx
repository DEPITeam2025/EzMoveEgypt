import "./ForgotPassword.css";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/firebase";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import logo from "@/assets/images/Container.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setMessage("✅ Password reset link has been sent to your email.");
      // ✅ الإيميل موجود
    } catch (err) {
      setError(
        "❌ Failed to send reset email. Make sure the email is correct."
      );
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Container className="forgotPassword-page d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <div className="text-center mb-3">
            <div className="logo-circle mb-2">
              <img src={logo} alt="logo" style={{ width: 64, height: 64 }} />
            </div>
            <h4>EZmove</h4>
          </div>

          <Card className="p-3 shadow-sm ">
            <Card.Body>
              <h4>Forgot Password !!</h4>
              <p className="text-muted">
                Enter your Email to send you a message.
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
                    required
                  />
                </Form.Group>

                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}

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
