import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-display font-bold tracking-tight", sizes[size])}>
        <span className="text-primary">Nut</span>
        <span className="text-secondary">flix</span>
      </span>
      <span className="text-lg">🥜</span>
    </div>
  );
}
