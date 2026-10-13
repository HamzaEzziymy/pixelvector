"use client";

import Script from "next/script";

/**
 * Adsterra Social Bar — loads globally once.
 * Renders a floating social-style bar managed entirely by the ad network.
 */
export function SocialBar() {
  return (
    <Script
      src="https://pl31808242.profitableratecpmnetwork.com/11/f8/e9/11f8e99adee8e898b98ddf05c6bbc5b4.js"
      strategy="afterInteractive"
    />
  );
}
