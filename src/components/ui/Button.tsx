import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline-light" | "outline-dark" | "solid-dark";

const base =
  "group/btn relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden px-7 text-[0.78rem] font-medium tracking-[0.2em] uppercase transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-silk)] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-gradient text-maroon-950 shadow-[0_10px_30px_-12px_rgb(221_180_106/0.6)] hover:shadow-[0_14px_36px_-10px_rgb(221_180_106/0.75)]",
  "outline-light":
    "border border-gold-400/60 text-gold-200 hover:border-gold-300 hover:bg-gold-400/10 hover:text-gold-200",
  "outline-dark":
    "border border-maroon-950/70 text-maroon-950 hover:bg-maroon-950 hover:text-gold-300",
  "solid-dark": "bg-maroon-950 text-gold-300 hover:bg-maroon-800",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  children: ReactNode;
  icon?: boolean;
};

export function ButtonLink({
  variant = "primary",
  className,
  children,
  icon = true,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 opacity-0 blur-md transition-all duration-700 ease-[var(--ease-silk)] group-hover/btn:left-[120%] group-hover/btn:opacity-100"
        />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden
          className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          strokeWidth={1.5}
        />
      )}
    </Link>
  );
}

/** Understated text link with an animated underline. */
export function TextLink({
  className,
  children,
  tone = "dark",
  ...props
}: ComponentProps<typeof Link> & { tone?: "dark" | "light"; children: ReactNode }) {
  return (
    <Link
      className={cn(
        "group/tl inline-flex items-center gap-2 text-[0.78rem] font-medium tracking-[0.2em] uppercase",
        tone === "dark" ? "text-maroon-700" : "text-gold-300",
        className,
      )}
      {...props}
    >
      <span className="relative pb-1">
        {children}
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 transition-transform duration-500 ease-[var(--ease-silk)] group-hover/tl:origin-right group-hover/tl:scale-x-0",
            tone === "dark" ? "bg-maroon-700/50" : "bg-gold-300/50",
          )}
        />
      </span>
      <ArrowUpRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-300 group-hover/tl:translate-x-0.5 group-hover/tl:-translate-y-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}
