import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">About UniBazaar</h1>
              <p className="lead mb-4">A marketplace designed exclusively for university students</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="section-title">Our Mission</h2>
              <p>At UniBazaar, we believe that university students should have a safe, convenient, and affordable way to buy and sell items within their campus community.</p>
              <p>Our platform is designed to make the process of finding what you need or selling what you don't as simple as possible, allowing students to focus on what matters most - their education.</p>
              <p>We're committed to fostering a sustainable campus economy where items can find new homes instead of landfills, helping students save money and reduce waste.</p>
            </Col>
            <Col lg={6}>
              <div className="image-container rounded">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop" 
                  alt="Students collaborating" 
                  className="img-fluid rounded shadow"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Creator Section */}
      <section className="creator-section">
        <Container>
          <h2 className="section-title text-center mb-5">Meet the Creator</h2>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="creator-card border-0 shadow">
                <Card.Body className="p-4 text-center">
                  <div className="creator-avatar mb-4">
                    <div className="avatar-placeholder">R</div>
                  </div>
                  <h3 className="mb-3">Raihan</h3>
                  <p className="text-muted mb-3">Founder & Developer</p>
                  <p className="mb-4">
                  I created UniBazaar to help solve the everyday problems students face when trying to buy or sell things on campus. With my background in web development and an interest in building practical tools, I focused on making UniBazaar simple, secure, and tailored to the needs of university students.
                  </p>
                  <div className="social-links">
                    <a href="https://github.com/raihanahmadkhan/" target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="github-icon"></i>
                    </a>
                    <a href="https://linkedin.com/in/raihanahmadkhan" target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="linkedin-icon"></i>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title text-center mb-5">What Makes Us Different</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="feature-card">
                <div className="feature-icon campus-icon"></div>
                <h3>Campus-Focused</h3>
                <p>Designed specifically for university students, with features that cater to campus life and student needs.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-card">
                <div className="feature-icon secure-icon"></div>
                <h3>Secure Exchanges</h3>
                <p>Built with safety in mind, enabling secure on-campus exchanges between verified students.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-card">
                <div className="feature-icon sustainable-icon"></div>
                <h3>Sustainable</h3>
                <p>Promoting reuse and reducing waste by connecting items with new owners within the campus community.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="section-title mb-4">Get In Touch</h2>
              <p className="mb-5">Have questions, suggestions, or feedback? We'd love to hear from you!</p>
              
              <Row className="contact-methods">
                <Col md={4} className="mb-4 mb-md-0">
                  <div className="contact-method">
                    <div className="contact-icon email-icon"></div>
                    <h4>Email</h4>
                    <p><a href="mailto:contact@unibazaar.com">raihanhzb@gmail.com</a></p>
                  </div>
                </Col>
                <Col md={4} className="mb-4 mb-md-0">
                  <div className="contact-method">
                    <div className="contact-icon location-icon"></div>
                    <h4>Location</h4>
                    <p>Hazaribagh<br />JH, India</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="contact-method">
                    <div className="contact-icon social-icon"></div>
                    <h4>Social</h4>
                    <p>Follow us on <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></p>
                  </div>
                </Col>
              </Row>
              
              <div className="mt-5">
                <Button as={Link} to="/signup" className="btn-primary btn-lg me-3">
                  Join UniBazaar
                </Button>
                <Button as={Link} to="/listings" variant="outline-primary" size="lg">
                  Browse Listings
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        /* About Page Styles */
        .about-page section {
          padding: 70px 0;
        }
        
        .about-hero {
          background-color: var(--primary-color);
          color: white;
          padding: 90px 0;
        }
        
        .section-title {
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 1.5rem;
        }
        
        .about-hero .section-title {
          color: white;
        }
        
        .mission-section {
          background-color: white;
        }
        
        .image-container {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .creator-section {
          background-color: var(--background-color);
        }
        
        .creator-card {
          border-radius: var(--border-radius);
          overflow: hidden;
        }
        
        .creator-avatar {
          width: 120px;
          height: 120px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--background-color);
          color: var(--text-color);
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          background-color: var(--primary-color);
          color: white;
        }
        
        .github-icon,
        .linkedin-icon {
          width: 20px;
          height: 20px;
          background-color: currentColor;
        }
        
        .github-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E");
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E");
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
        
        .linkedin-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/%3E%3C/svg%3E");
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/%3E%3C/svg%3E");
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
        
        .features-section {
          background-color: white;
        }
        
        .feature-card {
          background-color: var(--background-color);
          border-radius: var(--border-radius);
          padding: 2rem;
          height: 100%;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1.5rem;
          background-color: var(--primary-color);
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          -webkit-mask-size: contain;
        }
        
        .campus-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 22h20'/%3E%3Cpath d='M18 11v11'/%3E%3Cpath d='M14 11v11'/%3E%3Cpath d='M10 11v11'/%3E%3Cpath d='M6 11v11'/%3E%3Cpath d='M12 2L2 9l10 7 10-7-10-7z'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 22h20'/%3E%3Cpath d='M18 11v11'/%3E%3Cpath d='M14 11v11'/%3E%3Cpath d='M10 11v11'/%3E%3Cpath d='M6 11v11'/%3E%3Cpath d='M12 2L2 9l10 7 10-7-10-7z'/%3E%3C/svg%3E");
        }
        
        .secure-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E");
        }
        
        .sustainable-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22c4.97 0 9-2.239 9-5s-4.03-5-9-5-9 2.239-9 5 4.03 5 9 5z'/%3E%3Cpath d='M9 7l3 3 3-3'/%3E%3Cpath d='M12 17v-7'/%3E%3Cpath d='M11 3.5a1.5 1.5 0 0 1 3 0'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22c4.97 0 9-2.239 9-5s-4.03-5-9-5-9 2.239-9 5 4.03 5 9 5z'/%3E%3Cpath d='M9 7l3 3 3-3'/%3E%3Cpath d='M12 17v-7'/%3E%3Cpath d='M11 3.5a1.5 1.5 0 0 1 3 0'/%3E%3C/svg%3E");
        }
        
        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .feature-card p {
          color: var(--text-secondary);
          margin-bottom: 0;
        }
        
        .contact-section {
          background-color: var(--background-color);
        }
        
        .contact-method {
          padding: 2rem;
          background-color: white;
          border-radius: var(--border-radius);
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .contact-method:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
        }
        
        .contact-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 1.25rem;
          background-color: var(--primary-color);
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          -webkit-mask-size: contain;
        }
        
        .email-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/%3E%3Cpolyline points='22,6 12,13 2,6'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/%3E%3Cpolyline points='22,6 12,13 2,6'/%3E%3C/svg%3E");
        }
        
        .location-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
        }
        
        .social-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8h1a4 4 0 0 1 0 8h-1'/%3E%3Cpath d='M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z'/%3E%3Cline x1='6' y1='1' x2='6' y2='4'/%3E%3Cline x1='10' y1='1' x2='10' y2='4'/%3E%3Cline x1='14' y1='1' x2='14' y2='4'/%3E%3C/svg%3E");
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8h1a4 4 0 0 1 0 8h-1'/%3E%3Cpath d='M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z'/%3E%3Cline x1='6' y1='1' x2='6' y2='4'/%3E%3Cline x1='10' y1='1' x2='10' y2='4'/%3E%3Cline x1='14' y1='1' x2='14' y2='4'/%3E%3C/svg%3E");
        }
        
        .contact-method h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        
        .contact-method p {
          color: var(--text-secondary);
          margin-bottom: 0;
        }
        
        .contact-method a {
          color: var(--primary-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .contact-method a:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 992px) {
          .about-page section {
            padding: 50px 0;
          }
          
          .about-hero {
            padding: 70px 0;
          }
        }
        
        @media (max-width: 768px) {
          .feature-card,
          .contact-method {
            margin-bottom: 1.5rem;
          }
        }
        
        /* Dark Mode Enhancements */
        body.dark-mode .mission-section,
        body.dark-mode .features-section {
          background-color: var(--card-bg);
        }
        
        body.dark-mode .mission-section p,
        body.dark-mode .features-section p,
        body.dark-mode .contact-section p {
          color: var(--text-secondary);
        }
        
        body.dark-mode .creator-card {
          background-color: var(--card-bg);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }
        
        body.dark-mode .creator-card h3 {
          color: var(--text-color);
        }
        
        body.dark-mode .creator-card p {
          color: var(--text-secondary);
        }
        
        body.dark-mode .text-muted {
          color: var(--text-secondary) !important;
        }
        
        body.dark-mode .feature-card {
          background-color: var(--background-color);
          border-color: var(--border-color);
        }
        
        body.dark-mode .feature-card h3 {
          color: var(--text-color);
        }
        
        body.dark-mode .feature-card p {
          color: var(--text-secondary);
        }
        
        body.dark-mode .contact-method {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
        }
        
        body.dark-mode .contact-method h4 {
          color: var(--text-color);
        }
        
        body.dark-mode .contact-method a {
          color: var(--primary-light);
        }
        
        body.dark-mode .contact-method a:hover {
          color: white;
        }
        
        body.dark-mode .contact-icon {
          background-color: var(--text-secondary);
        }
        
        body.dark-mode .feature-icon {
          background-color: var(--primary-light);
        }
        
        body.dark-mode .section-title {
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
};

export default About; 