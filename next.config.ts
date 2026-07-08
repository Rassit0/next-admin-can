import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

export default withSerwist({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // El dominio de tus fotos
        port: "",
        pathname: "/**",
      },
    ],
  },
});

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com", // El dominio de tus fotos
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
