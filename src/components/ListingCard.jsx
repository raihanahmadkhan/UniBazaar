import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "react-bootstrap";

const ListingCard = ({ listing }) => {
  // Format the date if available
  const formattedDate = listing.createdAt 
    ? new Date(listing.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <Link to={`/listing/${listing._id}`} className="text-decoration-none">
    <Card className="listing-card h-100 shadow-sm animate-fade-in">
      <div className="card-img-wrapper">
        {listing.image ? (
          <Card.Img
            variant="top"
            src={listing.image}
            alt={listing.title}
            className="card-img-top"
          />
        ) : (
          <div className="no-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
            </svg>
          </div>
        )}
        <span className="price-badge">₹{listing.price}</span>
        {listing.hostel && (
          <span className="hostel-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            {listing.hostel}
          </span>
        )}
      </div>
      
      <Card.Body>
        <Card.Title className="text-truncate listing-title">{listing.title}</Card.Title>
        <Card.Text className="listing-description">
          {listing.description.length > 60
            ? `${listing.description.substring(0, 60)}...`
            : listing.description}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          {formattedDate && (
            <small className="text-muted listing-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-calendar3 me-1" viewBox="0 0 16 16">
                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
              {formattedDate}
            </small>
          )}
          <span className="btn btn-sm btn-primary">
            View Details
          </span>
        </div>
      </Card.Body>
      
      <style jsx>{`
        .listing-card {
          transition: transform 0.3s, box-shadow 0.3s;
          border: none;
          overflow: hidden;
        }
        
        .listing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .card-img-wrapper {
          position: relative;
          height: 200px;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-img-top {
          max-height: 100%;
          max-width: 100%;
          height: auto;
          width: auto;
          object-fit: contain;
          transition: transform 0.5s;
        }
        
        .listing-card:hover .card-img-top {
          transform: scale(1.05);
        }
        
        .no-image-placeholder {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
          background-color: #f8f9fa;
        }
        
        .price-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: var(--primary-color);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .hostel-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: white;
          color: #6c757d;
          padding: 3px 8px;
          border-radius: 15px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 3px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .listing-description {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 0;
          height: 40px;
          overflow: hidden;
        }
        
        /* Dark mode styles for better contrast */
        body.dark-mode .listing-card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .card-img-wrapper {
          background-color: var(--background-color);
        }
        
        body.dark-mode .no-image-placeholder {
          background-color: var(--background-color);
          color: var(--text-secondary);
        }
        
        body.dark-mode .hostel-badge {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        body.dark-mode .card-title,
        body.dark-mode .listing-title {
          color: white !important;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        body.dark-mode .listing-description {
          color: rgba(255, 255, 255, 0.8) !important;
          font-weight: 400;
        }
        
        body.dark-mode .text-muted,
        body.dark-mode .listing-date {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* Price badge should stand out in dark mode */
        body.dark-mode .price-badge {
          background-color: var(--primary-color);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Card>
    </Link>
  );
};

export default ListingCard;
