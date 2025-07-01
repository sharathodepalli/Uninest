import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
      <div className="container text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Find Your Perfect Student Housing?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of students who have found their ideal home away from home. Start your search today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              Start Searching
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              List Your Property
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <span>✓ Free to Search</span>
            <span>✓ Verified Listings</span>
            <span>✓ Secure Messaging</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}