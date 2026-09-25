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
      {
        protocol: "https",
        hostname: "https://pub-38a41e7136394ef3bc6fbee7f3f957b7.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  async redirects() {
    return [
      {
        source: "/admin/web/promos/promo-1",
        destination: "/admin/web/promotions",
        permanent: true,
      },
      {
        source: "/admin/web/promos/promo-2",
        destination: "/admin/web/promotions",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline'"; // unsafe-inline needed by Next.js without nonces

    const connectSrc = isDev
      ? "'self' ws: wss: http://localhost:3001 https:"
      : "'self' https:"; // API connections

    const imgSrc =
      "'self' data: blob: https://lh3.googleusercontent.com https://images.unsplash.com https://pub-d9fd1557230b4f54993890de726c12af.r2.dev";

    const csp = `
      default-src 'self';
      script-src ${scriptSrc};
      style-src 'self' 'unsafe-inline';
      img-src ${imgSrc};
      font-src 'self' data:;
      connect-src ${connectSrc};
      frame-src 'self';
      frame-ancestors 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: csp,
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    if (!isDev) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
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
