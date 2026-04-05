import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuContent from "@/components/Menu";

export const metadata = {
  title: "Our Menu | The Awareness Cafe",
  description:
    "Explore our full menu — breakfast, shakes, smoothies, burgers, pizza, sandwiches, tea & coffee. Fresh ingredients, amazing flavors. Order online now!",
  openGraph: {
    title: "Our Menu | The Awareness Cafe",
    description: "Explore our complete menu with 40+ items. Order online for free delivery!",
    images: [{ url: "/images/pizza.webp", width: 1200, height: 630 }],
  },
};

const menuJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://theawarenesscafe.in" },
    { "@type": "ListItem", position: 2, name: "Menu", item: "https://theawarenesscafe.in/menu" },
  ],
};

export default function MenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <Navbar />
      <main className="w-full overflow-x-hidden pt-16 md:pt-20">
        <MenuContent />
      </main>
      <Footer />
    </>
  );
}
