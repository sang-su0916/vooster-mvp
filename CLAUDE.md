# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js project created with EasyNext template that will be transformed into **Vooster** - a web-based automated document issuance system for HR departments. The system enables employees to generate essential HR documents (employment contracts, payroll ledgers, employee rosters) by entering their name and employee ID.

<vooster-docs>
- @vooster-docs/prd.md - Product Requirements Document
- @vooster-docs/architecture.md - System Architecture & Tech Stack
- @vooster-docs/guideline.md - Development Guidelines & Standards
- @vooster-docs/step-by-step.md - Three-Phase Development Process
- @vooster-docs/clean-code.md - Clean Code Principles & Standards
</vooster-docs>

## Core Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### EasyNext CLI Commands
```bash
easynext lang ko           # Switch to Korean language
easynext supabase          # Setup Supabase integration
easynext auth              # Setup Next-Auth
easynext auth idpw         # Setup ID/Password auth
easynext auth kakao        # Setup Kakao login
easynext gtag              # Setup Google Analytics
easynext clarity           # Setup Microsoft Clarity
easynext channelio         # Setup ChannelIO
easynext sentry            # Setup Sentry
easynext adsense           # Setup Google Adsense
```

## Technology Stack & Architecture

### Current Frontend Stack
- **Framework**: Next.js 15.1.0 with App Router, React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query), Zustand
- **Forms**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: es-toolkit, date-fns, ts-pattern
- **HTTP Client**: Axios

### Planned Vooster Architecture (Reference)
- **Backend**: NestJS with TypeScript, PostgreSQL (AWS RDS)
- **File Storage**: AWS S3 for PDF storage
- **PDF Generation**: openhtmltopdf for HTML-to-PDF conversion
- **Authentication**: OAuth2/OpenID Connect with internal AD SSO
- **Infrastructure**: AWS ECS (Fargate), Terraform for IaC
- **Monitoring**: Prometheus/Grafana, ELK Stack

## Project Structure

```
/src
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (currently EasyNext demo)
│   ├── providers.tsx      # React Query + Theme providers
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # shadcn/ui components
├── hooks/
│   └── use-toast.ts       # Toast hook for notifications
└── lib/
    └── utils.ts           # Utility functions (cn for className merging)
```

### Planned Vooster Structure (Reference)
```
/src
├── modules/
│   ├── auth/              # Authentication & authorization
│   ├── document/          # Template & document generation
│   ├── audit/             # Audit logging & compliance
│   └── admin/             # Management dashboard & statistics
├── common/                # Shared DTOs, filters, interceptors
├── config/                # Configuration modules
└── infrastructure/        # External service integrations
```

## Development Guidelines

### Mandatory Code Standards
1. **TypeScript**: Strict typing, no `any` types allowed
2. **Component Structure**: Single responsibility, max 200 lines per file
3. **Testing**: ≥80% coverage for all new functionality
4. **Layer Architecture**: Clear separation between UI, business logic, and data
5. **Error Handling**: Centralized error boundaries and consistent error responses

### Code Style Requirements
- Use `cn()` utility from `@/lib/utils` for conditional className merging
- Follow shadcn/ui component patterns for consistent styling
- Implement domain-driven design principles
- Services end with `Service`, DTOs with `Dto`, Components with descriptive names
- Maximum 20 lines per function (prefer under 10)
- Maximum 3 parameters per function

### State Management Patterns
- **Server State**: React Query for all server data fetching
- **Client State**: Zustand for complex local state, useState for simple component state
- **Forms**: React Hook Form with Zod schemas for validation
- **Theme**: next-themes for dark/light mode management

## Key Configuration

### shadcn/ui Setup
- Configuration in `components.json`
- Base color: neutral
- CSS variables enabled
- Path aliases configured: `@/components`, `@/lib`, `@/hooks`, `@/ui`

### ESLint Rules
- Next.js core web vitals + TypeScript rules
- Disabled: `@typescript-eslint/no-empty-object-type`, `no-explicit-any`, `no-unused-vars`
- ESLint ignored during builds (next.config.ts)

### Next.js Configuration
- Images: Remote patterns allow all hostnames (`hostname: '**'`)
- Development: Turbopack enabled for faster builds
- TypeScript: Strict mode enabled

## Vooster Implementation Phases

### Phase 1: Foundation Setup (Current)
- [x] Next.js project initialization with EasyNext
- [ ] Replace demo page with Vooster authentication UI
- [ ] Setup domain modules structure
- [ ] Implement SSO authentication flow

### Phase 2: Core Features
- [ ] Document template management
- [ ] PDF generation system
- [ ] Employee data integration
- [ ] Basic document issuance workflow

### Phase 3: Advanced Features
- [ ] Electronic signature integration
- [ ] Administrator dashboard
- [ ] Audit logging system
- [ ] Multi-language support

## Important Notes

### Development Approach
- Follow three-phase process: Exploration → Planning → Implementation
- Maintain minimalistic, expert-level code quality
- Validate all acceptance criteria before marking tasks complete
- Use established patterns from existing codebase

### Security Requirements
- Implement role-based access control
- Ensure TLS 1.3 encryption for all communications
- AES-256 encryption for personal data at rest
- Comprehensive audit logging with 1-year retention

### Performance Targets
- 95th percentile response time <2 seconds for 100 concurrent users
- System error rate <0.5%
- PDF generation in <3 seconds for preview

## Testing Strategy
- Unit tests: Jest + Testing Library for components
- Integration tests: Focus on document generation workflows
- E2E tests: Critical user journeys (auth → document generation → download)
- Performance tests: Load testing for concurrent document generation