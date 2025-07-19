import { Employee } from '@/types/document';

// DocumentTemplate 인터페이스를 여기서 정의
interface DocumentTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  fields: string[];
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: '홍길동',
    employeeId: 'EMP001',
    department: '개발팀',
    position: '주임',
    hireDate: '2023-01-15',
    salary: 3500000,
    email: 'hong@company.com',
    phone: '010-1234-5678',
  },
  {
    id: '2',
    name: '김영희',
    employeeId: 'EMP002',
    department: '인사팀',
    position: '대리',
    hireDate: '2022-03-20',
    salary: 4000000,
    email: 'kim@company.com',
    phone: '010-2345-6789',
  },
  {
    id: '3',
    name: '박철수',
    employeeId: 'EMP003',
    department: '마케팅팀',
    position: '과장',
    hireDate: '2021-08-10',
    salary: 4500000,
    email: 'park@company.com',
    phone: '010-3456-7890',
  },
  {
    id: '4',
    name: '이미영',
    employeeId: 'EMP004',
    department: '개발팀',
    position: '차장',
    hireDate: '2020-05-01',
    salary: 5500000,
    email: 'lee@company.com',
    phone: '010-4567-8901',
  },
  {
    id: '5',
    name: '정상수',
    employeeId: 'EMP005',
    department: '기획팀',
    position: '부장',
    hireDate: '2019-02-15',
    salary: 6500000,
    email: 'jung@company.com',
    phone: '010-5678-9012',
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: '1',
    type: 'employment_contract',
    name: '근로계약서',
    description: '표준 근로계약서 양식',
    fields: ['name', 'employeeId', 'department', 'position', 'hireDate', 'salary'],
  },
  {
    id: '2',
    type: 'payroll',
    name: '임금대장',
    description: '월간 임금대장 양식',
    fields: ['name', 'employeeId', 'department', 'position', 'salary'],
  },
  {
    id: '3',
    type: 'employee_roster',
    name: '직원명부',
    description: '부서별 직원명부 양식',
    fields: ['name', 'employeeId', 'department', 'position', 'hireDate', 'email', 'phone'],
  },
];

export const COMPANY_INFO = {
  name: '엘비즈파트너스',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '02-1234-5678',
  ceo: '김대표',
  businessNumber: '123-45-67890',
};