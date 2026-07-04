import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: "Custom furniture, built to your drawing.",
    start_url: "/",
    display: "standalone",
    background_color: "#ede7db",
    theme_color: "#2b2620",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
