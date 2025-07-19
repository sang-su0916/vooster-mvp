'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Sparkles, ArrowLeft, Building, User } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { GeminiService } from '@/lib/gemini-service';
import { CompanyInfo, EmployeeInfo, GeneratedDocument } from '@/types/document';
import { ApiKeySetup } from '@/components/api-key-setup';
import { DynamicFormFields } from '@/components/dynamic-form-fields';
import { FieldRequirementsIndicator } from '@/components/field-requirements-indicator';
import { PDFDownloadActions } from '@/components/pdf-download-actions';

export default function DocumentsPage() {
  const { toast } = useToast();
  
  // 회사 정보
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    businessNumber: '',
    address: '',
    ceo: '',
    phone: '',
    email: '',
  });

  // 직원 정보
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    employeeId: '',
    department: '',
    position: '',
    hireDate: '',
    salary: 0,
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    employmentType: 'permanent',
  });

  // 서류 요청
  const [documentType, setDocumentType] = useState('');
  const [customDocumentType, setCustomDocumentType] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [additionalData, setAdditionalData] = useState<Record<string, any>>({});

  const commonDocumentTypes = GeminiService.getCommonDocumentTypes();

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeInfoChange = (field: keyof EmployeeInfo, value: string | number) => {
    setEmployeeInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAdditionalDataChange = (field: string, value: any) => {
    setAdditionalData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    // 서류 타입이 변경되면 추가 데이터 초기화
    setAdditionalData({});
  };

  const handleGenerateDocument = async () => {
    // API 키 검증
    if (!apiKey) {
      toast({
        title: 'API 키 필요',
        description: 'Google Gemini API 키를 먼저 설정해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // 필수 필드 검증
    if (!companyInfo.name || !companyInfo.ceo || !employeeInfo.name || !employeeInfo.employeeId) {
      toast({
        title: '입력 오류',
        description: '회사명, 대표자, 직원명, 사번은 필수 입력 항목입니다.',
        variant: 'destructive',
      });
      return;
    }

    const requestedDocumentType = documentType === 'custom' ? customDocumentType : documentType;
    
    if (!requestedDocumentType) {
      toast({
        title: '입력 오류',
        description: '생성할 서류를 선택하거나 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const document = await GeminiService.generateDocument(
        companyInfo,
        employeeInfo,
        requestedDocumentType,
        apiKey,
        additionalData
      );
      
      setGeneratedDocument(document);
      
      toast({
        title: '서류 생성 완료',
        description: `${requestedDocumentType}이(가) 성공적으로 생성되었습니다.`,
      });
    } catch (error) {
      toast({
        title: '생성 실패',
        description: error instanceof Error ? error.message : '서류 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">AI 서류 생성기</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* API 키 설정 */}
        <ApiKeySetup
          onApiKeySet={setApiKey}
          currentApiKey={apiKey}
        />
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>회사 정보</span>
              </CardTitle>
              <CardDescription>
                발급 회사의 기본 정보를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">회사명 *</Label>
                <Input
                  id="companyName"
                  placeholder="주식회사 Vooster"
                  value={companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessNumber">사업자등록번호</Label>
                <Input
                  id="businessNumber"
                  placeholder="123-45-67890"
                  value={companyInfo.businessNumber}
                  onChange={(e) => handleCompanyInfoChange('businessNumber', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyAddress">회사 주소</Label>
                <Input
                  id="companyAddress"
                  placeholder="서울시 강남구 테헤란로 123"
                  value={companyInfo.address}
                  onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ceo">대표자 *</Label>
                <Input
                  id="ceo"
                  placeholder="김대표"
                  value={companyInfo.ceo}
                  onChange={(e) => handleCompanyInfoChange('ceo', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyPhone">회사 전화번호</Label>
                <Input
                  id="companyPhone"
                  placeholder="02-1234-5678"
                  value={companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyEmail">회사 이메일</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  placeholder="info@vooster.com"
                  value={companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 직원 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <span>직원 정보</span>
              </CardTitle>
              <CardDescription>
                서류 대상 직원의 정보를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeName">성명 *</Label>
                  <Input
                    id="employeeName"
                    placeholder="홍길동"
                    value={employeeInfo.name}
                    onChange={(e) => handleEmployeeInfoChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeId">사번 *</Label>
                  <Input
                    id="employeeId"
                    placeholder="EMP001"
                    value={employeeInfo.employeeId}
                    onChange={(e) => handleEmployeeInfoChange('employeeId', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <Input
                    id="department"
                    placeholder="개발팀"
                    value={employeeInfo.department}
                    onChange={(e) => handleEmployeeInfoChange('department', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">직급</Label>
                  <Input
                    id="position"
                    placeholder="주임"
                    value={employeeInfo.position}
                    onChange={(e) => handleEmployeeInfoChange('position', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">입사일</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={employeeInfo.hireDate}
                    onChange={(e) => handleEmployeeInfoChange('hireDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">생년월일</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={employeeInfo.birthDate}
                    onChange={(e) => handleEmployeeInfoChange('birthDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">기본급 (원)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="3500000"
                  value={employeeInfo.salary || ''}
                  onChange={(e) => handleEmployeeInfoChange('salary', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employmentType">고용형태</Label>
                <Select onValueChange={(value) => handleEmployeeInfoChange('employmentType', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="고용형태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">정규직</SelectItem>
                    <SelectItem value="contract">계약직</SelectItem>
                    <SelectItem value="part-time">시간제</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeePhone">전화번호</Label>
                <Input
                  id="employeePhone"
                  placeholder="010-1234-5678"
                  value={employeeInfo.phone}
                  onChange={(e) => handleEmployeeInfoChange('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeEmail">이메일</Label>
                <Input
                  id="employeeEmail"
                  type="email"
                  placeholder="hong@company.com"
                  value={employeeInfo.email}
                  onChange={(e) => handleEmployeeInfoChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeAddress">주소</Label>
                <Input
                  id="employeeAddress"
                  placeholder="서울시 강남구..."
                  value={employeeInfo.address}
                  onChange={(e) => handleEmployeeInfoChange('address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 서류 생성 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>서류 생성</span>
              </CardTitle>
              <CardDescription>
                필요한 서류를 선택하거나 직접 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">서류 종류</Label>
                <Select onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="서류를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonDocumentTypes.map((doc) => (
                      <SelectItem key={doc} value={doc}>
                        {doc}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {documentType === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customDocumentType">서류명 직접 입력</Label>
                  <Input
                    id="customDocumentType"
                    placeholder="예: 업무협약서, 전근발령서 등"
                    value={customDocumentType}
                    onChange={(e) => setCustomDocumentType(e.target.value)}
                  />
                </div>
              )}

              {/* 서류별 필수/선택 항목 가이드 */}
              {documentType && documentType !== 'custom' && (
                <FieldRequirementsIndicator documentType={documentType} />
              )}

              {/* 서류별 추가 입력 필드 */}
              {documentType && documentType !== 'custom' && (
                <DynamicFormFields
                  documentType={documentType}
                  additionalData={additionalData}
                  onAdditionalDataChange={handleAdditionalDataChange}
                />
              )}
              
              <Button 
                onClick={handleGenerateDocument} 
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? 'AI 생성 중...' : 'AI로 서류 생성'}
              </Button>
              
              {generatedDocument && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <strong>생성된 서류:</strong> {generatedDocument.documentType}
                    <br />
                    <strong>생성 시간:</strong> {generatedDocument.generatedAt.toLocaleString('ko-KR')}
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedDocument.content }}
                    />
                  </div>
                  
                  <PDFDownloadActions document={generatedDocument} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}