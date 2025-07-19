import { Employee, DocumentType } from '@/types/document';
import { MOCK_EMPLOYEES, DOCUMENT_TEMPLATES, COMPANY_INFO } from './mock-data';

// 기존 인터페이스 (하위 호환성)
interface LegacyDocumentRequest {
  name: string;
  employeeId: string;
  documentType: DocumentType;
}

interface LegacyGeneratedDocument {
  id: string;
  employee: Employee;
  template: any;
  generatedAt: Date;
  data: Record<string, any>;
}

export class DocumentService {
  static async findEmployee(name: string, employeeId: string): Promise<Employee | null> {
    // 실제 API 호출을 시뮬레이트하는 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employee = MOCK_EMPLOYEES.find(emp => 
      emp.name === name && emp.employeeId === employeeId
    );
    
    return employee || null;
  }

  static async generateDocument(request: LegacyDocumentRequest): Promise<LegacyGeneratedDocument> {
    const employee = await this.findEmployee(request.name, request.employeeId);
    
    if (!employee) {
      throw new Error('직원 정보를 찾을 수 없습니다.');
    }

    const template = DOCUMENT_TEMPLATES.find(t => t.type === request.documentType);
    
    if (!template) {
      throw new Error('서류 템플릿을 찾을 수 없습니다.');
    }

    // 문서 데이터 생성
    const documentData = this.generateDocumentData(employee, request.documentType);

    return {
      id: `doc_${Date.now()}`,
      employee,
      template,
      generatedAt: new Date(),
      data: documentData,
    };
  }

  private static generateDocumentData(employee: Employee, documentType: DocumentType): Record<string, any> {
    const baseData = {
      companyName: COMPANY_INFO.name,
      companyAddress: COMPANY_INFO.address,
      companyPhone: COMPANY_INFO.phone,
      companyCeo: COMPANY_INFO.ceo,
      companyBusinessNumber: COMPANY_INFO.businessNumber,
      employeeName: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate,
      generatedDate: new Date().toLocaleDateString('ko-KR'),
    };

    switch (documentType) {
      case 'employment_contract':
        return {
          ...baseData,
          salary: employee.salary.toLocaleString('ko-KR'),
          contractType: '정규직',
          workHours: '주 40시간',
          workDays: '월~금요일',
        };

      case 'payroll':
        return {
          ...baseData,
          salary: employee.salary.toLocaleString('ko-KR'),
          basicSalary: employee.salary.toLocaleString('ko-KR'),
          allowances: '200,000',
          deductions: '150,000',
          netSalary: (employee.salary + 200000 - 150000).toLocaleString('ko-KR'),
          paymentDate: new Date().toLocaleDateString('ko-KR'),
        };

      case 'employee_roster':
        return {
          ...baseData,
          email: employee.email,
          phone: employee.phone,
          status: '재직',
        };

      default:
        return baseData;
    }
  }

  static getDocumentTypeName(type: DocumentType): string {
    const typeNames = {
      employment_contract: '근로계약서',
      payroll: '임금대장',
      employee_roster: '직원명부',
    };
    return typeNames[type];
  }
}