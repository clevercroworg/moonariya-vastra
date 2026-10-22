import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Shared building blocks for the admin — brand palette, built for clarity. */

export const inputCls =
  "w-full rounded-md border border-ivory-200 bg-white px-3.5 text-base text-ink-900 sm:text-[0.95rem] shadow-[0_1px_0_rgb(0_0_0/0.02)] placeholder:text-ink-500/60 transition-colors focus:border-maroon-700 focus:ring-2 focus:ring-gold-400/40 focus:outline-none aria-[invalid=true]:border-rani-600 aria-[invalid=true]:ring-rani-600/15";

export function Card({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-ivory-200 bg-white shadow-[0_1px_2px_rgb(34_19_15/0.04)]", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ivory-200/70 px-5 py-4 sm:px-6">
          <div>
            {title && <h2 className="font-display text-[1.35rem] leading-tight text-maroon-950">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("px-5 py-5 sm:px-6", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-ink-900">
        <span>
          {label}
          {required && <span className="ml-0.5 text-rani-600">*</span>}
        </span>
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[0.8rem] text-rani-600" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[0.8rem] text-ink-500">{hint}</p>
      )}
    </div>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-maroon-950 text-gold-200 hover:bg-maroon-800 shadow-sm",
  secondary: "border border-ivory-200 bg-white text-ink-900 hover:border-maroon-950/30 hover:bg-ivory-50",
  ghost: "text-ink-700 hover:bg-ivory-100 hover:text-maroon-950",
  danger: "border border-rani-600/30 bg-white text-rani-600 hover:bg-rani-600 hover:text-white",
};

export function buttonCls(variant: Variant = "primary", size: "sm" | "md" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    size === "md" ? "h-10 px-4 text-sm" : "h-8 px-3 text-[0.8rem]",
    variants[variant],
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentPropsWithRef<"button"> & { variant?: Variant; size?: "sm" | "md" }) {
  return <button type="button" {...props} className={cn(buttonCls(variant, size), className)} />;
}

export function Pill({ tone = "neutral", children }: { tone?: "green" | "amber" | "red" | "neutral" | "maroon"; children: ReactNode }) {
  const tones = {
    green: "bg-emerald-700/10 text-emerald-700",
    amber: "bg-gold-400/20 text-gold-700",
    red: "bg-rani-600/10 text-rani-600",
    neutral: "bg-ivory-100 text-ink-700",
    maroon: "bg-maroon-950 text-gold-200",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] font-medium whitespace-nowrap", tones[tone])}>
      {children}
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 after:absolute after:-inset-2.5 items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-emerald-700" : "bg-ink-500/30",
      )}
    >
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="font-display text-[2.1rem] leading-tight text-maroon-950 sm:text-[2.5rem]">{title}</h1>
        {description && <p className="mt-1 text-[0.95rem] text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
