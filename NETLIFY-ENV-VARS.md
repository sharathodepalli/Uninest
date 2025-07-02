# Netlify Environment Variables Configuration

## Required Environment Variables for Netlify Deployment

Add these in your Netlify dashboard: **Site settings** → **Environment variables**

### Essential Variables (Required)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_SITE_URL=https://your-actual-netlify-site.netlify.app
```

### OAuth Configuration (For Google Sign-in)

```
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### Optional Variables (Configure if needed)

```
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

## IMPORTANT STEPS:

### 1. Find Your Netlify Site URL

- Go to your Netlify dashboard
- Your site URL will be something like: `https://amazing-unicorn-123456.netlify.app`
- Replace `https://your-actual-netlify-site.netlify.app` with your actual URL

### 2. Configure Google OAuth in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Add the credentials:
   - Client ID: `your_google_oauth_client_id`
   - Client Secret: `your_google_oauth_client_secret`

### 3. Update Google Cloud Console (CRITICAL FOR OAUTH)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `515191102407-9m097a69ugedhtmrfc09uqj3oot3optl.apps.googleusercontent.com`
3. Click **Edit** (pencil icon)
4. Add to **Authorized redirect URIs**:
   ```
   https://your-actual-netlify-site.netlify.app/auth/callback
   https://sgjpdsgjrpmiwlormues.supabase.co/auth/v1/callback
   ```
5. Add to **Authorized JavaScript origins**:
   ```
   https://your-actual-netlify-site.netlify.app
   https://sgjpdsgjrpmiwlormues.supabase.co
   ```
6. **Save** changes

### 4. Add Variables to Netlify

1. Go to Netlify dashboard
2. **Site settings** → **Environment variables**
3. Add each variable one by one
4. **Save** and **redeploy**

## Common Issues:

### Google OAuth Error: "redirect_uri_mismatch"
**Error 400: redirect_uri_mismatch** means your Netlify site URL is not added to Google Cloud Console.

**Fix:**
1. Get your exact Netlify site URL (e.g., `https://amazing-unicorn-123456.netlify.app`)
2. Add it to Google Cloud Console OAuth 2.0 client configuration
3. Include both redirect URIs and JavaScript origins
4. Wait 5-10 minutes for Google's changes to propagate

### Other Issues:
- Make sure there are no trailing spaces in environment variable values
- Ensure NEXT_PUBLIC_SITE_URL matches your actual Netlify site URL
- Google OAuth won't work until properly configured in both Supabase and Google Cloud Console
