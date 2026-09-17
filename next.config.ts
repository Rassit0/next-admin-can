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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-d9fd1557230b4f54993890de726c12af.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  async redirects() {
    return [
      {
        source: '/admin/web/promos/promo-1',
        destination: '/admin/web/promotions',
        permanent: true,
      },
      {
        source: '/admin/web/promos/promo-2',
        destination: '/admin/web/promotions',
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    cpus: 1,
    memoryBasedWorkersCount: true,
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
