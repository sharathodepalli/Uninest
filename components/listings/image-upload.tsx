'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export function ImageUpload({ photos, onPhotosChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  // For demo purposes, we'll use placeholder images
  const sampleImages = [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const handleAddSampleImages = () => {
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newPhotos = [...photos, ...sampleImages.slice(0, 3)];
      onPhotosChange(newPhotos);
      setUploading(false);
      toast.success('Sample images added!');
    }, 1000);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In a real app, you would upload to Supabase Storage here
    toast.info('File upload integration would be implemented here');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Property Photos</h3>
          <p className="text-muted-foreground text-center mb-6">
            Add high-quality photos to showcase your property. The first photo will be the main image.
          </p>
          
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSampleImages}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Sample Images
                </>
              )}
            </Button>
            
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Property photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemovePhoto(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main Photo
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No photos uploaded yet. Add some photos to make your listing more attractive!
        </p>
      )}
    </div>
  );
}