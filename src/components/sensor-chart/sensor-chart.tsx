import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
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
    labels: {
      show: false,
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
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
    data: Array<number>;
    xAxis: Array<string>;
  }) => {
    const chartElement = useSignal<HTMLDivElement>();
    useVisibleTask$(async ({ track }) => {
      track(chartElement);
      if (!chartElement.value) return;

      const options = chartOptions;
      options.series = [
        {
          name,
          data,
          color,
        },
      ];
      (options.xaxis as any).categories = xAxis;

      const chart = new ApexCharts(chartElement.value, options);
      chart.render();
    });

    return (
      <>
        <div class="flex h-[400px] w-full max-w-sm flex-col gap-8 rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
          <h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
            {name}
          </h5>

          <div id="line-chart" ref={chartElement}></div>
        </div>
      </>
    );
  },
);
