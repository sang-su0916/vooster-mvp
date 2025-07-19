export interface CompanyInfo {
  name: string;
  businessNumber: string;
  address: string;
  ceo: string;
  phone: string;
  email?: string;
}

export interface EmployeeInfo {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  employmentType: 'permanent' | 'contract' | 'part-time';
}

export interface DocumentRequest {
  companyInfo: CompanyInfo;
  employeeInfo: EmployeeInfo;
  documentType: string; // 자유 텍스트로 서류 요청
}

export interface GeneratedDocument {
  id: string;
  companyInfo: CompanyInfo;
  employeeInfo: EmployeeInfo;
  documentType: string;
  content: string;
  generatedAt: Date;
}

// 기존 타입들 (하위 호환성)
export type DocumentType = 'employment_contract' | 'payroll' | 'employee_roster';

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  email: string;
  phone: string;
}