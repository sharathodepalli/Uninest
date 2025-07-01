import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "UniNest - Student Housing Made Simple",
  description:
    "Find your perfect student housing with UniNest. Connect with verified hosts and discover amazing places to live near your university.",
  keywords:
    "student housing, university housing, college housing, rent, apartments, dorms",
  openGraph: {
    title: "UniNest - Student Housing Made Simple",
    description:
      "Find your perfect student housing with UniNest. Connect with verified hosts and discover amazing places to live near your university.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniNest - Student Housing Made Simple",
    description:
      "Find your perfect student housing with UniNest. Connect with verified hosts and discover amazing places to live near your university.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
