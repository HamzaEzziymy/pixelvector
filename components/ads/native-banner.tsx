"use client";

import Script from "next/script";

/**
 * Adsterra Native Banner (160×300).
 * Drop this beside content columns — it renders a sidebar-style native ad unit.
 */
export function NativeBanner() {
  return (
    <div className="flex justify-center" aria-label="Advertisement" role="complementary">
      <div id="container-445a3ec003711ea1f9b24616f00fb867" style={{ width: 160, minHeight: 300 }} />
      <Script
        id="native-banner-ad"
        src="https://pl31808241.profitableratecpmnetwork.com/445a3ec003711ea1f9b24616f00fb867/invoke.js"
        data-cfasync="false"
        async
        strategy="afterInteractive"
      />
    </div>
  );
}
