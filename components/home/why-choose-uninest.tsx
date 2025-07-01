import React from "react";

export function WhyChooseUniNest() {
  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 flex flex-col items-center text-center gap-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-primary">
        Why Choose UniNest?
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        We make finding student housing simple, safe, and stress-free with our
        comprehensive platform.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full mt-4 justify-items-center">
        <div className="bg-white dark:bg-muted rounded-lg shadow p-6 flex flex-col items-center w-full max-w-xs mx-auto">
          <span className="font-semibold text-lg mb-2">Verified Hosts</span>
          <span className="text-sm text-muted-foreground">
            All hosts are verified through our comprehensive background check
            process.
          </span>
        </div>
        <div className="bg-white dark:bg-muted rounded-lg shadow p-6 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Real-time Chat</span>
          <span className="text-sm text-muted-foreground">
            Connect instantly with hosts and get answers to your questions in
            real-time.
          </span>
        </div>
        <div className="bg-white dark:bg-muted rounded-lg shadow p-6 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">
            Location-based Search
          </span>
          <span className="text-sm text-muted-foreground">
            Find housing within walking distance of your university or preferred
            area.
          </span>
        </div>
        <div className="bg-white dark:bg-muted rounded-lg shadow p-6 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Reviews & Ratings</span>
          <span className="text-sm text-muted-foreground">
            Read honest reviews from previous tenants to make informed
            decisions.
          </span>
        </div>
        <div className="bg-white dark:bg-muted rounded-lg shadow p-6 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Roommate Matching</span>
          <span className="text-sm text-muted-foreground">
            Find compatible roommates based on your preferences and lifestyle.
          </span>
        </div>
        <div className="bg-white dark:bg-muted rounded-lg shadow p-6 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">24/7 Support</span>
          <span className="text-sm text-muted-foreground">
            Our dedicated support team is always here to help you with any
            questions.
          </span>
        </div>
      </div>
    </section>
  );
}
