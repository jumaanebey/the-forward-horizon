// Branding Configuration for Forward Horizon Platform
// This file centralizes all branding elements for easy customization

export interface BrandingConfig {
  // Company Information
  companyName: string;
  tagline: string;
  description: string;
  
  // Contact Information
  phone: string;
  email: string;
  address: string;
  serviceAreas: string[];
  
  // Social Media
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Colors (CSS variables)
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
  
  // Features Configuration
  features: {
    veteranHousing: boolean;
    soberLiving: boolean;
    reentryHousing: boolean;
    jobTraining: boolean;
    mentalHealthSupport: boolean;
    aiInsights: boolean;
    advancedAnalytics: boolean;
    automatedWorkflows: boolean;
  };
  
  // Program-specific settings
  programs: {
    veteranHousing: {
      name: string;
      description: string;
      requirements: string[];
      services: string[];
    };
    soberLiving: {
      name: string;
      description: string;
      requirements: string[];
      services: string[];
    };
    reentryHousing: {
      name: string;
      description: string;
      requirements: string[];
      services: string[];
    };
  };
  
  // Business Information
  business: {
    foundedYear: number;
    licenseNumber?: string;
    taxId?: string;
    nonprofit: boolean;
  };
}

// Default configuration
export const defaultBranding: BrandingConfig = {
  companyName: "Forward Horizon",
  tagline: "Rebuilding Lives Together — Through Accountability, Community, and a Fresh Start",
  description: "Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens",
  
  phone: "(626) 603-0954",
  email: "admin@theforwardhorizon.com",
  address: "Los Angeles County, CA",
  serviceAreas: [
    "Los Angeles County",
    "Orange County", 
    "Riverside County",
    "San Bernardino County"
  ],
  
  socialMedia: {
    facebook: "https://facebook.com/forwardhorizon",
    twitter: "https://twitter.com/forwardhorizon",
    instagram: "https://instagram.com/forwardhorizon"
  },
  
  colors: {
    primary: "#2563eb",    // Blue
    secondary: "#1e40af",  // Dark Blue
    accent: "#059669",     // Green
    success: "#10b981",    // Green
    warning: "#f59e0b",    // Yellow
    danger: "#ef4444"      // Red
  },
  
  features: {
    veteranHousing: true,
    soberLiving: true,
    reentryHousing: true,
    jobTraining: true,
    mentalHealthSupport: true,
    aiInsights: true,
    advancedAnalytics: true,
    automatedWorkflows: true
  },
  
  programs: {
    veteranHousing: {
      name: "Veteran Transitional Housing",
      description: "Specialized support for veterans transitioning to civilian life. We understand the unique challenges of military service and provide tailored resources for successful reintegration.",
      requirements: [
        "Verified military service",
        "Honorable discharge preferred",
        "VA enrollment assistance",
        "Mental health screening",
        "Commitment to peer support"
      ],
      services: [
        "VA benefits assistance",
        "PTSD and mental health support", 
        "Career transition services",
        "Peer veteran mentorship"
      ]
    },
    soberLiving: {
      name: "Sober Living After Detox",
      description: "Continued support for individuals completing detox programs. Our structured environment provides the stability needed for long-term recovery success.",
      requirements: [
        "Minimum 30 days sobriety",
        "Completed detox program",
        "Recovery program participation",
        "Employment or job search",
        "Clean drug/alcohol screening"
      ],
      services: [
        "24/7 sober living environment",
        "Recovery program coordination",
        "Relapse prevention support",
        "Life skills development"
      ]
    },
    reentryHousing: {
      name: "Re-entry Housing",
      description: "Comprehensive reintegration support for individuals returning from incarceration. We provide the tools and community needed for successful re-entry.",
      requirements: [
        "18 years of age or older",
        "Commitment to program rules",
        "Willingness to participate in services",
        "No violent criminal history",
        "Pass background screening"
      ],
      services: [
        "Employment placement assistance",
        "Legal aid connections",
        "Family reunification support",
        "Community reintegration programs"
      ]
    }
  },
  
  business: {
    foundedYear: 2020,
    nonprofit: false
  }
};

// Custom branding configurations for different use cases
export const brandingPresets = {
  // Property Management Focus
  propertyManagement: {
    ...defaultBranding,
    companyName: "TBD Property Management", 
    tagline: "Professional Property Management Solutions",
    description: "Comprehensive property management services for residential and commercial properties",
    features: {
      ...defaultBranding.features,
      veteranHousing: false,
      soberLiving: false,
      reentryHousing: false,
      aiInsights: true,
      advancedAnalytics: true,
      automatedWorkflows: true
    }
  },
  
  // Veteran-Focused Organization
  veteranFocus: {
    ...defaultBranding,
    companyName: "Veteran Support Services",
    tagline: "Serving Those Who Served",
    description: "Dedicated support services for military veterans and their families",
    features: {
      ...defaultBranding.features,
      veteranHousing: true,
      soberLiving: false,
      reentryHousing: false
    }
  },
  
  // Recovery-Focused Organization  
  recoveryFocus: {
    ...defaultBranding,
    companyName: "Recovery Horizons",
    tagline: "Your Journey to Recovery Starts Here",
    description: "Comprehensive addiction recovery and sober living services",
    features: {
      ...defaultBranding.features,
      veteranHousing: false,
      soberLiving: true,
      reentryHousing: false
    }
  }
};

// Function to get current branding configuration
export function getBrandingConfig(): BrandingConfig {
  // In production, this could read from environment variables, database, etc.
  return defaultBranding;
}

// Function to apply branding to CSS custom properties
export function applyBrandingCSS(config: BrandingConfig): string {
  return `
    :root {
      --brand-primary: ${config.colors.primary};
      --brand-secondary: ${config.colors.secondary};
      --brand-accent: ${config.colors.accent};
      --brand-success: ${config.colors.success};
      --brand-warning: ${config.colors.warning};
      --brand-danger: ${config.colors.danger};
    }
  `;
}

// Function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof BrandingConfig['features']): boolean {
  const config = getBrandingConfig();
  return config.features[feature];
}

// Function to get program configuration
export function getProgramConfig(program: keyof BrandingConfig['programs']) {
  const config = getBrandingConfig();
  return config.programs[program];
}