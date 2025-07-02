"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { ListingGallery } from "@/components/listings/listing-gallery";
import { ListingMap } from "@/components/listings/listing-map";
import { ContactHost } from "@/components/listings/contact-host";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  Heart,
  Share2,
  Shield,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Home as HomeIcon,
  Snowflake,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
  profiles: {
    name: string;
    photo_url: string | null;
    verified: boolean;
    bio: string | null;
    created_at: string;
  };
};

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  kitchen: Utensils,
  laundry: HomeIcon,
  ac: Snowflake,
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) {
      checkFavoriteStatus();
    }
  }, [params.id, user]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          profiles:host_id (
            name,
            photo_url,
            verified,
            bio,
            created_at
          )
        `
        )
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setListing(data as Listing);

      // Track view
      await supabase.from("listing_views").insert({
        listing_id: params.id as string,
        viewer_id: user?.id,
      });
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", params.id as string)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", params.id as string);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          listing_id: params.id as string,
        });
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Button onClick={() => router.push("/search")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-6">
        {/* Image Gallery */}
        <ListingGallery photos={listing.photos_urls} title={listing.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={toggleFavorite}>
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {listing.bathrooms} bathroom
                  {listing.bathrooms !== 1 ? "s" : ""}
                </div>
                {listing.square_feet && (
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {listing.square_feet} sq ft
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Available{" "}
                  {new Date(listing.available_date).toLocaleDateString()}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-primary">
                  ${listing.rent}
                  <span className="text-lg text-muted-foreground font-normal">
                    /month
                  </span>
                </div>
                {listing.deposit && (
                  <div className="text-sm text-muted-foreground">
                    ${listing.deposit} deposit
                  </div>
                )}
              </div>

              {listing.featured && (
                <Badge className="mb-4 bg-orange-500">Featured Listing</Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity) => {
                    const IconComponent =
                      amenityIcons[amenity.toLowerCase()] || HomeIcon;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <ListingMap
                latitude={listing.latitude}
                longitude={listing.longitude}
                address={listing.address}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.profiles.photo_url || ""} />
                    <AvatarFallback>
                      {listing.profiles.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{listing.profiles.name}</h3>
                      {listing.profiles.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Host since{" "}
                      {new Date(listing.profiles.created_at).getFullYear()}
                    </p>
                  </div>
                </div>

                {listing.profiles.bio && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {listing.profiles.bio}
                  </p>
                )}

                <Button
                  className="w-full"
                  onClick={() => setShowContactForm(true)}
                  disabled={user?.id === listing.host_id}
                >
                  {user?.id === listing.host_id
                    ? "Your Listing"
                    : "Contact Host"}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span>Student Housing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms</span>
                    <span>{listing.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms</span>
                    <span>{listing.bathrooms}</span>
                  </div>
                  {listing.square_feet && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Square Feet</span>
                      <span>{listing.square_feet}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span>
                      {new Date(listing.available_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">
                      Stay Safe
                    </h4>
                    <p className="text-sm text-orange-800">
                      Never send money or personal information before viewing
                      the property. Meet in person and verify the host&apos;s
                      identity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactHost
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        listing={listing}
        hostName={listing.profiles.name}
      />
    </div>
  );
}
