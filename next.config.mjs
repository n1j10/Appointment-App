const DEFAULT_API_BASE_URL = "http://localhost:1337/api";

const parseMediaOrigin = () => {
  const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
  const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
  const mediaOrigin = normalizedApiBaseUrl.replace(/\/api\/?$/i, "");

  try {
    return new URL(mediaOrigin);
  } catch {
    return new URL("http://localhost:1337");
  }
};

const backendOrigin = parseMediaOrigin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: backendOrigin.protocol.replace(":", ""),
        hostname: backendOrigin.hostname,
        ...(backendOrigin.port ? { port: backendOrigin.port } : {}),
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },
};

export default nextConfig;
