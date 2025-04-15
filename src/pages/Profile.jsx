import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { usersApi, listingsApi } from '../utils/api';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    hostel: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
    show: false
  });
  
  const [passwordFeedback, setPasswordFeedback] = useState({
    type: '',
    message: '',
    show: false
  });
  
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        setError('You must be logged in to view your profile');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching user data for:', user.uid);
        
        // Fetch user profile
        try {
          const profileResponse = await usersApi.getProfile(user.uid);
          
          console.log('Profile data received:', profileResponse.data);
          setUserProfile(profileResponse.data);
          setFormData({
            name: profileResponse.data.name || user.displayName || '',
            hostel: profileResponse.data.hostel || '',
            phone: profileResponse.data.phone || ''
          });
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to load profile information. Please try again.');
        }
        
        // Fetch user listings count
        try {
          const listingsResponse = await listingsApi.getUserListings();
          
          console.log('Listings data received:', listingsResponse.data);
          setUserListings(listingsResponse.data);
        } catch (listingsError) {
          console.error('Error fetching listings:', listingsError);
          // Don't set an error here, as we want to show the profile even if listings fail
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setFeedback({ show: false, message: '', type: '' });
    
    try {
      // Update Firebase display name
      await updateProfile(user, {
        displayName: formData.name
      });
      
      // Update user profile in database
      const response = await usersApi.updateProfile({
        name: formData.name,
        phone: formData.phone,
        hostel: formData.hostel
      });
      
      setUserProfile(response.data);
      setFeedback({
        type: 'success',
        message: 'Profile updated successfully!',
        show: true
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setFeedback({
        type: 'danger',
        message: 'Failed to update profile. Please try again.',
        show: true
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({
        type: 'danger',
        message: 'New passwords do not match.',
        show: true
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordFeedback({
        type: 'danger',
        message: 'Password must be at least 6 characters long.',
        show: true
      });
      return;
    }
    
    try {
      setUpdatingPassword(true);
      setPasswordFeedback({ show: false, message: '', type: '' });
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      setPasswordFeedback({
        type: 'success',
        message: 'Password updated successfully!',
        show: true
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Error updating password:', error);
      
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many unsuccessful attempts. Please try again later.';
      }
      
      setPasswordFeedback({
        type: 'danger',
        message: errorMessage,
        show: true
      });
    } finally {
      setUpdatingPassword(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your profile...</p>
      </Container>
    );
  }
  
  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="mb-4">My Profile</h1>
      
      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4 text-center">
              <div className="profile-avatar mb-3">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={formData.name} 
                    className="rounded-circle img-thumbnail" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary d-flex justify-content-center align-items-center text-white mx-auto"
                    style={{ width: '120px', height: '120px', fontSize: '3rem' }}
                  >
                    {formData.name?.charAt(0) || user.email?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              
              <h4 className="mb-1">{formData.name || 'UniBazaar User'}</h4>
              <p className="text-muted mb-3">{user.email}</p>
              
              <div className="d-flex justify-content-center">
                <div className="text-center mx-2">
                  <div className="fw-bold">{userListings.length || 0}</div>
                  <small className="text-muted">Listings</small>
                </div>
                <div className="text-center mx-2">
                  <div className="fw-bold">{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}</div>
                  <small className="text-muted">Joined</small>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-3">Account Information</h5>
              <div className="mb-2 d-flex">
                <div className="text-muted me-2" style={{ width: '100px' }}>Email:</div>
                <div className="fw-medium">{user.email}</div>
              </div>
              {formData.phone && (
                <div className="mb-2 d-flex">
                  <div className="text-muted me-2" style={{ width: '100px' }}>Phone:</div>
                  <div className="fw-medium">{formData.phone}</div>
                </div>
              )}
              {formData.hostel && (
                <div className="mb-2 d-flex">
                  <div className="text-muted me-2" style={{ width: '100px' }}>Hostel:</div>
                  <div className="fw-medium">{formData.hostel}</div>
                </div>
              )}
              <div className="mb-2 d-flex">
                <div className="text-muted me-2" style={{ width: '100px' }}>Member since:</div>
                <div className="fw-medium">
                  {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h5 className="mb-4">Edit Profile</h5>
              
              {feedback.show && (
                <Alert variant={feedback.type} onClose={() => setFeedback({...feedback, show: false})} dismissible>
                  {feedback.message}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Hostel/Residence</Form.Label>
                  <Form.Control
                    type="text"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    placeholder="e.g. BH-2, GH-1"
                  />
                  <Form.Text className="text-muted">
                    This helps buyers know your general location on campus.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                  <Form.Text className="text-muted">
                    This will be visible to potential buyers.
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-4">Change Password</h5>
              
              {passwordFeedback.show && (
                <Alert variant={passwordFeedback.type} onClose={() => setPasswordFeedback({...passwordFeedback, show: false})} dismissible>
                  {passwordFeedback.message}
                </Alert>
              )}
              
              <Form onSubmit={handlePasswordUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="outline-primary"
                    disabled={updatingPassword}
                  >
                    {updatingPassword ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Updating Password...
                      </>
                    ) : 'Update Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Dark mode styles */
        body.dark-mode .card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .text-muted {
          color: var(--text-secondary) !important;
        }
        
        body.dark-mode .form-control {
          background-color: var(--card-bg);
          border-color: var(--border-color);
          color: var(--text-color);
        }
        
        body.dark-mode .form-control:focus {
          background-color: var(--card-bg);
          color: var(--text-color);
        }
      `}</style>
    </Container>
  );
};

export default Profile;
