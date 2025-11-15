// src/pages/ResetPassword.jsx
import "./ForgotPassword.css"; // ✅ نفس الستايل
import { useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { firebaseAuth } from "@/firebase";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import logo from "@/assets/images/Container.png";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode"); // كود الريسيت جاي من اللينك
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("❌ Passwords do not match.");
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(firebaseAuth, oobCode);
      await confirmPasswordReset(firebaseAuth, oobCode, newPassword);
      setMessage(
        "✅ Password has been reset successfully. You can now log in."
      );
    } catch (err) {
      console.error(err);
      setError("❌ Invalid or expired reset link.");
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

          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h4>Reset Password</h4>
              <p className="text-muted">Enter your new password below.</p>

              <Form onSubmit={handleResetPassword}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="forgotPassword-input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="forgotPassword-input"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
