import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "./AboutClient";

export const metadata = {
  title: "About Us | The Awareness Cafe",
  description:
    "Learn about The Awareness Cafe — our story, mission, values, and the team behind our amazing food. Founded near Vaishno Devi Mandir, Haryana.",
  openGraph: {
    title: "About Us | The Awareness Cafe",
    description: "Our story, mission, and the people behind every delicious bite.",
    images: [{ url: "/images/cafe front view.webp" }],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://theawarenesscafe.in" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://theawarenesscafe.in/about" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
