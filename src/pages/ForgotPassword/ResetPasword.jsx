// src/pages/ResetPassword.jsx
import "./ForgotPassword.css";
import { useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { firebaseAuth } from "@/firebase";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import EzmoveLogo from "@/assets/logo/ezmoveLogo.svg";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "Password is required.";
    else if (newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required.";
    else if (confirmPassword !== newPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(firebaseAuth, oobCode);
      await confirmPasswordReset(firebaseAuth, oobCode, newPassword);
      setMessage(
        "✅ Password has been reset successfully. You can now log in."
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setErrors({ general: "❌ Invalid or expired reset link." });
    }
    setLoading(false);
  };

  return (
    <Container className="forgotPassword-page d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <div className="text-center mb-3">
            <div className="logo-circle mb-2">
              <img
                src={EzmoveLogo}
                alt="logo"
                style={{ width: 50, height: 50 }}
              />
            </div>
            <h4>Ezmove</h4>
          </div>

          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h4>Reset Password</h4>
              <p className="text-muted">Enter your new password below.</p>

              <Form onSubmit={handleResetPassword}>
                {/* New Password */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="forgotPassword-input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    isInvalid={!!errors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="forgotPassword-input"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* General error */}
                {errors.general && (
                  <p className="text-danger">{errors.general}</p>
                )}
                {message && <p className="text-success">{message}</p>}

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
