import { Box } from "@chakra-ui/react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { CSSProperties, useMemo } from "react";

export interface LiquidProgressProps {
  /** Completion percentage, 0–100. Values outside the range are clamped. */
  progress: number;
  /** Track height. Defaults to `12px`. */
  height?: string | number;
  /**
   * CSS colour used for the liquid fill. Chrome token variables
   * (`var(--chakra-colors-primary-500)`) work, as does any CSS colour.
   */
  color?: string;
  /**
   * Duration of the width transition in ms — how long each progress step
   * takes to glide into place. Defaults to `400`.
   */
  duration?: number;
  /** Accessible name of the progress bar. */
  ariaLabel?: string;
  /** Extra context appended to the accessible value text. */
  valueText?: string;
  className?: string;
}

/**
 * Two full wave periods across a 200%-wide band, so translating the band by
 * exactly one period (50% of the band width) loops seamlessly.
 */
const WAVE_PATH =
  "M0,0 H200 V45 C12.5,15 37.5,15 50,45 C62.5,75 87.5,75 100,45 " +
  "C112.5,15 137.5,15 150,45 C162.5,75 187.5,75 200,45 Z";

const TRACK_STYLE: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "9999px",
};

const WAVE_STYLE: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "200%",
  height: "58%",
  pointerEvents: "none",
};

const SHEEN_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
};

/**
 * LiquidProgress — brand-coloured liquid progress bar.
 *
 * Purely presentational: it renders whatever `progress` it is given and owns no
 * timers. Whoever drives it decides how (and whether) the value is estimated.
 *
 * - Colours come from Chakra tokens; the track/label surface uses semantic
 *   tokens (`bg-muted`, `border`) so it follows the active colour mode.
 * - Transforms and the width glide are disabled when the user prefers reduced
 *   motion; the value still updates, just without animation.
 */
export const LiquidProgress = ({
  progress,
  height = "12px",
  color = "var(--chakra-colors-red-500)",
  duration = 400,
  ariaLabel = "Progress",
  valueText,
  className,
}: LiquidProgressProps) => {
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.max(
    0,
    Math.min(100, Number.isFinite(progress) ? progress : 0)
  );
  const rounded = Math.round(clamped);

  const fillStyle = useMemo<CSSProperties>(
    () => ({
      position: "relative",
      height: "100%",
      width: `${clamped}%`,
      overflow: "hidden",
      borderRadius: "inherit",
      background: `linear-gradient(90deg, color-mix(in srgb, ${color} 52%, var(--chakra-colors-bg-panel, white)), color)`,
      transition: prefersReducedMotion ? "none" : `width ${duration}ms linear`,
    }),
    [clamped, color, duration, prefersReducedMotion]
  );

  return (
    <MotionConfig reducedMotion="user">
      <Box
        className={className}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={valueText ?? `${rounded} percent`}
        bg="bg-muted"
        boxShadow="inset 0 1px 2px rgba(0, 0, 0, 0.08)"
        borderWidth="1px"
        borderColor="border"
        height={height}
        style={TRACK_STYLE}
      >
        <div style={fillStyle}>
          {/* Liquid surface: a translucent wave band drifting across the fill. */}
          <motion.div
            style={WAVE_STYLE}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          >
            <svg
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              <path d={WAVE_PATH} fill="rgba(255, 252, 252, 0.32)" />
            </svg>
          </motion.div>

          {/* Subtle pulse of light through the body of the liquid. */}
          <motion.div
            style={SHEEN_STYLE}
            animate={{ opacity: [0.14, 0.42, 0.14] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <Box
              position="absolute"
              inset={0}
              style={{
                background:
                  "radial-gradient(120% 180% at 78% 50%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 60%)",
              }}
            />
          </motion.div>
        </div>
      </Box>
    </MotionConfig>
  );
};

export default LiquidProgress;
