import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veterans Housing Program | Forward Horizon - Safe Housing for Veterans",
  description: "Secure, affordable housing for veterans with VA benefits assistance, job training, and supportive community. Download your free Veterans Benefits Guide + Housing Checklist today.",
  keywords: "veterans housing, VA benefits, veterans housing assistance, military housing, veterans transitional housing, VA home loan, veterans support, military transition",
  openGraph: {
    title: "Veterans Housing Program | Forward Horizon",
    description: "Safe, supportive housing for veterans with comprehensive services and VA benefits assistance.",
    url: "https://your-domain.com/veterans-housing",
    siteName: "Forward Horizon",
    images: [
      {
        url: "/veterans-housing-og.jpg",
        width: 1200,
        height: 630,
        alt: "Veterans Housing Program - Forward Horizon"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Veterans Housing Program | Forward Horizon",
    description: "Safe, supportive housing for veterans with comprehensive services and VA benefits assistance.",
    images: ["/veterans-housing-og.jpg"]
  },
  alternates: {
    canonical: "https://your-domain.com/veterans-housing"
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

export default function VeteransHousingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}