# Technical Requirements Document (TRD)

## 1. Executive Technical Summary
- **프로젝트 개요**  
  사내 직원이 이름·사번만 입력하면 근로계약서, 임금대장, 직원명부 등 필수 인사·노무 서류를 즉시 발급·다운로드·인쇄할 수 있는 웹 기반 시스템. Next.js 기반 프론트엔드와 NestJS 기반 백엔드를 AWS ECS 위에 배포하고, PostgreSQL·S3를 사용해 데이터와 PDF를 관리합니다.
- **핵심 기술 스택**  
  · 프론트엔드: Next.js (React)  
  · 백엔드: NestJS (Node.js)  
  · 데이터베이스: PostgreSQL (RDS)  
  · 파일 스토리지: AWS S3  
  · PDF 생성: openhtmltopdf  
  · 인증·인가: 사내 AD 연동 SSO (OAuth2, OpenID Connect)  
  · 배포·인프라: AWS ECS, Terraform, GitHub Actions
- **주요 기술 목표**  
  · 95퍼센타일 응답 시간 <2초 (100건 동시)  
  · 시스템 오류율 <0.5%  
  · 무중단 배포·오토스케일링  
  · 개인정보 암호화(AES-256 at rest), TLS 1.3
- **핵심 가정 사항**  
  · 사내 AD/SSO 통합 가능  
  · 템플릿 및 인사 데이터 초기 적재 완료  
  · AWS 계정 및 네트워크(VPC, Subnet) 기본 구성 완료  

---

## 2. Tech Stack

| Category             | Technology / Library      | Reasoning (선택 이유)                                                 |
| -------------------- | ------------------------- | --------------------------------------------------------------------- |
| Frontend Framework   | Next.js                   | React 기반 SSR/SSG 지원, SEO 및 초기 렌더링 최적화                     |
| Styling / UI Toolkit | Tailwind CSS              | 유연한 디자인 시스템, 빠른 스타일링                                   |
| State Management     | React Query               | 서버 상태 캐싱 및 데이터 페칭 최적화                                   |
| Backend Framework    | NestJS                     | 모듈화·유연한 구조, 데코레이터 기반, 확장성 우수                       |
| Language             | TypeScript                | 정적 타입으로 가독성·안정성 확보                                      |
| API Design           | REST (OpenAPI)            | 표준화된 인터페이스, Swagger 문서 자동 생성                           |
| Database             | PostgreSQL (RDS)          | ACID 보장, JSONB 지원, 확장성·신뢰성                                   |
| ORM                  | TypeORM                   | NestJS 공식 지원, Entity 기반 코드 조직화                              |
| File Storage         | AWS S3                    | 내구성·확장성 우수, 비용 효율적                                       |
| PDF Generation       | openhtmltopdf             | HTML/CSS 템플릿에서 정확한 PDF 출력                                    |
| Authentication       | OAuth2 / OpenID Connect   | 사내 AD SSO 연동, 권한 관리 편리                                       |
| Electronic Signature | eSign SaaS API            | 검증된 전자서명 제공, 개발 부담 최소화                                 |
| CI/CD                | GitHub Actions            | Git 연동 파이프라인, 코드 퀄리티·배포 자동화                           |
| Infrastructure IaC   | Terraform                 | 인프라 코드화, 재현 가능 · 버전 관리                                   |
| Container Orchestration | AWS ECS                 | 관리형 컨테이너 서비스, 오토스케일링 지원                              |
| Monitoring / Logging | Prometheus & Grafana, ELK | 실시간 모니터링·로그 검색·알람 체계 구축                              |
| Notification         | Amazon SES / Slack API    | 이메일·메신저 알림 자동화                                             |

---

## 3. System Architecture Design

### Top-Level Building Blocks
- 프론트엔드 (Next.js)  
  · SSR/CSR 혼합 렌더링, React Query를 통한 데이터 페칭  
  · 모바일·PC 반응형 UI
- 백엔드 API (NestJS)  
  · REST API 컨트롤러·서비스·레포지토리 구조  
  · 인증·인가 모듈, 문서 생성·관리 모듈, 감사 로그 모듈
- 데이터 저장소  
  · RDS PostgreSQL: 인사 데이터·템플릿 버전 관리  
  · S3 버킷: 생성된 PDF 파일 영구 보관
- 인증·인가  
  · OAuth2/OpenID Connect 기반 AD SSO 연동  
  · 권한(Role-Based Access Control)
- 외부 서비스  
  · eSign SaaS: 전자서명 처리  
  · 메신저·이메일 API: 알림 전송
- 인프라 및 운영  
  · AWS ECS (Fargate) 컨테이너 배포  
  · Terraform IaC, GitHub Actions CI/CD  
  · Prometheus·Grafana 모니터링, ELK 로그스택

### Top-Level Component Interaction Diagram
```mermaid
graph TD
    A[Frontend (Next.js)] -->|REST API 호출| B[Backend (NestJS)]
    B -->|SQL Query| C[(PostgreSQL)]
    B -->|파일 업로드/다운로드| D[(S3)]
    B -->|전자서명 요청| E[eSign SaaS]
    B -->|SSO 인증| F[사내 AD]
    B -->|로그 수집| G[ELK Stack]
    H[Monitoring] --> B
```

- 직원·관리자는 Next.js UI에서 인증 후 백엔드 API 호출  
- 백엔드는 PostgreSQL에서 인사정보 조회·템플릿 매핑 후 openhtmltopdf로 PDF 생성  
- 생성된 PDF를 S3에 저장·버전 관리  
- 전자서명 요청은 eSign SaaS API로 연동  
- 발급·열람·변경 이벤트는 ELK 스택으로 전송, Prometheus/Grafana에서 지표 수집

### Code Organization & Convention

**Domain-Driven Organization Strategy**  
- Domain Separation  
  · User (인증·권한)  
  · Document (템플릿·발급)  
  · Audit (감사용 로그)  
  · Admin (통계·템플릿 관리)  
- Layer-Based Architecture  
  · Presentation Layer (Controller)  
  · Business Logic Layer (Service)  
  · Data Access Layer (Repository / Entity)  
  · Infrastructure Layer (External API, S3, eSign, DB Connection)  
- Feature-Based Modules  
  · 각 도메인은 독립 NestJS 모듈  
- Shared Components  
  · 공통 유틸리티, DTO, 인터셉터, 예외 필터 등

**Universal File & Folder Structure**
```
/
├── src
│   ├── main.ts
│   ├── app.module.ts
│   ├── common
│   │   ├── filters
│   │   ├── interceptors
│   │   └── dto
│   ├── config
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── user
│   │   ├── document
│   │   ├── audit
│   │   └── admin
│   └── infrastructure
│       ├── db
│       ├── s3
│       └── esign
├── templates
│   └── *.html
├── public
│   └── assets
└── terraform
    ├── main.tf
    └── variables.tf
```

### Data Flow & Communication Patterns
- **Client-Server Communication**: Next.js → NestJS REST API, JWT 또는 OAuth2 토큰 사용  
- **Database Interaction**: TypeORM 기반 Repository, 커넥션 풀링, 인덱싱  
- **External Service Integration**: Axios를 통한 eSign SaaS, SES/Slack API 호출  
- **Real-time Communication**: Webhook 수신(전자서명 완료 콜백)  
- **Data Synchronization**: S3 업로드 후 DB에 메타데이터 저장, 템플릿 버전 관리

---

## 4. Performance & Optimization Strategy
- API 응답 캐싱: Redis 적용 고려 (문서 미변경 시)  
- 데이터베이스 인덱스·쿼리 튜닝: 자주 조회되는 컬럼 인덱스 추가  
- 비동기 작업 처리: PDF 생성·전자서명 처리는 메시지 큐(AWS SQS) 활용  
- 오토스케일링: AWS ECS Fargate CPU/메모리 기반 오토스케일 정책  

---

## 5. Implementation Roadmap & Milestones

### Phase 1: Foundation (MVP 구현, 3개월)
- Core Infrastructure: Terraform으로 VPC, ECS 클러스터, RDS, S3 배포  
- Essential Features:  
  · SSO 로그인/권한 관리  
  · 템플릿 3종(근로계약서·임금대장·직원명부) PDF 생성·다운로드  
  · React Query 기반 미리보기 (3초 이내)  
- Basic Security: TLS 설정, DB 암호화  
- Development Setup: GitHub Actions CI/CD 파이프라인  
- Timeline: 3개월

### Phase 2: Feature Enhancement (2개월)
- Advanced Features: 전자서명 연동, 관리자 대시보드(발급 통계, 오류 알림)  
- Performance Optimization: 메시지 큐 기반 비동기 처리  
- Enhanced Security: OWASP 점검, 정기 침투 테스트  
- Monitoring Implementation: Prometheus·Grafana, ELK 알림  
- Timeline: 2개월

### Phase 3: Scaling & Optimization (2개월)
- Scalability Implementation: Redis 캐싱, ECS 클러스터 Autoscaling  
- Advanced Integrations: 다국어(영어), AI 문서 추천 PoC  
- Enterprise Features: 조직도 기반 권한 설정, 템플릿 롤백  
- Compliance & Auditing: 감사 로그 1년 보존 정책 자동화  
- Timeline: 2개월

---

## 6. Risk Assessment & Mitigation Strategies

### Technical Risk Analysis
- Technology Risks  
  · NestJS·Next.js 신규 도입 학습 곡선 → 초기 교육 세션 진행  
- Performance Risks  
  · 대량 PDF 생성 부하 → 비동기 큐 처리, 오토스케일링  
- Security Risks  
  · 개인정보 유출 → AES-256 at rest, 권한 최소화  
- Integration Risks  
  · eSign SaaS API 변경 → 계약 시 버전 고정, 테스트 자동화  
- Mitigation Strategies  
  · 기술 워크숍, 부하 테스트, 정기 보안 점검, 회귀 테스트 자동화

### Project Delivery Risks
- Timeline Risks  
  · 주요 기능 지연 → 명확한 마일스톤·데일리 스탠드업  
- Resource Risks  
  · 백엔드·프론트 인력 부족 → 크로스 트레이닝, 외부 컨설팅 가능성 검토  
- Quality Risks  
  · 테스트 커버리지 부족 → Jest·Supertest 기반 단위·통합 테스트  
- Deployment Risks  
  · 프로덕션 환경 이슈 → 단계별 Canary 배포, 롤백 자동화  
- Contingency Plans  
  · 외부 전문가 자문, 기능 우선순위 재조정, 추가 리소스 투입  

---

**끝**