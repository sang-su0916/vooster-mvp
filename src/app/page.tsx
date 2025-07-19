'use client';

import { Button } from '@/components/ui/button';
import { FileText, Users, Shield, Download } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">엘비즈파트너스</h1>
          </div>
          <Button variant="outline" className="hidden md:block">
            로그인
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              간편한 인사서류
              <br />
              <span className="text-blue-600">자동 발급 시스템</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              이름과 사번만 입력하면 근로계약서, 임금대장, 직원명부 등 
              필수 인사서류를 즉시 발급받을 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/documents">
              <Button size="lg" className="px-8 py-3 text-lg">
                서류 발급하기
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              데모 보기
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-blue-600" />}
            title="안전한 인증"
            description="사내 AD 연동으로 보안이 검증된 직원만 접근 가능합니다."
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-green-600" />}
            title="즉시 발급"
            description="이름과 사번 입력 후 3초 이내에 미리보기를 제공합니다."
          />
          <FeatureCard
            icon={<Download className="w-8 h-8 text-purple-600" />}
            title="다양한 형식"
            description="PDF 다운로드, 브라우저 인쇄, 전자서명 등을 지원합니다."
          />
        </div>

        {/* Document Types */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            지원하는 서류 종류
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <DocumentCard
              title="근로계약서"
              description="개인별 맞춤 근로계약서를 즉시 생성합니다."
            />
            <DocumentCard
              title="임금대장"
              description="최신 급여 정보가 반영된 임금대장을 제공합니다."
            />
            <DocumentCard
              title="직원명부"
              description="부서별, 직급별 직원명부를 생성할 수 있습니다."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Vooster. 모든 권리 보유. 프로젝트 F671
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function DocumentCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <FileText className="w-12 h-12 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
