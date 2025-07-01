'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface ListingMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address: string;
}

export function ListingMap({ latitude, longitude, address }: ListingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mapbox integration would be implemented here
    // For now, we show a styled placeholder
  }, [latitude, longitude]);

  return (
    <Card>
      <CardContent className="p-0">
        <div 
          ref={mapContainer}
          className="w-full h-64 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden"
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />
            </svg>
          </div>

          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-500 rounded-full p-2 shadow-lg animate-pulse">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm mx-4">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-gray-900">{address}</p>
            <p className="text-sm text-gray-600 mt-1">
              Interactive map ready for Mapbox integration
            </p>
            {latitude && longitude && (
              <p className="text-xs text-gray-500 mt-1">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
          <div className="absolute top-8 right-6 w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-6 left-8 w-4 h-4 bg-orange-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
        </div>
      </CardContent>
    </Card>
  );
}