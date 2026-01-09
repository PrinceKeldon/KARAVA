import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      onClick={onClick}
      className="group w-full text-left p-5 rounded-lg bg-card border border-border hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-base"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground text-base mb-0.5">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </div>
    </motion.button>
  );
}
