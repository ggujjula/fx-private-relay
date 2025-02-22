/** @type { Record<string, import("./src/config").RuntimeConfig> } */
const runtimeConfigs = {
  production: {
    // The front-end and back-end are served from the same domain in production,
    // so relative URLs can be used:
    backendOrigin: "",
    frontendOrigin: "",
    fxaLoginUrl: "/accounts/fxa/login/?process=login",
    fxaLogoutUrl: "/accounts/logout/",
    supportUrl: "https://support.mozilla.org/products/relay/",
    emailSizeLimitNumber: 10,
    emailSizeLimitUnit: "MB",
    maxFreeAliases: 5,
    mozmailDomain: "mozmail.com",
    googleAnalyticsId: "UA-77033033-33",
    maxOnboardingAvailable: 3,
    featureFlags: {
      // Also add keys here to RuntimeConfig in src/config.ts
      tips: true,
      generateCustomAliasMenu: true,
      generateCustomAliasSubdomain: false,
      interviewRecruitment: true,
      csatSurvey: true,
    },
  },
};

// This configuration is for the setup where the Next.js dev server
// is running concurrently with the Django server.
// Due to not running on the same server as the back-end,
// login and logout needs to be simulated using the `/mock/` pages.
runtimeConfigs.development = {
  ...runtimeConfigs.production,
  backendOrigin: "http://127.0.0.1:8000",
  frontendOrigin: "http://localhost:3000",
  fxaLoginUrl: "http://localhost:3000/mock/login",
  fxaLogoutUrl: "http://localhost:3000/mock/logout",
};

// This configuration is for the setup where the front-end is built and served
// on its own, with the back-end mocked out using Mock Service Worker.
// Login and logout need to be simulated using the `/mock/` pages.
runtimeConfigs.apimock = {
  ...runtimeConfigs.production,
  backendOrigin: "",
  frontendOrigin: "",
  fxaLoginUrl: "/mock/login",
  fxaLogoutUrl: "/mock/logout",
};

/** @type {(config: import('next').NextConfig) => import('next').NextConfig} */
const withBundleAnalyzer = (nextConfig) => {
  if (process.env.ANALYZE !== "true") {
    return nextConfig;
  }
  // This file is only loaded at build time, so we don't care about tree shaking
  // being made impossible by a `require` call:
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const getAnalyzerWrapper = require("@next/bundle-analyzer");
  const withAnalyzer = getAnalyzerWrapper({
    enabled: process.env.ANALYZE === "true",
  });
  return withAnalyzer(nextConfig);
};

let applicableConfig = "production";
if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
  applicableConfig = "apimock";
}
if (process.env.NODE_ENV === "development") {
  applicableConfig = "development";
}

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  // This custom value for `pageExtensions` ensures that
  // test files are not picked up as pages to render by Next.js.
  // See https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions
  pageExtensions: ["page.ts", "page.tsx", "page.js", "page.jsx"],
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  // Unfortunately we cannot use Next.js's built-in dev server,
  // as the front-end needs to be served from the same origin as the back-end
  // in order to use authenticated sessions.
  // Thus, we use `npm run watch` to create a build every time a file in `src/`
  // changes — but builds are production builds in Next.js by default.
  // Thus, we cannot use different .env files for different environments
  // (https://nextjs.org/docs/basic-features/environment-variables),
  // and use this mechanism instead:
  publicRuntimeConfig: runtimeConfigs[applicableConfig],
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.ftl/,
      type: "asset/source",
    });

    return config;
  },
});
