"use client";

import { useEffect, useRef } from "react";

/**
 * Counts one impression when the creative actually enters the viewport.
 * Fire-and-forget via sendBeacon; never blocks rendering or navigation.
 */
export function AdImpression({ adId }: { adId: string }) {
  const sent = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const send = () => {
      if (sent.current) return;
      sent.current = true;
      const payload = JSON.stringify({ adId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/ads/impression", new Blob([payload], { type: "application/json" }));
      } else {
        void fetch("/api/ads/impression", { method: "POST", body: payload, keepalive: true, headers: { "content-type": "application/json" } });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          send();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [adId]);

  return <span ref={ref} aria-hidden className="absolute inset-0 -z-10" />;
}
