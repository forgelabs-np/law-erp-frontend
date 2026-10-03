import { Box } from "@chakra-ui/react";
import type { LenisOptions } from "lenis";
import { ReactLenis, type LenisRef } from "lenis/react";
import {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { useLocation } from "react-router-dom";

import "@/shared/styles/smoothScroll.css";

/**
 * Central Lenis configuration for the authenticated shell.
 *
 * Deliberately subtle: a short lerp keeps wheel scrolling precise instead of
 * floaty, touch devices keep their native momentum, and nested scrollables
 * inside the shell (sidebar sections, tables, timelines, calendars, dropdowns,
 * editor fields) keep scrolling on their own through `allowNestedScroll`.
 *
 * `respectReducedMotion` is honoured for programmatic scrolls; the component
 * additionally skips Lenis entirely when the user prefers reduced motion.
 */
const SMOOTH_SCROLL_OPTIONS: LenisOptions = {
  lerp: 0.1,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  smoothWheel: true,
  syncTouch: false,
  allowNestedScroll: true,
  anchors: true,
  autoResize: true,
  autoRaf: true,
  respectReducedMotion: true,
};

/**
 * The shell's scroll container. Must stay in sync with the reduced-motion
 * fallback below so toggling the OS preference never shifts the layout.
 */
const SCROLL_CONTAINER_STYLE: CSSProperties = {
  overflowY: "auto",
  flex: "1",
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToReducedMotion = (onStoreChange: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
};

const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

const getReducedMotionServerSnapshot = () => false;

/**
 * SmoothScroll — the app shell's scroll container.
 *
 * Mounted **once** by the authenticated `Layout` so the whole authenticated app
 * shares a single Lenis instance (no per-page providers, no duplicate rAF
 * loops). Unauthenticated screens (login, MFA, forgot/reset password) never
 * render this component, so their scrolling is untouched.
 */
export const SmoothScroll = ({ children }: PropsWithChildren) => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const { pathname } = useLocation();
  const lenisRef = useRef<LenisRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Route change → the new page starts at the top of the shell's scroll
   * container (`immediate`, so navigation never animates). The DOM fallback
   * covers the reduced-motion branch, which runs without a Lenis instance.
   */
  useEffect(() => {
    const instance = lenisRef.current?.lenis;
    if (instance) {
      instance.scrollTo(0, { immediate: true });
      return;
    }

    const container = lenisRef.current?.wrapper ?? containerRef.current;
    if (container) container.scrollTop = 0;
  }, [pathname]);

  if (prefersReducedMotion) {
    // Native scrolling, no Lenis instance and no animation frame loop at all.
    return (
      <Box ref={containerRef} style={SCROLL_CONTAINER_STYLE}>
        {children}
      </Box>
    );
  }

  return (
    <ReactLenis
      ref={lenisRef}
      data-smooth-scroll="true"
      style={SCROLL_CONTAINER_STYLE}
      options={SMOOTH_SCROLL_OPTIONS}
    >
      {children}
    </ReactLenis>
  );
};
