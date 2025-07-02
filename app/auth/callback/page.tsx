"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          toast.error("Authentication failed");
          router.push("/auth/signin");
          return;
        }

        if (data.session) {
          toast.success("Signed in successfully!");
          // Redirect to dashboard after successful OAuth
          router.push("/dashboard");
        } else {
          router.push("/auth/signin");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        router.push("/auth/signin");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
