// 고용노동부 표준 양식 기반 법적 정확성 강화 템플릿

export interface LegalTemplate {
  documentType: string;
  legalBasis: string[];
  mandatoryFields: string[];
  standardFormat: string;
  legalValidationRules: string[];
}

// 고용노동부 표준 서식 및 관련 법령 기반 템플릿
export const LEGAL_TEMPLATES: Record<string, LegalTemplate> = {
  '근로계약서': {
    documentType: '근로계약서',
    legalBasis: [
      '근로기준법 제17조 (근로조건의 명시)',
      '근로기준법 시행령 제8조 (근로조건의 명시방법)',
      '고용노동부 표준근로계약서 양식'
    ],
    mandatoryFields: [
      '근로계약기간', '근무장소', '업무내용', '근로시간', '휴게시간', '휴일',
      '임금의 구성항목·계산방법·지급방법', '연차유급휴가', '사회보험 적용여부',
      '근로계약서 작성연월일', '사업주·근로자 서명날인'
    ],
    standardFormat: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Malgun Gothic', sans-serif;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">근로계약서</h1>
        
        <div style="margin-bottom: 20px;">
          <strong>※ 이 계약서는 근로기준법 제17조에 따라 근로조건을 명시한 것입니다.</strong>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5; width: 120px;"><strong>사업체명</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{companyName}</td>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5; width: 120px;"><strong>사업자등록번호</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{businessNumber}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5;"><strong>사업장 소재지</strong></td>
            <td style="border: 1px solid #000; padding: 8px;" colspan="3">{companyAddress}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5;"><strong>대표자</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{ceoName}</td>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5;"><strong>연락처</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{companyPhone}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5; width: 120px;"><strong>성명</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{employeeName}</td>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5; width: 120px;"><strong>생년월일</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{birthDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5;"><strong>주소</strong></td>
            <td style="border: 1px solid #000; padding: 8px;" colspan="3">{employeeAddress}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5;"><strong>연락처</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{employeePhone}</td>
            <td style="border: 1px solid #000; padding: 8px; background-color: #f5f5f5;"><strong>이메일</strong></td>
            <td style="border: 1px solid #000; padding: 8px;">{employeeEmail}</td>
          </tr>
        </table>

        <div style="margin-bottom: 15px;">
          <strong>1. 근로계약기간</strong><br>
          {contractPeriod}
        </div>

        <div style="margin-bottom: 15px;">
          <strong>2. 근무장소</strong><br>
          {workLocation}
        </div>

        <div style="margin-bottom: 15px;">
          <strong>3. 업무내용</strong><br>
          {jobDescription}
        </div>

        <div style="margin-bottom: 15px;">
          <strong>4. 근로시간 및 휴게시간</strong><br>
          • 소정근로시간: {workHours}<br>
          • 휴게시간: 12:00 ~ 13:00 (1시간)<br>
          • 휴일: 주휴일(일요일) 및 관공서 공휴일
        </div>

        <div style="margin-bottom: 15px;">
          <strong>5. 임금</strong><br>
          • 기본급: 월 {basicSalary}원<br>
          • 지급일: 매월 25일<br>
          • 지급방법: 근로자 명의 계좌 입금
        </div>

        <div style="margin-bottom: 15px;">
          <strong>6. 연차유급휴가</strong><br>
          근로기준법에 따라 1년간 80% 이상 출근 시 15일의 유급휴가를 부여하며, 
          3년 이상 근속 시 매 2년마다 1일씩 가산하여 최대 25일까지 부여
        </div>

        <div style="margin-bottom: 15px;">
          <strong>7. 사회보험 적용여부</strong><br>
          • 국민연금: 적용<br>
          • 건강보험: 적용<br>
          • 고용보험: 적용<br>
          • 산재보험: 적용
        </div>

        <div style="margin-bottom: 30px;">
          <strong>8. 기타</strong><br>
          이 계약에 명시되지 않은 사항은 근로기준법 및 관련 법령에 따릅니다.
        </div>

        <div style="margin-top: 40px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p><strong>사업주</strong></p>
              <p>회사명: {companyName}</p>
              <p>대표자: {ceoName} (인)</p>
            </div>
            <div>
              <p><strong>근로자</strong></p>
              <p>성명: {employeeName} (인)</p>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          {currentDate}
        </div>
      </div>
    `,
    legalValidationRules: [
      '근로계약기간이 명시되어야 함',
      '근무장소와 업무내용이 구체적으로 기재되어야 함',
      '근로시간이 주 40시간을 초과하지 않아야 함',
      '최저임금 이상이어야 함',
      '사회보험 적용여부가 명시되어야 함'
    ]
  },

  '재직증명서': {
    documentType: '재직증명서',
    legalBasis: [
      '근로기준법 제39조 (증명서)',
      '고용노동부 표준 재직증명서 양식'
    ],
    mandatoryFields: [
      '성명', '생년월일', '입사일', '근무부서', '직급', '발급목적', '발급일자'
    ],
    standardFormat: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Malgun Gothic', sans-serif;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 40px;">재 직 증 명 서</h1>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="border: 1px solid #000; padding: 12px; background-color: #f5f5f5; width: 120px; text-align: center;"><strong>성 명</strong></td>
            <td style="border: 1px solid #000; padding: 12px;">{employeeName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 12px; background-color: #f5f5f5; text-align: center;"><strong>생년월일</strong></td>
            <td style="border: 1px solid #000; padding: 12px;">{birthDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 12px; background-color: #f5f5f5; text-align: center;"><strong>입사일</strong></td>
            <td style="border: 1px solid #000; padding: 12px;">{hireDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 12px; background-color: #f5f5f5; text-align: center;"><strong>부 서</strong></td>
            <td style="border: 1px solid #000; padding: 12px;">{department}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 12px; background-color: #f5f5f5; text-align: center;"><strong>직 급</strong></td>
            <td style="border: 1px solid #000; padding: 12px;">{position}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 12px; background-color: #f5f5f5; text-align: center;"><strong>재직상태</strong></td>
            <td style="border: 1px solid #000; padding: 12px;">재직중</td>
          </tr>
        </table>

        <div style="margin-bottom: 30px; text-align: center; font-size: 16px;">
          위 사람은 현재 본 회사에 재직중임을 증명합니다.
        </div>

        <div style="margin-bottom: 20px; text-align: center;">
          <strong>발급목적: {purpose}</strong>
        </div>

        <div style="text-align: center; margin-bottom: 40px;">
          {currentDate}
        </div>

        <div style="text-align: center;">
          <div style="margin-bottom: 10px;">
            <strong>발급기관</strong>
          </div>
          <div style="margin-bottom: 5px;">
            <strong>{companyName}</strong>
          </div>
          <div style="margin-bottom: 5px;">
            주소: {companyAddress}
          </div>
          <div style="margin-bottom: 20px;">
            전화: {companyPhone}
          </div>
          <div>
            <strong>대표이사: {ceoName} (인)</strong>
          </div>
        </div>
      </div>
    `,
    legalValidationRules: [
      '근로자의 동의 없이 급여 정보를 포함할 수 없음',
      '발급목적이 명시되어야 함',
      '사실과 다른 내용을 기재할 수 없음'
    ]
  },

  '휴가신청서': {
    documentType: '휴가신청서',
    legalBasis: [
      '근로기준법 제60조 (연차유급휴가)',
      '근로기준법 제61조 (연차유급휴가의 사용촉진)',
      '고용노동부 휴가신청서 표준양식'
    ],
    mandatoryFields: [
      '신청자', '부서', '휴가종류', '휴가기간', '휴가사유', '업무인수인계', '신청일'
    ],
    standardFormat: `
      <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: 'Malgun Gothic', sans-serif;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">휴 가 신 청 서</h1>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; width: 100px; text-align: center;"><strong>성 명</strong></td>
            <td style="border: 1px solid #000; padding: 10px; width: 150px;">{employeeName}</td>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; width: 100px; text-align: center;"><strong>사 번</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{employeeId}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; text-align: center;"><strong>부 서</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{department}</td>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; text-align: center;"><strong>직 급</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{position}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; width: 120px; text-align: center;"><strong>휴가종류</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{vacationType}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; text-align: center;"><strong>휴가기간</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{startDate} ~ {endDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; text-align: center;"><strong>휴가일수</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{vacationDays}일</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; text-align: center;"><strong>휴가사유</strong></td>
            <td style="border: 1px solid #000; padding: 10px; height: 80px; vertical-align: top;">{reason}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; background-color: #f5f5f5; text-align: center;"><strong>업무대행자</strong></td>
            <td style="border: 1px solid #000; padding: 10px;">{substitute}</td>
          </tr>
        </table>

        <div style="margin-bottom: 30px;">
          <strong>※ 연차휴가 관련 안내</strong><br>
          • 연차휴가는 근로기준법 제60조에 따라 보장되는 권리입니다.<br>
          • 휴가 신청은 업무에 지장이 없도록 사전에 신청하여 주시기 바랍니다.<br>
          • 경조사휴가, 병가 등은 관련 증빙서류를 첨부해 주시기 바랍니다.
        </div>

        <div style="text-align: center; margin-bottom: 40px;">
          위와 같이 휴가를 신청하오니 승인하여 주시기 바랍니다.
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p><strong>신청일: {currentDate}</strong></p>
            <p style="margin-top: 30px;">신청자: {employeeName} (인)</p>
          </div>
          <div style="text-align: right;">
            <p><strong>결재란</strong></p>
            <table style="border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="border: 1px solid #000; padding: 20px; width: 80px; text-align: center;">팀장</td>
                <td style="border: 1px solid #000; padding: 20px; width: 80px; text-align: center;">부서장</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="text-align: center;">
          <strong>{companyName}</strong>
        </div>
      </div>
    `,
    legalValidationRules: [
      '연차휴가는 1년간 80% 이상 출근한 근로자에게 보장',
      '휴가신청은 사전에 하는 것이 원칙',
      '업무대행 계획이 수립되어야 함'
    ]
  }
};

// 서류별 법적 유효성 검증
export function validateLegalRequirements(
  documentType: string, 
  data: Record<string, any>
): { isValid: boolean; errors: string[] } {
  const template = LEGAL_TEMPLATES[documentType];
  if (!template) {
    return { isValid: false, errors: ['지원하지 않는 서류 타입입니다.'] };
  }

  const errors: string[] = [];

  // 필수 필드 검증
  template.mandatoryFields.forEach(field => {
    const fieldPath = getFieldPath(field);
    if (!getNestedValue(data, fieldPath)) {
      errors.push(`${field}은(는) 필수 입력 항목입니다.`);
    }
  });

  // 문서별 특별 검증
  switch (documentType) {
    case '근로계약서':
      validateEmploymentContract(data, errors);
      break;
    case '휴가신청서':
      validateVacationRequest(data, errors);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 근로계약서 특별 검증
function validateEmploymentContract(data: Record<string, any>, errors: string[]) {
  // 최저임금 검증 (2024년 기준: 9,860원)
  const hourlyMinWage = 9860;
  const monthlyMinWage = hourlyMinWage * 8 * 5 * 52 / 12; // 월 최저임금 계산
  
  if (data.employeeInfo?.salary && data.employeeInfo.salary < monthlyMinWage) {
    errors.push(`기본급이 최저임금(월 ${Math.round(monthlyMinWage).toLocaleString()}원)보다 낮습니다.`);
  }

  // 근로시간 검증 (주 40시간 초과 금지)
  if (data.workHours && data.workHours.includes('주') && 
      parseInt(data.workHours.match(/\d+/)?.[0] || '0') > 40) {
    errors.push('주당 근로시간은 40시간을 초과할 수 없습니다.');
  }
}

// 휴가신청서 특별 검증
function validateVacationRequest(data: Record<string, any>, errors: string[]) {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  
  if (startDate >= endDate) {
    errors.push('휴가 종료일은 시작일보다 늦어야 합니다.');
  }

  if (startDate < new Date()) {
    errors.push('과거 날짜로 휴가를 신청할 수 없습니다.');
  }
}

// 유틸리티 함수들
function getFieldPath(field: string): string {
  const fieldMap: Record<string, string> = {
    '성명': 'employeeInfo.name',
    '사번': 'employeeInfo.employeeId',
    '부서': 'employeeInfo.department',
    '직급': 'employeeInfo.position',
    '입사일': 'employeeInfo.hireDate',
    '생년월일': 'employeeInfo.birthDate',
    '회사명': 'companyInfo.name',
    '대표자': 'companyInfo.ceo',
    '회사주소': 'companyInfo.address'
  };
  
  return fieldMap[field] || field;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// 법적 템플릿 가져오기
export function getLegalTemplate(documentType: string): LegalTemplate | null {
  return LEGAL_TEMPLATES[documentType] || null;
}