import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import ListingCard from "../components/ListingCard";
import { useLocation } from "react-router-dom";
import config from "../config";

const Listings = () => {
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortOption, setSortOption] = useState("newest");
  const [hostels] = useState(["BH-1", "BH-2", "GH"]);
  const [categories, setCategories] = useState([
    "Textbooks", "Electronics", "Furniture", "Clothing", "Sports", "Miscellaneous"
  ]);

  // Read URL params on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromURL = searchParams.get("search");
    const categoryFromURL = searchParams.get("category");
    
    if (searchFromURL) {
      setSearchTerm(searchFromURL);
    }
    
    // Handle category filtering from URL
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      setSelectedCategory(categoryFromURL);
    }
  }, [location.search, categories]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching listings from:', `${config.apiBaseUrl}/listings`);
        
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        
        if (token) {
          console.log('User is authenticated, token obtained');
        } else {
          console.log('No user logged in, proceeding without authentication');
        }

        const res = await axios.get(`${config.apiBaseUrl}/listings`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        console.log('Listings data received:', res.data);
        console.log('Number of listings:', res.data.length);
        
        setListings(res.data);
        setFilteredListings(res.data);
      } catch (error) {
        console.error("❌ Error fetching listings:", error.message);
        console.error("Error details:", error.response ? error.response.data : 'No response data');
        console.error("Error status:", error.response ? error.response.status : 'No status code');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...listings];

    // Search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.title?.toLowerCase().includes(lowerCaseSearchTerm) || 
          item.description?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Special case handling for known listings with missing categories
    const earbudsId = "67fba772393e8f5e60233dd4";
    
    // Category filter
    if (selectedCategory) {
      console.log("Filtering by category:", selectedCategory);
      console.log("All listings before filter:", result.map(item => ({id: item._id, title: item.title, category: item.category})));
      
      result = result.filter(item => {
        // Special handling for specific items we know should be in certain categories
        if (item._id === earbudsId && selectedCategory === "Electronics") {
          console.log(`Special case: Displaying item "${item.title}" in Electronics category`);
          return true;
        }
      
        // Normalize category values by trimming whitespace and converting to lowercase
        const normalizedItemCategory = (item.category || "").trim().toLowerCase();
        const normalizedSelectedCategory = selectedCategory.trim().toLowerCase();
        
        console.log(`Item "${item.title}" - Raw category: "${item.category}", Normalized: "${normalizedItemCategory}"`);
        
        // For Miscellaneous, check if category is empty or not in our predefined list
        if (normalizedSelectedCategory === "miscellaneous") {
          // Check if the item has no category at all
          if (!item.category) {
            console.log(`Item "${item.title}" - No category field, showing in Miscellaneous`);
            return true;
          }
          
          const isInPredefinedCategories = categories.some(cat => 
            cat.toLowerCase() === normalizedItemCategory
          );
          
          const isMiscellaneous = !isInPredefinedCategories && normalizedItemCategory !== "";
          console.log(`Item "${item.title}" - Is Miscellaneous: ${isMiscellaneous}`);
          return isMiscellaneous;
        }
        
        // For other categories, check for an exact match after normalization
        return normalizedItemCategory === normalizedSelectedCategory;
      });
      
      console.log("Filtered results:", result.length, "items");
    }

    // Hostel filter
    if (selectedHostel) {
      result = result.filter(item => item.hostel === selectedHostel);
    }

    // Price range filter
    if (priceRange.min) {
      result = result.filter(item => Number(item.price) >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(item => Number(item.price) <= Number(priceRange.max));
    }

    // Apply sorting
    switch (sortOption) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        break;
    }

    setFilteredListings(result);
  }, [listings, searchTerm, selectedHostel, priceRange, sortOption, selectedCategory, categories]);

  const handlePriceChange = (e, field) => {
    setPriceRange({
      ...priceRange,
      [field]: e.target.value
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedHostel("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortOption("newest");
  };

  return (
    <Container className="py-5 animate-fade-in">
      {/* Header */}
      <div className="mb-5 text-center">
        <h1 className="fw-bold mb-2">Marketplace Listings</h1>
        <p className="text-muted listings-subtitle">Find everything you need from fellow students</p>
      </div>

      {/* Filters Row */}
      <div className="listings-filters bg-white p-4 rounded shadow-sm mb-4">
        <Row className="g-3">
          {/* Search */}
          <Col lg={3}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-end-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Col>

          {/* Hostel Filter */}
          <Col md={2} lg={2}>
            <Form.Select 
              value={selectedHostel} 
              onChange={(e) => setSelectedHostel(e.target.value)}
              aria-label="Filter by hostel"
            >
              <option value="">All Hostels</option>
              {hostels.map((hostel, index) => (
                <option key={index} value={hostel}>{hostel}</option>
              ))}
            </Form.Select>
          </Col>
          
          {/* Category Filter */}
          <Col md={2} lg={2}>
            <Form.Select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>

          {/* Price Range */}
          <Col md={3} lg={2}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent">₹</InputGroup.Text>
              <Form.Control
                placeholder="Min"
                type="number"
                min="0"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, 'min')}
                className="no-spinner"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
              <InputGroup.Text className="bg-transparent">to</InputGroup.Text>
              <Form.Control
                placeholder="Max"
                type="number"
                min="0"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="no-spinner"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </InputGroup>
          </Col>

          {/* Sort By */}
          <Col md={2} lg={2}>
            <Form.Select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </Form.Select>
          </Col>

          {/* Clear Filters */}
          <Col md={1} lg={1} className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleClearFilters}
              className="w-100"
            >
              Clear
            </Button>
          </Col>
        </Row>
      </div>

      {/* Results Info */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 results-count">
          Showing <span className="fw-bold">{filteredListings.length}</span> {filteredListings.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted loading-text">Loading listings...</p>
        </div>
      ) : filteredListings.length > 0 ? (
        <Row className="g-4">
          {filteredListings.map((listing) => (
            <Col sm={6} md={4} lg={3} key={listing._id}>
              <ListingCard listing={listing} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 no-results-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-inbox text-secondary mb-3" viewBox="0 0 16 16">
            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
          </svg>
          <h4 className="no-results-title">No listings found</h4>
          <p className="no-results-message">Try adjusting your filters or search terms</p>
          <Button variant="primary" onClick={handleClearFilters}>Clear All Filters</Button>
        </div>
      )}

      <style jsx>{`
        /* Dark mode styles for better contrast */
        body.dark-mode .listings-subtitle {
          color: var(--text-secondary) !important;
        }

        body.dark-mode .listings-filters {
          background-color: var(--card-bg) !important;
          border-color: var(--border-color);
        }

        body.dark-mode .form-control,
        body.dark-mode .form-select {
          background-color: var(--background-color);
          color: var(--text-color);
          border-color: var(--border-color);
        }

        body.dark-mode .form-control::placeholder {
          color: var(--text-secondary);
        }

        body.dark-mode .input-group-text {
          background-color: var(--background-color);
          color: var(--text-secondary);
          border-color: var(--border-color);
        }

        body.dark-mode .results-count {
          color: var(--text-color);
        }

        body.dark-mode .loading-text {
          color: var(--text-secondary) !important;
        }

        body.dark-mode .no-results-container {
          background-color: var(--card-bg);
        }

        body.dark-mode .no-results-title {
          color: var(--text-color);
        }

        body.dark-mode .no-results-message {
          color: var(--text-secondary);
        }

        body.dark-mode .bi-inbox {
          color: var(--text-secondary) !important;
        }
        
        /* Ensure all product titles are visible in dark mode */
        body.dark-mode .card-title, 
        body.dark-mode h1, 
        body.dark-mode h2, 
        body.dark-mode h3, 
        body.dark-mode h4, 
        body.dark-mode h5, 
        body.dark-mode h6 {
          color: white !important;
          font-weight: 600;
        }

        /* Remove number input spinners */
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </Container>
  );
};

export default Listings;
