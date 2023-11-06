import { type RequestHandler } from "@builder.io/qwik-city";

declare global {
  interface QwikCityPlatform {
    D1: D1Database;
    R2: R2Bucket;
    KV: KVNamespace;
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
  platform.D1 = await getBinding<D1Database>(platform, "DATA");
  platform.R2 = await getBinding<R2Bucket>(platform, "STORAGE");
  platform.KV = await getBinding<KVNamespace>(platform, "KV");
  platform.SENSORS = await getAnalytics(platform, "SENSORS");
};
