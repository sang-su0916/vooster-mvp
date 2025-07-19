// PDF 생성 및 인쇄 최적화 유틸리티

export interface PDFOptions {
  title: string;
  content: string;
  format?: 'A4' | 'Letter';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  orientation?: 'portrait' | 'landscape';
}

export class PDFGenerator {
  private static readonly DEFAULT_OPTIONS: Partial<PDFOptions> = {
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    },
    orientation: 'portrait'
  };

  // HTML을 PDF로 변환하기 위한 최적화된 스타일
  private static getPrintStyles(): string {
    return `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 20mm;
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: white;
          }
          
          .document-container {
            max-width: none;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 15pt;
            page-break-inside: avoid;
          }
          
          th, td {
            border: 1pt solid #000;
            padding: 8pt;
            text-align: left;
            vertical-align: top;
          }
          
          th {
            background-color: #f5f5f5 !important;
            font-weight: bold;
          }
          
          h1, h2, h3 {
            page-break-after: avoid;
            margin-top: 20pt;
            margin-bottom: 10pt;
          }
          
          h1 {
            font-size: 18pt;
            text-align: center;
            font-weight: bold;
          }
          
          h2 {
            font-size: 14pt;
            font-weight: bold;
          }
          
          h3 {
            font-size: 12pt;
            font-weight: bold;
          }
          
          p {
            margin: 6pt 0;
            orphans: 3;
            widows: 3;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .no-break {
            page-break-inside: avoid;
          }
          
          .signature-section {
            margin-top: 40pt;
            page-break-inside: avoid;
          }
          
          .date-section {
            text-align: center;
            margin-top: 20pt;
            font-weight: bold;
          }
          
          .company-info {
            margin-bottom: 20pt;
          }
          
          .employee-info {
            margin-bottom: 20pt;
          }
          
          @page {
            size: A4;
            margin: 20mm;
          }
          
          /* 웹 전용 요소 숨기기 */
          .no-print {
            display: none !important;
          }
        }
        
        @media screen {
          .print-preview {
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            font-size: 12pt;
            line-height: 1.5;
          }
        }
      </style>
    `;
  }

  // PDF 미리보기 창 열기
  static openPrintPreview(options: PDFOptions): void {
    const { title, content, ...pdfOptions } = { ...this.DEFAULT_OPTIONS, ...options };
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      throw new Error('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    }

    const htmlContent = this.generatePrintHTML(title, content);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // 문서 로드 완료 후 인쇄 대화상자 자동 실행
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    };
  }

  // 브라우저 다운로드로 HTML 파일 저장
  static downloadAsHTML(options: PDFOptions): void {
    const { title, content } = options;
    const htmlContent = this.generatePrintHTML(title, content);
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.sanitizeFilename(title)}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // PDF 전용 HTML 생성
  private static generatePrintHTML(title: string, content: string): string {
    const currentDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          ${this.getPrintStyles()}
        </head>
        <body>
          <div class="document-container">
            ${content}
          </div>
          
          <script>
            // 인쇄 후 창 닫기
            window.onafterprint = function() {
              setTimeout(function() {
                window.close();
              }, 1000);
            };
            
            // ESC 키로 창 닫기
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                window.close();
              }
            });
          </script>
        </body>
      </html>
    `;
  }

  // 브라우저 네이티브 인쇄 (현재 페이지)
  static printCurrentPage(): void {
    window.print();
  }

  // 파일명 정리 (특수문자 제거)
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '') // 특수문자 제거
      .replace(/\s+/g, '_') // 공백을 언더스코어로
      .slice(0, 100); // 길이 제한
  }

  // 웹 기반 PDF 변환 (선택적 기능)
  static async generatePDFBlob(options: PDFOptions): Promise<Blob> {
    // 이 기능은 현재 라이브러리 의존성을 피하기 위해 비활성화됨
    // 필요시 jsPDF와 html2canvas를 설치하고 구현 가능
    throw new Error('PDF 생성 기능은 현재 비활성화되어 있습니다. HTML 다운로드를 사용해주세요.');
  }

  // 모바일 환경에서의 최적화된 인쇄
  static printForMobile(options: PDFOptions): void {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일에서는 새 탭에서 열어서 브라우저 기본 기능 활용
      const printUrl = this.createPrintDataURL(options);
      window.open(printUrl, '_blank');
    } else {
      this.openPrintPreview(options);
    }
  }

  // 데이터 URL 생성 (모바일 최적화)
  private static createPrintDataURL(options: PDFOptions): string {
    const htmlContent = this.generatePrintHTML(options.title, options.content);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  // QR 코드나 바코드가 포함된 문서용 특별 처리
  static printWithQR(options: PDFOptions & { qrData?: string }): void {
    if (options.qrData) {
      // QR 코드 생성이 필요한 경우의 특별 처리
      // qrcode 라이브러리 사용 시
      console.log('QR 코드 데이터:', options.qrData);
    }
    
    this.openPrintPreview(options);
  }
}

// 인쇄 상태 모니터링
export class PrintMonitor {
  private static listeners: Array<(status: 'started' | 'completed' | 'cancelled') => void> = [];

  static addListener(callback: (status: 'started' | 'completed' | 'cancelled') => void): void {
    this.listeners.push(callback);
  }

  static removeListener(callback: (status: 'started' | 'completed' | 'cancelled') => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private static notifyListeners(status: 'started' | 'completed' | 'cancelled'): void {
    this.listeners.forEach(callback => callback(status));
  }

  // 인쇄 이벤트 리스너 설정
  static setupPrintListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeprint', () => {
        this.notifyListeners('started');
      });

      window.addEventListener('afterprint', () => {
        this.notifyListeners('completed');
      });
    }
  }
}

// 사용 예시:
// PDFGenerator.openPrintPreview({
//   title: '근로계약서',
//   content: htmlContent
// });

// PDFGenerator.downloadAsHTML({
//   title: '재직증명서',
//   content: htmlContent
// });