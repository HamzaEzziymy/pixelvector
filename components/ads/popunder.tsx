"use client";

import Script from "next/script";

/**
 * Adsterra Popunder — loads globally once.
 * Fires a popunder tab on the first user interaction, managed by the ad network.
 */
export function Popunder() {
  return (
    <Script
      src="https://pl31808239.profitableratecpmnetwork.com/0c/c0/6b/0cc06b58ebd529a9ba37ec0724037eee.js"
      strategy="afterInteractive"
    />
  );
}
