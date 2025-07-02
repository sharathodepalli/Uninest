import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    university: "Stanford University",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
    rating: 5,
    content:
      "UniNest made finding housing so much easier! I found my perfect apartment within walking distance of campus in just two days.",
  },
  {
    name: "Mike Chen",
    university: "UC Berkeley",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
    rating: 5,
    content:
      "The verification process gave me peace of mind. My host was amazing and the whole experience was seamless.",
  },
  {
    name: "Emily Rodriguez",
    university: "NYU",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
    rating: 5,
    content:
      "As an international student, UniNest helped me find housing before I even arrived in the US. The support team was incredibly helpful.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 flex flex-col items-center">
        <div className="text-center mb-16 w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Students Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have found their perfect home through
            UniNest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full justify-items-center">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-md w-full max-w-md mx-auto"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-4 justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex flex-col items-center gap-2 mt-4">
                  <Avatar className="h-10 w-10 mx-auto">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.university}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
