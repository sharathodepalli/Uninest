# UniNest Deployment Guide

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

### 3. Docker

```bash
# Build image
docker build -t uninest .

# Run container
docker run -p 3000:3000 uninest
```

## 🔧 Environment Setup

### Required Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Optional Variables:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 📊 Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### 2. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or run the SQL manually in Supabase dashboard
# Copy contents of supabase/migrations/20250701025227_round_castle.sql
```

### 3. Configure Storage

1. Go to Storage in Supabase dashboard
2. Create bucket named `listings`
3. Set to public access
4. Configure RLS policies for bucket

### 4. Configure Authentication

1. Go to Authentication > Settings
2. Configure OAuth providers (Google, GitHub)
3. Add your domain to redirect URLs

## 🛡️ Security Checklist

- [ ] Environment variables set in production
- [ ] Database RLS policies enabled
- [ ] Storage bucket permissions configured
- [ ] CORS settings updated
- [ ] Domain allowlist configured
- [ ] API rate limiting enabled

## 📈 Performance Monitoring

### Built-in Monitoring

The app includes performance monitoring utilities:

```typescript
import { PerformanceMonitor } from "@/lib/monitoring";

const monitor = PerformanceMonitor.getInstance();
monitor.trackPageLoad("homepage");
```

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics or Google Analytics
- **Performance**: Web Vitals monitoring
- **Uptime**: UptimeRobot or similar

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build fails**: Check TypeScript errors with `npm run type-check`
2. **Database connection**: Verify environment variables
3. **Authentication**: Check OAuth provider settings
4. **Images not loading**: Configure storage bucket permissions

### Logs:

- Check browser console for client errors
- Check deployment platform logs for server errors
- Enable Supabase logging for database issues

## 📱 Mobile Considerations

- App is responsive and mobile-friendly
- PWA ready (can add manifest.json)
- Touch-friendly interface
- Optimized images and loading

## 🔧 Maintenance

### Regular Tasks:

- Update dependencies: `npm update`
- Monitor error rates
- Review database performance
- Check security updates
- Backup database regularly

### Scaling:

- Supabase automatically scales
- Add CDN for image optimization
- Consider edge deployment for global users
- Monitor and optimize database queries
