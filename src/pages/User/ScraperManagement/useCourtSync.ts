import { useCallback, useEffect, useRef, useState } from "react";

import {
  getManualScrapeOutcome,
  isRequestCanceled,
  notifyScrapeOutcome,
  useManualScrape,
} from "@/shared/hooks/useScraper";
import { ScrapeResult } from "@/shared/types/scraper.types";

/** Hard wait window for one sync run. */
export const COURT_SYNC_MAX_WAIT_MS = 120_000;
/** How often the estimate is recomputed (the bar interpolates between ticks). */
export const COURT_SYNC_TICK_MS = 200;
/** Time given to the fill to glide to 100% before the outcome is reported. */
export const COURT_SYNC_COMPLETION_MS = 750;
/** The simulated estimate never reaches 100% on its own. */
export const COURT_SYNC_PEAK_PROGRESS = 95;

export type CourtSyncPhase = "idle" | "syncing" | "completing" | "timedOut";

/**
 * Estimated progress ramp. The scraper reports no progress, so this is a
 * deliberate, openly-labelled estimate — never presented as real work done.
 */
const PROGRESS_CURVE: ReadonlyArray<{ atMs: number; progress: number }> = [
  { atMs: 0, progress: 0 },
  { atMs: 10_000, progress: 20 },
  { atMs: 40_000, progress: 55 },
  { atMs: 80_000, progress: 80 },
  { atMs: 110_000, progress: 90 },
  { atMs: COURT_SYNC_MAX_WAIT_MS, progress: COURT_SYNC_PEAK_PROGRESS },
];

/** Piecewise-linear, monotonic estimate for a given elapsed time. */
export const estimateCourtSyncProgress = (elapsedMs: number) => {
  if (elapsedMs <= 0) return 0;

  for (let index = 1; index < PROGRESS_CURVE.length; index += 1) {
    const previous = PROGRESS_CURVE[index - 1];
    const current = PROGRESS_CURVE[index];

    if (elapsedMs <= current.atMs) {
      const span = current.atMs - previous.atMs;
      const ratio = span === 0 ? 1 : (elapsedMs - previous.atMs) / span;
      return previous.progress + ratio * (current.progress - previous.progress);
    }
  }

  return COURT_SYNC_PEAK_PROGRESS;
};

export interface CourtSyncRunContext {
  courtId: number;
  dateBs: string;
}

/**
 * useCourtSync — owns the entire Court Data Sync lifecycle.
 *
 * One phase value is the single source of truth; every timer, the request
 * controller and the "did this run finish?" check are keyed to a run id, so a
 * timed-out or unmounted run can never write to the UI again, and two runs can
 * never both finalise the same operation.
 */
export const useCourtSync = () => {
  // `notify: false` — the outcome is reported here, after the completion
  // animation, instead of the instant the response lands.
  const mutation = useManualScrape({ notify: false });

  const [phase, setPhase] = useState<CourtSyncPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [runContext, setRunContext] = useState<CourtSyncRunContext | null>(
    null
  );

  const phaseRef = useRef<CourtSyncPhase>("idle");
  const runIdRef = useRef(0);
  const startedAtRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionResolveRef = useRef<(() => void) | null>(null);

  const updatePhase = useCallback((next: CourtSyncPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  /** Clears every timer, releasing any in-flight completion wait. */
  const clearTimers = useCallback(() => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (completionTimerRef.current !== null) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }

    const resolveCompletion = completionResolveRef.current;
    completionResolveRef.current = null;
    resolveCompletion?.();
  }, []);

  /**
   * Invalidates the current run: its pending continuations are ignored and its
   * request is optionally cancelled.
   */
  const abandonRun = useCallback(
    (abortRequest: boolean) => {
      runIdRef.current += 1;
      clearTimers();

      if (abortRequest) controllerRef.current?.abort();
      controllerRef.current = null;
    },
    [clearTimers]
  );

  // Leaving the page must not leave timers or a request behind.
  useEffect(() => () => abandonRun(true), [abandonRun]);

  /** Waits for the completion animation; released early if the run is abandoned. */
  const waitForCompletion = useCallback(() => {
    return new Promise<void>((resolve) => {
      completionResolveRef.current = resolve;
      completionTimerRef.current = setTimeout(() => {
        completionTimerRef.current = null;
        completionResolveRef.current = null;
        resolve();
      }, COURT_SYNC_COMPLETION_MS);
    });
  }, []);

  const startSync = useCallback(
    async ({ courtId, dateBs }: CourtSyncRunContext) => {
      // Duplicate-click guard: a run may only start from an idle or timed-out UI.
      if (phaseRef.current === "syncing" || phaseRef.current === "completing") {
        return;
      }

      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      clearTimers();

      const controller = new AbortController();
      controllerRef.current = controller;
      startedAtRef.current = Date.now();

      setResult(null);
      setRunContext({ courtId, dateBs });
      setProgress(0);
      setElapsedMs(0);
      updatePhase("syncing");

      tickRef.current = setInterval(() => {
        if (runIdRef.current !== runId) return;

        const elapsed = Date.now() - startedAtRef.current;
        setElapsedMs(elapsed);
        // Monotonic: the estimate can never move backwards within one run.
        setProgress((previous) =>
          Math.max(previous, estimateCourtSyncProgress(elapsed))
        );
      }, COURT_SYNC_TICK_MS);

      timeoutRef.current = setTimeout(() => {
        if (runIdRef.current !== runId) return;

        // Stop waiting, cancel the browser request and never report success.
        // The server-side scrape is not cancelled by this. See the UI copy.
        abandonRun(true);
        setProgress((previous) => Math.min(previous, COURT_SYNC_PEAK_PROGRESS));
        updatePhase("timedOut");
      }, COURT_SYNC_MAX_WAIT_MS);

      try {
        const response = await mutation.mutateAsync({
          courtId,
          dateBs,
          signal: controller.signal,
        });

        // The run timed out or was abandoned while the request was in flight.
        if (runIdRef.current !== runId) return;

        clearTimers();
        controllerRef.current = null;

        const data = response?.data?.data;

        // The request completed but the scrape itself failed. Stop where we
        // are — never celebrate a failure with a 100% finish.
        if (data && data.success === false) {
          setProgress(0);
          setElapsedMs(0);
          updatePhase("idle");
          notifyScrapeOutcome(getManualScrapeOutcome(data));
          return;
        }

        // Glide to 100% first; the outcome is only reported afterwards.
        setProgress(100);
        updatePhase("completing");
        await waitForCompletion();

        if (runIdRef.current !== runId) return;

        setResult(data ?? null);
        updatePhase("idle");
        notifyScrapeOutcome(getManualScrapeOutcome(data));
      } catch (error) {
        if (runIdRef.current !== runId) return;
        // A deliberate cancellation (timeout, unmount, retry) is not a failure.
        if (isRequestCanceled(error)) return;

        clearTimers();
        controllerRef.current = null;
        setProgress(0);
        setElapsedMs(0);
        updatePhase("idle");
        notifyScrapeOutcome(getManualScrapeOutcome(undefined));
      }
    },
    [abandonRun, clearTimers, mutation, updatePhase, waitForCompletion]
  );

  /** Returns the card to a clean idle state (used by Retry). */
  const reset = useCallback(() => {
    abandonRun(true);
    setProgress(0);
    setElapsedMs(0);
    setResult(null);
    updatePhase("idle");
  }, [abandonRun, updatePhase]);

  return {
    phase,
    progress,
    elapsedMs,
    result,
    runContext,
    isRunning: phase === "syncing" || phase === "completing",
    startSync,
    reset,
  };
};
