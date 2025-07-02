"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageCircle, Heart, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

interface ActivityStats {
  totalViews: number;
  totalMessages: number;
  totalFavorites: number;
  memberSince: string;
}

export function ProfileStats() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<ActivityStats>({
    totalViews: 0,
    totalMessages: 0,
    totalFavorites: 0,
    memberSince: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      // Get message count
      const { data: messages } = await supabase
        .from("messages")
        .select("id")
        .eq("sender_id", user.id);

      // Get favorites count
      const { data: favorites } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id);

      // Get view count (if host)
      let totalViews = 0;
      if (profile?.role === "host") {
        const { data: listings } = await supabase
          .from("listings")
          .select("view_count")
          .eq("host_id", user.id);

        totalViews =
          listings?.reduce((sum, listing) => sum + listing.view_count, 0) || 0;
      }

      setStats({
        totalViews,
        totalMessages: messages?.length || 0,
        totalFavorites: favorites?.length || 0,
        memberSince: profile?.created_at || "",
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  const statCards = [
    {
      title: "Messages Sent",
      value: stats.totalMessages,
      icon: MessageCircle,
      description: "Total conversations",
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      description: "Saved listings",
    },
    ...(profile?.role === "host"
      ? [
          {
            title: "Profile Views",
            value: stats.totalViews,
            icon: Eye,
            description: "Listing views",
          },
        ]
      : []),
    {
      title: "Member Since",
      value: stats.memberSince
        ? new Date(stats.memberSince).getFullYear()
        : "2024",
      icon: Calendar,
      description: "Years on UniNest",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Account Type:</span>
              <span className="ml-2 capitalize font-medium">
                {profile?.role}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{profile?.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">University:</span>
              <span className="ml-2 font-medium">
                {profile?.university || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                Verification Status:
              </span>
              <span
                className={`ml-2 font-medium ${
                  profile?.verified ? "text-green-600" : "text-orange-600"
                }`}
              >
                {profile?.verified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
