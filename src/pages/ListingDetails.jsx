import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import moment from "moment";
import config from "../config";

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  
  // New state for contact modal and saved listings
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [contactStatus, setContactStatus] = useState({ show: false, message: "", type: "success" });
  
  // State for image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  // This function will be used to fetch seller information separately
  const fetchSellerInfo = async (userId) => {
    if (!userId) return;
    
    try {
      console.log("Fetching seller info for userId:", userId);
      // Ensure we're using the Firebase UID to fetch user data
      const sellerRes = await axios.get(`${config.apiBaseUrl}/users/${userId}`);
      console.log("Seller data received:", sellerRes.data);
      
      if (sellerRes.data) {
        setSeller(sellerRes.data);
        console.log("Seller state updated with:", sellerRes.data.name);
      } else {
        console.error("No seller data received for userId:", userId);
      }
    } catch (err) {
      console.error("Error fetching seller info:", err.response ? err.response.data : err.message);
      // If we get a 404, it might mean the user record doesn't exist yet
      if (err.response && err.response.status === 404) {
        console.log("User not found, setting default seller info");
        // Set a default seller object to prevent UI errors
        setSeller({
          name: "Unknown Seller",
          email: "No email available",
          createdAt: new Date()
        });
      }
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        const res = await axios.get(`${config.apiBaseUrl}/listings/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setListing(res.data);
        
        // Collect all images from the listing
        const mainImage = res.data.image;
        
        // Handle additionalImages array properly
        let additionalImages = [];
        if (res.data.additionalImages) {
          if (Array.isArray(res.data.additionalImages)) {
            additionalImages = res.data.additionalImages.filter(img => img && img.trim() !== '');
          } else if (typeof res.data.additionalImages === 'string' && res.data.additionalImages.trim() !== '') {
            additionalImages = [res.data.additionalImages];
          }
        }
        
        // Debug logging
        console.log("Listing data from API:", res.data);
        console.log("Main image:", mainImage);
        console.log("Additional images (raw):", res.data.additionalImages);
        console.log("Additional images (processed):", additionalImages);
        
        // Create the final array of all images
        const imageArray = mainImage ? [mainImage, ...additionalImages].filter(Boolean) : additionalImages.filter(Boolean);
        console.log("Final image array:", imageArray);
        console.log("Number of images to display:", imageArray.length);
        
        setAllImages(imageArray);

        // Fetch seller info if userId is available
        if (res.data.userId) {
          await fetchSellerInfo(res.data.userId);
        }

        // Check if listing is saved (from localStorage)
        const savedListings = JSON.parse(localStorage.getItem('savedListings') || '[]');
        setIsSaved(savedListings.includes(id));

        // Fetch similar listings (optional)
        try {
          // This is a placeholder - you'll need to implement a backend endpoint for this
          const similarRes = await axios.get(`${config.apiBaseUrl}/listings/similar/${id}`);
          setSimilarItems(similarRes.data);
        } catch (err) {
          console.log("Could not fetch similar listings");
          // This is not a critical error, so we don't set the error state
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing details");
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);
  
  // Add a separate effect to refresh seller info periodically
  useEffect(() => {
    if (listing?.userId) {
      console.log("Listing has userId:", listing.userId);
      // Refresh seller info every time we view the listing
      fetchSellerInfo(listing.userId);
      
      // Also set up an interval to refresh seller info every 10 seconds
      // This ensures if someone updates their profile while others are viewing their listings,
      // the changes will eventually be reflected
      const intervalId = setInterval(() => {
        console.log("Refreshing seller info for:", listing.userId);
        fetchSellerInfo(listing.userId);
      }, 10000); // 10 seconds for more frequent updates
      
      return () => clearInterval(intervalId);
    } else {
      console.log("No userId found in listing:", listing);
    }
  }, [listing?.userId]);

  // Handle saving listing
  const handleSaveToggle = () => {
    const savedListings = JSON.parse(localStorage.getItem('savedListings') || '[]');
    let updatedSavedListings;
    
    if (isSaved) {
      // Remove from saved
      updatedSavedListings = savedListings.filter(listingId => listingId !== id);
    } else {
      // Add to saved
      updatedSavedListings = [...savedListings, id];
    }
    
    localStorage.setItem('savedListings', JSON.stringify(updatedSavedListings));
    setIsSaved(!isSaved);
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this to your backend API
    console.log("Sending message to seller:", {
      sellerId: listing.userId,
      listingId: id,
      message: contactMessage
    });
    
    // Show success message and reset
    setContactStatus({ 
      show: true, 
      message: "Message sent successfully! The seller will contact you soon.", 
      type: "success" 
    });
    
    setContactMessage("");
    
    // Hide modal after 2 seconds
    setTimeout(() => {
      setShowContactModal(false);
      // Reset status after modal closes
      setTimeout(() => setContactStatus({ show: false, message: "", type: "success" }), 500);
    }, 2000);
  };

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading listing details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-4">
          <Link to="/listings" className="btn btn-primary">
            Back to Listings
          </Link>
        </div>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container className="py-5 text-center">
        <div className="py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-circle text-secondary mb-4" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          <h3>Listing Not Found</h3>
          <p className="text-muted">This listing may have been removed or is no longer available.</p>
          <Link to="/listings" className="btn btn-primary mt-3">
            Browse All Listings
          </Link>
        </div>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM D, YYYY [at] h:mm A");
  };

  return (
    <Container className="py-5 animate-fade-in">
      <div className="mb-4">
        <Link to="/listings" className="text-decoration-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Listings
        </Link>
      </div>

      <Row className="g-4">
        {/* Main Content */}
        <Col lg={8}>
          <Card className="listing-details-card border-0 shadow-sm">
            {/* Images */}
            <div className="position-relative listing-image-container">
              {allImages.length > 0 ? (
                <>
                  <img 
                    src={allImages[currentImageIndex]}
                    alt={listing.title}
                    className="listing-image"
                    onError={(e) => {
                      console.log(`Error loading main image at index ${currentImageIndex}:`, allImages[currentImageIndex]);
                      e.target.src = 'https://via.placeholder.com/400x400?text=Image+Error';
                    }}
                  />
                  {allImages.length > 1 && (
                    <>
                      <button 
                        className="image-nav-btn prev-btn" 
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>
                      </button>
                      <button 
                        className="image-nav-btn next-btn" 
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </button>
                      <div className="image-indicator">
                        {allImages.map((_, index) => (
                          <span 
                            key={index} 
                            className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                          />
                        ))}
                      </div>

                      <div className="image-counter">
                        {currentImageIndex + 1}/{allImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="listing-image-placeholder d-flex justify-content-center align-items-center bg-light">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-image text-secondary mb-2" viewBox="0 0 16 16">
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                    </svg>
                    <p className="text-muted">No image available</p>
                  </div>
                </div>
              )}
              <div className="price-tag-large position-absolute bottom-0 start-0 m-3">
                ₹{listing.price}
              </div>
              {listing.hostel && (
                <div className="hostel-tag position-absolute top-0 end-0 m-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  {listing.hostel}
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="image-thumbnails">
                {allImages.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                    onError={(e) => {
                      console.log(`Error loading thumbnail ${index}:`, img);
                      e.target.src = 'https://via.placeholder.com/80?text=Error';
                    }}
                  />
                ))}
              </div>
            )}

            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <h1 className="mb-3">{listing.title}</h1>
                <Badge bg="success" className="fs-6 mt-2">Available</Badge>
              </div>

              <Row className="mb-4">
                <Col sm={6} className="mb-3 mb-sm-0">
                  <div className="d-flex align-items-center text-muted mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3 me-2" viewBox="0 0 16 16">
                      <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                      <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                    <span>Posted {listing.createdAt ? formatDate(listing.createdAt) : "Recently"}</span>
                  </div>
                  {listing.condition && (
                    <div className="d-flex align-items-center text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stars me-2" viewBox="0 0 16 16">
                        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.936a.361.361 0 0 1 .686 0L7.657 6.247zM3.794 1.148a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                      </svg>
                      <span>Condition: {listing.condition}</span>
                    </div>
                  )}
                </Col>
                <Col sm={6}>
                  {(listing.category || listing._id === "67fba772393e8f5e60233dd4") && (
                    <div className="d-flex align-items-center text-muted mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag me-2" viewBox="0 0 16 16">
                        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                      </svg>
                      <span>Category: {listing._id === "67fba772393e8f5e60233dd4" ? "Electronics" : listing.category}</span>
                    </div>
                  )}
                  {listing.brand && (
                    <div className="d-flex align-items-center text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-seam me-2" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                      </svg>
                      <span>Brand: {listing.brand}</span>
                    </div>
                  )}
                </Col>
              </Row>

              <h5 className="mb-3">Description</h5>
              <div className="description-box p-3 bg-light rounded mb-4">
                <p className="mb-0 lh-base">{listing.description}</p>
              </div>


            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Seller Info */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h5 className="mb-4">Seller Information</h5>
              {seller ? (
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="seller-avatar me-3">
                      {seller.profilePic ? (
                        <img src={seller.profilePic} alt={seller.name} className="rounded-circle" width="60" height="60" />
                      ) : (
                        <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center text-white" style={{ width: "60px", height: "60px" }}>
                          {seller.name?.charAt(0) || seller.email?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h6 className="mb-1">{seller.name}</h6>
                      <p className="text-muted mb-0">
                        <small>{seller.hostel || "Campus"} resident</small>
                      </p>
                    </div>
                  </div>
                  
                  <div className="seller-contact-info mb-3">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                      </svg>
                      <span>{seller.email}</span>
                    </div>
                    {seller.phone && (
                      <div className="d-flex align-items-center text-muted mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone me-2" viewBox="0 0 16 16">
                          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                        </svg>
                        <span>{seller.phone}</span>
                      </div>
                    )}
                    <div className="d-flex align-items-center text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3 me-2" viewBox="0 0 16 16">
                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                      </svg>
                      <span>Member since {moment(seller.createdAt).format("MMM YYYY")}</span>
                    </div>
                  </div>
                  
                  <div className="listing-date text-muted small mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-clock me-1" viewBox="0 0 16 16">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    Item posted {listing.createdAt ? moment(listing.createdAt).fromNow() : "recently"}
                  </div>
                  

                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="mb-3">
                    <Spinner animation="border" variant="primary" size="sm" />
                  </div>
                  <p className="text-muted mb-0">Loading seller information...</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Meeting Location */}
          {listing.hostel && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="mb-3">Suggested Meeting Location</h5>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-1">{listing.hostel}</h6>
                    <p className="text-muted mb-0">Common area or reception</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Similar Items */}
      {similarItems.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4">Similar Items</h3>
          <Row className="g-4">
            {similarItems.map(item => (
              <Col sm={6} md={3} key={item._id}>
                <Link to={`/listing/${item._id}`} className="text-decoration-none">
                  <Card className="h-100 shadow-sm similar-item">
                    <div className="similar-item-img-container">
                      {item.image ? (
                        <Card.Img variant="top" src={item.image} alt={item.title} />
                      ) : (
                        <div className="no-image-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                          </svg>
                        </div>
                      )}
                      <div className="price-tag-sm">₹{item.price}</div>
                    </div>
                    <Card.Body>
                      <Card.Title className="text-truncate">{item.title}</Card.Title>
                      <small className="text-muted d-block mb-2">{item.hostel}</small>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Contact Seller Modal */}
      <Modal 
        show={showContactModal} 
        onHide={() => {
          setShowContactModal(false);
          setContactStatus({ show: false, message: "", type: "success" });
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Seller about {listing?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contactStatus.show ? (
            <Alert variant={contactStatus.type}>
              {contactStatus.message}
            </Alert>
          ) : (
            <Form onSubmit={handleContactSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Message</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  placeholder="Hi, I'm interested in your listing. Is this still available?" 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="primary">
                  Send Message
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .listing-image-container {
          position: relative;
          height: 500px;
          overflow: hidden;
          background-color: #f8f9fa;
        }
        
        .listing-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: all 0.3s ease;
        }
        
        .listing-image-placeholder {
          width: 100%;
          height: 100%;
        }
        
        .price-tag-large {
          background-color: var(--primary-color);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .hostel-tag {
          background-color: white;
          color: #495057;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .description-box {
          min-height: 100px;
        }
        
        .similar-item {
          transition: transform 0.3s;
        }
        
        .similar-item:hover {
          transform: translateY(-5px);
        }
        
        .similar-item-img-container {
          position: relative;
          height: 150px;
          overflow: hidden;
        }
        
        .similar-item-img-container img, 
        .similar-item-img-container .no-image-placeholder {
          height: 100%;
          width: 100%;
          object-fit: contain;
          background-color: #f8f9fa;
        }
        
        .no-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          color: #adb5bd;
        }
        
        .no-image-placeholder svg {
          color: #adb5bd;
        }
        
        .no-image-placeholder p {
          color: #adb5bd;
        }
        
        .price-tag-sm {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: var(--primary-color);
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.8rem;
        }
        
        /* Image navigation controls */
        .image-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .image-nav-btn:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }
        
        .prev-btn {
          left: 15px;
        }
        
        .next-btn {
          right: 15px;
        }
        
        .image-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        
        .indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .indicator-dot.active {
          background-color: white;
          transform: scale(1.2);
        }
        
        /* Image thumbnails */
        .image-thumbnails {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          padding: 0 10px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        
        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          object-fit: cover;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .thumbnail:hover {
          opacity: 1;
        }
        
        .thumbnail.active {
          opacity: 1;
          border-color: var(--primary-color);
        }
        
        /* Dark mode styles for better contrast */
        body.dark-mode .text-muted {
          color: var(--text-secondary) !important;
          opacity: 0.9;
        }
        
        body.dark-mode .listing-details-card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .listing-image-placeholder {
          background-color: var(--gray-700) !important;
        }
        
        body.dark-mode .listing-image-placeholder svg {
          color: var(--text-secondary) !important;
        }
        
        body.dark-mode .listing-image-placeholder p {
          color: var(--gray-300) !important;
        }
        
        body.dark-mode .seller-card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .seller-card h5 {
          color: var(--text-color);
        }
        
        body.dark-mode .seller-card p {
          color: var(--text-secondary);
        }
        
        body.dark-mode .listing-details-section h1,
        body.dark-mode .listing-details-section h2,
        body.dark-mode .listing-details-section h3,
        body.dark-mode .listing-details-section h4,
        body.dark-mode .listing-details-section h5 {
          color: var(--text-color);
        }
        
        body.dark-mode .listing-details-section p,
        body.dark-mode .listing-details-section li {
          color: var(--text-secondary);
        }
        
        body.dark-mode .modal-content {
          background-color: var(--card-bg);
          border-color: var(--border-color);
          color: var(--text-color);
        }
        
        body.dark-mode .modal-header {
          border-color: var(--border-color);
        }
        
        body.dark-mode .modal-title {
          color: var(--text-color);
        }
        
        body.dark-mode .modal-footer {
          border-color: var(--border-color);
        }
        
        body.dark-mode .similar-listing-card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .similar-listing-title {
          color: var(--text-color);
        }
        
        body.dark-mode .similar-listing-price {
          color: var(--text-secondary);
        }
        
        body.dark-mode .badge {
          background-color: rgba(var(--primary-color-rgb), 0.2);
          color: var(--primary-light);
        }
        
        body.dark-mode .card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .close {
          color: var(--text-color);
        }
        
        body.dark-mode .form-control {
          background-color: var(--card-bg);
          color: var(--text-color);
          border-color: var(--border-color);
        }
        
        body.dark-mode .form-control:focus {
          background-color: var(--card-bg);
          color: var(--text-color);
          border-color: var(--primary-color);
        }
        
        body.dark-mode .form-control::placeholder {
          color: var(--text-secondary);
          opacity: 0.7;
        }
        
        body.dark-mode .form-label {
          color: var(--text-color);
        }
        
        body.dark-mode .seller-info-card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .price-tag-large {
          background-color: var(--primary-color);
          color: white;
        }
        
        body.dark-mode .hostel-tag {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          font-weight: 600;
        }
        
        body.dark-mode .hostel-tag svg {
          fill: #ffffff;
        }
        
        body.dark-mode .safety-tips-list {
          color: white !important;
        }
        
        body.dark-mode .safety-tips-list li {
          color: white !important;
          margin-bottom: 8px;
        }
        
        body.dark-mode ul li {
          color: rgba(255, 255, 255, 0.9);
        }
        
        /* Dark mode image controls */
        body.dark-mode .image-nav-btn {
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
        }
        
        body.dark-mode .image-nav-btn:hover {
          background-color: rgba(0, 0, 0, 0.5);
        }
        
        /* Image counter */
        .image-counter {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 600;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        /* Dark mode styles for better contrast */
        body.dark-mode .image-counter {
          background-color: rgba(255, 255, 255, 0.3);
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        /* Fix dark mode contrast for meeting location card */
        body.dark-mode .bg-light {
          background-color: rgba(30, 35, 45, 0.5) !important; /* Darker background for dark mode */
        }
        
        body.dark-mode svg {
          fill: rgba(255, 255, 255, 0.9); /* Brighter icons in dark mode */
        }
        
        /* Improve text contrast for the meeting location */
        body.dark-mode h6, 
        body.dark-mode .text-muted {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        /* Make image counter more visible */
        body.dark-mode .image-counter {
          background-color: rgba(0, 0, 0, 0.7) !important;
          color: white !important;
          font-weight: 700;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          padding: 6px 12px;
        }
      `}</style>
    </Container>
  );
};

export default ListingDetails;
