import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  // Vercel 최적화 설정
  experimental: {
    optimizePackageImports: ['@/components/ui', 'lucide-react'],
  },
  // CSR 강제 설정으로 이벤트 문제 방지
  trailingSlash: false,
  // 빌드 최적화
  compress: true,
  poweredByHeader: false,
  // React Strict Mode 유지 (개발환경에서만)
  reactStrictMode: true,
};

export default nextConfig;
