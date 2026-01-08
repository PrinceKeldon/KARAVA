import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { RoleCard } from "@/components/RoleCard";
import { InteractiveChainVisualization } from "@/components/InteractiveChainVisualization";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { ProcessorOnboarding } from "@/components/onboarding/ProcessorOnboarding";
import { BuyerDiscovery } from "@/components/onboarding/BuyerDiscovery";
import { FarmerRegistration } from "@/components/onboarding/FarmerRegistration";
import { ExporterOnboarding } from "@/components/onboarding/ExporterOnboarding";
import heroImage from "@/assets/hero-kenya-farm.jpg";

type Role = "farmer" | "processor" | "exporter" | "buyer" | null;

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const roles = [
    {
      id: "farmer" as const,
      icon: "👨‍🌾",
      title: "I Grow / Farm",
      subtitle: "Smallholder & Commercial Farmers",
      description: "Register your farm, get EUDR compliant, and connect with processors who pay premium prices for traceable harvest.",
    },
    {
      id: "processor" as const,
      icon: "🏭",
      title: "I Process / Aggregate",
      subtitle: "Shellers, Millers & Aggregators",
      description: "Manage compliance across 100s of farms. Batch registration, risk assessment, and transparent sourcing stories for buyers.",
    },
    {
      id: "exporter" as const,
      icon: "🚢",
      title: "I Export",
      subtitle: "Export Companies & Traders",
      description: "One-click EUDR documentation. Prove deforestation-free sourcing and connect with verified European importers.",
    },
    {
      id: "buyer" as const,
      icon: "🛒",
      title: "I Import / Buy",
      subtitle: "European Importers & Retailers",
      description: "Source verified Kenyan macadamia and sesame with full traceability. Meet the farmers behind your ingredients.",
    },
  ];

  const stats = [
    { value: "200+", label: "Connected Farms", icon: "🌿" },
    { value: "€2.4M", label: "Trade Facilitated", icon: "💰" },
    { value: "100%", label: "EUDR Compliant", icon: "✅" },
    { value: "15%", label: "Price Premium", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              How It Works
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Success Stories
            </Button>
            <Button variant="heroOutline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Kenyan macadamia farm at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                🌍 EUDR Compliance Made Simple
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Connecting Kenya's Harvest{" "}
              <span className="text-gradient-warm">with Europe's Tables</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Every great ingredient has a story—and many hands that help it travel.
              Where do you join the journey?
            </motion.p>
          </div>

          {/* Role Selection Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16"
          >
            {roles.map((role, index) => (
              <RoleCard
                key={role.id}
                icon={role.icon}
                title={role.title}
                subtitle={role.subtitle}
                description={role.description}
                onClick={() => setSelectedRole(role.id)}
                delay={index}
              />
            ))}
          </motion.div>

          {/* Chain Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-3xl mx-auto bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft"
          >
            <p className="text-center text-sm text-muted-foreground mb-4">
              Click any node to explore the journey from farm to table.
            </p>
            <InteractiveChainVisualization />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Building Transparent Trade
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real impact from real partnerships across the Kenya-Europe trade corridor.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
                For Processors & Exporters
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Manage 200+ Farms with One Dashboard
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We understand your challenge: tracing hundreds of smallholder farms for EUDR compliance 
                feels impossible. Nutflix provides batch farm registration, group mapping tools, and 
                farmer self-onboarding via SMS—making compliance achievable.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Batch GPS mapping for entire farm networks",
                  "Risk assessment across your supplier base",
                  "Automated documentation for EU customs",
                  "Premium buyer connections"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-secondary mt-1">✓</span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg">
                Start Processing Onboarding
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-medium">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    🏭
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Valley Macadamia Processors</h4>
                    <p className="text-sm text-muted-foreground">Mombasa, Kenya</p>
                  </div>
                  <span className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    EUDR Verified
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground">156</p>
                    <p className="text-xs text-muted-foreground">Partner Farms</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-secondary">92%</p>
                    <p className="text-xs text-muted-foreground">Compliance Score</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground">5K</p>
                    <p className="text-xs text-muted-foreground">MT Capacity</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Partner Farm Network</p>
                  <div className="flex flex-wrap gap-2">
                    {["Mwangi Family Farm", "Kiambu Cooperative", "Thika Growers"].map((farm) => (
                      <span key={farm} className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        {farm}
                      </span>
                    ))}
                    <span className="px-2 py-1 text-xs text-primary">+153 more</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-forest text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the Connected Chain?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Whether you're growing, processing, exporting, or buying—
              Nutflix makes every link in the chain transparent, compliant, and profitable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl">
                Get Started Free
              </Button>
              <Button variant="heroOutline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 Nutflix. Connecting Kenya's premium exports with European quality standards.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
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
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedRole(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-medium border border-border my-8"
            >
              {selectedRole === "processor" && <ProcessorOnboarding onClose={() => setSelectedRole(null)} />}
              {selectedRole === "buyer" && <BuyerDiscovery onClose={() => setSelectedRole(null)} />}
              {selectedRole === "farmer" && <FarmerRegistration onClose={() => setSelectedRole(null)} />}
              {selectedRole === "exporter" && <ExporterOnboarding onClose={() => setSelectedRole(null)} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
