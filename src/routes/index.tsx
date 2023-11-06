import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import Chart, { Colors } from "chart.js/auto";

import styles from "./styles.css?inline";

const ENDPOINT =
  "https://api.cloudflare.com/client/v4/accounts/00afccb96609b332b12ebafa18a20cd8/analytics_engine/sql";

export const useTemperatureData = routeLoader$(async ({ platform }) => {
  const query = `
    SELECT toStartOfInterval(timestamp, INTERVAL '1' SECOND) AS time,
           double1 AS t0,
           double2 AS t1,
           double3 AS t2
    FROM   SENSORS
    WHERE  index1 = 'b1'
    AND    timestamp > NOW() - INTERVAL '1' HOUR
  `;
  return await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${platform.env?.API_TOKEN}`,
    },
    body: query,
  })
    .then((res) => res.json())
    .then(
      (json: any) =>
        json.data as Array<{ time: string; t0: number; t1: number; t2: number }>
    );
});

export default component$(() => {
  const chartContainer = useSignal<HTMLCanvasElement>();
  const temperatureData = useTemperatureData();
  useStyles$(styles);
  useVisibleTask$(({ track }) => {
    track(() => chartContainer.value);
    if (!chartContainer.value) {
      return;
    }

    Chart.register(Colors);
    new Chart(chartContainer.value, {
      type: "line",
      options: {
        responsive: true,
      },
      data: {
        labels: temperatureData.value.map(({ time }) => time),
        datasets: [
          {
            label: "temperature 1",
            data: temperatureData.value.map(({ t0 }) => t0),
            fill: false,
            tension: 0.1,
          },
          {
            label: "temperature 2",
            data: temperatureData.value.map(({ t1 }) => t1),
            fill: false,
            tension: 0.1,
          },
          {
            label: "temperature 3",
            data: temperatureData.value.map(({ t2 }) => t2),
            fill: false,
            tension: 0.1,
          },
        ],
      },
    });
  });

  return (
    <>
      <div>
        <canvas ref={chartContainer}></canvas>
      </div>
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
