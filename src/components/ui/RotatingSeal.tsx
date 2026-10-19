import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";

/** Circular text that slowly turns around the brand emblem. */
export function RotatingSeal({ text, className }: { text: string; className?: string }) {
  const id = useId();
  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <text fill="currentColor" fontSize="13.5" className="font-sans uppercase">
          <textPath href={`#${id}`} textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[32%] grid place-items-center rounded-full bg-maroon-950">
        <Image src="/brand/emblem.png" alt="" width={292} height={271} className="h-[78%] w-auto" />
      </div>
    </div>
  );
}
