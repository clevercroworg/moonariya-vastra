import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FlourishRule, LotusMark } from "./Ornaments";
import { MaskLines, Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: [string, string];
  intro?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  rule?: boolean;
  id?: string;
  className?: string;
};

/**
 * Lotus → eyebrow → two-line title (plain + italic gold) → optional rule and intro.
 * `tone="dark"` is for maroon sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "light",
  rule = true,
  id,
  className,
}: Props) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div className={cn("flex flex-col", center ? "items-center text-center" : "items-start", className)}>
      <Reveal className={cn("flex items-center gap-3", dark ? "text-gold-400" : "text-gold-600")}>
        <LotusMark className="h-5" />
        <span className={cn("eyebrow", dark ? "text-gold-300" : "text-gold-700")}>{eyebrow}</span>
      </Reveal>
      <h2
        id={id}
        className={cn(
          "mt-5 font-display text-h1 font-medium",
          dark ? "text-ivory-50" : "text-maroon-950",
        )}
      >
        <MaskLines
          lines={[
            title[0],
            <em key="i" className={cn("font-normal italic", dark ? "text-gold-gradient" : "text-gold-600")}>
              {title[1]}
            </em>,
          ]}
        />
      </h2>
      {rule && (
        <Reveal delay={0.2} className={cn("mt-5", dark ? "text-gold-400" : "text-gold-500")}>
          <FlourishRule />
        </Reveal>
      )}
      {intro && (
        <Reveal
          delay={0.25}
          className={cn(
            "mt-5 max-w-xl text-[1.02rem] leading-relaxed",
            dark ? "text-ivory-100/75" : "text-ink-700",
          )}
        >
          {intro}
        </Reveal>
      )}
    </div>
  );
}
