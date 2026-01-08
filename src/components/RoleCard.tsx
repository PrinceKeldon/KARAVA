import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RoleCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

export function RoleCard({ icon, title, subtitle, description, onClick, delay = 0 }: RoleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start p-6 rounded-2xl text-left",
        "bg-card border border-border/50",
        "shadow-soft hover:shadow-card-hover",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary/30"
      )}
    >
      {/* Accent gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-warm opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="font-display text-xl font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm font-medium text-secondary mb-3">
        {subtitle}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      {/* Arrow indicator */}
      <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Get started</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.button>
  );
}
