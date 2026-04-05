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

import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function MenuPage() {
  const supabase = await createClient();
  
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order");

  const formattedMenu = [];
  if (menuItems) {
    const categoriesMap = new Map();
    menuItems.forEach((item) => {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          category: item.category,
          emoji: item.emoji || "🍽️",
          items: [],
        });
      }
      categoriesMap.get(item.category).items.push({
        name: item.name,
        desc: item.description,
        price: item.price,
        image: item.image_url || "/images/placeholder.webp",
      });
    });
    formattedMenu.push(...categoriesMap.values());
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <Navbar />
      <main className="w-full overflow-x-hidden pt-16 md:pt-20">
        <MenuContent menuData={formattedMenu} />
      </main>
      <Footer />
    </>
  );
}
