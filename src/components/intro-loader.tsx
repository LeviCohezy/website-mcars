"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

export const INTRO_EVENT = "mcars:intro-done";

declare global {
  interface Window {
    __mcarsIntroDone?: boolean;
  }
}

// The reveal choreography only makes sense on the immersive homepage variants;
// interior pages skip the intro and load instantly.
const HOME_ROUTES = new Set(["/", "/v2", "/v3"]);

export default function IntroLoader() {
  const pathname = usePathname();
  const enabled = HOME_ROUTES.has(pathname);
  const finished = useRef(false);
  const [phase, setPhase] = useState<"playing" | "exit" | "done">("playing");

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    window.__mcarsIntroDone = true;
    window.dispatchEvent(new Event(INTRO_EVENT));
    setPhase("exit");
  };

  // Plays on the homepage variants; skipped elsewhere, in preview thumbnails
  // (?preview=1) and for reduced-motion.
  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).has("preview");
    if (!enabled || isPreview) {
      finished.current = true;
      window.__mcarsIntroDone = true;
      window.dispatchEvent(new Event(INTRO_EVENT));
      setPhase("done");
      return;
    }
    // The reveal choreography assumes the hero fills the viewport — don't let
    // the browser restore a previous scroll position underneath the intro.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => {
        finished.current = true;
        window.__mcarsIntroDone = true;
        window.dispatchEvent(new Event(INTRO_EVENT));
        setPhase("done");
      }, 0);
      return () => clearTimeout(t);
    }
    // Safety net: never hold the site hostage if the video stalls.
    const t = setTimeout(finish, 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Quick fade to the white canvas, then hand the stage to the hero.
  useEffect(() => {
    if (phase !== "exit") return;
    window.scrollTo(0, 0);
    const t = setTimeout(() => setPhase("done"), 250);
    return () => clearTimeout(t);
  }, [phase]);

  // Lock scrolling while the intro is on screen.
  useEffect(() => {
    if (phase === "done") return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      onClick={finish}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-250 ease-out ${
        phase === "exit" ? "pointer-events-none opacity-0" : "cursor-pointer opacity-100"
      }`}
    >
      <video
        ref={(el) => {
          if (el) el.playbackRate = 2;
        }}
        src={asset("/logo-loader.mp4")}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        onError={finish}
        className="w-56 max-w-[70vw] sm:w-72"
      />
    </div>
  );
}
