export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theawarenesscafe.in";

  const routes = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/menu", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/gallery", changeFrequency: "weekly", priority: 0.7 },
    { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
    { path: "/checkout", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
