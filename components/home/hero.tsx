"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Search, MapPin, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Hero() {
  const [location, setLocation] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [budget, setBudget] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (moveInDate) params.set("date", moveInDate);
    if (budget) params.set("maxRent", budget);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 w-full">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto space-y-8 w-full">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect
              <span className="text-primary block">Student Housing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover verified student housing near your university. Connect
              with trusted hosts and find your home away from home.
            </p>
          </div>

          <Card className="p-6 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="University or City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Move-in Date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Max Budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Start Searching
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/auth/signup">List Your Property</a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Verified Hosts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
