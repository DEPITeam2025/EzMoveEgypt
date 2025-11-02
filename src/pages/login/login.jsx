// src/components/Login.jsx
import "./Login.css";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, loadUserFromStorage } from "@/features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo from "@/assets/images/Container.png";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  // ✅ خزّن اختيار "Remember me" في localStorage علشان authSlice يعرف يخزن في المكان الصح
  useEffect(() => {
    localStorage.setItem("rememberMe", JSON.stringify(remember));
  }, [remember]);

  // عند تحميل الـ app — استرجاع لو في بيانات مخزنة
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // عند نجاح الدخول — خزّن في storage و اعمل redirect
  useEffect(() => {
    if (auth.token) {
      navigate(from, { replace: true });
    }
  }, [auth.token, auth.user, remember, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <Container className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <div className="text-center mb-3">
            <div className="logo-circle mb-2">
              <img src={logo} alt="logo" style={{ width: 64, height: 64 }} />
            </div>
            <h5>EZmove</h5>
            <p className="text-muted">
              Welcome back! Please login to your account.
            </p>
          </div>

          <Card className="p-3 shadow-sm ">
            <Card.Body>
              <h4>Login</h4>
              <p className="text-muted">
                Enter your credentials to access your account
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="login-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      className="login-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword((s) => !s)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "9px",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <Link to="/auth/forgot-password"> Forgot password?</Link>
                </div>

                {auth.error && (
                  <div className="text-danger mb-2">{auth.error}</div>
                )}

                <Button
                  type="submit"
                  className="w-100 login-button"
                  disabled={auth.status === "loading"}
                >
                  {auth.status === "loading" ? "Logging in..." : "Login"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
