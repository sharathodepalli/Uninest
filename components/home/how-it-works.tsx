import { Search, MessageCircle, Key } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Discover',
    description: 'Browse through verified listings near your university using our advanced search filters.',
    step: '01',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Chat',
    description: 'Message hosts directly through our secure platform to ask questions and schedule viewings.',
    step: '02',
  },
  {
    icon: Key,
    title: 'Book & Move In',
    description: 'Complete your booking securely online and get ready to move into your new home.',
    step: '03',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect student housing is just three simple steps away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.step}
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border transform -translate-x-1/2 -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}