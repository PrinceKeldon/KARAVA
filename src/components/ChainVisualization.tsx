import { motion } from "framer-motion";

export function ChainVisualization() {
  const chainSteps = [
    { icon: "🌱", label: "Farmers", location: "Kenya" },
    { icon: "🏭", label: "Processors", location: "Mombasa" },
    { icon: "🚢", label: "Exporters", location: "Port" },
    { icon: "🛒", label: "Buyers", location: "Europe" },
  ];

  return (
    <div className="relative py-8">
      {/* Connection line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-gold -translate-y-1/2 opacity-30" />
      
      {/* Animated flow */}
      <motion.div
        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        style={{ opacity: 0.6 }}
      />
      
      {/* Chain nodes */}
      <div className="relative flex justify-between items-center">
        {chainSteps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Node circle */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="w-14 h-14 rounded-full bg-card border-2 border-primary/20 shadow-medium flex items-center justify-center text-2xl cursor-pointer hover:border-secondary transition-colors"
            >
              {step.icon}
            </motion.div>
            
            {/* Label */}
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
