import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recovery Housing Program | Forward Horizon - Sober Living Community",
  description: "Safe, substance-free recovery housing with 24/7 support, peer community, and proven results. 89% sobriety success rate. Download your free Recovery Housing Guide today.",
  keywords: "recovery housing, sober living, addiction recovery housing, halfway house, transitional living, substance abuse recovery, drug recovery housing, alcohol recovery housing",
  openGraph: {
    title: "Recovery Housing Program | Forward Horizon",
    description: "Safe, substance-free recovery housing with 24/7 support and proven 89% success rate.",
    url: "https://your-domain.com/recovery-housing",
    siteName: "Forward Horizon",
    images: [
      {
        url: "/recovery-housing-og.jpg",
        width: 1200,
        height: 630,
        alt: "Recovery Housing Program - Forward Horizon"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery Housing Program | Forward Horizon",
    description: "Safe, substance-free recovery housing with 24/7 support and proven 89% success rate.",
    images: ["/recovery-housing-og.jpg"]
  },
  alternates: {
    canonical: "https://your-domain.com/recovery-housing"
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

export default function RecoveryHousingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}