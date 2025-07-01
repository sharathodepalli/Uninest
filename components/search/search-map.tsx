'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Eye, Plus, Minus, Navigation } from 'lucide-react';
import { Database } from '@/lib/database.types';
import Link from 'next/link';

type Listing = Database['public']['Tables']['listings']['Row'] & {
  profiles: {
    name: string;
    photo_url: string | null;
    verified: boolean;
  };
};

interface SearchMapProps {
  listings: Listing[];
  loading: boolean;
  onViewListing: (id: string) => void;
}

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  price: number;
  selected?: boolean;
}

export function SearchMap({ listings, loading, onViewListing }: SearchMapProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoom, setZoom] = useState(12);

  // Create markers from listings
  const markers: MapMarker[] = listings
    .filter(listing => listing.latitude && listing.longitude)
    .map(listing => ({
      id: listing.id,
      latitude: listing.latitude!,
      longitude: listing.longitude!,
      price: listing.rent,
      selected: selectedListing?.id === listing.id,
    }));

  // Interactive Map Component with enhanced styling
  const InteractiveMap = () => {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-lg overflow-hidden border">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setZoom(Math.max(zoom - 1, 8))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => {
              // Center map on user location or default
              setMapCenter({ lat: 40.7128, lng: -74.0060 });
            }}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Map Background with Grid */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="search-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#search-grid)" />
          </svg>
        </div>

        {/* Decorative Map Elements */}
        <div className="absolute inset-0">
          {/* Roads/paths */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 0 200 Q 150 180 300 200 T 600 200"
              stroke="#e2e8f0"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 200 0 Q 220 150 200 300 T 200 600"
              stroke="#e2e8f0"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Property Markers */}
        <div className="absolute inset-0">
          {markers.map((marker, index) => {
            // Calculate position based on index for demo
            const x = 60 + (index % 6) * 80 + Math.sin(index) * 30;
            const y = 80 + Math.floor(index / 6) * 60 + Math.cos(index) * 20;
            
            return (
              <div
                key={marker.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  marker.selected ? 'z-20 scale-110' : 'z-10'
                }`}
                style={{ left: `${Math.min(Math.max(x, 30), 90)}%`, top: `${Math.min(Math.max(y, 20), 80)}%` }}
                onClick={() => {
                  const listing = listings.find(l => l.id === marker.id);
                  if (listing) setSelectedListing(listing);
                }}
              >
                <div
                  className={`px-3 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 ${
                    marker.selected
                      ? 'bg-primary text-primary-foreground shadow-xl ring-2 ring-primary/50'
                      : 'bg-white text-gray-900 hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }`}
                >
                  ${marker.price.toLocaleString()}
                </div>
                {/* Marker pin */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 ${
                  marker.selected ? 'border-primary border-l-transparent border-r-transparent' : 'border-white border-l-transparent border-r-transparent'
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Selected Property</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Available Properties</span>
          </div>
        </div>

        {/* Map Attribution */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          Map ready for Mapbox integration
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card>
        <CardContent className="p-4">
          <InteractiveMap />
        </CardContent>
      </Card>

      {/* Selected Listing Details */}
      {selectedListing && (
        <Card className="border-primary shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={selectedListing.photos_urls[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300'}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedListing.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedListing.address}
                </p>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3" />
                    {selectedListing.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {selectedListing.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedListing.view_count}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  ${selectedListing.rent.toLocaleString()}
                </div>
                <Button size="sm" asChild>
                  <Link 
                    href={`/listings/${selectedListing.id}`}
                    onClick={() => onViewListing(selectedListing.id)}
                  >
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <Card 
            key={listing.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedListing?.id === listing.id ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
            onClick={() => setSelectedListing(listing)}
          >
            <CardContent className="p-4">
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={listing.photos_urls[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold truncate">{listing.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{listing.address}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{listing.bedrooms}bd</span>
                  <span>{listing.bathrooms}ba</span>
                </div>
                <div className="font-bold text-primary">
                  ${listing.rent.toLocaleString()}
                </div>
              </div>
              {listing.featured && (
                <Badge className="mt-2 bg-orange-500">Featured</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {listings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters to see more results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}