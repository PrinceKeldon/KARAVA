import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact KARAVA
            </h1>
            <p className="text-muted-foreground">
              KARAVA is currently in early-stage operation and focused on a single trade corridor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl space-y-12"
          >
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">We welcome inquiries from:</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Kenyan suppliers and processors</li>
                <li>German buyers and importers</li>
                <li>Institutional partners and regulators</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-foreground">How to Reach Us</h2>
              
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">General Inquiries & Privacy Requests</p>
                    <a 
                      href="mailto:hello@karava.trade" 
                      className="text-primary hover:underline"
                    >
                      hello@karava.trade
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">What to Expect</h2>
              <p className="text-muted-foreground">
                We aim to respond within a reasonable timeframe. Please note that KARAVA does not provide individual consulting.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Location</h2>
              <p className="text-muted-foreground">
                KARAVA operates digitally and does not currently maintain a public office address.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground">
              © 2026 KARAVA. Discovery and qualification for Kenya-Germany agricultural trade.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
