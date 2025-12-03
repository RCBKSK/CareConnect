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
import { Shield, Clock, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth"; // Assuming useAuth is imported from here

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  console.log("Home page rendering");
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 animated-gradient -z-10" />
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl -z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />

          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="text-sm px-4 py-2 gap-2 shimmer" data-testid="badge-hero">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Trusted by 10,000+ patients
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                variants={fadeInUp}
              >
                Find Expert Healthcare
                <motion.span
                  className="text-primary block mt-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  At Your Doorstep
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Connect with verified physiotherapists, doctors, and home care nurses.
                Quality healthcare delivered where you need it, when you need it.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <SearchBar className="max-w-3xl mx-auto" />
              </motion.div>

              <motion.div
                className="flex flex-wrap justify-center gap-3 pt-4"
                variants={fadeInUp}
              >
                <Link href="/providers?type=physiotherapist">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    data-testid="badge-physio"
                  >
                    Physiotherapy
                  </Badge>
                </Link>
                <Link href="/providers?type=nurse">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    data-testid="badge-nursing"
                  >
                    Home Nursing
                  </Badge>
                </Link>
                <Link href="/providers?type=doctor">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    data-testid="badge-doctor"
                  >
                    Doctor Consultation
                  </Badge>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 border-y bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300 icon-bounce"
                data-testid="feature-verified"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Verified Professionals</h3>
                  <p className="text-sm text-muted-foreground">All providers are background-checked and certified</p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300 icon-bounce"
                data-testid="feature-booking"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Easy Online Booking</h3>
                  <p className="text-sm text-muted-foreground">Book appointments in minutes, 24/7</p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300 icon-bounce"
                data-testid="feature-quality"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quality Guaranteed</h3>
                  <p className="text-sm text-muted-foreground">Rated 4.9/5 by thousands of patients</p>
                </div>
              </motion.div>
            </motion.div>
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