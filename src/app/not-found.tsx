import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return <ComingSoon missing />;
}
