import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">UniNest</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making student housing simple and accessible for everyone.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@uninest.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-foreground">Find Housing</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
              <li><Link href="/safety" className="hover:text-foreground">Safety Tips</Link></li>
              <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Hosts</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/host" className="hover:text-foreground">List Your Property</Link></li>
              <li><Link href="/host-guide" className="hover:text-foreground">Host Guide</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/resources" className="hover:text-foreground">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 UniNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}