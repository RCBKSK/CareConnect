import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have found trusted healthcare providers through CareConnect. 
            Quality care is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base" data-testid="button-find-provider">
              <Link href="/providers">
                Find a Provider
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base" data-testid="button-become-provider">
              <Link href="/register?role=provider">
                <UserPlus className="mr-2 h-5 w-5" />
                Become a Provider
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
