// 서류별 필수/선택 입력 필드 정의
export interface DocumentRequirement {
  documentType: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  additionalFields?: AdditionalField[];
}

export interface AdditionalField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// 서류별 요구사항 정의
export const DOCUMENT_REQUIREMENTS: Record<string, DocumentRequirement> = {
  '근로계약서': {
    documentType: '근로계약서',
    description: '정규직/계약직 근로계약서 작성을 위한 필수 정보',
    requiredFields: ['companyInfo.name', 'companyInfo.ceo', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.hireDate', 'employeeInfo.salary'],
    optionalFields: ['companyInfo.businessNumber', 'companyInfo.address', 'employeeInfo.department', 'employeeInfo.position'],
    additionalFields: [
      {
        key: 'contractPeriod',
        label: '계약기간',
        type: 'select',
        options: ['정규직 (기간의 정함이 없음)', '1년', '2년', '3년', '기타'],
        validation: { required: true }
      },
      {
        key: 'workHours',
        label: '근무시간',
        type: 'text',
        placeholder: '주 40시간 (09:00~18:00)',
        validation: { required: true }
      },
      {
        key: 'workLocation',
        label: '근무장소',
        type: 'text',
        placeholder: '회사 주소 또는 재택근무',
        validation: { required: true }
      }
    ]
  },

  '재직증명서': {
    documentType: '재직증명서',
    description: '현재 재직 중임을 증명하는 서류',
    requiredFields: ['companyInfo.name', 'companyInfo.ceo', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.hireDate'],
    optionalFields: ['companyInfo.businessNumber', 'companyInfo.address', 'employeeInfo.department', 'employeeInfo.position', 'employeeInfo.salary'],
    additionalFields: [
      {
        key: 'purpose',
        label: '발급목적',
        type: 'select',
        options: ['금융기관 제출용', '관공서 제출용', '이직용', '기타'],
        validation: { required: true }
      },
      {
        key: 'includesSalary',
        label: '급여정보 포함 여부',
        type: 'select',
        options: ['포함', '미포함'],
        validation: { required: true }
      }
    ]
  },

  '경력증명서': {
    documentType: '경력증명서',
    description: '근무 경력을 증명하는 서류',
    requiredFields: ['companyInfo.name', 'companyInfo.ceo', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.hireDate'],
    optionalFields: ['companyInfo.businessNumber', 'companyInfo.address', 'employeeInfo.department', 'employeeInfo.position'],
    additionalFields: [
      {
        key: 'workPeriod',
        label: '근무기간',
        type: 'text',
        placeholder: '예: 2022.03.01 ~ 2024.12.31',
        validation: { required: true }
      },
      {
        key: 'jobDescription',
        label: '주요업무',
        type: 'textarea',
        placeholder: '담당했던 주요 업무를 간략히 기술해주세요',
        validation: { required: true }
      }
    ]
  },

  '퇴직증명서': {
    documentType: '퇴직증명서',
    description: '퇴직 사실을 증명하는 서류',
    requiredFields: ['companyInfo.name', 'companyInfo.ceo', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.hireDate'],
    optionalFields: ['companyInfo.businessNumber', 'companyInfo.address', 'employeeInfo.department', 'employeeInfo.position'],
    additionalFields: [
      {
        key: 'resignationDate',
        label: '퇴직일',
        type: 'date',
        validation: { required: true }
      },
      {
        key: 'resignationType',
        label: '퇴직사유',
        type: 'select',
        options: ['자진퇴사', '권고사직', '정년퇴직', '계약만료', '기타'],
        validation: { required: true }
      }
    ]
  },

  '임금명세서': {
    documentType: '임금명세서',
    description: '급여 내역을 상세히 기록한 서류',
    requiredFields: ['companyInfo.name', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.salary'],
    optionalFields: ['companyInfo.businessNumber', 'employeeInfo.department', 'employeeInfo.position'],
    additionalFields: [
      {
        key: 'paymentMonth',
        label: '지급연월',
        type: 'text',
        placeholder: '2024년 12월',
        validation: { required: true }
      },
      {
        key: 'allowances',
        label: '수당',
        type: 'number',
        placeholder: '200000',
        validation: { required: false }
      },
      {
        key: 'deductions',
        label: '공제액',
        type: 'number',
        placeholder: '150000',
        validation: { required: false }
      }
    ]
  },

  '휴가신청서': {
    documentType: '휴가신청서',
    description: '연차 또는 기타 휴가 신청을 위한 서류',
    requiredFields: ['companyInfo.name', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.department'],
    optionalFields: ['employeeInfo.position'],
    additionalFields: [
      {
        key: 'vacationType',
        label: '휴가종류',
        type: 'select',
        options: ['연차휴가', '반차', '병가', '경조사휴가', '기타'],
        validation: { required: true }
      },
      {
        key: 'startDate',
        label: '휴가시작일',
        type: 'date',
        validation: { required: true }
      },
      {
        key: 'endDate',
        label: '휴가종료일',
        type: 'date',
        validation: { required: true }
      },
      {
        key: 'reason',
        label: '휴가사유',
        type: 'textarea',
        placeholder: '휴가 사유를 간략히 기술해주세요',
        validation: { required: true }
      },
      {
        key: 'substitute',
        label: '업무대행자',
        type: 'text',
        placeholder: '휴가 중 업무를 대행할 직원명',
        validation: { required: false }
      }
    ]
  },

  '연장근로신청서': {
    documentType: '연장근로신청서',
    description: '시간외 근무 신청을 위한 서류',
    requiredFields: ['companyInfo.name', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.department'],
    optionalFields: ['employeeInfo.position'],
    additionalFields: [
      {
        key: 'overtimeDate',
        label: '연장근로일',
        type: 'date',
        validation: { required: true }
      },
      {
        key: 'startTime',
        label: '시작시간',
        type: 'text',
        placeholder: '18:00',
        validation: { required: true }
      },
      {
        key: 'endTime',
        label: '종료시간',
        type: 'text',
        placeholder: '22:00',
        validation: { required: true }
      },
      {
        key: 'overtimeReason',
        label: '연장근로 사유',
        type: 'textarea',
        placeholder: '연장근로가 필요한 사유를 기술해주세요',
        validation: { required: true }
      }
    ]
  },

  '출장신청서': {
    documentType: '출장신청서',
    description: '업무상 출장 신청을 위한 서류',
    requiredFields: ['companyInfo.name', 'employeeInfo.name', 'employeeInfo.employeeId', 'employeeInfo.department'],
    optionalFields: ['employeeInfo.position'],
    additionalFields: [
      {
        key: 'destination',
        label: '출장지',
        type: 'text',
        placeholder: '서울시 강남구',
        validation: { required: true }
      },
      {
        key: 'businessTripStartDate',
        label: '출장시작일',
        type: 'date',
        validation: { required: true }
      },
      {
        key: 'businessTripEndDate',
        label: '출장종료일',
        type: 'date',
        validation: { required: true }
      },
      {
        key: 'purpose',
        label: '출장목적',
        type: 'textarea',
        placeholder: '출장의 목적과 업무내용을 기술해주세요',
        validation: { required: true }
      },
      {
        key: 'transportation',
        label: '교통수단',
        type: 'select',
        options: ['자가용', '대중교통', '항공', '기타'],
        validation: { required: true }
      }
    ]
  }
};

// 기본 공통 필드 (모든 서류에 공통으로 사용)
export const COMMON_FIELDS = {
  companyInfo: {
    name: { label: '회사명', required: true },
    businessNumber: { label: '사업자등록번호', required: false },
    address: { label: '회사 주소', required: false },
    ceo: { label: '대표자', required: true },
    phone: { label: '회사 전화번호', required: false },
    email: { label: '회사 이메일', required: false }
  },
  employeeInfo: {
    name: { label: '성명', required: true },
    employeeId: { label: '사번', required: true },
    department: { label: '부서', required: false },
    position: { label: '직급', required: false },
    hireDate: { label: '입사일', required: false },
    salary: { label: '기본급', required: false },
    birthDate: { label: '생년월일', required: false },
    phone: { label: '전화번호', required: false },
    email: { label: '이메일', required: false },
    address: { label: '주소', required: false },
    employmentType: { label: '고용형태', required: false }
  }
};

// 서류 요구사항 가져오기
export function getDocumentRequirement(documentType: string): DocumentRequirement | null {
  return DOCUMENT_REQUIREMENTS[documentType] || null;
}

// 필드 경로를 기반으로 필수 여부 확인
export function isFieldRequired(documentType: string, fieldPath: string): boolean {
  const requirement = getDocumentRequirement(documentType);
  if (!requirement) return false;
  
  return requirement.requiredFields.includes(fieldPath);
}

// 서류별 추가 필드 가져오기
export function getAdditionalFields(documentType: string): AdditionalField[] {
  const requirement = getDocumentRequirement(documentType);
  return requirement?.additionalFields || [];
}