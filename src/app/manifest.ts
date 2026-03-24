import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mindful Curator",
    short_name: "Mindful",
    description: "Parents tracking daily habits with clarity.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5f5",
    theme_color: "#006565",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
