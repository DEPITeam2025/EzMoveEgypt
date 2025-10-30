import React, { useState } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import styles from "./SignUp.module.css";

const BusIcon = () => (
  <div className={styles.iconPlaceholder}>
    {/* Placeholder for a stylized bus icon */}
    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
      <path
        d="M12.9111 9.68348V19.367"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M24.2085 9.68348V19.367"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.22778 19.367H34.8605"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M29.0504 29.0504H33.8921C33.8921 29.0504 34.6991 26.3068 35.1833 24.5315C35.3446 23.8859 35.506 23.2403 35.506 22.5948C35.506 21.9492 35.3446 21.3036 35.1833 20.6581L32.9238 12.5885C32.4396 10.9746 30.8257 9.68348 29.0504 9.68348H6.45561C5.59954 9.68348 4.77853 10.0236 4.17319 10.6289C3.56786 11.2342 3.22778 12.0552 3.22778 12.9113V29.0504H8.06952"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.2974 32.2783C13.0801 32.2783 14.5252 30.8331 14.5252 29.0504C14.5252 27.2678 13.0801 25.8226 11.2974 25.8226C9.51473 25.8226 8.06958 27.2678 8.06958 29.0504C8.06958 30.8331 9.51473 32.2783 11.2974 32.2783Z"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.5251 29.0504H22.5947"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25.8226 32.2783C27.6052 32.2783 29.0504 30.8331 29.0504 29.0504C29.0504 27.2678 27.6052 25.8226 25.8226 25.8226C24.0399 25.8226 22.5947 27.2678 22.5947 29.0504C22.5947 30.8331 24.0399 32.2783 25.8226 32.2783Z"
        stroke="white"
        stroke-width="2.14936"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
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
              style={{ color: "#3a2be2ff" }}
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
