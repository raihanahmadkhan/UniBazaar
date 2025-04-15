# 🎓 UniBazaar

**UniBazaar** is a full-stack campus marketplace that allows university students to buy, sell, and exchange items within their local student community.

Built with simplicity and utility in mind, the platform features secure authentication, image-based listings, user profile management, and a smooth mobile-first design.

---

## ✨ Features

- 🔐 Firebase Authentication (only verified users can access)
- 🛍️ Product Listings with filtering options
- 🖼️ Cloud-based Image Uploads for each item
- 👤 User Profiles with **My Listings** section
- ➕ Add / 🗑️ Delete Listings in a click
- 📱 Responsive UI for all devices

---

## 🧱 Tech Stack

| Layer         | Tools Used                                  |
|---------------|---------------------------------------------|
| **Frontend**  | React.js (with Vite), Bootstrap             |
| **Backend**   | Node.js, Express.js                         |
| **Database**  | MongoDB (via Mongoose)                      |
| **Authentication** | Firebase Authentication              |
| **Image Hosting** | Cloudinary                             |
| **Hosting**   | Netlify (Frontend), Render (Backend)        |

---

## 📊 System Architecture

                +------------------+
                |   React (Vite)   |  <-- Frontend UI
                +--------+---------+
                         |
                         v
        +------------------------------+
        |  Firebase Authentication     |  <-- User login/auth
        +------------------------------+
                         |
                         v
                +------------------+
                |   Node.js +      |
                |   Express.js     |  <-- Backend API server
                +--------+---------+
                         |
                         v
               +-------------------+
               |   Mongoose ORM    |  <-- Data modeling layer
               +--------+----------+
                        |
                        v
                 +-------------+
                 |  MongoDB    |  <-- NoSQL database
                 +-------------+

      ⤴                                            ⤵
   Cloudinary (image hosting)         Netlify + Render (hosting)
