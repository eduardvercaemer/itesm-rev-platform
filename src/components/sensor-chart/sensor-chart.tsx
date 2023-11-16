import {
  type Signal,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import ApexCharts, { type ApexOptions } from "apexcharts";

const chartOptions = {
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "line",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 6,
    curve: "smooth",
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -26,
    },
  },
  legend: {
    show: false,
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    show: false,
  },
} as ApexOptions;

export const SensorChart = component$(
  ({
    name,
    data,
    xAxis,
    color,
  }: {
    color: string;
    name: string;
    data: Signal<Array<number>>;
    xAxis: Signal<Array<Date>>;
  }) => {
    const chartElement = useSignal<HTMLDivElement>();
    useVisibleTask$(async ({ track }) => {
      track(() => chartElement.value);
      if (!chartElement.value) return;

      const options = chartOptions;
      options.series = [];
      (options.xaxis as any).categories = xAxis.value;

      const chart = new ApexCharts(chartElement.value, options);
      chart.render();
      Object.assign(chartElement.value, { chart });
    });
    useVisibleTask$(({ track }) => {
      track(() => data.value);
      track(() => chartElement.value);
      if (!chartElement.value) return;

      const chart: ApexCharts = (chartElement.value as any).chart;
      const newSeries = data.value.map((data, i) => ({
        x: xAxis.value[i].getTime(),
        y: data,
      }));
      chart.updateSeries([
        {
          color,
          data: newSeries,
        },
      ]);
    });

    return (
      <>
        <div class="flex h-[400px] w-full max-w-sm flex-col gap-8 rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
          <h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
            {name}
          </h5>

          <div ref={chartElement}></div>
        </div>
      </>
    );
  },
);
