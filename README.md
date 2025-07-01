# UniNest - Student Housing Finder

A comprehensive student housing platform built with Next.js, TypeScript, and Supabase.

## Features

- **Authentication**: Email/password + OAuth (Google, GitHub)
- **User Roles**: Host and Seeker accounts with different permissions
- **Listings Management**: Create, edit, and manage property listings
- **Advanced Search**: Location-based search with filters and map integration
- **Real-time Chat**: Instant messaging between hosts and seekers
- **Photo Upload**: Secure image storage with Supabase Storage
- **Admin Dashboard**: Moderation tools for platform management
- **Responsive Design**: Optimized for mobile and desktop

## Tech Stack

- **Frontend**: Next.js 13 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Maps**: Mapbox GL (integration ready)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd uninest
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup

Install Supabase CLI and run migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase locally
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Storage Setup

In your Supabase dashboard:

1. Go to Storage and create a bucket named `listings`
2. Set up storage policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'listings');

-- Allow public access to view files
CREATE POLICY "Public can view files" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'listings');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE TO authenticated
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Authentication Setup

Configure OAuth providers in Supabase:

1. Go to Authentication > Settings > Auth Providers
2. Enable and configure Google and GitHub OAuth
3. Add your site URL to redirect URLs

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── search/            # Search and listing pages
│   ├── messages/          # Chat functionality
│   └── dashboard/         # Host dashboard
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── home/             # Landing page components
│   ├── search/           # Search-related components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── supabase/            # Database migrations and functions
│   ├── migrations/      # SQL migration files
│   └── functions/       # Edge Functions
└── types/               # TypeScript type definitions
```

## Key Features Implementation

### Authentication System

The app uses Supabase Auth with custom profiles:

- Email/password authentication
- OAuth with Google and GitHub
- Role-based access (host/seeker/admin)
- Profile management with user details

### Listings Management

- Create listings with photos, location, and details
- Geocoding integration for map display
- Advanced search with filters
- Favorites and bookmarking system

### Real-time Chat

- Instant messaging between users
- Message threads organized by listing
- Read receipts and typing indicators
- Real-time updates with Supabase Realtime

### Search & Discovery

- Location-based search with radius filtering
- Price range, bedrooms, bathrooms filters
- Amenities filtering
- Map view with clustering
- Saved searches

## Database Schema

### Core Tables

- `profiles` - User profiles and roles
- `listings` - Property listings with location data
- `messages` - Chat messages between users
- `listing_views` - Analytics for listing views
- `favorites` - User favorites/bookmarks

### Security

All tables use Row Level Security (RLS) with policies:

- Users can only access their own data
- Hosts can manage their own listings
- Public read access for active listings
- Secure chat between involved parties

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Migrations

Set up GitHub Actions for automated migrations:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Supabase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

### Environment Variables

Required environment variables:

```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend/Edge Functions
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Maps (optional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

## Development Guidelines

### Code Organization

- Keep components small and focused
- Use custom hooks for business logic
- Implement proper TypeScript types
- Follow the established folder structure

### Database Best Practices

- Always use migrations for schema changes
- Test RLS policies thoroughly
- Use indexes for query performance
- Keep functions simple and focused

### Security Considerations

- Never expose service role keys in frontend
- Validate all user inputs
- Use RLS for data access control
- Implement proper file upload restrictions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:

- Check the GitHub issues
- Review the Supabase documentation
- Contact the development team

## License

This project is licensed under the MIT License.