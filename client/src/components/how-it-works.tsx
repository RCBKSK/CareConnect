import { Search, Calendar, CreditCard, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Provider",
    description: "Search for healthcare professionals by specialty, location, and availability",
    step: 1,
  },
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Choose a convenient time slot for online consultation or home visit",
    step: 2,
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay securely online with our Stripe integration for a seamless experience",
    step: 3,
  },
  {
    icon: Star,
    title: "Get Care & Review",
    description: "Receive quality care and share your experience to help others",
    step: 4,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting quality healthcare has never been easier. Follow these simple steps to connect with trusted professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.step} 
              className="relative text-center"
              data-testid={`step-${step.step}`}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <step.icon className="h-7 w-7" />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
