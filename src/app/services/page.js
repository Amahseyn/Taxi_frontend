import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Our Services | Colchester Airport Taxi",
  description: "Explore our range of professional private hire transfer services in Colchester. From meet and greet airport taxi transfers to corporate accounts and group travel.",
};

export default function ServicesPage() {
  const serviceList = [
    {
      id: "airport-transfers",
      title: "Airport Transfers",
      description: "We specialize in transfers to and from all major London and regional airports. Our drivers know the best routes and traffic patterns to ensure you arrive with time to spare.",
      bullets: [
        "Heathrow Airport (Terminals 2, 3, 4, 5)",
        "Stansted Airport (Primary Local Hub)",
        "Gatwick Airport (North & South Terminals)",
        "Luton Airport & Southend Airport",
        "London City Airport",
      ],
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
    },
    {
      id: "meet-greet",
      title: "Meet & Greet Service",
      description: "Take the stress out of navigating busy arrivals halls. Our signature Meet & Greet service guarantees your driver is waiting at the barrier ready to welcome you.",
      bullets: [
        "Driver waits inside the arrivals terminal",
        "Clear digital tablet with your name displayed",
        "Full assistance carrying and loading luggage",
        "Coordination via SMS/WhatsApp upon landing",
      ],
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      id: "flight-tracking",
      title: "Real-Time Flight Tracking",
      description: "Flight times change, but your ride won't. We track your flight number directly with live air traffic control APIs to ensure our driver is dispatched exactly when you land.",
      bullets: [
        "Zero delay surcharges for passengers",
        "Automatic adjustment for early landings",
        "No need to notify us of minor flight updates",
        "Full dispatch coordination by our logistics team",
      ],
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      id: "long-distance",
      title: "Long Distance & Seaports",
      description: "We are not just limited to airport taxi rides. Book comfortable, premium vehicles for long-distance city-to-city travel or direct transfers to cruise and ferry terminals.",
      bullets: [
        "Harwich International Port (Local Hub)",
        "Southampton & Dover Cruise Terminals",
        "Fixed-rate city-to-city transfers",
        "Discreet, luxurious vehicles for long rides",
      ],
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 2 22 22 22"></polygon>
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Colchester Taxi Services</h1>
          <p className={styles.subtitle}>
            Premium private hire services tailored for business, domestic, and airport holiday transfers. Discover what makes us Colchester&apos;s leading transport choice.
          </p>
        </div>

        {/* Services List */}
        <div>
          {serviceList.map((service, index) => (
            <section key={service.id} id={service.id} className={styles.serviceSection}>
              {index % 2 === 0 ? (
                <>
                  <div className={styles.content}>
                    <h2 className={styles.serviceTitle}>{service.title}</h2>
                    <p className={styles.serviceDesc}>{service.description}</p>
                    <ul className={styles.bullets}>
                      {service.bullets.map((b, bi) => (
                        <li key={`bullet-${bi}`} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}>✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "10px" }}>
                      <Link href="/booking" className="btn-primary">
                        Book This Service
                      </Link>
                    </div>
                  </div>
                  <div className={styles.visual}>
                    {service.icon}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.visual}>
                    {service.icon}
                  </div>
                  <div className={styles.content}>
                    <h2 className={styles.serviceTitle}>{service.title}</h2>
                    <p className={styles.serviceDesc}>{service.description}</p>
                    <ul className={styles.bullets}>
                      {service.bullets.map((b, bi) => (
                        <li key={`bullet-${bi}`} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}>✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "10px" }}>
                      <Link href="/booking" className="btn-primary">
                        Book This Service
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
