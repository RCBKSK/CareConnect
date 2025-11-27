import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, HeartPulse, Stethoscope, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "physiotherapist",
    title: "Physiotherapy",
    description: "Expert physical therapy for recovery, pain management, and mobility improvement",
    icon: Activity,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    id: "nurse",
    title: "Home Nursing",
    description: "Professional nursing care in the comfort of your home for recovery and wellness",
    icon: HeartPulse,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950",
  },
  {
    id: "doctor",
    title: "Doctor Consultations",
    description: "Qualified doctors available for home visits and online consultations",
    icon: Stethoscope,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
];

export function ServiceCategories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of professional healthcare services, all delivered with care and expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/providers?type=${category.id}`}>
              <Card 
                className="h-full hover-elevate transition-all duration-200 cursor-pointer group"
                data-testid={`card-category-${category.id}`}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4`}>
                    <category.icon className={`h-7 w-7 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground flex-1">{category.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary font-medium">
                    <span>Find providers</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
