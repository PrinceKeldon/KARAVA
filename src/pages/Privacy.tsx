import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const Privacy = () => {
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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective date: January 2026</p>
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
            <p className="text-muted-foreground">
              KARAVA ("we", "our", "us") respects your privacy and is committed to protecting the personal and business
              information you share with us. This Privacy Policy explains what data we collect, how we use it, and your
              rights when using the KARAVA platform.
            </p>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect only information necessary to assess supplier readiness and buyer fit. This may include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Company and contact information</li>
                <li>Export licences and certifications</li>
                <li>Product specifications and capacity data</li>
                <li>Uploaded documents provided voluntarily by users</li>
                <li>Technical data such as IP address, browser type, and usage logs</li>
              </ul>
              <p className="text-muted-foreground">
                We do not collect consumer personal data or sensitive personal identifiers unless explicitly required
                for verification purposes.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">2. How We Use Information</h2>
              <p className="text-muted-foreground">We use collected information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Evaluate supplier readiness against regulatory and buyer requirements</li>
                <li>Generate readiness scores and explanations</li>
                <li>Improve platform accuracy and reliability</li>
                <li>Communicate with users regarding their submissions or inquiries</li>
              </ul>
              <p className="text-muted-foreground">
                KARAVA does not sell user data and does not use data for advertising.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">3. AI Usage</h2>
              <p className="text-muted-foreground">
                Where enabled, AI is used strictly to explain readiness results and regulatory context. AI does not make
                decisions, alter scores, or override validation logic.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">4. Data Sharing</h2>
              <p className="text-muted-foreground">We do not share data with third parties except:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Where legally required</li>
                <li>With service providers strictly necessary to operate the platform (e.g. hosting, security)</li>
              </ul>
              <p className="text-muted-foreground">
                Supplier data is never shared with buyers without explicit user action.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">5. Data Retention</h2>
              <p className="text-muted-foreground">
                Data is retained only as long as necessary to provide the service or meet legal obligations. Users may
                request deletion of their data at any time.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access your data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion</li>
                <li>Restrict processing</li>
              </ul>
              <p className="text-muted-foreground">
                Requests can be made via the{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact page
                </a>
                .
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">7. Contact</h2>
              <p className="text-muted-foreground">
                For privacy-related questions, contact:{" "}
                <a href="mailto:privacy@karava.trade" className="text-primary hover:underline">
                  hello@karava.trade
                </a>
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
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
