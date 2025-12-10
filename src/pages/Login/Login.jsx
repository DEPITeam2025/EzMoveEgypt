import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  loadUserFromStorage,
  fetchUserExtraData,
} from "@/features/auth/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import EzmoveLogo from "@/assets/logo/ezmoveLogo.svg";
import styles from "./Login.module.css";

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
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [invalidCred, setInvalidCred] = useState(false);

  useEffect(() => {
    localStorage.setItem("rememberMe", JSON.stringify(remember));
  }, [remember]);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchUserExtraData(auth.user.uid));
      navigate(from, { replace: true });
    }
  }, [auth.token, auth.user, navigate, from, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({ email: "", password: "" });
    setInvalidCred(false);

    let newErrors = {};
    if (!email.trim()) newErrors.email = "Required";
    if (!password) newErrors.password = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Dispatch login
    dispatch(login({ email, password }))
      .unwrap()
      .catch(() => {
        // Invalid credentials: don't mark fields red, just show message
        setInvalidCred(true);
      });
  };

  return (
    <Container className={styles.loginPage}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6}>
          <div className="text-center mb-3">
            <div className={styles.logoCircle + " mb-2"}>
              <img src={EzmoveLogo} alt="Ezmove Logo" />
            </div>
            <h5>Ezmove</h5>
            <p className="text-muted">
              Welcome back! Please login to your account.
            </p>
          </div>

          <Card className={styles.cardCustom + " p-3 shadow-sm"}>
            <Card.Body>
              <h4>Login</h4>
              <p className="text-muted">
                Enter your credentials to access your account
              </p>

              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    className={styles.loginInput}
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      className={styles.loginInput}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                    />
                    <InputGroup.Text
                      onClick={() => setShowPassword((s) => !s)}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Invalid credentials message */}
                {invalidCred && (
                  <div
                    className="text-danger mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Invalid email or password
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <Link to="/auth/forgot-password"> Forgot password?</Link>
                </div>

                <Button
                  type="submit"
                  className={styles.loginButton + " w-100"}
                  disabled={auth.status === "loading"}
                >
                  {auth.status === "loading" ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <span style={{ fontSize: "14px", color: "#555" }}>
                  Don’t have an account?{" "}
                </span>
                <Link to="/auth/signup" className={styles.textBtnSignUp}>
                  Sign up
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
