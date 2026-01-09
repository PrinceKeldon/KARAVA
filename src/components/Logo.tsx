import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        <span className={cn("font-display font-bold tracking-tight text-foreground", sizes[size])}>
          KARAVA
        </span>
      </div>
      <div className="h-4 w-px bg-border" />
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Kenya → Germany
      </span>
    </div>
  );
}
