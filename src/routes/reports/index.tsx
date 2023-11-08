import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <></>;
});

export const head: DocumentHead = {
  title: "Grupo REV - Reportes",
  meta: [
    {
      name: "description",
      content: "Grupo REV. Reportes generados de información de sensores.",
    },
  ],
};
