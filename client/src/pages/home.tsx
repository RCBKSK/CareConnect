import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search-bar";
import { ServiceCategories } from "@/components/service-categories";
import { HowItWorks } from "@/components/how-it-works";
import { StatsSection } from "@/components/stats-section";
import { Testimonials } from "@/components/testimonials";
import { CTASection } from "@/components/cta-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Shield, Clock, Award, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 -z-10" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge variant="secondary" className="text-sm px-4 py-1" data-testid="badge-hero">
                Trusted by 10,000+ patients
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                Find Expert Healthcare
                <span className="text-primary block mt-2">At Your Doorstep</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with verified physiotherapists, doctors, and home care nurses. 
                Quality healthcare delivered where you need it, when you need it.
              </p>
              
              <SearchBar className="max-w-3xl mx-auto" />
              
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Link href="/providers?type=physiotherapist">
                  <Badge 
                    variant="outline" 
                    className="px-4 py-2 text-sm cursor-pointer hover-elevate"
                    data-testid="badge-physio"
                  >
                    Physiotherapy
                  </Badge>
                </Link>
                <Link href="/providers?type=nurse">
                  <Badge 
                    variant="outline" 
                    className="px-4 py-2 text-sm cursor-pointer hover-elevate"
                    data-testid="badge-nursing"
                  >
                    Home Nursing
                  </Badge>
                </Link>
                <Link href="/providers?type=doctor">
                  <Badge 
                    variant="outline" 
                    className="px-4 py-2 text-sm cursor-pointer hover-elevate"
                    data-testid="badge-doctor"
                  >
                    Doctor Consultation
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4" data-testid="feature-verified">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Verified Professionals</h3>
                  <p className="text-sm text-muted-foreground">All providers are background-checked and certified</p>
                </div>
              </div>
              <div className="flex items-center gap-4" data-testid="feature-booking">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Easy Online Booking</h3>
                  <p className="text-sm text-muted-foreground">Book appointments in minutes, 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-4" data-testid="feature-quality">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quality Guaranteed</h3>
                  <p className="text-sm text-muted-foreground">Rated 4.9/5 by thousands of patients</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServiceCategories />
        <HowItWorks />
        <StatsSection />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
