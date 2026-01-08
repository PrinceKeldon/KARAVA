import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
  delay?: number;
}

export function StatCard({ value, label, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-4"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}
