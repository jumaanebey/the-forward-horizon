import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Re-entry Support Program | Forward Horizon - Life After Release Housing",
  description: "Comprehensive re-entry support with safe housing, employment assistance, and life skills training. 5% recidivism rate. Download your free Life After Release Planning Kit.",
  keywords: "re-entry housing, prison re-entry programs, halfway house, second chance housing, ex offender housing, re-entry services, life after prison, returning citizen support, transitional housing",
  openGraph: {
    title: "Re-entry Support Program | Forward Horizon",
    description: "Comprehensive re-entry support with safe housing and proven 5% recidivism rate.",
    url: "https://your-domain.com/re-entry-support",
    siteName: "Forward Horizon",
    images: [
      {
        url: "/re-entry-support-og.jpg",
        width: 1200,
        height: 630,
        alt: "Re-entry Support Program - Forward Horizon"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Re-entry Support Program | Forward Horizon",
    description: "Comprehensive re-entry support with safe housing and proven 5% recidivism rate.",
    images: ["/re-entry-support-og.jpg"]
  },
  alternates: {
    canonical: "https://your-domain.com/re-entry-support"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function ReentrySupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}