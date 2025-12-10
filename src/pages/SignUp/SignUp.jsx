import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import styles from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseAuth } from "../../firebase";
import EzmoveLogo from "@/assets/logo/ezmoveLogo.svg";

// Strong email regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Egyptian phone regex
const EGYPT_PHONE_REGEX = /^(010|011|012|015)[0-9]{8}$/;

// Eye Icons
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </InputGroup.Text>
);

const Eye2Icon = ({ onClick }) => (
  <InputGroup.Text className={styles.eyeIcon} onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.73 5.073C11.1516 5.02419 11.5756 4.99982 12 5C16.664 5 20.4 7.903 22 12C21.6126 12.9966 21.0893 13.9348 20.445 14.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12C3.6 16.097 7.336 19 12 19C13.9321 19.0102 15.8292 18.484 17.48 17.48M9.88 9.88C9.6014 10.1586 9.3804 10.4893 9.22963 10.8534C9.07885 11.2174 9.00125 11.6075 9.00125 12.0015C9.00125 12.3955 9.07885 12.7856 9.22963 13.1496C9.3804 13.5137 9.6014 13.8444 9.88 14.123C10.1586 14.4016 10.4893 14.6226 10.8534 14.7734C11.2174 14.9242 11.6075 15.0018 12.0015 15.0018C12.3955 15.0018 12.7856 14.9242 13.1496 14.7734C13.5137 14.6226 13.8444 14.4016 14.123 14.123"
        stroke="#717182"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L20 20"
        stroke="#717182"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </InputGroup.Text>
);

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);
  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const findFormErrors = () => {
    const { fullName, email, phone, password, confirmPassword, terms } = form;
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    else if (fullName.trim().length < 2)
      newErrors.fullName = "Full Name must be at least 2 characters.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email))
      newErrors.email = "Please enter a valid email.";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!EGYPT_PHONE_REGEX.test(phone))
      newErrors.phone = "Please enter a valid Egyptian phone number.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!terms) newErrors.terms = "You must agree to the terms.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // إنشاء يوزر
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // تحديث displayName
      await updateProfile(user, { displayName: form.fullName });

      // حفظ بيانات اليوزر محلياً
      // const authData = {
      //   user: { uid: user.uid, email: user.email, fullName: user.displayName },
      //   token: await user.getIdToken(),
      // };
      // localStorage.setItem("ezMove_auth", JSON.stringify(authData));

      setLoading(false);
      navigate("/auth/signup-success");
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/email-already-in-use") {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Something went wrong. Please try again.",
        }));
      }
    }
  };

  return (
    <Container fluid className={styles.signupPage}>
      <header className="text-center mb-4">
        <img
          src={EzmoveLogo}
          alt="Ezmove Logo"
          style={{ width: 50, height: 50 }}
        />
        <h1 className="h5 fw-bold mb-0">Ezmove</h1>
        <p className="text-muted small">Create an account to get started</p>
      </header>

      <Card className={styles.signupCard}>
        <Card.Body className="p-4">
          <Card.Title className="h4 fw-bold">Sign Up</Card.Title>
          <Card.Text className="text-muted mb-4">
            Enter your information to create an account
          </Card.Text>

          <Form onSubmit={handleSubmit}>
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                className={styles.formControlCustom}
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.email@example.com"
                className={styles.formControlCustom}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="01*********"
                className={styles.formControlCustom}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type={passwordShown ? "text" : "password"}
                  placeholder="Create a password (min. 6 characters)"
                  className={styles.formControlCustom}
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  isInvalid={!!errors.password}
                />
                {passwordShown ? (
                  <Eye2Icon onClick={togglePasswordVisibility} />
                ) : (
                  <EyeIcon onClick={togglePasswordVisibility} />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type={passwordShown ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={styles.formControlCustom}
                  value={form.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                />
                {passwordShown ? (
                  <Eye2Icon onClick={togglePasswordVisibility} />
                ) : (
                  <EyeIcon onClick={togglePasswordVisibility} />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Terms */}
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="terms-checkbox"
                label={
                  <>
                    <span>I agree to the </span>
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
                checked={form.terms}
                onChange={(e) => setField("terms", e.target.checked)}
                isInvalid={!!errors.terms}
                feedback={errors.terms}
              />
            </Form.Group>

            <Button
              type="submit"
              className={styles.createAccountBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  {" "}
                  <Spinner animation="border" size="sm" /> Creating...{" "}
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Form>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <span style={{ fontSize: "14px", color: "#555" }}>
              Already have an account?{" "}
            </span>
            <Link to="/auth/login" className={styles.textButton}>
              Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
