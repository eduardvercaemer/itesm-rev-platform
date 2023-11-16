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
      <div class="mx-auto w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        {reports.value.map(({ name }) => (
          <a
            href={`/download/${name}`}
            download
            class="block w-full cursor-pointer border-b border-gray-200 px-4 py-2 hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
            key={name}
          >
            {name}
          </a>
        ))}
      </div>
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
