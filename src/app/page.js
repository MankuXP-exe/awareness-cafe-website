import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import MapSection from "@/components/MapSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();
  
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

  const { data: galleryItems } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
    
  const formattedGallery = galleryItems?.map(img => ({
    src: img.image_url,
    alt: img.title || "Gallery Image",
    category: img.category
  })) || [];

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <About />
        <Menu menuData={formattedMenu} />
        <Gallery galleryImages={formattedGallery} />
        <Testimonials />
        <MapSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
