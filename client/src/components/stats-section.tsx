import { Users, Award, Calendar, Heart } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Patients",
  },
  {
    icon: Award,
    value: "500+",
    label: "Verified Providers",
  },
  {
    icon: Calendar,
    value: "50,000+",
    label: "Appointments Booked",
  },
  {
    icon: Heart,
    value: "4.9",
    label: "Average Rating",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
