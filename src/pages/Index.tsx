import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { RoleCard } from "@/components/RoleCard";
import { InteractiveChainVisualization } from "@/components/InteractiveChainVisualization";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { ProcessorOnboarding } from "@/components/onboarding/ProcessorOnboarding";
import { BuyerDiscovery } from "@/components/onboarding/BuyerDiscovery";
import { BuyerOnboarding } from "@/components/onboarding/BuyerOnboarding";
import { ArrowRight, X } from "lucide-react";

type Role = "supplier" | "buyer" | null;
type BuyerFlow = "onboarding" | "discovery";

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [buyerFlow, setBuyerFlow] = useState<BuyerFlow>("onboarding");
  const [buyerId, setBuyerId] = useState<string | undefined>();

  const roles = [
    {
      id: "supplier" as const,
      icon: "🏭",
      title: "Kenyan Supplier",
      subtitle: "Growers, Processors & Exporters",
      description: "Evaluate your market readiness for German buyers. Identify gaps and receive actionable qualification guidance.",
    },
    {
      id: "buyer" as const,
      icon: "🏢",
      title: "German Buyer",
      subtitle: "Importers & Processors",
      description: "Define your requirements clearly. Assess supplier fit before outreach. Reduce failed introductions.",
    },
  ];

  // Stats are illustrative projections, not verified metrics
  const stats = [
    { value: "78%", label: "Target assessment accuracy", sublabel: "for market readiness (projected)" },
    { value: "3.2x", label: "Expected reduction in failed intros", sublabel: "compared to cold outreach (projected)" },
    { value: "14 days", label: "Target qualification time", sublabel: "from intake to assessment (projected)" },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Submit Profile",
      description: "Suppliers provide structured information. Buyers define requirements.",
    },
    {
      step: "02",
      title: "Assess Fit",
      description: "Our system evaluates alignment, identifies gaps, and generates readiness scores.",
    },
    {
      step: "03",
      title: "Address Gaps",
      description: "Clear guidance on what needs improvement before market access.",
    },
    {
      step: "04",
      title: "Request Introduction",
      description: "When alignment exists, facilitate informed introductions between qualified parties.",
    },
  ];

  const handleBuyerClick = () => {
    setSelectedRole("buyer");
    setBuyerFlow("onboarding");
    setBuyerId(undefined);
  };

  const handleBuyerOnboardingComplete = (id: string) => {
    setBuyerId(id);
    setBuyerFlow("discovery");
  };

  const handleCloseModal = () => {
    setSelectedRole(null);
    setBuyerFlow("onboarding");
    setBuyerId(undefined);
  };

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
              className="hidden md:inline-flex text-muted-foreground"
              onClick={() => navigate('/about')}
            >
              About
            </Button>
            {/* Sign In button removed for MVP - authentication not yet implemented */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium text-muted-foreground mb-4 tracking-wide uppercase"
            >
              Discovery & Qualification Platform
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight"
            >
              Assess market fit between Kenyan suppliers and German buyers
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              KARAVA helps agricultural suppliers and importers evaluate alignment before trade happens. 
              Reduce wasted outreach. Identify gaps early. Enable informed introductions.
            </motion.p>
          </div>

          {/* Role Selection Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-16"
          >
            {roles.map((role, index) => (
              <RoleCard
                key={role.id}
                icon={role.icon}
                title={role.title}
                subtitle={role.subtitle}
                description={role.description}
                onClick={() => role.id === "buyer" ? handleBuyerClick() : setSelectedRole(role.id)}
                delay={index}
              />
            ))}
          </motion.div>

        </div>
      </section>

      {/* Corridor & Focus Micro-Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Current Focus Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground border border-border">
                <span>🇰🇪</span>
                <span>Kenya → Germany</span>
                <span>🇩🇪</span>
              </span>
            </motion.div>
            
            {/* Product Categories */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center mb-6"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Initial Product Categories
              </h3>
              <p className="text-muted-foreground">
                Export-grade tree nuts and selected oilseeds
              </p>
              <p className="text-sm text-muted-foreground">
                (including macadamia and comparable regulated categories)
              </p>
            </motion.div>
            
            {/* Why These Categories */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h4 className="font-display font-semibold text-foreground mb-4">
                Why these categories
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                These products face the strictest combination of:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-foreground">Legal export requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-foreground">EU food safety and contaminant controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-foreground">German buyer readiness thresholds</span>
                </li>
              </ul>
              
              {/* Key Statement */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-foreground">
                  By starting where compliance, quality, and documentation are non-negotiable, KARAVA builds a corridor where trade readiness is{" "}
                  <strong>verified, scored, and explainable</strong> — not assumed.
                </p>
              </div>
              
              {/* Intentional Design Note */}
              <p className="mt-4 text-xs text-muted-foreground italic">
                KARAVA is designed so that most suppliers are not immediately ready — and that is intentional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do / Don't Do Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              What KARAVA provides
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* What we do */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  We provide
                </h3>
                <ul className="space-y-3">
                  {[
                    "Structured supplier profiles in buyer-relevant formats",
                    "Clear buyer requirement specifications",
                    "Market-fit scoring and gap analysis",
                    "Readiness signals and qualification guidance",
                    "Informed introductions when alignment exists",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-primary mt-0.5">✓</span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What we don't do */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  We do not provide
                </h3>
                <ul className="space-y-3">
                  {[
                    "Product buying or selling",
                    "Payment processing or pricing",
                    "Logistics or shipping coordination",
                    "Compliance execution or certification",
                    "Guarantees of trade outcomes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-muted-foreground mt-0.5">—</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Unified */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                The Process
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                How KARAVA Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A structured process from intake to qualified introduction
              </p>
            </motion.div>
            
            {/* Step Overview Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-10">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-display font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-sm">
                    {step.step}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1.5 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Interactive Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 md:p-8 border border-primary/20 shadow-lg"
            >
              <div className="text-center mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Explore Each Stage
                </h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Click icons for details
                  </span>
                </p>
              </div>
              <InteractiveChainVisualization />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                sublabel={stat.sublabel}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Who KARAVA is for
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Kenyan Suppliers */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xl">
                    🇰🇪
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Kenyan Suppliers</h3>
                    <p className="text-xs text-muted-foreground">Growers, Processors, Exporters</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Evaluate whether your operation meets German buyer expectations. Understand gaps before investing in market entry.
                </p>
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-xs text-muted-foreground italic">
                    "This tells me if I'm ready—and why or why not."
                  </p>
                </div>
              </div>

              {/* German Buyers */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xl">
                    🇩🇪
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">German Buyers</h3>
                    <p className="text-xs text-muted-foreground">Importers, Food Processors</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Define requirements once. Receive pre-qualified supplier matches. Reduce time spent on suppliers who aren't ready.
                </p>
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-xs text-muted-foreground italic">
                    "This saves me screening time."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Assess your market fit
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
              Whether you're a Kenyan supplier evaluating readiness or a German buyer defining requirements—start with qualification.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setSelectedRole("supplier")}
              >
                I'm a Supplier <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary"
                onClick={handleBuyerClick}
              >
                I'm a Buyer <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
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

      {/* Role-Specific Modal */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg p-6 md:p-8 max-w-2xl w-full border border-border my-8 relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              {selectedRole === "supplier" && <ProcessorOnboarding onClose={handleCloseModal} />}
              {selectedRole === "buyer" && buyerFlow === "onboarding" && (
                <BuyerOnboarding onClose={handleCloseModal} onComplete={handleBuyerOnboardingComplete} />
              )}
              {selectedRole === "buyer" && buyerFlow === "discovery" && (
                <BuyerDiscovery onClose={handleCloseModal} buyerId={buyerId} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
