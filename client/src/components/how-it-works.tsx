import { Search, Calendar, CreditCard, Star } from "lucide-react";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Getting quality healthcare has never been easier. Follow these simple steps to connect with trusted professionals.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.step} 
              className="relative text-center group"
              data-testid={`step-${step.step}`}
              variants={itemVariants}
            >
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                  style={{ background: "linear-gradient(to right, hsl(var(--primary) / 0.5), transparent)" }}
                />
              )}
              <motion.div 
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary mb-6 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className="h-9 w-9" />
                <motion.span 
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 400 }}
                >
                  {step.step}
                </motion.span>
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
