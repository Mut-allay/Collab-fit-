import { cn } from "@/lib/utils";

type ProgressProps = {
  value?: number;
  className?: string;
};

export function Progress({ value = 0, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
