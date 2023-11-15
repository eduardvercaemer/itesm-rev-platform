import { type PropFunction, component$, type Signal } from "@builder.io/qwik";
import { FlFileExportOutline } from "@qwikest/icons/flowbite";

export enum IntervalSelection {
  FIVE_MINTUES = "5m",
  FIFTEEN_MINTUES = "15m",
  ONE_HOUR = "1h",
  EIGHT_HOURS = "8h",
}

export interface IntervalSelectionBarProps {
  selection: IntervalSelection;
  disableExport: Signal<boolean>;
  setSelection$: PropFunction<(selection: IntervalSelection) => void>;
  export$: PropFunction<() => void>;
}

const COLORS_ACTIVE =
  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";

const COLORS_INACTIVE =
  "bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:bg-gray-700 dark:focus:text-white";

export const IntervalSelectionBar = component$(
  ({
    selection,
    disableExport,
    setSelection$,
    export$,
  }: IntervalSelectionBarProps) => {
    return (
      <>
        <div class="inline-flex flex-row gap-8">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              class={[
                "rounded-l-lg border border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:focus:ring-blue-500",
                selection === IntervalSelection.FIVE_MINTUES
                  ? COLORS_ACTIVE
                  : COLORS_INACTIVE,
              ]}
              disabled={selection === IntervalSelection.FIVE_MINTUES}
              onClick$={() => {
                setSelection$(IntervalSelection.FIVE_MINTUES);
              }}
            >
              5 minutos
            </button>
            <button
              type="button"
              class={[
                "border-b border-t border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:focus:ring-blue-500",
                selection === IntervalSelection.FIFTEEN_MINTUES
                  ? COLORS_ACTIVE
                  : COLORS_INACTIVE,
              ]}
              disabled={selection === IntervalSelection.FIFTEEN_MINTUES}
              onClick$={() => {
                setSelection$(IntervalSelection.FIFTEEN_MINTUES);
              }}
            >
              15 minutos
            </button>
            <button
              type="button"
              class={[
                "border-b border-t border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:focus:ring-blue-500",
                selection === IntervalSelection.ONE_HOUR
                  ? COLORS_ACTIVE
                  : COLORS_INACTIVE,
              ]}
              disabled={selection === IntervalSelection.ONE_HOUR}
              onClick$={() => {
                setSelection$(IntervalSelection.ONE_HOUR);
              }}
            >
              1 hora
            </button>
            <button
              type="button"
              class={[
                "rounded-r-md border border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:focus:ring-blue-500",
                selection === IntervalSelection.EIGHT_HOURS
                  ? COLORS_ACTIVE
                  : COLORS_INACTIVE,
              ]}
              disabled={selection === IntervalSelection.EIGHT_HOURS}
              onClick$={() => {
                setSelection$(IntervalSelection.EIGHT_HOURS);
              }}
            >
              8 horas
            </button>
          </div>
          <div class="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              disabled={disableExport.value}
              class={[
                "inline-flex items-center justify-around gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:focus:ring-blue-500",
                COLORS_INACTIVE,
              ]}
              onClick$={export$}
            >
              <span> Exportar</span>
              <FlFileExportOutline />
            </button>
          </div>
        </div>
      </>
    );
  },
);
