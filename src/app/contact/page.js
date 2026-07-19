"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in the required fields (Name, Email, Message)");
      return;
    }
    // Simulate submission
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 48px auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 className={styles.title}>Contact Our Team</h1>
          <p className={styles.subtitle}>
            Have questions about a journey, need a custom corporate quote, or want to modify an existing booking? We are here to help 24/7.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Info cards on the left */}
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <svg className={styles.infoIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Phone Line (24/7)</span>
                  <a href="tel:01206701051" className={styles.infoValue}>01206 701 051</a>
                  <a href="tel:01206701701" style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Backup: 01206 701 701</a>
                </div>
              </div>

              <div className={styles.infoCard}>
                <svg className={styles.infoIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email Bookings</span>
                  <a href="mailto:bookings@colchester-airport-taxi.co.uk" className={styles.infoValue}>bookings@colchester-airport-taxi.co.uk</a>
                </div>
              </div>

              <div className={styles.infoCard}>
                <svg className={styles.infoIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Service Base</span>
                  <span className={styles.infoValue}>Colchester, Essex, UK</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className={styles.mapWrapper}>
              <iframe
                title="Colchester Airport Taxi – Service Area Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158830.3352543127!2d0.7549799!3d51.8847456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d908e5b8c4f027%3A0x8be46e4bdb2b21c8!2sColchester%2C%20UK!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form Card on the right */}
          <div className={styles.card}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ margin: "0 auto", color: "var(--accent-gold)" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 className={styles.cardTitle}>Message Sent!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                  Thank you for your enquiry. Our team has received your message and we will respond to you via email or phone shortly.
                </p>
                <button 
                  className="btn-primary" 
                  style={{ alignSelf: "center", marginTop: "10px" }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "General Enquiry",
                      message: "",
                    });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.cardTitle}>Send Us A Message</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.group}>
                    <label className={styles.label}>Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className={styles.input} 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.group}>
                      <label className={styles.label}>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className={styles.input} 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className={styles.group}>
                      <label className={styles.label}>Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. 07123 456789" 
                        className={styles.input} 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>

                  <div className={styles.group}>
                    <label className={styles.label}>Enquiry Type</label>
                    <select className={styles.input} name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Booking Modification">Booking Modification</option>
                      <option value="Corporate Account">Corporate Account / Contract</option>
                      <option value="Lost & Found">Lost & Found</option>
                    </select>
                  </div>

                  <div className={styles.group}>
                    <label className={styles.label}>Your Message</label>
                    <textarea 
                      placeholder="Please write your questions or details here..." 
                      className={styles.textarea} 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
