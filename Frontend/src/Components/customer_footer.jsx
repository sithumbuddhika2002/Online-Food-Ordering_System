import React from 'react';
import './customer_footer.css';

function CustomerFooter() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section">
                    <h3 className="footer-title">About Us</h3>
                    <p>The Land of Kings Cafe & Restaurant has recently made a name for itself as the first-ever Game of Thrones themed cafe and restaurant in Sri Lanka.</p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/menu">Menu & Order Online</a></li>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/gallery">Gallery</a></li>
                        <li><a href="/contact-us">Contact Us</a></li>
                    </ul>
                </div>

                {/* Contact & Social Media */}
                <div className="footer-section">
                    <h3 className="footer-title">Contact Us</h3>
                    <p>Email: landofkings@gmail.com</p>
                    <p>Phone: +94-51-2242863</p>

                    {/* Social Media Links */}
                    <div className="footer-social">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Land of Kings. All Rights Reserved.
            </div>
        </footer>
    );
}

export default CustomerFooter;
