# Deployment Guide - MarketPro GT

## Prerequisites

### Required Software
- Node.js 18+ 
- pnpm (recommended) or npm
- Git
- Supabase CLI
- Docker (for local development)

### Required Accounts
- Supabase account
- OpenAI account with API access
- GitHub account (for deployment)

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/marketpro-gt.git
cd marketpro-gt
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env.local

# Edit with your values
nano .env.local
```

**Required Environment Variables:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Start local Supabase (requires Docker)
supabase start
```

### 5. Database Setup
```bash
# Apply migrations
supabase db push

# Or reset database
supabase db reset
```

### 6. Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy generate-content
supabase functions deploy generate-marketing-strategy
supabase functions deploy auth-manager
```

### 7. Start Development Server
```bash
pnpm dev
```

## Production Deployment

### Option 1: Vercel (Recommended)

#### 1. Connect to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 2. Environment Variables in Vercel
Set the following environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

#### 3. Build Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key",
    "VITE_OPENAI_API_KEY": "@vite_openai_api_key"
  }
}
```

### Option 2: Netlify

#### 1. Build Settings
- Build command: `pnpm build`
- Publish directory: `dist`
- Node version: `18`

#### 2. Environment Variables
Set in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

### Option 3: Self-Hosted

#### 1. Build Application
```bash
pnpm build
```

#### 2. Serve with Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/marketpro-gt/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://your-supabase-url.supabase.co;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Supabase Production Setup

### 1. Create Production Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Note down project URL and anon key

### 2. Configure Database
```bash
# Link to production project
supabase link --project-ref your-production-ref

# Apply migrations
supabase db push
```

### 3. Deploy Edge Functions
```bash
# Deploy to production
supabase functions deploy --project-ref your-production-ref
```

### 4. Configure RLS Policies
```sql
-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

-- Create policies (see API.md for examples)
```

### 5. Set Environment Variables
In Supabase Dashboard > Settings > API:
- Set `OPENAI_API_KEY` in Edge Functions secrets

## Monitoring and Maintenance

### 1. Logs Monitoring
```bash
# View Edge Function logs
supabase functions logs generate-content --project-ref your-ref

# View database logs
supabase db logs --project-ref your-ref
```

### 2. Performance Monitoring
- Monitor Supabase usage in dashboard
- Monitor OpenAI API usage
- Set up alerts for errors

### 3. Backup Strategy
```bash
# Backup database
supabase db dump --project-ref your-ref > backup.sql

# Restore database
supabase db reset --project-ref your-ref
psql -h your-host -U postgres -d postgres < backup.sql
```

### 4. Security Updates
- Regularly update dependencies: `pnpm update`
- Monitor security advisories
- Rotate API keys periodically

## Troubleshooting

### Common Issues

#### 1. Edge Functions Not Working
```bash
# Check function status
supabase functions list --project-ref your-ref

# Redeploy functions
supabase functions deploy --project-ref your-ref
```

#### 2. Database Connection Issues
```bash
# Check connection
supabase status

# Reset local database
supabase db reset
```

#### 3. OpenAI API Issues
- Verify API key is valid
- Check rate limits
- Monitor usage in OpenAI dashboard

#### 4. Build Issues
```bash
# Clear cache
pnpm store prune
rm -rf node_modules
pnpm install

# Check for TypeScript errors
pnpm type-check
```

### Support
- Check [GitHub Issues](https://github.com/your-username/marketpro-gt/issues)
- Review [API Documentation](API.md)
- Contact: support@marketpro-gt.com
