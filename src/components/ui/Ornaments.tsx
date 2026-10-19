import { cn } from "@/lib/utils";

type Props = { className?: string };

/** Lotus from the logo — used above section titles and in marquees. */
export function LotusMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 48 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-5 w-auto", className)}
    >
      <path d="M24 26C19.5 20 19.5 10 24 2c4.5 8 4.5 18 0 24Z" fill="currentColor" fillOpacity={0.18} />
      <path d="M24 26c-7-2-12.5-8-13.6-17 7 2 12 8 13.6 17Z" />
      <path d="M24 26c7-2 12.5-8 13.6-17-7 2-12 8-13.6 17Z" />
      <path d="M22.5 26.4C14.5 26.6 6.4 22.6 2 15.4c8.2-.9 15.6 3.4 20.5 11Z" />
      <path d="M25.5 26.4c8 .2 16.1-3.8 20.5-11-8.2-.9-15.6 3.4-20.5 11Z" />
    </svg>
  );
}

/** Line · dot · diamond · dot · line — echoes the rule under "Vastra". */
export function FlourishRule({ className }: Props) {
  return (
    <svg
      viewBox="0 0 240 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden
      className={cn("h-4 w-48", className)}
    >
      <path d="M0 8h98" strokeOpacity={0.6} />
      <circle cx={104} cy={8} r={1.6} fill="currentColor" />
      <path d="M120 1.5 126.5 8 120 14.5 113.5 8Z" fill="currentColor" fillOpacity={0.25} />
      <circle cx={136} cy={8} r={1.6} fill="currentColor" />
      <path d="M142 8h98" strokeOpacity={0.6} />
    </svg>
  );
}

/** A single corner flourish; rotate for the other corners. */
function Corner({ className }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden
      className={cn("absolute h-7 w-7 sm:h-9 sm:w-9", className)}
    >
      <path d="M1 39V9a8 8 0 0 1 8-8h30" />
      <path d="M6 39V14a8 8 0 0 1 8-8h25" strokeOpacity={0.5} />
      <path d="M12 12c4-1 6.5 1 6 4.5-.4 2.7-3.4 3.6-5 1.8-1.4-1.6.2-3.6 1.8-2.6" />
      <circle cx={1} cy={1} r={1.2} fill="currentColor" />
    </svg>
  );
}

/** Inset hairline frame with four corner flourishes (from the logo border). */
export function FrameCorners({ className }: Props) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      <div className="absolute inset-[6px] border border-current opacity-30 sm:inset-[8px]" />
      <Corner className="top-0 left-0" />
      <Corner className="top-0 right-0 rotate-90" />
      <Corner className="right-0 bottom-0 rotate-180" />
      <Corner className="bottom-0 left-0 -rotate-90" />
    </div>
  );
}

/** Small four-point star used as a separator. */
export function Sparkle({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cn("h-3 w-3", className)} fill="currentColor">
      <path d="M8 0c.6 4.2 3.8 7.4 8 8-4.2.6-7.4 3.8-8 8-.6-4.2-3.8-7.4-8-8 4.2-.6 7.4-3.8 8-8Z" />
    </svg>
  );
}
