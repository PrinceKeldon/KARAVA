import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  delay?: number;
}

export function StatCard({ value, label, sublabel, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="text-center p-4"
    >
      <p className="font-display text-3xl font-bold text-foreground mb-1">
        {value}
      </p>
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>
      {sublabel && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
}
