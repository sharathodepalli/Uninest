'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/listings/image-upload';
import { MapPin, DollarSign, Home, Calendar, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  address: z.string().min(10, 'Please provide a complete address'),
  rent: z.number().min(1, 'Rent must be greater than 0'),
  deposit: z.number().optional(),
  bedrooms: z.number().min(1, 'Must have at least 1 bedroom'),
  bathrooms: z.number().min(0.5, 'Must have at least 0.5 bathrooms'),
  square_feet: z.number().optional(),
  available_date: z.string().min(1, 'Available date is required'),
  amenities: z.array(z.string()).default([]),
});

type ListingFormData = z.infer<typeof listingSchema>;

const amenitiesList = [
  'WiFi',
  'Parking',
  'Gym',
  'Kitchen',
  'Laundry',
  'Air Conditioning',
  'Heating',
  'Dishwasher',
  'Microwave',
  'Furnished',
  'Pet Friendly',
  'Balcony',
];

export function ListingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      address: '',
      rent: 0,
      deposit: 0,
      bedrooms: 1,
      bathrooms: 1,
      square_feet: 0,
      available_date: '',
      amenities: [],
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    if (!user) {
      toast.error('You must be signed in to create a listing');
      return;
    }

    setSubmitting(true);

    try {
      // Geocode the address (in a real app, you'd use a geocoding service)
      const mockLatitude = 40.7128 + (Math.random() - 0.5) * 0.1;
      const mockLongitude = -74.0060 + (Math.random() - 0.5) * 0.1;

      const listingData = {
        host_id: user.id,
        title: data.title,
        description: data.description,
        address: data.address,
        latitude: mockLatitude,
        longitude: mockLongitude,
        rent: data.rent,
        deposit: data.deposit || null,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        square_feet: data.square_feet || null,
        available_date: data.available_date,
        photos_urls: photos,
        amenities: data.amenities,
        status: 'active' as const,
      };

      const { data: listing, error } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Listing created successfully!');
      router.push(`/listings/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cozy 2BR Apartment Near Campus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property, its features, and what makes it special..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123 University Ave, City, State 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseFloat(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="square_feet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Square Feet (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 800"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1200"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1200"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Available Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {amenitiesList.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amenity}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, amenity])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== amenity
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {amenity}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload photos={photos} onPhotosChange={setPhotos} />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}