import GalleryClient from "./GalleryClient";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Gallery | The Awareness Cafe",
  description:
    "Explore the beautiful interiors, delicious food, and vibrant atmosphere of The Awareness Cafe through our photo gallery.",
  openGraph: {
    title: "Gallery | The Awareness Cafe",
    description: "A visual tour of our café — food, interiors, exteriors, and team.",
    images: [{ url: "/images/siting area.webp" }],
  },
};

export const revalidate = 60;

export default async function GalleryPage() {
  const supabase = await createClient();
  
  const { data: galleryItems } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
    
  const formattedGallery = galleryItems?.map(img => ({
    src: img.image_url,
    alt: img.title || "Gallery Image",
    category: img.category
  })) || [];

  return <GalleryClient allImages={formattedGallery} />;
}
