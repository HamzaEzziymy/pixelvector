"use client";

import Script from "next/script";

/**
 * Adsterra Native Banner — responsive, non-intrusive inline ad unit.
 * Centers itself and adapts to the container width.
 */
export function NativeBanner() {
  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 sm:px-6"
      aria-label="Advertisement"
      role="complementary"
    >
      <div
        id="container-445a3ec003711ea1f9b24616f00fb867"
        className="mx-auto overflow-hidden"
      />
      <Script
        id="native-banner-ad"
        src="https://pl31808241.profitableratecpmnetwork.com/445a3ec003711ea1f9b24616f00fb867/invoke.js"
        data-cfasync="false"
        strategy="afterInteractive"
      />
    </div>
  );
}
