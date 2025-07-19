import { CompanyInfo, EmployeeInfo, GeneratedDocument } from '@/types/document';
import { getLegalTemplate, validateLegalRequirements } from '@/lib/legal-templates';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  static async generateDocument(
    companyInfo: CompanyInfo,
    employeeInfo: EmployeeInfo,
    documentType: string,
    apiKey?: string,
    additionalData?: Record<string, any>
  ): Promise<GeneratedDocument> {
    const useApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyAl6GUlOtIoJyghsqTdsboxnwOVugkmUH8';
    
    // 법적 유효성 검증
    const allData = { companyInfo, employeeInfo, ...additionalData };
    const validation = validateLegalRequirements(documentType, allData);
    
    if (!validation.isValid) {
      throw new Error(`법적 요구사항 미충족: ${validation.errors.join(', ')}`);
    }
    
    const prompt = this.createPrompt(companyInfo, employeeInfo, documentType, additionalData);
    
    try {
      const response = await fetch(`${this.API_URL}?key=${useApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API 오류: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('Gemini API에서 응답을 받지 못했습니다.');
      }

      const content = data.candidates[0].content.parts[0].text;

      return {
        id: `doc_${Date.now()}`,
        companyInfo,
        employeeInfo,
        documentType,
        content,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('Gemini API 호출 오류:', error);
      throw new Error('서류 생성 중 오류가 발생했습니다.');
    }
  }

  private static createPrompt(
    companyInfo: CompanyInfo,
    employeeInfo: EmployeeInfo,
    documentType: string,
    additionalData?: Record<string, any>
  ): string {
    const employmentTypeKorean = {
      permanent: '정규직',
      contract: '계약직',
      'part-time': '시간제'
    };

    // 법적 템플릿 정보 포함
    const legalTemplate = getLegalTemplate(documentType);
    const legalBasisText = legalTemplate ? 
      `\n**법적 근거:**\n${legalTemplate.legalBasis.join('\n')}\n` : '';

    return `
다음 정보를 바탕으로 "${documentType}"을 한국의 고용노동부 표준 양식에 맞춰 작성해주세요.
${legalBasisText}

**회사 정보:**
- 회사명: ${companyInfo.name}
- 사업자등록번호: ${companyInfo.businessNumber}
- 주소: ${companyInfo.address}
- 대표자: ${companyInfo.ceo}
- 전화번호: ${companyInfo.phone}
${companyInfo.email ? `- 이메일: ${companyInfo.email}` : ''}

**직원 정보:**
- 성명: ${employeeInfo.name}
- 사번: ${employeeInfo.employeeId}
- 부서: ${employeeInfo.department}
- 직급: ${employeeInfo.position}
- 입사일: ${employeeInfo.hireDate}
- 기본급: ${employeeInfo.salary.toLocaleString('ko-KR')}원
- 고용형태: ${employmentTypeKorean[employeeInfo.employmentType]}
- 생년월일: ${employeeInfo.birthDate}
- 주소: ${employeeInfo.address}
- 전화번호: ${employeeInfo.phone}
- 이메일: ${employeeInfo.email}

${additionalData && Object.keys(additionalData).length > 0 ? `
**추가 정보:**
${Object.entries(additionalData)
  .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
` : ''}

**작성 지침:**
1. 한국의 관련 법규에 맞는 정확한 양식으로 작성
2. 필수 기재사항을 모두 포함: ${legalTemplate?.mandatoryFields.join(', ') || '기본 필수사항'}
3. 정중하고 공식적인 문체 사용
4. 날짜는 오늘 날짜(${new Date().toLocaleDateString('ko-KR')})로 설정
5. HTML 형식으로 작성하여 깔끔한 레이아웃 구성
6. 근로기준법 및 관련 법령 준수
7. 최저임금법, 사회보험법 등 관련 규정 반영

${legalTemplate?.legalValidationRules ? 
  `**법적 유의사항:**\n${legalTemplate.legalValidationRules.map(rule => `• ${rule}`).join('\n')}\n` : ''}

서류 내용만 HTML로 응답해주세요. 추가 설명은 필요하지 않습니다.
`.trim();
  }

  // 미리 정의된 서류 목록 (사용자 편의성을 위해)
  static getCommonDocumentTypes(): string[] {
    return [
      '근로계약서',
      '재직증명서',
      '경력증명서',
      '퇴직증명서',
      '임금명세서',
      '휴가신청서',
      '연장근로신청서',
      '출장신청서',
      '사직서',
      '추천서',
      '인사발령서',
      '징계통지서',
      '복무규정',
      '급여명세서',
      '연차휴가확인서'
    ];
  }
}