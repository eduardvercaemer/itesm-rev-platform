import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <section class="bg-white dark:bg-gray-900">
        <div class="mx-auto grid max-w-screen-xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div class="flex flex-col justify-center">
            <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Bienvenidos al mundo de REV
            </h1>
            <p class="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-xl">
              Con más de 70 años de experiencia, Grupo REV nace como una empresa
              familiar orgullosamente mexicana, especializados en fabricación y
              comercialización de máscaras de látex y disfraces.
            </p>
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <a
                href="#"
                class="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              >
                Analizar sensores en tiempo real
                <svg
                  class="ml-2 h-3.5 w-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
              <a
                href="https://gruporev.com/"
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Visitar sitio
              </a>
            </div>
          </div>
          <div>
            <iframe
              class="mx-auto h-64 w-full rounded-lg shadow-xl sm:h-96 lg:max-w-xl"
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/MuB7KRj0jPM"
              title="CÓMO SE HACEN LAS MÁSCARAS DE TERROR ? Para Halloween 👻"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "Platform",
  meta: [
    {
      name: "description",
      content: "Temperature analytics graphs",
    },
  ],
};
