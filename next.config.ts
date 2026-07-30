import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@fullcalendar/common",
    "@fullcalendar/core",
    "@fullcalendar/react",
    "@fullcalendar/daygrid",
    "@fullcalendar/timegrid",
    "@fullcalendar/interaction",
  ],
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
