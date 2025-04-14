import React from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetails = () => {
  const { id } = useParams();

  // Dummy product (later you'll fetch using this `id`)
  const product = {
    name: "Study Table",
    price: "₹1000",
    description: "A sturdy wooden table, slightly used.",
    image: "https://via.placeholder.com/400",
    contact: "user@example.com",
    hostel: "Hostel 5",
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} className="img-fluid rounded" alt={product.name} />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-success fw-bold">{product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Hostel:</strong> {product.hostel}</p>
          <p><strong>Contact:</strong> {product.contact}</p>
          <button className="btn btn-primary mt-3">Message Seller</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
