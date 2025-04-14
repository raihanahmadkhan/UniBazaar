import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, InputGroup, Card, Button, Spinner } from "react-bootstrap";
import ListingCard from "../components/ListingCard";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: "Textbooks", icon: "📚", color: "#4361EE" },
    { id: 2, name: "Electronics", icon: "💻", color: "#3A0CA3" },
    { id: 3, name: "Furniture", icon: "🪑", color: "#F72585" },
    { id: 4, name: "Clothing", icon: "👕", color: "#4CC9F0" },
    { id: 5, name: "Sports", icon: "🏀", color: "#F77F00" },
    { id: 6, name: "Miscellaneous", icon: "📦", color: "#7209B7" }
  ];
  
  const featuredListings = [
    {
      id: 1, 
      title: "MacBook Pro 2021",
      price: 75000,
      description: "M1 Pro chip, 16GB RAM, 512GB SSD, good condition, includes charger.",
      location: "Central Library",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 2, 
      title: "Calculus Textbook",
      price: 450,
      description: "Thomas' Calculus, 14th Edition. Barely used, no highlights or markings.",
      location: "Science Block",
      image: "https://images.unsplash.com/photo-1576333539869-30f743a10fc1?q=80&w=1374&auto=format&fit=crop"
    },
    {
      id: 3, 
      title: "Desk Lamp",
      price: 350,
      description: "Adjustable LED desk lamp with 3 brightness levels and USB charging port.",
      location: "Hostel C",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1374&auto=format&fit=crop"
    },
    {
      id: 4, 
      title: "Scientific Calculator",
      price: 900,
      description: "Casio FX-991EX, perfect for engineering and science students.",
      location: "Engineering Block",
      image: "https://images.unsplash.com/photo-1564473185935-58c6a872636a?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log("Firebase auth token available");
      }
    });

    // Fetch listings from API
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        const response = await axios.get("http://localhost:5000/api/listings", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { limit: 4 } // Only get 4 latest listings for the featured section
        });
        
        setListings(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Find what you need,<br />sell what you don't</h1>
              <p className="lead mb-4">The campus marketplace for students to buy, sell, and trade items easily.</p>
              
              <Form onSubmit={handleSearch} className="search-form mb-4">
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <Button type="submit" className="search-button">
                    Search
                  </Button>
                </div>
              </Form>
              
              <div className="d-flex gap-3">
                <Link to="/listings" className="btn btn-outline-primary">
                  Browse All
                </Link>
                <Link to="/post" className="btn btn-primary">
                  Sell Item
                </Link>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1447&auto=format&fit=crop" 
                  alt="Students at campus" 
                  className="hero-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <Container>
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                to={`/listings?category=${encodeURIComponent(category.name)}`} 
                key={category.id}
                className="category-card"
                style={{ borderColor: category.color }}
              >
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  {category.icon}
                </div>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Listings Section */}
      <section className="listings-section">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Featured Listings</h2>
            <Link to="/listings" className="view-all-link">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading listings...</p>
            </div>
          ) : listings.length > 0 ? (
            <Row>
              {listings.slice(0, 4).map((listing) => (
                <Col md={6} lg={3} key={listing._id} className="mb-4">
                  <ListingCard listing={listing} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <p>No listings available right now.</p>
              <Link to="/post" className="btn btn-primary mt-3">
                Be the first to post an item
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <Container>
          <h2 className="section-title text-center">How It Works</h2>
          <Row className="gx-5">
            <Col md={4} className="mb-4 mb-md-0">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>List Your Item</h3>
                <p>Take a photo, add details and set your price. Creating a listing takes less than a minute.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Connect With Buyers</h3>
                <p>Interested buyers will contact you. Negotiate and answer questions easily.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Make the Exchange</h3>
                <p>Meet at a safe campus location. Complete the transaction in person.</p>
              </div>
            </Col>
          </Row>
          <div className="text-center mt-5">
            <Link to="/post" className="btn btn-primary btn-lg">
              Start Selling
        </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2>Join UniBazaar Today</h2>
            <p>Buy and sell items within your campus community. Easy, safe, and convenient.</p>
            <Link to="/signup" className="btn btn-light btn-lg">
              Create Account
        </Link>
      </div>
        </Container>
      </section>

      <style jsx>{`
        /* Hero Section */
        .hero-section {
          padding: 90px 0 70px;
          background-color: var(--background-color);
        }
        
        .search-form {
          max-width: 100%;
        }
        
        .search-input {
          height: 56px;
          border-radius: var(--border-radius);
          padding-right: 130px;
          font-size: 1.1rem;
        }
        
        .search-button {
          position: absolute;
          right: 5px;
          top: 5px;
          height: 46px;
          border-radius: var(--border-radius-sm);
          padding: 0 1.5rem;
          font-weight: 500;
        }
        
        .hero-image-container {
          position: relative;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          height: 400px;
          box-shadow: var(--shadow-md);
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Categories Section */
        .categories-section {
          padding: 60px 0;
          background-color: white;
        }
        
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 1.75rem;
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1.5rem;
        }
        
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 1rem;
          background-color: white;
          border-radius: var(--border-radius);
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
        }
        
        .category-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 1rem;
          font-size: 24px;
        }
        
        .category-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
          text-align: center;
          margin: 0;
        }
        
        /* Listings Section */
        .listings-section {
          padding: 60px 0;
          background-color: var(--background-color);
        }
        
        .view-all-link {
          color: var(--primary-color);
          font-weight: 600;
          transition: color 0.2s ease;
        }
        
        .view-all-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }
        
        .listing-card {
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .listing-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        
        .listing-image-container {
          position: relative;
          height: 180px;
        }
        
        .listing-image {
          height: 180px;
          object-fit: cover;
          width: 100%;
        }
        
        .no-image-placeholder {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--gray-200);
          color: var(--gray-600);
        }
        
        .listing-price {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--primary-color);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .listing-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-color);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .listing-location {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .location-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          background-color: var(--text-secondary);
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E");
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E");
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
        
        .listing-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          min-height: 60px;
        }
        
        /* How It Works Section */
        .how-it-works-section {
          padding: 70px 0;
          background-color: white;
        }
        
        .step-card {
          padding: 2rem;
          background-color: var(--background-color);
          border-radius: var(--border-radius);
          text-align: center;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
        }
        
        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.25rem;
          margin: 0 auto 1.25rem;
        }
        
        .step-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .step-card p {
          color: var(--text-secondary);
          margin-bottom: 0;
        }
        
        /* CTA Section */
        .cta-section {
          padding: 70px 0;
          background-color: var(--primary-color);
          margin-top: 2rem;
        }
        
        .cta-content {
          text-align: center;
          color: white;
        }
        
        .cta-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }
        
        .cta-content p {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 992px) {
          .hero-section {
            padding: 60px 0 50px;
          }
          
          .cta-content h2 {
            font-size: 1.75rem;
          }
          
          .cta-content p {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .step-card {
            margin-bottom: 1.5rem;
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .search-input {
            padding-right: 100px;
          }
          
          .search-button {
            padding: 0 1rem;
          }
        }
        
        /* Location icon in dark mode */
        body.dark-mode .location-icon {
          background-color: var(--text-secondary);
        }
        
        /* Make sure step cards are visible in dark mode */
        body.dark-mode .step-card {
          background-color: var(--card-bg);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }
        
        body.dark-mode .step-card h3 {
          color: var(--text-color);
        }
        
        body.dark-mode .step-card p {
          color: var(--text-secondary);
        }
        
        /* Ensure category text is visible */
        body.dark-mode .category-card h3 {
          color: var(--text-color);
        }
        
        /* Fix Hero section text in dark mode */
        body.dark-mode .hero-section h1,
        body.dark-mode .hero-section p {
          color: var(--text-color);
        }
        
        body.dark-mode .section-title {
          color: var(--text-color);
        }
        
        /* Categories section background in dark mode */
        body.dark-mode .categories-section {
          background-color: var(--card-bg);
        }
        
        body.dark-mode .how-it-works-section {
          background-color: var(--card-bg);
        }
        
        /* Make category cards stand out in dark mode */
        body.dark-mode .category-card {
          background-color: var(--background-color);
          border-color: var(--border-color);
        }
      `}</style>
    </div>
  );
};

export default Home;
