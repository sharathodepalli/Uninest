"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Search,
  MessageCircle,
  User,
  LogOut,
  Menu,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const navigation = [
    { name: "Search", href: "/search", icon: Search },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircle,
      requireAuth: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
            <span className="text-xl sm:text-2xl font-bold">UniNest</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
            {navigation.map((item) => {
              if (item.requireAuth && !user) return null;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {profile?.role === "host" && (
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link href="/listings/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Listing
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.photo_url || ""}
                        alt={profile?.name || ""}
                      />
                      <AvatarFallback>
                        {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === "host" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5 max-w-xs p-6">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
              <div className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => {
                  if (item.requireAuth && !user) return null;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}

                {user && profile?.role === "host" && (
                  <Link
                    href="/listings/new"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Listing
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
