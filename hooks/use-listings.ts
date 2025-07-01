'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'] & {
  profiles: {
    name: string;
    photo_url: string | null;
    verified: boolean;
  };
};

interface SearchFilters {
  location?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  availableDate?: string;
  amenities?: string[];
  radius?: number;
  latitude?: number;
  longitude?: number;
}

export function useListings(filters: SearchFilters = {}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles:host_id (
            name,
            photo_url,
            verified
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.minRent) {
        query = query.gte('rent', filters.minRent);
      }
      if (filters.maxRent) {
        query = query.lte('rent', filters.maxRent);
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }
      if (filters.availableDate) {
        query = query.lte('available_date', filters.availableDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by location/radius if provided
      let filteredData = data || [];
      if (filters.latitude && filters.longitude && filters.radius) {
        filteredData = filteredData.filter(listing => {
          if (!listing.latitude || !listing.longitude) return false;
          
          const distance = calculateDistance(
            filters.latitude!,
            filters.longitude!,
            listing.latitude,
            listing.longitude
          );
          
          return distance <= filters.radius!;
        });
      }

      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        filteredData = filteredData.filter(listing =>
          filters.amenities!.every(amenity =>
            listing.amenities.includes(amenity)
          )
        );
      }

      setListings(filteredData as Listing[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listingData: Database['public']['Tables']['listings']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh listings
      fetchListings();
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateListing = async (id: string, updates: Database['public']['Tables']['listings']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setListings(prev => prev.map(listing => 
        listing.id === id ? { ...listing, ...updates } : listing
      ));
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setListings(prev => prev.filter(listing => listing.id !== id));
      
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const trackView = async (listingId: string) => {
    try {
      await supabase
        .from('listing_views')
        .insert({
          listing_id: listingId,
        });

      // Update view count locally
      setListings(prev => prev.map(listing =>
        listing.id === listingId
          ? { ...listing, view_count: listing.view_count + 1 }
          : listing
      ));
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
    createListing,
    updateListing,
    deleteListing,
    trackView,
  };
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d * 0.621371; // Convert to miles
}