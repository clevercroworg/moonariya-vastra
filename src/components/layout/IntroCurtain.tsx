import Image from "next/image";
import { site } from "@/data/site";

/**
 * Brand curtain shown on the first page load of a session. Pure CSS
 * (see `.intro` in globals.css) so it lifts even before hydration; an inline
 * script in <head> adds `intro-seen` to <html> to skip it on later loads.
 */
export function IntroCurtain() {
  return (
    <div
      aria-hidden
      className="intro pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-maroon-950"
    >
      <div className="bg-lattice absolute inset-0" />
      <Image
        src="/brand/emblem.png"
        alt=""
        width={292}
        height={271}
        preload
        className="intro-emblem relative h-28 w-auto sm:h-36"
      />
      <span className="intro-line hairline-gold relative mt-6 h-px w-48 origin-center" />
      <p className="intro-word eyebrow relative mt-5 text-gold-300">{site.name}</p>
    </div>
  );
}

export const introScript = `try{if(sessionStorage.getItem('mv-intro')){document.documentElement.classList.add('intro-seen')}else{sessionStorage.setItem('mv-intro','1')}}catch(e){}`;
