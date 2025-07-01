'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, DollarSign, Home, Bath, Wifi, Car, Dumbbell, Utensils } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    location: string;
    minRent?: number;
    maxRent?: number;
    bedrooms?: number;
    bathrooms?: number;
    availableDate?: string;
    amenities: string[];
    radius: number;
  };
  onFiltersChange: (filters: any) => void;
}

const amenitiesList = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'laundry', label: 'Laundry', icon: Home },
  { id: 'ac', label: 'Air Conditioning', icon: Home },
];

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minRent || 0, filters.maxRent || 3000]);

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      minRent: values[0] > 0 ? values[0] : undefined,
      maxRent: values[1] < 3000 ? values[1] : undefined,
    });
  };

  const handleBedroomsChange = (bedrooms: string) => {
    onFiltersChange({
      ...filters,
      bedrooms: bedrooms === 'any' ? undefined : parseInt(bedrooms),
    });
  };

  const handleBathroomsChange = (bathrooms: string) => {
    onFiltersChange({
      ...filters,
      bathrooms: bathrooms === 'any' ? undefined : parseInt(bathrooms),
    });
  };

  const handleDateChange = (date: string) => {
    onFiltersChange({ ...filters, availableDate: date });
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenityId]
      : filters.amenities.filter(id => id !== amenityId);
    
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      minRent: undefined,
      maxRent: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      availableDate: undefined,
      amenities: [],
      radius: 10,
    });
    setPriceRange([0, 3000]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="University or City"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={3000}
              step={50}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Bedrooms
          </Label>
          <Select value={filters.bedrooms?.toString() || 'any'} onValueChange={handleBedroomsChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            Bathrooms
          </Label>
          <Select value={filters.bathrooms?.toString() || 'any'} onValueChange={handleBathroomsChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Available Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Available Date
          </Label>
          <Input
            id="date"
            type="date"
            value={filters.availableDate || ''}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label>Amenities</Label>
          <div className="space-y-2">
            {amenitiesList.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={filters.amenities.includes(amenity.id)}
                  onCheckedChange={(checked) => 
                    handleAmenityChange(amenity.id, checked as boolean)
                  }
                />
                <Label htmlFor={amenity.id} className="flex items-center gap-2 text-sm">
                  <amenity.icon className="h-4 w-4" />
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}