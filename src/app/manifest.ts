import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Admin CAN - Club Atlético Nacional",
    short_name: "Admin CAN",
    description:
      "Sistema Administrativo Integral del Club Atlético Nacional (CAN).",
    start_url: "/admin",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x256",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x683",
        type: "image/png",
      },
    ],
  };
}
