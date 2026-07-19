import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "Colchester Airport Taxi",
  description: "24/7 Airport taxi service based in Colchester. Comfortable, reliable and cost-effective transfers to all UK airports and destinations. Book online or call 01206 701 701 today.",
  keywords: "Colchester Airport Taxi, Airport Taxi Colchester, Colchester Airport Transfer, Stansted Taxi Colchester, Heathrow Taxi Colchester, Gatwick Taxi Colchester, Essex Airport Taxi",
  alternates: {
    canonical: "https://colchester-airport-taxi.co.uk/",
  },
  other: {
    "google-site-verification": "LfLNNZ00MiXPgCiMQVaromMg_V-_WQbffrlQ3HMx068",
    "robots": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },
  openGraph: {
    locale: "en_GB",
    type: "website",
    title: "Colchester Airport Taxi",
    description: "24/7 Airport taxi service based in Colchester. Comfortable, reliable and cost-effective transfers to all UK airports and destinations. Book online or call 01206 701 701 today.",
    url: "https://colchester-airport-taxi.co.uk/",
    siteName: "Colchester Airport Taxi",
    images: [
      {
        url: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2025/10/logo512-1.png",
        width: 512,
        height: 512,
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-512.png",
    apple: "/favicon-512.png",
  },
};

export default function RootLayout({ children }) {
  // Exact Yoast schema graph from the user request
  const yoastSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://colchester-airport-taxi.co.uk/",
        "url": "https://colchester-airport-taxi.co.uk/",
        "name": "Colchester Airport Taxi",
        "isPartOf": {
          "@id": "https://colchester-airport-taxi.co.uk/#website"
        },
        "about": {
          "@id": "https://colchester-airport-taxi.co.uk/#organization"
        },
        "datePublished": "2025-10-28T04:36:45+00:00",
        "dateModified": "2026-07-18T19:12:45+00:00",
        "description": "24/7 Airport taxi service based in Colchester. Comfortable, reliable and cost-effective transfers to all UK airports and destinations. Book online or call 01206 701 701 today.",
        "breadcrumb": {
          "@id": "https://colchester-airport-taxi.co.uk/#breadcrumb"
        },
        "inLanguage": "en-GB",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "https://colchester-airport-taxi.co.uk/"
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://colchester-airport-taxi.co.uk/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://colchester-airport-taxi.co.uk/#website",
        "url": "https://colchester-airport-taxi.co.uk/",
        "name": "Colchester Airport Taxi",
        "description": "Your reliable airport transfer, comfortable, punctual, and stress-free.",
        "publisher": {
          "@id": "https://colchester-airport-taxi.co.uk/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://colchester-airport-taxi.co.uk/?s={search_term_string}"
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          }
        ],
        "inLanguage": "en-GB"
      },
      {
        "@type": "Organization",
        "@id": "https://colchester-airport-taxi.co.uk/#organization",
        "name": "Colchester Airport Taxi",
        "url": "https://colchester-airport-taxi.co.uk/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-GB",
          "@id": "https://colchester-airport-taxi.co.uk/#/schema/logo/image/",
          "url": "https://colchester-airport-taxi.co.uk/wp-content/uploads/2025/10/logo512-1.png",
          "contentUrl": "https://colchester-airport-taxi.co.uk/wp-content/uploads/2025/10/logo512-1.png",
          "width": 512,
          "height": 512,
          "caption": "Colchester Airport Taxi"
        },
        "image": {
          "@id": "https://colchester-airport-taxi.co.uk/#/schema/logo/image/"
        },
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61585145488267"
        ]
      }
    ]
  };

  return (
    <html lang="en-GB" className={`no-js ${plusJakartaSans.variable}`}>
      <head>
        <link rel="stylesheet" href="/font-awesome.min.css" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Google Consent Mode Setup */}
        <script
          id="google_gtagjs-js-consent-mode-data-layer"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                "ad_personalization": "denied",
                "ad_storage": "denied",
                "ad_user_data": "denied",
                "analytics_storage": "denied",
                "functionality_storage": "denied",
                "security_storage": "denied",
                "personalization_storage": "denied",
                "region": ["AT","BE","BG","CH","CY","CZ","DE","DK","EE","ES","FI","FR","GB","GR","HR","HU","IE","IS","IT","LI","LT","LU","LV","MT","NL","NO","PL","PT","RO","SE","SI","SK"],
                "wait_for_update": 500
              });
              window._googlesitekitConsentCategoryMap = {
                "statistics": ["analytics_storage"],
                "marketing": ["ad_storage","ad_user_data","ad_personalization"],
                "functional": ["functionality_storage","security_storage"],
                "preferences": ["personalization_storage"]
              };
              window._googlesitekitConsents = {
                "ad_personalization": "denied",
                "ad_storage": "denied",
                "ad_user_data": "denied",
                "analytics_storage": "denied",
                "functionality_storage": "denied",
                "security_storage": "denied",
                "personalization_storage": "denied",
                "region": ["AT","BE","BG","CH","CY","CZ","DE","DK","EE","ES","FI","FR","GB","GR","HR","HU","IE","IS","IT","LI","LT","LU","LV","MT","NL","NO","PL","PT","RO","SE","SI","SK"],
                "wait_for_update": 500
              };
            `
          }}
        />

        {/* Google Tag Manager (GTM) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WGXZRC78');
            `
          }}
        />

        {/* Yoast SEO Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(yoastSchema) }}
        />
      </head>
      <body>
        {/* GTM Noscript (fallback for disabled Javascript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGXZRC78"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}