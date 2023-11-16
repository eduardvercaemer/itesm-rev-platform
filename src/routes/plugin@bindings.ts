import { type RequestHandler } from "@builder.io/qwik-city";

declare global {
  interface QwikCityPlatform {
    R2: R2Bucket;
    SENSORS: AnalyticsEngineDataset | null;
  }
}

const getBinding = async <T>(platform: QwikCityPlatform, name: string) => {
  if (platform.env && platform.env["CF_PAGES"]) {
    return platform.env[name];
  }

  const { binding } = await import("cf-bindings-proxy");
  return binding<T>(name);
};

const getAnalytics = async (platform: QwikCityPlatform, name: string) => {
  if (platform.env && platform.env["CF_PAGES"]) {
    return platform.env[name];
  }

  return null;
};

export const onRequest: RequestHandler = async ({ platform }) => {
  platform.R2 = await getBinding<R2Bucket>(platform, "STORAGE");
  platform.SENSORS = await getAnalytics(platform, "SENSORS");
};
