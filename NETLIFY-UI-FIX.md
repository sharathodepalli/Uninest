# Netlify Deployment Fix for Next.js SSR

## Common Build Error Scenarios

### Error 1: "Deployment folder not found"

```
Error: Could not find the deployment folder "/opt/build/repo/out"
publish: /opt/build/repo/out
publishOrigin: ui
```

**Cause:** Netlify UI has publish directory set to "out" (static export mode)
**Fix:** Clear the "Publish directory" field in Netlify dashboard

### Error 2: "Publish directory cannot be the same as base directory"

```
Error: Your publish directory cannot be the same as the base directory of your site
publish: /opt/build/repo
publishOrigin: default
```

**Cause:** No publish directory set, Netlify defaults to repository root
**Fix:** Set publish directory to ".next" in netlify.toml

## Fix Steps

### 1. Update netlify.toml

Ensure your `netlify.toml` has:

```toml
[build]
  command = "npm run build"
  publish = ".next"  # Required for @netlify/plugin-nextjs

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. Clear Netlify Dashboard Setting (if needed)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your UniNest site
3. Navigate to **Site settings** → **Build & deploy** → **Build settings**
4. Find **"Publish directory"** field
5. **Clear/delete the value** (should be empty)
6. Click **Save**

### 2. Verify Configuration

Ensure your `netlify.toml` has:

```toml
[build]
  command = "npm run build"
  # NO publish setting - let plugin handle it

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. Redeploy

After clearing the UI setting:

- Trigger a new deployment
- The plugin should now manage SSR properly
- No `/out` directory needed

## Verification

In successful build logs, you should see:

- No `publish:` or `publishOrigin: ui`
- `@netlify/plugin-nextjs` plugin execution
- No "deployment folder not found" errors

## Why This Happens

- Netlify UI settings override `netlify.toml` configuration
- Static export requires `publish = "out"`
- SSR with Next.js plugin should have NO publish setting
- The plugin manages deployment automatically

## Related Files

- `netlify.toml` - Correct configuration ✅
- `package.json` - Build scripts ✅
- `next.config.js` - No static export ✅

The only change needed is clearing the UI setting!
