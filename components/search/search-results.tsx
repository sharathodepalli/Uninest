'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, Bed, Bath, Square, Eye, MessageCircle, Calendar, Shield } from 'lucide-react';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import { useState } from 'react';

type Listing = Database['public']['Tables']['listings']['Row'] & {
  profiles: {
    name: string;
    photo_url: string | null;
    verified: boolean;
  };
};

interface SearchResultsProps {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  onViewListing: (id: string) => void;
}

export function SearchResults({ listings, loading, error, onViewListing }: SearchResultsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (listingId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-80 h-48 bg-muted"></div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading listings: {error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No listings found matching your criteria.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative md:w-80 h-48 md:h-auto">
                <img
                  src={listing.photos_urls[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => toggleFavorite(listing.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.has(listing.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </Button>
                {listing.featured && (
                  <Badge className="absolute top-2 left-2 bg-orange-500">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                    <p className="text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-4 w-4" />
                      {listing.address}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${listing.rent}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
                  </div>
                  {listing.square_feet && (
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {listing.square_feet} sq ft
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Available {new Date(listing.available_date).toLocaleDateString()}
                  </div>
                </div>

                {/* Amenities */}
                {listing.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.amenities.slice(0, 4).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {listing.amenities.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{listing.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Host Info & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={listing.profiles.photo_url || ''} />
                      <AvatarFallback>
                        {listing.profiles.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{listing.profiles.name}</span>
                        {listing.profiles.verified && (
                          <Shield className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {listing.view_count} views
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/messages?listing=${listing.id}&host=${listing.host_id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link 
                        href={`/listings/${listing.id}`}
                        onClick={() => onViewListing(listing.id)}
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}