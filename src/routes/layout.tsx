import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const onRequest: RequestHandler = async ({ platform }) => {
  // Global D1 binding
  platform.D1 = await (async () => {
    if (platform.env && platform.env["CF_PAGES"]) {
      return platform.env["DATA"];
    }

    const { binding } = await import("cf-bindings-proxy");
    return binding<D1Database>("DATA");
  })();
  // Global R2 binding
  platform.R2 = await (async () => {
    if (platform.env && platform.env["CF_PAGES"]) {
      return platform.env["STORAGE"];
    }

    const { binding } = await import("cf-bindings-proxy");
    return binding<R2Bucket>("STORAGE");
  })();
  // Global Analytics Engine binding
  platform.SENSORS = await (async () => {
    if (platform.env && platform.env["CF_PAGES"]) {
      return platform.env["SENSORS"];
    }

    return null;
  })();
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      <main>
        <Slot />
      </main>
    </>
  );
});
