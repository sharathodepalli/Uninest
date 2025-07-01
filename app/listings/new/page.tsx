'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ListingForm } from '@/components/listings/listing-form';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';

export default function NewListingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  if (profile?.role !== 'host') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>Host Account Required</CardTitle>
              <CardDescription>
                You need a host account to create listings. Please contact support to upgrade your account.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
            <p className="text-muted-foreground">
              Add your property details to start attracting potential tenants
            </p>
          </div>

          <ListingForm />
        </div>
      </div>
    </div>
  );
}