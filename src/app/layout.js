import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "The Awareness Cafe | Premium Café in Haryana",
  description:
    "Experience the finest coffee, burgers, pizza, and more at The Awareness Cafe. A modern, cozy café near Vaishno Devi Mandir, Haryana. Rated 4.6⭐ by 111+ happy customers.",
  keywords: [
    "awareness cafe",
    "cafe haryana",
    "best cafe near me",
    "coffee shop",
    "restaurant haryana",
    "pizza",
    "burgers",
    "shakes",
  ],
  authors: [{ name: "The Awareness Cafe" }],
  openGraph: {
    title: "The Awareness Cafe | Premium Café Experience",
    description:
      "Experience the finest coffee, burgers, pizza, and more. Rated 4.6⭐ by 111+ customers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://theawarenesscafe.in",
    siteName: "The Awareness Cafe",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Awareness Cafe",
    description: "Premium café experience in Haryana",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "The Awareness Cafe",
  image: "/images/cafe front view.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gadi Budhera Road, Near Vaishno Devi Mandir",
    addressLocality: "Haryana",
    postalCode: "122505",
    addressCountry: "IN",
  },
  telephone: "+918750155505",
  servesCuisine: ["Indian", "Fast Food", "Cafe"],
  priceRange: "₹₹",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "111",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased w-full max-w-[100vw] overflow-x-hidden">{children}</body>
    </html>
  );
}
