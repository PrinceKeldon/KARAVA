import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const Terms = () => {
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
              Terms of Use
            </h1>
            <p className="text-muted-foreground">
              Effective date: January 2026
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
            <p className="text-muted-foreground">
              By accessing or using KARAVA, you agree to these Terms of Use.
            </p>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">1. Purpose of KARAVA</h2>
              <p className="text-muted-foreground">
                KARAVA is a readiness assessment and discovery tool for cross-border trade.
              </p>
              <p className="text-muted-foreground">KARAVA:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Does not facilitate transactions</li>
                <li>Does not guarantee buyer interest</li>
                <li>Does not provide legal, financial, or regulatory advice</li>
              </ul>
              <p className="text-muted-foreground">
                All outputs are informational and decision-support only.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">2. User Responsibilities</h2>
              <p className="text-muted-foreground">Users are responsible for:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Providing accurate, current, and verifiable information</li>
                <li>Uploading documents they are authorized to share</li>
                <li>Using KARAVA outputs responsibly</li>
              </ul>
              <p className="text-muted-foreground">
                False or misleading submissions may result in suspension or removal.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">3. Scoring & Assessments</h2>
              <p className="text-muted-foreground">
                Readiness scores are generated using deterministic rules and verified inputs. Scores reflect current documented readiness only.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Scores do not predict commercial success</li>
                <li>Scores may change if data is updated or corrected</li>
              </ul>
              <p className="text-muted-foreground">
                KARAVA makes no warranty that a readiness score will lead to commercial engagement.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">4. AI Explanations</h2>
              <p className="text-muted-foreground">Where AI explanations are provided:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>They are informational only</li>
                <li>They do not replace expert advice</li>
                <li>They do not modify underlying scores</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">To the fullest extent permitted by law:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>KARAVA is not liable for commercial decisions made based on platform outputs</li>
                <li>KARAVA is not responsible for trade outcomes, losses, or missed opportunities</li>
              </ul>
              <p className="text-muted-foreground">
                Use of the platform is at your own discretion.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All platform content, logic, and scoring methodologies are the property of KARAVA unless otherwise stated.
              </p>
              <p className="text-muted-foreground">
                Users retain ownership of their submitted data.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">7. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of the Federal Republic of Germany, without regard to conflict of law principles.
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

export default Terms;
