import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router";

const SignUpSuccess = () => {
  const navigate = useNavigate();
  return (
    <Container fluid className={styles.signupPage}>
      <Card className={styles.signupCard}>
        <Card.Body className="p-4 text-center">
          <svg
            className="mb-4"
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#4169E1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>

          <Card.Title className="h4 fw-bold mb-3">
            Welcome to Ezmove!
          </Card.Title>
          <Card.Text className="text-muted mb-4">
            Your account has been successfully created. You can now log in to
            start using our service.
          </Card.Text>

          <Button
            variant="primary"
            className={styles.createAccountBtn}
            onClick={() => navigate("/login")}
          >
            Proceed to Login
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUpSuccess;
