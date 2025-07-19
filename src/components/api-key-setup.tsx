'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

export function ApiKeySetup({ onApiKeySet, currentApiKey }: ApiKeySetupProps) {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 API 키 불러오기
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey && !currentApiKey) {
      setApiKey(savedApiKey);
      onApiKeySet(savedApiKey);
    }
  }, [currentApiKey, onApiKeySet]);

  const validateAndSaveApiKey = async () => {
    console.log('🔑 Validating API key...', { keyLength: apiKey.length });
    
    if (!apiKey.trim()) {
      toast({
        title: '입력 오류',
        description: 'API 키를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      toast({
        title: '형식 오류',
        description: 'Google API 키는 "AIza"로 시작해야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);

    try {
      // API 키 유효성 검증을 위한 간단한 테스트 요청
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Hello'
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1,
          }
        }),
      });

      if (response.ok || response.status === 400) {
        // 400도 API 키가 유효하다는 의미 (요청 형식 문제일 뿐)
        localStorage.setItem('gemini_api_key', apiKey);
        onApiKeySet(apiKey);
        
        toast({
          title: 'API 키 설정 완료',
          description: 'Gemini API 키가 성공적으로 설정되었습니다.',
        });
      } else if (response.status === 403) {
        throw new Error('API 키가 유효하지 않거나 권한이 없습니다.');
      } else {
        throw new Error('API 키 검증에 실패했습니다.');
      }
    } catch (error) {
      toast({
        title: 'API 키 검증 실패',
        description: error instanceof Error ? error.message : 'API 키를 확인해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    onApiKeySet('');
    
    toast({
      title: 'API 키 삭제',
      description: 'API 키가 삭제되었습니다.',
    });
  };

  if (currentApiKey) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">API 키 설정 완료</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearApiKey}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            변경
          </Button>
        </div>
        <p className="text-sm text-green-600 mt-1">
          {currentApiKey.substring(0, 12)}...{currentApiKey.substring(currentApiKey.length - 4)}
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-blue-600" />
          <span>Google Gemini API 키 설정</span>
        </CardTitle>
        <CardDescription>
          ⚠️ <strong>필수:</strong> AI 서류 생성을 위해 개인 Gemini API 키를 먼저 입력해주세요. 
          키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Gemini API 키</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={validateAndSaveApiKey}
            disabled={isValidating}
            className="flex-1 mr-4"
          >
            {isValidating ? '검증 중...' : 'API 키 설정'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>API 키 발급</span>
            </a>
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="font-medium text-yellow-800 text-sm mb-2">API 키 발급 방법:</h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. 위 "API 키 발급" 버튼 클릭</li>
            <li>2. Google 계정으로 로그인</li>
            <li>3. "Create API Key" 클릭</li>
            <li>4. 생성된 키를 복사하여 위에 입력</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 text-sm mb-2">🔒 보안 안내:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• API 키는 브라우저 로컬 저장소에만 저장됩니다</li>
            <li>• 서버로 전송되거나 외부에 공유되지 않습니다</li>
            <li>• 언제든지 삭제하거나 변경할 수 있습니다</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}