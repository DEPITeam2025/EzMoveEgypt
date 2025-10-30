import React, { useState } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import styles from "./SignUp.module.css";

const BusIcon = () => (
  <div className={styles.iconPlaceholder}>
    {/* Placeholder for a stylized bus icon */}
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="6" fill="url(#busGradient)" />
      <path
        d="M7 12H17M7 16H17M14 8L16 10L14 12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="busGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#8A2BE2", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#4169E1", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Placeholder for the eye icon (using a simple SVG)
const EyeIcon = ({ onClick }) => (
  <InputGroup.Text className={styles.eyeIcon} onClick={onClick}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  </InputGroup.Text>
);

const Eye2Icon = ({ onClick }) => (
  <InputGroup.Text className={styles.eyeIcon} onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.73 5.073C11.1516 5.02419 11.5756 4.99982 12 5C16.664 5 20.4 7.903 22 12C21.6126 12.9966 21.0893 13.9348 20.445 14.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12C3.6 16.097 7.336 19 12 19C13.9321 19.0102 15.8292 18.484 17.48 17.48M9.88 9.88C9.6014 10.1586 9.3804 10.4893 9.22963 10.8534C9.07885 11.2174 9.00125 11.6075 9.00125 12.0015C9.00125 12.3955 9.07885 12.7856 9.22963 13.1496C9.3804 13.5137 9.6014 13.8444 9.88 14.123C10.1586 14.4016 10.4893 14.6226 10.8534 14.7734C11.2174 14.9242 11.6075 15.0018 12.0015 15.0018C12.3955 15.0018 12.7856 14.9242 13.1496 14.7734C13.5137 14.6226 13.8444 14.4016 14.123 14.123"
        stroke="#717182"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 4L20 20"
        stroke="#717182"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  </InputGroup.Text>
);

const SignUp = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  return (
    <Container fluid className={styles.signupPage}>
      <header className="text-center mb-4">
        <BusIcon />
        <h1 className="h5 fw-bold mb-0">Ezmove</h1>
        <p className="text-muted small">Create an account to get started</p>
      </header>

      <Card className={styles.signupCard}>
        <Card.Body className="p-4">
          <Card.Title className="h4 fw-bold">Sign Up</Card.Title>
          <Card.Text className="text-muted mb-4">
            Enter your information to create an account
          </Card.Text>

          <Form>
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold mb-1">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                className={styles.formControlCustom}
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold mb-1">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.email@example.com"
                className={styles.formControlCustom}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold mb-1">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordShown ? "text" : "password"}
                  placeholder="Create a password (min. 8 characters)"
                  className={styles.formControlCustom}
                />
                {passwordShown ? (
                  <Eye2Icon onClick={togglePasswordVisibility} />
                ) : (
                  <EyeIcon onClick={togglePasswordVisibility} />
                )}
              </InputGroup>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-1">
                Confirm Password
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordShown ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={styles.formControlCustom}
                />
                <EyeIcon onClick={togglePasswordVisibility} />
              </InputGroup>
            </Form.Group>

            {/* Terms and Policy Checkbox */}
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="terms-checkbox"
                label={
                  <>
                    I agree to the{" "}
                    <a href="#" className="fw-bold text-decoration-none">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="fw-bold text-decoration-none">
                      Privacy Policy
                    </a>
                  </>
                }
                className={styles.formCheckCustom}
              />
            </Form.Group>

            {/* Create Account Button */}
            <Button type="submit" className={styles.createAccountBtn}>
              Create Account
            </Button>
          </Form>

          <p className="text-center mt-4 mb-0 small text-muted">
            Already have an account?{" "}
            <a
              href="#"
              className="fw-bold text-decoration-none"
              style={{ color: "#8A2BE2" }}
            >
              Login
            </a>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
