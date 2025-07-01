'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchResults } from '@/components/search/search-results';
import { SearchMap } from '@/components/search/search-map';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';
import { useListings } from '@/hooks/use-listings';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minRent: searchParams.get('minRent') ? parseInt(searchParams.get('minRent')!) : undefined,
    maxRent: searchParams.get('maxRent') ? parseInt(searchParams.get('maxRent')!) : undefined,
    bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
    availableDate: searchParams.get('date') || undefined,
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    radius: 10,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  const { listings, loading, error, trackView } = useListings(filters);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {filters.location ? `Housing in ${filters.location}` : 'All Listings'}
                </h1>
                <p className="text-muted-foreground">
                  {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <SearchResults
                listings={listings}
                loading={loading}
                error={error}
                onViewListing={trackView}
              />
            ) : (
              <SearchMap
                listings={listings}
                loading={loading}
                onViewListing={trackView}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}