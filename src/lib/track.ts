declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 이벤트. NEXT_PUBLIC_GA_ID 없으면 콘솔에만 찍힘 */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  if (window.gtag) window.gtag("event", event, params);
  else if (process.env.NODE_ENV !== "production") console.debug("[track]", event, params);
}

export function obudUrl(matId: string) {
  const base = process.env.NEXT_PUBLIC_OBUD_URL || "https://obud.co/discover";
  const u = new URL(base);
  u.searchParams.set("utm_source", "mat_quiz");
  u.searchParams.set("utm_medium", "web");
  u.searchParams.set("utm_campaign", "obud_dobby");
  u.searchParams.set("utm_content", matId);
  return u.toString();
}
