"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Eye, MessageCircle, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

interface Stats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  unreadMessages: number;
  monthlyRevenue: number;
}

export function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    unreadMessages: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      // Get listings stats
      const { data: listings } = await supabase
        .from("listings")
        .select("id, status, view_count, rent")
        .eq("host_id", user.id);

      // Get unread messages count
      const { data: messages } = await supabase
        .from("messages")
        .select("id")
        .eq("receiver_id", user.id)
        .is("read_at", null);

      const totalListings = listings?.length || 0;
      const activeListings =
        listings?.filter((l) => l.status === "active").length || 0;
      const totalViews =
        listings?.reduce((sum, l) => sum + l.view_count, 0) || 0;
      const unreadMessages = messages?.length || 0;

      // Calculate potential monthly revenue from active listings
      const monthlyRevenue =
        listings
          ?.filter((l) => l.status === "active")
          .reduce((sum, l) => sum + l.rent, 0) || 0;

      setStats({
        totalListings,
        activeListings,
        totalViews,
        unreadMessages,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  const statCards = [
    {
      title: "Total Listings",
      value: stats.totalListings,
      icon: Home,
      description: `${stats.activeListings} active`,
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      description: "All time views",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageCircle,
      description: "Pending responses",
    },
    {
      title: "Potential Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Monthly potential",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
