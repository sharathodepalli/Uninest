import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyChooseUniNest } from "@/components/home/why-choose-uninest";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 w-full max-w-full 2xl:max-w-7xl mx-auto px-2 sm:px-4 md:px-8 flex flex-col gap-12">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}
