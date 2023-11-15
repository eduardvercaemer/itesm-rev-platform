import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";

export const useReports = routeLoader$(async ({ platform }) => {
  const list = await platform.R2.list();
  return list.objects.map((object) => ({
    name: object.key,
    date: object.uploaded,
  }));
});

export default component$(() => {
  const reports = useReports();

  return (
    <>
      <p>{JSON.stringify(reports)}</p>
    </>
  );
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
