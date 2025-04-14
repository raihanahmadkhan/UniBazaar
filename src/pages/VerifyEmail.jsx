import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import config from '../config';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query params
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link. No token provided.');
          return;
        }
        
        // Call the API to verify the email
        const response = await axios.get(`${config.apiBaseUrl}/users/verify-email/${token}`);
        
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error || 
          'Failed to verify email. The link may be invalid or expired.'
        );
      }
    };
    
    verifyEmail();
  }, [location]);
  
  const goToLogin = () => {
    navigate('/login');
  };
  
  const goToHome = () => {
    navigate('/');
  };
  
  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: '500px' }}>
        <Card.Body className="p-4 text-center">
          <h2 className="mb-4">Email Verification</h2>
          
          {status === 'loading' && (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <>
              <Alert variant="success" className="mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </div>
                <h4>Verification Successful!</h4>
                <p>{message}</p>
              </Alert>
              <Button variant="primary" onClick={goToLogin} className="me-2">
                Go to Login
              </Button>
              <Button variant="outline-primary" onClick={goToHome}>
                Go to Home
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <Alert variant="danger" className="mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                </div>
                <h4>Verification Failed</h4>
                <p>{message}</p>
              </Alert>
              <Button variant="primary" onClick={goToLogin} className="me-2">
                Go to Login
              </Button>
              <Button variant="outline-primary" onClick={goToHome}>
                Go to Home
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
      
      <style>{`
        /* Dark mode styles */
        body.dark-mode .card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode h2,
        body.dark-mode h4,
        body.dark-mode p {
          color: var(--text-color);
        }
        
        body.dark-mode .alert-success {
          background-color: rgba(25, 135, 84, 0.2);
          color: #75b798;
          border-color: #0f5132;
        }
        
        body.dark-mode .alert-danger {
          background-color: rgba(220, 53, 69, 0.2);
          color: #ea868f;
          border-color: #842029;
        }
      `}</style>
    </Container>
  );
};

export default VerifyEmail;
