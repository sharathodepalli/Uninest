'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ListingGalleryProps {
  photos: string[];
  title: string;
}

export function ListingGallery({ photos, title }: ListingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const defaultPhotos = [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % displayPhotos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? displayPhotos.length - 1 : selectedImage - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-96 rounded-lg overflow-hidden">
        {/* Main Image */}
        <div 
          className="col-span-2 row-span-2 cursor-pointer relative group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={displayPhotos[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Secondary Images */}
        {displayPhotos.slice(1, 5).map((photo, index) => (
          <div
            key={index + 1}
            className="cursor-pointer relative group overflow-hidden"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={photo}
              alt={`${title} - Image ${index + 2}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {/* Show more overlay on last image */}
            {index === 3 && displayPhotos.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{displayPhotos.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-4 w-4" />
            </Button>

            {selectedImage !== null && (
              <>
                <img
                  src={displayPhotos[selectedImage]}
                  alt={`${title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                />

                {/* Navigation */}
                {displayPhotos.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {displayPhotos.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}