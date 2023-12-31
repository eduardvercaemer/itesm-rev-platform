import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import { initFlowbite } from "flowbite";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

import { Navbar } from "~/components/navbar/navbar";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    noCache: true,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  useVisibleTask$(() => {
    initFlowbite();
  });

  return (
    <>
      <Navbar />
      <main>
        <Slot />
      </main>
    </>
  );
});
