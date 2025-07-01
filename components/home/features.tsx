import {
  Shield,
  MessageCircle,
  MapPin,
  Star,
  Users,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Verified Hosts",
    description:
      "All hosts are verified through our comprehensive background check process.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description:
      "Connect instantly with hosts and get answers to your questions in real-time.",
  },
  {
    icon: MapPin,
    title: "Location-based Search",
    description:
      "Find housing within walking distance of your university or preferred area.",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description:
      "Read honest reviews from previous tenants to make informed decisions.",
  },
  {
    icon: Users,
    title: "Roommate Matching",
    description:
      "Find compatible roommates based on your preferences and lifestyle.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our dedicated support team is always here to help you with any questions.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex flex-col items-center text-center mb-16 gap-4 w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Why Choose UniNest?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make finding student housing simple, safe, and stress-free with
            our comprehensive platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center h-full"
            >
              <CardHeader className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
