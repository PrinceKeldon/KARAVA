import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5"
            >
              About KARAVA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              A trade discovery and readiness platform built to make cross-border agricultural trade viable before it becomes expensive.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 border border-border text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">Our role</p>
              <p className="font-display text-lg font-semibold text-foreground">
                Not to promise deals. To make trade readiness visible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                The Problem We Solve
              </h2>
              <p className="text-muted-foreground mb-6">
                In regulated agricultural trade, most failures happen before a shipment ever leaves port:
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  "Suppliers believe they are export-ready — but fail on documentation, food safety systems, or buyer expectations",
                  "Buyers spend time screening suppliers that cannot legally or operationally ship",
                  "Trade support programs over-index on volume and optimism, under-index on compliance and risk",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-destructive mt-0.5">•</span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                The result is wasted time, failed trial shipments, rejected consignments, and broken trust.
              </p>
              <p className="text-foreground font-medium mt-4">
                KARAVA addresses this gap before introductions are made.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-10">
                Our Approach
              </h2>
              
              <div className="space-y-8">
                {/* Principle 1 */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">
                      1
                    </div>
                    <h3 className="font-display font-semibold text-foreground">
                      Start where standards are highest
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tree nuts and oilseeds entering Germany face:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Mandatory export licensing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>EU contaminant and pesticide controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Third-party food safety certification expectations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Strict labelling, traceability, and documentation norms</span>
                    </li>
                  </ul>
                  <p className="text-sm text-foreground mt-4 font-medium">
                    If a digital corridor works here, it can scale elsewhere.
                  </p>
                </div>

                {/* Principle 2 */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">
                      2
                    </div>
                    <h3 className="font-display font-semibold text-foreground">
                      Separate readiness from aspiration
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    KARAVA evaluates suppliers based on current, verifiable state, not future plans.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">—</span>
                      <span className="text-muted-foreground">"We plan to certify next year" does not increase readiness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">—</span>
                      <span className="text-muted-foreground">"We can double capacity if demand exists" does not raise volume scores</span>
                    </li>
                  </ul>
                  <p className="text-sm text-foreground mt-4 font-medium">
                    Only documented licences, certificates, lab tests, and systems count.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This creates trust on the buyer side and clarity on the supplier side.
                  </p>
                </div>

                {/* Principle 3 */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">
                      3
                    </div>
                    <h3 className="font-display font-semibold text-foreground">
                      Use technology to explain, not override
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    KARAVA uses structured scoring to determine readiness and risk. AI is used only to:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Explain why a supplier passed or failed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Translate regulations into plain language</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Recommend concrete next steps to improve readiness</span>
                    </li>
                  </ul>
                  <p className="text-sm text-foreground mt-4 font-medium">
                    AI never overrides scores, waives requirements, or predicts deal success.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This distinction is explicit by design.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What KARAVA Is / Isn't */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                What KARAVA Is — and Is Not
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    KARAVA is
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "A readiness and discovery layer for cross-border trade",
                      "A filter that saves buyers time and reduces supplier failure",
                      "A system that makes compliance visible and actionable",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-primary mt-0.5">✓</span>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    KARAVA is not
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "A marketplace promising transactions",
                      "A lead-generation platform without qualification",
                      "A replacement for contracts, audits, or inspections",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-muted-foreground mt-0.5">—</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why We Start Narrow */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Why We Start Narrow
              </h2>
              <p className="text-muted-foreground mb-6">
                KARAVA deliberately starts with:
              </p>
              <ul className="space-y-2 text-sm text-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>One corridor (Kenya → Germany)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Few product categories (high-compliance nuts and oilseeds)</span>
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                This allows us to:
              </p>
              <ul className="space-y-2 text-sm text-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Encode real regulatory and buyer logic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Maintain strict scoring thresholds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Build credibility with early adopters</span>
                </li>
              </ul>
              <p className="text-foreground font-medium">
                Expansion comes only after the corridor proves reliable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Creation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                How KARAVA Creates Value
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border text-center">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-2xl mx-auto mb-4">
                    🇰🇪
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">For Suppliers</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear visibility into what blocks access to German buyers — and what to fix next.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border text-center">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-2xl mx-auto mb-4">
                    🇩🇪
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">For Buyers</h3>
                  <p className="text-sm text-muted-foreground">
                    Fewer unqualified conversations, lower compliance risk, and faster sourcing decisions.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border text-center">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-2xl mx-auto mb-4">
                    🌍
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">For the Corridor</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduced rejection rates, fewer failed trials, and higher trust per introduction.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Closing */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-primary-foreground/70 mb-4">In One Sentence</p>
            <h2 className="font-display text-xl md:text-2xl font-bold max-w-3xl mx-auto mb-8">
              KARAVA builds digital trade corridors by making readiness measurable, explainable, and honest — starting where standards are highest.
            </h2>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/')}
            >
              Get Started
            </Button>
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
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
