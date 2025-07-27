interface StructuredDataProps {
  type: 'veterans' | 'recovery' | 'reentry';
}

export default function StructuredData({ type }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Forward Horizon",
      "url": "https://theforwardhorizon.com",
      "telephone": "+1-555-123-4567",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Your City",
        "addressRegion": "Your State",
        "postalCode": "Your ZIP",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "Customer Service",
        "availableLanguage": "English"
      }
    };

    const pageSpecificData = {
      veterans: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Veterans Housing Program",
        "description": "Secure, affordable housing for veterans with VA benefits assistance, job training, and supportive community.",
        "provider": {
          "@type": "Organization",
          "name": "Forward Horizon"
        },
        "serviceType": "Veterans Housing",
        "audience": {
          "@type": "Audience",
          "audienceType": "Military Veterans"
        },
        "offers": {
          "@type": "Offer",
          "description": "Free Veterans Benefits Guide + Housing Checklist",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      recovery: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Recovery Housing Program",
        "description": "Safe, substance-free recovery housing with 24/7 support, peer community, and proven results.",
        "provider": {
          "@type": "Organization",
          "name": "Forward Horizon"
        },
        "serviceType": "Recovery Housing",
        "audience": {
          "@type": "Audience",
          "audienceType": "Individuals in Recovery"
        },
        "offers": {
          "@type": "Offer",
          "description": "Free Recovery Housing Preparation Guide",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      reentry: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Reentry Support Program",
        "description": "Comprehensive reentry support with safe housing, employment assistance, and life skills training.",
        "provider": {
          "@type": "Organization",
          "name": "Forward Horizon"
        },
        "serviceType": "Reentry Support",
        "audience": {
          "@type": "Audience",
          "audienceType": "Returning Citizens"
        },
        "offers": {
          "@type": "Offer",
          "description": "Free Life After Release Planning Kit",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    };

    return [baseData, pageSpecificData[type]];
  };

  const structuredData = getStructuredData();

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
    </>
  );
}