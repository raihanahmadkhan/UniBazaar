// src/pages/PostItem.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Alert } from "react-bootstrap";

const PostItem = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    hostel: "",
    category: "Miscellaneous",
  });

  const [files, setFiles] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
      
      // If no user is logged in, redirect to login page after a brief delay
      if (!currentUser) {
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "You must be logged in to post an item",
              redirectTo: "/post" 
            } 
          });
        }, 2000);
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, index) => {
    const selected = e.target.files[0];
    if (selected) {
      // Create a copy of the current files array
      const newFiles = [...files];
      newFiles[index] = selected;
      setFiles(newFiles);
      
      // Create a copy of the current previews array
      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(selected);
      setImagePreviews(newPreviews);
    }
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...imagePreviews];
    
    newFiles[index] = null;
    
    // If there's a preview URL, revoke it to free up memory
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newPreviews[index] = null;
    
    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make sure at least one image is uploaded
      if (!files[0]) {
        alert("Please upload at least one image (primary image)");
        setLoading(false);
        return;
      }

      // Array to store all image URLs
      const imageUrls = [];

      // Step 1: Upload images to Cloudinary
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          try {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "unibazaar_unsigned"); // Your Cloudinary preset

            console.log(`Uploading image ${i+1} to Cloudinary...`);
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dxtbsdvhj/image/upload",
              data
            );

            console.log(`📷 Cloudinary Upload Response for image ${i+1}:`, uploadRes.data);
            imageUrls.push(uploadRes.data.secure_url);
            console.log(`Successfully added image ${i+1} URL:`, uploadRes.data.secure_url);
          } catch (uploadErr) {
            console.error(`❌ Error uploading image ${i+1}:`, uploadErr);
            // Continue with other uploads even if one fails
          }
        }
      }

      console.log(`Total images uploaded: ${imageUrls.length}`);
      console.log(`Image URLs: ${JSON.stringify(imageUrls)}`);

      // Only proceed if at least the main image was uploaded
      if (imageUrls.length === 0) {
        alert("❌ Failed to upload any images. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Get Firebase token dynamically
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      // ✅ Log what we're sending to the backend
      console.log("📤 Sending to backend:", {
        ...formData,
        image: imageUrls[0], // primary image (first one)
        additionalImages: imageUrls.slice(1).filter(url => url), // additional images (if any)
        userId: user.uid // Add the user's Firebase UID
      });

      // Step 2: Send listing data to backend
      const res = await axios.post(
        "http://localhost:5000/api/listings",
        {
          ...formData,
          image: imageUrls[0], // primary image
          additionalImages: imageUrls.slice(1).filter(url => url), // additional images (if any)
          userId: user.uid // Add the user's Firebase UID
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      alert("🎉 Listing created successfully!");
      console.log(res.data);
      setFormData({ title: "", description: "", price: "", hostel: "", category: "Miscellaneous" });
      setFiles([null, null, null]);
      setImagePreviews([null, null, null]);
    } catch (err) {
      console.error("❌ Error creating listing:", err.response?.data || err.message);
      alert("❌ Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator while checking auth status
  if (isAuthChecking) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Checking authentication...</p>
        </div>
      </Container>
    );
  }

  // If not authenticated, show message and redirect
  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="auth-required-alert">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>You must be logged in to post items for sale.</p>
          <p>Redirecting to login page...</p>
        </Alert>
        
        <style jsx>{`
          /* Enhanced visibility in dark mode */
          body.dark-mode .auth-required-alert {
            background-color: rgba(255, 193, 7, 0.2);
            color: white;
            border-color: #ffc107;
            border-width: 2px;
            font-weight: 600;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          }
          
          body.dark-mode .auth-required-alert .alert-heading {
            color: #ffc107;
          }
        `}</style>
      </Container>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Post an Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            className="form-control no-spinner"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Hostel (Optional)</label>
          <select
            className="form-select"
            name="hostel"
            value={formData.hostel}
            onChange={handleChange}
          >
            <option value="">Select Hostel</option>
            <option value="BH-1">BH-1</option>
            <option value="BH-2">BH-2</option>
            <option value="GH">GH</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Category</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Textbooks">Textbooks</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Sports">Sports</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Images (Primary + up to 2 additional)</label>
          <div className="images-container">
            <div className="images-grid">
              {/* Image thumbnails */}
              {imagePreviews.map((preview, index) => (
                preview && (
                  <div 
                    key={index} 
                    className={`image-item ${index === 0 ? 'primary-image' : ''}`}
                  >
                    <img src={preview} alt={`Preview ${index + 1}`} className="preview-img" />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger remove-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                    {index === 0 && <div className="primary-badge">Primary</div>}
                  </div>
                )
              ))}
              
              {/* Add image button */}
              {imagePreviews.filter(Boolean).length < 3 && (
                <label className="add-image-btn">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      // Find the first empty slot
                      const emptyIndex = imagePreviews.findIndex(preview => !preview);
                      if (emptyIndex !== -1) {
                        handleFileChange(e, emptyIndex);
                      }
                    }}
                    hidden
                  />
                  <div className="add-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                    </svg>
                  </div>
                </label>
              )}
            </div>
            
            <div className="image-upload-help">
              <div className="upload-instruction">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <span>{imagePreviews.some(Boolean) ? 
                  "Upload up to 3 images. First image is the primary one shown in listings." : 
                  "At least one image is required. Click + to add."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Uploading..." : "Submit Listing"}
        </button>
      </form>
      
      <style jsx>{`
        .images-container {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
          background-color: #f8f9fa;
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
        
        .images-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .image-item {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 2px solid transparent;
        }
        
        .primary-image {
          border-color: var(--primary-color);
        }
        
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(220, 53, 69, 0.9);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          font-size: 12px;
        }
        
        .primary-badge {
          position: absolute;
          bottom: 5px;
          left: 5px;
          background-color: var(--primary-color);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }
        
        .add-image-btn {
          width: 120px;
          height: 120px;
          border: 2px dashed #ced4da;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: rgba(0,0,0,0.03);
          transition: all 0.2s ease;
        }
        
        .add-image-btn:hover {
          background-color: rgba(0,0,0,0.05);
          border-color: #adb5bd;
        }
        
        .add-icon {
          color: #6c757d;
        }
        
        .image-upload-help {
          padding-top: 10px;
          border-top: 1px solid #dee2e6;
        }
        
        .upload-instruction {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6c757d;
          font-size: 0.875rem;
        }
        
        /* Dark mode support */
        body.dark-mode .images-container {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        
        body.dark-mode .add-image-btn {
          border-color: var(--border-color);
          background-color: rgba(255,255,255,0.05);
        }
        
        body.dark-mode .add-image-btn:hover {
          background-color: rgba(255,255,255,0.1);
          border-color: var(--text-secondary);
        }
        
        body.dark-mode .add-icon {
          color: var(--text-secondary);
        }
        
        body.dark-mode .image-upload-help {
          border-color: var(--border-color);
        }
        
        body.dark-mode .upload-instruction {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default PostItem;
