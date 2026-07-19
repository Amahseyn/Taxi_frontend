import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book Airport Transfer | Colchester Airport Taxi",
  description: "Securely book your Colchester airport transfer online. Choose your vehicle type and receive an instant fixed-price estimate.",
};

export default function BookingPage() {
  return (
    <div style={{ padding: "80px 0", background: "radial-gradient(circle at 50% 10%, rgba(229, 184, 44, 0.05) 0%, transparent 50%)" }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        <h1 
          style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "40px", 
            fontWeight: "800", 
            textAlign: "center", 
            marginBottom: "12px",
            letterSpacing: "-1px" 
          }}
        >
          Secure Booking Portal
        </h1>
        <p 
          style={{ 
            color: "var(--text-secondary)", 
            textAlign: "center", 
            marginBottom: "40px", 
            fontSize: "16px",
            lineHeight: "1.5" 
          }}
        >
          Complete the form below to request your fixed-rate transfer. A dispatcher will contact you within 15 minutes to confirm.
        </p>
        
        <BookingForm />
        
        {/* Support note */}
        <div 
          style={{ 
            marginTop: "30px", 
            textAlign: "center", 
            fontSize: "14px", 
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <span>Need immediate assistance or looking to book for a large corporate event?</span>
          <span>
            Call us directly 24/7 on{" "}
            <a href="tel:01206701051" style={{ color: "var(--accent-gold)", fontWeight: "600" }}>
              01206 701 051
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
