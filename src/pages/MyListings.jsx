import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import moment from 'moment';
import config from '../config';

const MyListings = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });
  
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const token = await user.getIdToken();
        
        const response = await axios.get(`${config.apiBaseUrl}/listings/mine`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user listings:', error);
        setError('Failed to load your listings. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUserListings();
  }, [user]);
  
  const handleDeleteClick = (listing) => {
    setSelectedListing(listing);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedListing || !user) return;
    
    try {
      setDeleting(true);
      const token = await user.getIdToken();
      
      await axios.delete(`${config.apiBaseUrl}/listings/${selectedListing._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the deleted listing from state
      setListings(listings.filter(item => item._id !== selectedListing._id));
      
      setFeedback({
        type: 'success',
        message: 'Listing deleted successfully!',
        show: true
      });
      
      // Close the modal
      setShowDeleteModal(false);
      setSelectedListing(null);
      
    } catch (error) {
      console.error('Error deleting listing:', error);
      setFeedback({
        type: 'danger',
        message: 'Failed to delete listing. Please try again.',
        show: true
      });
    } finally {
      setDeleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY');
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your listings...</p>
      </Container>
    );
  }
  
  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please log in to view your listings.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Listings</h1>
        <Button 
          variant="primary"
          onClick={() => navigate('/post')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
          </svg>
          Post New Item
        </Button>
      </div>
      
      {feedback.show && (
        <Alert 
          variant={feedback.type} 
          onClose={() => setFeedback({...feedback, show: false})} 
          dismissible
          className="mb-4"
        >
          {feedback.message}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {listings.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5">
          <Card.Body>
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-bag text-muted" viewBox="0 0 16 16">
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
              </svg>
            </div>
            <h4>You haven't posted any items yet</h4>
            <p className="text-muted mb-4">Start selling your items to the campus community!</p>
            <Button 
              variant="primary"
              size="lg"
              onClick={() => navigate('/post')}
            >
              Post Your First Item
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {listings.map(listing => (
            <Col md={6} lg={4} key={listing._id}>
              <Card className="h-100 border-0 shadow-sm listing-card">
                <div className="position-relative">
                  <Link to={`/listing/${listing._id}`}>
                    <div className="listing-img-container">
                      {listing.image ? (
                        <Card.Img 
                          variant="top" 
                          src={listing.image} 
                          alt={listing.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="no-image-placeholder d-flex justify-content-center align-items-center bg-light">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-image text-secondary" viewBox="0 0 16 16">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="price-tag">₹{listing.price}</div>
                  <Badge 
                    bg="success" 
                    className="status-badge"
                  >
                    Available
                  </Badge>
                </div>
                
                <Card.Body>
                  <Link 
                    to={`/listing/${listing._id}`}
                    className="text-decoration-none"
                  >
                    <Card.Title className="listing-title">{listing.title}</Card.Title>
                  </Link>
                  
                  <Card.Text className="listing-description text-muted mb-3">
                    {listing.description.length > 100 
                      ? `${listing.description.substring(0, 100)}...` 
                      : listing.description
                    }
                  </Card.Text>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">
                      Posted {listing.createdAt ? formatDate(listing.createdAt) : 'Recently'}
                    </small>
                    
                    <div className="d-flex">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="me-2"
                        as={Link}
                        to={`/listing/${listing._id}`}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(listing)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{selectedListing?.title}</strong>?</p>
          <p className="text-danger mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : 'Delete Listing'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .listing-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
        }
        
        .listing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .listing-img-container {
          height: 200px;
          overflow: hidden;
          position: relative;
        }
        
        .listing-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .listing-card:hover .listing-img-container img {
          transform: scale(1.05);
        }
        
        .no-image-placeholder {
          width: 100%;
          height: 100%;
        }
        
        .price-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: var(--primary-color);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .status-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
        }
        
        .listing-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .listing-description {
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Dark mode styles */
        body.dark-mode .card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .listing-title {
          color: var(--text-color);
        }
        
        body.dark-mode .text-muted {
          color: var(--text-secondary) !important;
        }
        
        body.dark-mode .no-image-placeholder {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        body.dark-mode .price-tag {
          background-color: var(--primary-color);
        }
        
        /* Modal dark mode styles */
        body.dark-mode .modal-content {
          background-color: var(--card-bg);
          color: var(--text-color);
          border-color: var(--border-color);
        }
        
        body.dark-mode .modal-header {
          border-bottom-color: var(--border-color);
        }
        
        body.dark-mode .modal-footer {
          border-top-color: var(--border-color);
        }
        
        body.dark-mode .modal-header .close {
          color: var(--text-color);
        }
        
        body.dark-mode .btn-secondary {
          background-color: #6c757d;
          border-color: #6c757d;
          color: white;
        }
        
        body.dark-mode .btn-secondary:hover {
          background-color: #5a6268;
          border-color: #545b62;
        }
        
        body.dark-mode .text-danger {
          color: #ff6b6b !important;
        }
      `}</style>
    </Container>
  );
};

export default MyListings;
