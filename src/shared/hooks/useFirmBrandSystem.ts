import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useCurrentUserQuery } from "@/api/me";
import TokenService, { Authorities } from "@/shared/service/service-token";
import { createBrandSystem, type BrandColorInput } from "@/shared/theme";
import { isSuperAdminRole } from "@/shared/utils/role";

// ============================================================
// Firm brand theme
//
// Derives the Chakra system from the `/me` brand colors. Key rules:
// - Reuses the SAME `["current-user"]` query the Layout already runs, so
//   no extra `/me` request is ever issued (React Query dedupes by key).
// - The last-seen brand is mirrored to localStorage so a page refresh paints
//   with the firm's theme immediately, before `/me` resolves (no flash of the
//   default blue).
// - Super Admin sessions always get the default system.
// - Logout clears the cached brand so the login screen returns to default.
// ============================================================

const BRAND_CACHE_KEY = "nepalcrm.firm-brand.v1";

const isStoredColor = (value: unknown): value is string | null =>
  value === null || typeof value === "string";

const readCachedBrand = (): BrandColorInput | null => {
  try {
    const raw = localStorage.getItem(BRAND_CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { primary, secondary } = parsed as Record<string, unknown>;
    if (!isStoredColor(primary) || !isStoredColor(secondary)) return null;
    return { primary, secondary };
  } catch {
    return null;
  }
};

const writeCachedBrand = (brand: BrandColorInput): void => {
  try {
    localStorage.setItem(
      BRAND_CACHE_KEY,
      JSON.stringify({
        primary: brand.primary ?? null,
        secondary: brand.secondary ?? null,
      })
    );
  } catch {
    // Storage unavailable (private mode/quota) — flash prevention only,
    // never a functional concern.
  }
};

const clearCachedBrand = (): void => {
  try {
    localStorage.removeItem(BRAND_CACHE_KEY);
  } catch {
    // ignore
  }
};

/** True for the platform Super Admin, which keeps the default branding. */
const isSuperAdminSession = (
  pathname: string,
  role: string | undefined
): boolean => {
  if (pathname.startsWith("/super-admin")) return true;
  if (role && isSuperAdminRole(role)) return true;

  const jwt = TokenService.getTokenDetails();
  if (!jwt) return false;
  return (
    jwt.workspace === Authorities["super-admin"] ||
    (typeof jwt.roleCode === "string" &&
      jwt.roleCode.toUpperCase() === "SUPER_ADMIN")
  );
};

/**
 * Returns the Chakra system for the authenticated firm's brand.
 *
 * Mount once, above the app: it watches auth state via the `tokenChanged`
 * event, reads the cached brand synchronously (first paint on refresh), then
 * switches to the live `/me` values as soon as they arrive.
 */
export const useFirmBrandSystem = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    TokenService.isAuthenticated()
  );
  // Read once on mount: later /me responses supersede it anyway.
  const [cachedBrand] = useState(readCachedBrand);

  // Auth state is not reactive by itself — AppRoutes listens to the same
  // event, so the theme follows login/logout exactly when routing does.
  useEffect(() => {
    const sync = () => setIsAuthenticated(TokenService.isAuthenticated());
    sync();
    window.addEventListener("tokenChanged", sync);
    return () => window.removeEventListener("tokenChanged", sync);
  }, []);

  // Same query key as the Layout → zero additional network calls.
  const { data: me } = useCurrentUserQuery({ enabled: isAuthenticated });

  // Logout → drop the cached brand (a different account must not inherit it).
  // The initial mount is ignored: an expired-but-refreshable token is not a
  // logout, and AppRoutes resolves the refresh before anything renders.
  const wasAuthenticated = useRef(isAuthenticated);
  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) clearCachedBrand();
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  // Mirror the fresh values so the next refresh is flash-free.
  useEffect(() => {
    if (!me) return;
    writeCachedBrand({
      primary: me.brandColorPrimary ?? null,
      secondary: me.brandColorSecondary ?? null,
    });
  }, [me]);

  const brand = useMemo<BrandColorInput | null>(() => {
    if (!isAuthenticated) return null;
    if (isSuperAdminSession(location.pathname, me?.role)) return null;
    if (me) {
      return {
        primary: me.brandColorPrimary ?? null,
        secondary: me.brandColorSecondary ?? null,
      };
    }
    // `/me` not here yet → last known brand (prevents default-theme flash).
    return cachedBrand;
  }, [isAuthenticated, location.pathname, me, cachedBrand]);

  return useMemo(() => createBrandSystem(brand), [brand]);
};
