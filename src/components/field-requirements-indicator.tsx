'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import React from 'react';
import { getDocumentRequirement, COMMON_FIELDS } from '@/lib/document-requirements';

interface FieldRequirementsIndicatorProps {
  documentType: string;
}

export function FieldRequirementsIndicator({ documentType }: FieldRequirementsIndicatorProps) {
  const requirement = getDocumentRequirement(documentType);

  if (!requirement) {
    return null;
  }

  const getFieldDisplayName = (fieldPath: string): string => {
    const [section, field] = fieldPath.split('.');
    
    if (section === 'companyInfo' && field in COMMON_FIELDS.companyInfo) {
      return COMMON_FIELDS.companyInfo[field as keyof typeof COMMON_FIELDS.companyInfo].label;
    }
    
    if (section === 'employeeInfo' && field in COMMON_FIELDS.employeeInfo) {
      return COMMON_FIELDS.employeeInfo[field as keyof typeof COMMON_FIELDS.employeeInfo].label;
    }
    
    return fieldPath;
  };

  return (
    <Card className="mb-4 border-blue-100 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Info className="w-4 h-4 text-blue-600" />
          <span>{documentType} 입력 가이드</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {requirement.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requirement.requiredFields.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">필수 입력 항목</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {requirement.requiredFields.map((field) => (
                <Badge key={field} variant="destructive" className="text-xs">
                  {getFieldDisplayName(field)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {requirement.optionalFields.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">선택 입력 항목</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {requirement.optionalFields.map((field) => (
                <Badge key={field} variant="secondary" className="text-xs">
                  {getFieldDisplayName(field)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {requirement.additionalFields && requirement.additionalFields.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">추가 필수 정보</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {requirement.additionalFields.map((field) => (
                <Badge 
                  key={field.key} 
                  variant={field.validation?.required ? "destructive" : "secondary"} 
                  className="text-xs"
                >
                  {field.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}