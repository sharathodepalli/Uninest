# 🚀 Netlify Deployment Guide for UniNest

## Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

## ✅ Fixed Configuration

The Netlify configuration has been updated to properly support Next.js SSR:

### Key Changes Made:

1. **Removed `publish = "out"`** - Let Netlify Next.js plugin handle deployment
2. **Added `@netlify/plugin-nextjs`** - Enables SSR and API routes
3. **Removed conflicting redirect** - `/* → /index.html` conflicts with dynamic routes
4. **Kept build command** - `npm run build` (runs `next build`)

## 📋 Deployment Steps

### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Select the UniNest repository

### 2. Configure Build Settings

Netlify should auto-detect these settings, but verify:

- **Build command**: `npm run build`
- **Publish directory**: (leave empty - plugin handles it)
- **Base directory**: (leave empty unless in subdirectory)

### 3. Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Optional variables:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### 4. Deploy

Click "Deploy site" - Netlify will:

1. Install dependencies (`npm install`)
2. Run build command (`npm run build`)
3. Use Next.js plugin for SSR deployment

## 🔧 Current Configuration

### netlify.toml

```toml
[build]
  command = "npm run build"
  # No publish directory - @netlify/plugin-nextjs handles it

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Features Enabled:

- ✅ **SSR (Server-Side Rendering)** - Dynamic pages work
- ✅ **API Routes** - `/api/*` endpoints work
- ✅ **Dynamic Routes** - `/listings/[id]` works
- ✅ **Image Optimization** - Next.js Image component works
- ✅ **Security Headers** - Configured for production
- ✅ **Caching** - Static assets cached efficiently

## 🐛 Troubleshooting

### Common Issues:

**1. Build Fails**

```bash
# Check build locally first
npm run build

# If successful locally but fails on Netlify:
# - Check Node.js version (should be 18+)
# - Verify environment variables are set
# - Check build logs for specific errors
```

**2. Functions Don't Work**

- Ensure `@netlify/plugin-nextjs` is in `netlify.toml`
- API routes should be in `app/api/` directory
- Check function logs in Netlify dashboard

**3. Dynamic Routes 404**

- Verify no conflicting redirects in `netlify.toml`
- Ensure Next.js plugin is properly configured
- Check that routes are using App Router (`app/` directory)

**4. Environment Variables Not Working**

- Variables must be prefixed with `NEXT_PUBLIC_` for client-side
- Server-side variables should not have the prefix
- Check spelling and ensure they're set in Netlify dashboard

### Build Logs to Check:

1. **Plugin Installation**: Look for "@netlify/plugin-nextjs" installation
2. **Next.js Build**: Should show "Creating an optimized production build"
3. **Function Generation**: Plugin should create Netlify functions from API routes

## 🚀 Post-Deployment

### 1. Domain Setup

- Configure custom domain in Netlify dashboard
- SSL is automatically provisioned
- Update Supabase Auth settings with new domain

### 2. Performance Monitoring

- Enable Netlify Analytics (optional)
- Check Core Web Vitals
- Monitor function execution times

### 3. Testing Checklist

- [ ] Homepage loads correctly
- [ ] Authentication works (sign in/up)
- [ ] Dynamic routes work (`/listings/[id]`)
- [ ] API routes respond (`/api/health`)
- [ ] Database connections work
- [ ] Image uploads work (if using Supabase Storage)
- [ ] Real-time features work (chat)

## 📈 Optimization Tips

### 1. Build Performance

```json
// package.json - optimize for faster builds
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 2. Function Optimization

- Keep API routes lightweight
- Use edge functions for simple logic
- Cache database queries when possible

### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze
```

## 🔄 Continuous Deployment

### Auto-Deploy Setup:

1. **Branch Deploys**: Configure which branches trigger deploys
2. **Deploy Previews**: Automatic for pull requests
3. **Build Hooks**: Trigger deploys via webhooks

### Environment-Specific Builds:

```toml
# netlify.toml - different settings per environment
[context.production.environment]
  NODE_ENV = "production"

[context.deploy-preview.environment]
  NODE_ENV = "development"
```

## 📞 Support

If deployment issues persist:

1. Check Netlify docs: [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
2. Review build logs in Netlify dashboard
3. Test build locally with `npm run build`
4. Ensure all environment variables are properly set

**UniNest is now optimized for Netlify deployment with full SSR support!** 🎉
