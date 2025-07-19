# Code Guideline Document

## 1. Project Overview  
This project delivers a web‐based automated document issuance system using:  
- Frontend: Next.js (React + TypeScript), Tailwind CSS, React Query  
- Backend: NestJS (Node.js + TypeScript), REST (OpenAPI), TypeORM  
- Database: PostgreSQL (RDS)  
- File Storage: AWS S3 (PDF assets)  
- PDF Generation: openhtmltopdf  
- Auth: OAuth2/OpenID Connect via AD SSO  
- Infra & CI/CD: AWS ECS (Fargate), Terraform, GitHub Actions  
Key decisions:  
- Domain‐driven, feature‐based NestJS modules  
- SSR/CSR hybrid Next.js with per‐page caching via React Query  
- Secure, typed APIs with Swagger‐driven OpenAPI  

## 2. Core Principles  
1. Single Responsibility: each file or module must serve one feature or domain and remain under 200 lines.  
2. Strict Typing: forbid `any`; all public functions and API DTOs require explicit TypeScript types.  
3. Automated Testing: each controller/service and React hook must include ≥80% unit‐test coverage.  
4. Declarative Data Flow: use React Query for all server state, avoid ad‐hoc `useState` for remote data.  
5. Consistent Error Handling: all errors propagate through a centralized filter/interceptor.  

## 3. Language-Specific Guidelines  

### 3.1 Next.js (TypeScript + React)  
- Folder Layout:  
  ```
  /src
  ├─ pages           ← Next.js pages
  ├─ components      ← Reusable UI components
  ├─ hooks           ← Custom React hooks (React Query)
  ├─ services        ← API client modules
  ├─ styles          ← Tailwind CSS configs
  └─ utils           ← Shared utilities
  ```  
- Imports:  
  - Use absolute imports via `tsconfig.json` `paths`.  
  - Group: React / Next → external libs → src aliases → styles/assets.  
- Error Handling:  
  - Wrap API calls in try/catch and return standardized `ApiError` object.  
  - Use a global _error boundary_ at `pages/_app.tsx`.  

### 3.2 NestJS (TypeScript)  
- Folder Layout:  
  ```
  /src
  ├─ modules
  │  ├─ auth
  │  ├─ document
  │  ├─ audit
  │  └─ admin
  ├─ common            ← filters, interceptors, DTOs  
  ├─ config            ← configuration modules  
  ├─ infrastructure    ← S3/SQS/esign clients  
  └─ main.ts  
  ```  
- Imports:  
  - Use TypeScript path aliases (`@modules`, `@common`, `@infra`).  
  - Avoid relative imports deeper than two levels.  
- Error Handling:  
  - Use built-in Exceptions (`BadRequestException`, `NotFoundException`).  
  - All controllers must use `@UseFilters(new AllExceptionsFilter())`.  
  - Unhandled errors propagate to `exceptionFilter` for logging.  

## 4. Code Style Rules  

### MUST Follow  
1. **Explicit Types**  
   - Rationale: improves readability & compile‐time safety.  
   ```ts
   // MUST
   async function fetchUser(id: string): Promise<UserDto> {
     return this.userService.findById(id);
   }
   ```  
2. **Single‐Purpose Components/Services**  
   - Rationale: easier testing, maintenance.  
   ```ts
   // MUST: one controller per resource
   @Controller('documents')
   export class DocumentController {
     constructor(private readonly docService: DocumentService) {}
     @Get(':id') getOne(@Param('id') id: string) { return this.docService.find(id); }
   }
   ```  
3. **Consistent Naming**  
   - Rationale: discoverability.  
   - Services suffixed `Service`, DTOs suffixed `Dto`, Entities suffixed `Entity`.  
4. **Centralized Configuration**  
   - Rationale: avoids magic literals.  
   ```ts
   // MUST: use ConfigService
   this.configService.get<number>('PDF_TIMEOUT_SECONDS');
   ```  
5. **No `any` or Undeclared Variables**  
   - Rationale: preserves type safety.  

### MUST NOT Do  
1. **Monolithic Files**  
   ```ts
   // MUST NOT: 500+ line file
   export class UtilityLivingInEveryCorner { /* ... */ }
   ```  
   - Anti‐pattern: violates SRP & hard to navigate.  
2. **Direct Database Calls in Controllers**  
   ```ts
   // MUST NOT
   @Controller('user')
   export class BadController {
     @Get() find() { return this.repo.query('SELECT * FROM user'); }
   }
   ```  
   - Fix: delegate to Service & Repository layers.  
3. **Inline CSS or Magic Classnames**  
   ```jsx
   // MUST NOT
   <div className="p-3 bg-gray-300 rounded text-sm">…
   ```  
   - Fix: use Tailwind ‘@apply’ in a `.css` file or extract to component.  
4. **Console Logging in Production Code**  
   - Use NestJS Logger or a centralized logging service.  
5. **Blocking Calls for PDF Generation**  
   - Always push to queue (AWS SQS) and respond asynchronously.  

## 5. Architecture Patterns  

### 5.1 Module & Component Structure  
- **Domain Modules**: one NestJS module per domain (auth, document, audit, admin).  
- **Feature Folders** in Next.js: group page+components+styles per route if >3 components.  
- **Shared Libraries**: extract common code to `@common` / `src/utils`.  

### 5.2 Data Flow  
- **Frontend**:  
  - Use React Query’s `useQuery`/`useMutation`.  
  - No global state library for server data.  
- **Backend**:  
  - Controllers → Services → Repositories → Entities  
  - External calls in `infrastructure` layer  

### 5.3 State Management Conventions  
- **React Query**:  
  ```tsx
  // MUST
  const { data, error, isLoading } = useQuery(['document', id], () =>
    docService.fetchDocument(id)
  );
  ```  
- **Mutations** always invalidate related queries:  
  ```tsx
  // MUST
  const mutation = useMutation(saveDoc, {
    onSuccess: () => queryClient.invalidateQueries('documents')
  });
  ```  

### 5.4 API Design Standards  
- **RESTful Endpoints**: `/documents/{id}`, `/users/{id}/documents`  
- **HTTP Status Codes**:  
  - 200 OK, 201 Created, 204 No Content for deletes  
  - 400 Bad Request for validation errors  
  - 401 Unauthorized, 403 Forbidden, 404 Not Found  
- **Request/Response DTOs** with Swagger decorators:  
  ```ts
  // MUST: NestJS DTO with validation
  export class CreateDocumentDto {
    @IsString() title: string;
    @IsEnum(DocumentType) type: DocumentType;
  }
  ```  

---

## Example Snippets  

```ts
// MUST: NestJS Service with explicit types and single responsibility
@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}
  async findById(id: string): Promise<UserDto> {
    const user = await this.repo.findOneOrFail(id);
    return plainToClass(UserDto, user);
  }
}
```

```ts
// MUST NOT: Any usage, broad return type, and inline SQL
async function badFetch(): Promise<any> {
  const res = await this.repo.query('SELECT * FROM users');
  return res;
}
```

```jsx
// MUST: Next.js page using React Query
import { useQuery } from 'react-query';
import { fetchDocument } from '@services/document';
export default function DocumentPage({ id }) {
  const { data, isLoading, error } = useQuery(['doc', id], () => fetchDocument(id));
  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <DocumentViewer data={data} />;
}
```

```jsx
// MUST NOT: Fetching in `useEffect` with manual state
function BadComponent({ id }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`/api/documents/${id}`).then(r => r.json()).then(setData);
  }, [id]);
  return data ? <Viewer data={data} /> : <Spinner />;
}
```

# End of Code Guidelines