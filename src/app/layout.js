import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
    "Experience the finest coffee, burgers, pizza, and more at The Awareness Cafe. A modern, cozy café near Vaishno Devi Mandir, Haryana. Rated 4.6⭐ by 111+ happy customers. Order online now!",
  keywords: [
    "awareness cafe",
    "cafe haryana",
    "best cafe near me",
    "coffee shop",
    "restaurant haryana",
    "pizza",
    "burgers",
    "shakes",
    "order food online haryana",
    "cafe near vaishno devi mandir",
  ],
  authors: [{ name: "The Awareness Cafe" }],
  openGraph: {
    title: "The Awareness Cafe | Premium Café Experience",
    description:
      "Experience the finest coffee, burgers, pizza, and more. Order online — free delivery within 5km! Rated 4.6⭐ by 111+ customers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://theawarenesscafe.in",
    siteName: "The Awareness Cafe",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/cafe front view.webp",
        width: 1200,
        height: 630,
        alt: "The Awareness Cafe — Premium Café in Haryana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Awareness Cafe",
    description: "Premium café experience in Haryana. Order online!",
    images: ["/images/cafe front view.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
  url: "https://theawarenesscafe.in",
  telephone: "+917838485551",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gadi Budhera Road, Near Vaishno Devi Mandir",
    addressLocality: "Haryana",
    postalCode: "122505",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "28.4200",
    longitude: "76.8800",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "22:00",
    },
  ],
  servesCuisine: ["Indian", "Fast Food", "Cafe", "Continental"],
  priceRange: "₹₹",
  hasMenu: {
    "@type": "Menu",
    url: "https://theawarenesscafe.in/menu",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "111",
    bestRating: "5",
    worstRating: "1",
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
      <body suppressHydrationWarning className="antialiased w-full max-w-[100vw] overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
