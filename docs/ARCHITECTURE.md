# Architecture Documentation - MarketPro GT

## System Overview

MarketPro GT is a modern web application built with a microservices architecture using Supabase as the backend-as-a-service platform and React for the frontend.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Supabase      │    │   OpenAI API    │
│                 │    │                 │    │                 │
│  - Dashboard    │◄──►│  - PostgreSQL   │    │  - GPT-5-nano   │
│  - Auth         │    │  - Auth         │    │  - Content Gen  │
│  - Content Gen  │    │  - Edge Functions│   │  - Strategy Gen │
│  - Strategies   │    │  - RLS          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Query** - State management and caching
- **React Router** - Client-side routing

### Backend
- **Supabase** - Backend-as-a-Service
  - **PostgreSQL** - Database
  - **Auth** - Authentication and authorization
  - **Edge Functions** - Serverless functions (Deno runtime)
  - **RLS** - Row Level Security
- **OpenAI API** - AI content generation

### Development Tools
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing framework

## Data Flow

### 1. Authentication Flow
```
User Login → Supabase Auth → JWT Token → RLS Policies → Data Access
```

### 2. Content Generation Flow
```
User Input → React Frontend → Edge Function → OpenAI API → Response Processing → Database Storage → UI Update
```

### 3. Strategy Generation Flow
```
User Input → React Frontend → Edge Function → OpenAI API → Framework Processing → Database Storage → UI Update
```

## Database Design

### Entity Relationship Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Users     │    │   Clients   │    │  Campaigns  │
│             │    │             │    │             │
│ - id        │◄──►│ - id        │◄──►│ - id        │
│ - email     │    │ - name      │    │ - name      │
│ - created_at│    │ - industry  │    │ - objective │
└─────────────┘    │ - user_id   │    │ - client_id │
                   └─────────────┘    └─────────────┘
                          │                   │
                          ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   Content   │    │  Strategies │
                   │             │    │             │
                   │ - id        │    │ - id        │
                   │ - client_id │    │ - client_id │
                   │ - content   │    │ - framework │
                   │ - platform  │    │ - strategy  │
                   └─────────────┘    └─────────────┘
```

### Key Relationships
- **Users** → **Clients** (1:many)
- **Clients** → **Campaigns** (1:many)
- **Clients** → **Content** (1:many)
- **Clients** → **Strategies** (1:many)
- **Campaigns** → **Content** (1:many)

## Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │    │  Supabase Auth  │    │   RLS Policies  │
│                 │    │                 │    │                 │
│ - Email/Pass    │───►│ - JWT Token     │───►│ - User Access   │
│ - Whitelist     │    │ - Session Mgmt  │    │ - Data Filtering│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Security
- **Row Level Security (RLS)** - Database-level access control
- **JWT Tokens** - Stateless authentication
- **Environment Variables** - Secure credential storage
- **CORS Configuration** - Cross-origin request security

## Edge Functions Architecture

### generate-content Function
```typescript
interface ContentRequest {
  client_id: string;
  type: 'post' | 'strategy' | 'analysis';
  platform?: string;
  topic?: string;
  tone?: string;
  custom_prompt?: string;
  openai_api_key?: string;
}

interface ContentResponse {
  data: {
    client_info: ClientInfo;
    content_type: string;
    platform: string;
    content_body: string;
    // ... other fields
  };
}
```

### generate-marketing-strategy Function
```typescript
interface StrategyRequest {
  clientId: string;
  strategyType: string;
  framework: string;
  targetAudience?: string;
  productInfo: ProductInfo;
  businessGoals: string[];
  customRequirements?: string;
  openai_api_key?: string;
}
```

## Frontend Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── ContentPage.tsx
│   ├── StrategiesPage.tsx
│   └── ...
├── lib/                # Utilities and configuration
│   ├── supabase.ts     # Supabase client
│   ├── auth.tsx        # Authentication context
│   └── types.ts        # TypeScript definitions
└── hooks/              # Custom React hooks
```

### State Management
- **React Query** - Server state management
- **React Context** - Authentication state
- **Local State** - Component-level state with useState

## API Design

### RESTful Principles
- **GET** - Retrieve data
- **POST** - Create new resources
- **PUT/PATCH** - Update existing resources
- **DELETE** - Remove resources

### Edge Functions as API Endpoints
```
/functions/v1/generate-content
/functions/v1/generate-marketing-strategy
/functions/v1/auth-manager
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting** - Lazy loading of components
- **React Query Caching** - Reduced API calls
- **Vite Build** - Optimized bundle size
- **TailwindCSS** - Minimal CSS footprint

### Backend Optimization
- **Edge Functions** - Serverless scaling
- **Database Indexing** - Optimized queries
- **RLS** - Efficient data filtering
- **Connection Pooling** - Supabase managed

## Scalability

### Horizontal Scaling
- **Edge Functions** - Auto-scaling serverless functions
- **Supabase** - Managed database scaling
- **CDN** - Static asset delivery

### Vertical Scaling
- **Database** - Supabase managed scaling
- **Compute** - Edge Function auto-scaling

## Monitoring & Observability

### Logging
- **Edge Function Logs** - Supabase dashboard
- **Browser Console** - Client-side debugging
- **Database Logs** - Query performance

### Metrics
- **Supabase Dashboard** - Usage metrics
- **OpenAI Dashboard** - API usage
- **Vercel Analytics** - Performance metrics

## Deployment Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │   Supabase      │    │   OpenAI API    │
│                 │    │                 │    │                 │
│  - Static Files │    │  - Database     │    │  - AI Services  │
│  - Edge Network │    │  - Edge Functions│   │  - Rate Limiting│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Dev     │    │   Supabase      │    │   OpenAI API    │
│                 │    │                 │    │                 │
│  - Vite Dev     │    │  - Local DB     │    │  - Sandbox      │
│  - Hot Reload   │    │  - Edge Functions│   │  - Test Keys    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Future Enhancements

### Planned Features
- **Real-time Analytics** - WebSocket connections
- **Advanced AI Models** - Multiple AI providers
- **Mobile App** - React Native implementation
- **API Rate Limiting** - Custom rate limiting
- **Advanced Caching** - Redis integration

### Technical Debt
- **Test Coverage** - Increase test coverage
- **Error Handling** - Improve error boundaries
- **Performance** - Optimize bundle size
- **Accessibility** - WCAG compliance
