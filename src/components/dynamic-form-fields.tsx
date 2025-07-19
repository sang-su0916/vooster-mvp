'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { getAdditionalFields, AdditionalField } from '@/lib/document-requirements';

interface DynamicFormFieldsProps {
  documentType: string;
  additionalData: Record<string, any>;
  onAdditionalDataChange: (field: string, value: any) => void;
}

export function DynamicFormFields({ 
  documentType, 
  additionalData, 
  onAdditionalDataChange 
}: DynamicFormFieldsProps) {
  const additionalFields = getAdditionalFields(documentType);

  if (additionalFields.length === 0) {
    return null;
  }

  const renderField = (field: AdditionalField) => {
    const value = additionalData[field.key] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.key}
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onAdditionalDataChange(field.key, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            id={field.key}
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onAdditionalDataChange(field.key, parseInt(e.target.value) || 0)}
          />
        );

      case 'date':
        return (
          <Input
            id={field.key}
            type="date"
            value={value}
            onChange={(e) => onAdditionalDataChange(field.key, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select onValueChange={(value) => onAdditionalDataChange(field.key, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`${field.label}을(를) 선택하세요`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            id={field.key}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onAdditionalDataChange(field.key, e.target.value)}
            rows={3}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="text-sm font-medium text-gray-700">
        📋 {documentType} 추가 필수 정보
      </div>
      
      {additionalFields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>
            {field.label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}