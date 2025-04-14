import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card, InputGroup } from "react-bootstrap";
import axios from "axios";
import { getAuth } from "firebase/auth";
import config from "../config";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hostel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create the user in Firebase
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Get Firebase token
      const token = await userCredential.user.getIdToken();
      console.log("Firebase authentication successful, proceeding to backend registration");

      try {
        // Create user profile in our backend
        console.log("Attempting to create user in backend with data:", {
          firebaseId: userCredential.user.uid,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          hostel: formData.hostel,
        });
        
        const response = await axios.post(
          `${config.apiBaseUrl}/users`,
          {
            firebaseId: userCredential.user.uid,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            hostel: formData.hostel,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Backend registration successful:", response.data);

        // Update Firebase user profile
        await updateProfile(userCredential.user, {
          displayName: formData.name,
        });

        // Show success message
        setSuccessMessage("Account created successfully!");
        
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          hostel: "",
        });
        
        // Redirect to login page after 5 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Your account has been created successfully. You can now log in." 
            } 
          });
        }, 5000);
      } catch (backendError) {
        console.error("Backend error details:", {
          message: backendError.message,
          response: backendError.response ? {
            status: backendError.response.status,
            data: backendError.response.data
          } : 'No response from server',
          request: backendError.request ? 'Request was made but no response received' : 'Request setup failed'
        });
        
        // Delete the Firebase user since backend creation failed
        await userCredential.user.delete();
        
        // Show user-friendly error message based on backend response
        if (backendError.response && backendError.response.data && backendError.response.data.error) {
          setError(backendError.response.data.error);
        } else if (backendError.request) {
          setError("Cannot connect to the server. Please check your internet connection and try again.");
        } else {
          setError("An error occurred during signup. Please try again.");
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error("Firebase error details:", {
        code: error.code,
        message: error.message
      });
      
      // Handle Firebase-specific errors with user-friendly messages
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please use a different email or try logging in.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/weak-password':
          errorMessage = "The password is too weak. Please use a stronger password.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection and try again.";
          break;
        default:
          errorMessage = error.message || "Failed to create account. Please try again.";
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Create an Account</h2>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your contact number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hostel/Location</Form.Label>
              <Form.Select
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                required
              >
                <option value="">Select your hostel</option>
                <option value="BH-1">BH-1</option>
                <option value="BH-2">BH-2</option>
                <option value="GH">GH</option>
                <option value="Off-Campus">Off-Campus</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <InputGroup.Text 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                  className="password-toggle"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  )}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength="6"
                />
                <InputGroup.Text 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer' }}
                  className="password-toggle"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  )}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </Card.Body>
      </Card>

      <style>{`
        /* Dark mode specific styles to ensure text visibility */
        body.dark-mode .form-control,
        body.dark-mode .form-select {
          background-color: var(--card-bg);
          color: var(--text-color);
          border-color: var(--border-color);
        }
        
        body.dark-mode .form-control:focus,
        body.dark-mode .form-select:focus {
          background-color: var(--card-bg);
          color: var(--text-color);
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.25rem rgba(var(--primary-color-rgb), 0.25);
        }
        
        body.dark-mode .form-control::placeholder {
          color: var(--text-secondary);
          opacity: 0.7;
        }
        
        body.dark-mode .form-label {
          color: var(--text-color);
        }
        
        body.dark-mode .text-muted {
          color: var(--text-secondary) !important;
        }
        
        body.dark-mode .card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        /* Fix password toggle visibility in dark mode */
        body.dark-mode .password-toggle {
          background-color: #495057;
          border-color: #495057;
        }
        
        body.dark-mode .password-toggle svg {
          fill: #f8f9fa;
        }
      `}</style>
    </Container>
  );
};

export default Signup;
