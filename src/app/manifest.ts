import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vide Connect",
    short_name: "Vide",
    description: "Music player application",
    start_url: "/",
    display: "standalone",
    background_color: "#FB5E5E",
    theme_color: "#FB5E5E",
    icons: [
      {
        src: "/icon-192.png",   
        sizes: "192x192",
        type: "image/png",
      }
    ],
  };
}
