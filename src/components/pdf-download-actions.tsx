'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer, FileText, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PDFGenerator, PrintMonitor } from '@/lib/pdf-generator';
import { GeneratedDocument } from '@/types/document';

interface PDFDownloadActionsProps {
  document: GeneratedDocument;
}

export function PDFDownloadActions({ document }: PDFDownloadActionsProps) {
  const { toast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);

  React.useEffect(() => {
    PrintMonitor.setupPrintListeners();
    
    const handlePrintStatus = (status: 'started' | 'completed' | 'cancelled') => {
      switch (status) {
        case 'started':
          setIsPrinting(true);
          toast({
            title: '인쇄 시작',
            description: '문서 인쇄를 시작합니다.',
          });
          break;
        case 'completed':
          setIsPrinting(false);
          toast({
            title: '인쇄 완료',
            description: '문서 인쇄가 완료되었습니다.',
          });
          break;
        case 'cancelled':
          setIsPrinting(false);
          toast({
            title: '인쇄 취소',
            description: '인쇄가 취소되었습니다.',
            variant: 'destructive',
          });
          break;
      }
    };

    PrintMonitor.addListener(handlePrintStatus);

    return () => {
      PrintMonitor.removeListener(handlePrintStatus);
    };
  }, [toast]);

  const handlePrintPreview = () => {
    try {
      PDFGenerator.openPrintPreview({
        title: document.documentType,
        content: document.content
      });

      toast({
        title: '미리보기 열림',
        description: '새 창에서 문서를 확인하고 인쇄하실 수 있습니다.',
      });
    } catch (error) {
      toast({
        title: '미리보기 실패',
        description: error instanceof Error ? error.message : '미리보기를 여는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadHTML = () => {
    try {
      PDFGenerator.downloadAsHTML({
        title: document.documentType,
        content: document.content
      });

      toast({
        title: 'HTML 다운로드 완료',
        description: 'HTML 파일이 다운로드되었습니다. 브라우저에서 열어 인쇄하실 수 있습니다.',
      });
    } catch (error) {
      toast({
        title: '다운로드 실패',
        description: error instanceof Error ? error.message : '다운로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleMobilePrint = () => {
    try {
      PDFGenerator.printForMobile({
        title: document.documentType,
        content: document.content
      });

      toast({
        title: '모바일 인쇄',
        description: '모바일 환경에 최적화된 인쇄 모드입니다.',
      });
    } catch (error) {
      toast({
        title: '모바일 인쇄 실패',
        description: error instanceof Error ? error.message : '모바일 인쇄 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleCurrentPagePrint = () => {
    try {
      PDFGenerator.printCurrentPage();
    } catch (error) {
      toast({
        title: '인쇄 실패',
        description: '현재 페이지 인쇄 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const isMobile = typeof window !== 'undefined' && 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="text-sm font-medium text-gray-700 mb-3">
        📄 문서 출력 및 다운로드
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* 인쇄 미리보기 (데스크톱 최적화) */}
        <Button 
          onClick={handlePrintPreview} 
          disabled={isPrinting}
          variant="default"
          size="sm"
          className="w-full"
        >
          <Printer className="w-4 h-4 mr-2" />
          {isPrinting ? '인쇄 중...' : '미리보기 및 인쇄'}
        </Button>

        {/* HTML 다운로드 */}
        <Button 
          onClick={handleDownloadHTML} 
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          HTML 다운로드
        </Button>

        {/* 모바일 인쇄 (모바일 환경에서만 표시) */}
        {isMobile && (
          <Button 
            onClick={handleMobilePrint} 
            variant="secondary"
            size="sm"
            className="w-full sm:col-span-2"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            모바일 인쇄
          </Button>
        )}

        {/* 현재 페이지 인쇄 (빠른 인쇄) */}
        <Button 
          onClick={handleCurrentPagePrint} 
          variant="ghost"
          size="sm"
          className="w-full sm:col-span-2 text-xs"
        >
          <FileText className="w-3 h-3 mr-2" />
          현재 페이지 바로 인쇄 (Ctrl+P)
        </Button>
      </div>

      {/* 인쇄 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
        <div className="font-medium text-blue-800 mb-1">💡 인쇄 팁:</div>
        <ul className="text-blue-700 space-y-1">
          <li>• <strong>미리보기 및 인쇄</strong>: 새 창에서 최적화된 인쇄 형식으로 확인</li>
          <li>• <strong>HTML 다운로드</strong>: 오프라인에서 인쇄하거나 보관용</li>
          <li>• 인쇄 시 브라우저 설정에서 '배경 그래픽' 옵션을 체크하세요</li>
          <li>• A4 용지, 세로 방향으로 인쇄하는 것을 권장합니다</li>
        </ul>
      </div>

      {/* 문서 정보 */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs">
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <div>
            <span className="font-medium">문서:</span> {document.documentType}
          </div>
          <div>
            <span className="font-medium">생성:</span> {document.generatedAt.toLocaleString('ko-KR')}
          </div>
        </div>
      </div>
    </div>
  );
}