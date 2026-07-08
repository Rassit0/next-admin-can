import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  output: "standalone",
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
};

export default withSerwist(nextConfig);

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
