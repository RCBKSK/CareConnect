import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Patient",
    avatar: "",
    rating: 5,
    comment: "CareConnect made it so easy to find a physiotherapist after my surgery. The home visits were incredibly convenient, and my recovery was faster than expected.",
  },
  {
    id: 2,
    name: "James Peterson",
    role: "Patient",
    avatar: "",
    rating: 5,
    comment: "Having a nurse come to my elderly mother's home for regular check-ups gives our family peace of mind. The booking process is simple and the staff is always professional.",
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Patient",
    avatar: "",
    rating: 5,
    comment: "I was able to book a doctor's home visit within hours when my child got sick. The doctor was thorough and caring. Highly recommend this service!",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">What Our Patients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real patients who found quality healthcare through CareConnect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full" data-testid={`testimonial-${testimonial.id}`}>
              <CardContent className="p-6 flex flex-col h-full">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground flex-1 mb-6">{testimonial.comment}</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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
