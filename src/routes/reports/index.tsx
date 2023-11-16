import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";

export const useReports = routeLoader$(async ({ platform }) => {
  const list = await platform.R2.list();
  return list.objects
    .map((object) => ({
      name: object.key,
      date: new Date(object.uploaded),
    }))
    .sort(
      ({ date: date0 }, { date: date1 }) => date1.getTime() - date0.getTime(),
    );
});

export default component$(() => {
  const reports = useReports();
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    hourCycle: "h24",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div class="mx-auto w-60 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        {reports.value.map(({ name, date }) => {
          return (
            <a
              href={`/download/${name}`}
              download
              class="block w-full cursor-pointer border-b border-gray-200 px-4 py-2 hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
              key={name}
            >
              {formatter.format(date)}
            </a>
          );
        })}
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
