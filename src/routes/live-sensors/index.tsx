import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { SensorChart } from "~/components/sensor-chart/sensor-chart";

const ENDPOINT =
  "https://api.cloudflare.com/client/v4/accounts/00afccb96609b332b12ebafa18a20cd8/analytics_engine/sql";

export const useTemperatureData = routeLoader$(async ({ platform }) => {
  if (!platform.env?.CF_PAGES) {
    return [];
  }

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
      Authorization: `Bearer ${platform.env.API_TOKEN}`,
    },
    body: query,
  })
    .then((res) => res.json())
    .then((json: any) => {
      return json.data as Array<{
        time: string;
        t0: number;
        t1: number;
        t2: number;
      }>;
    });
});

export default component$(() => {
  const temperatureData = useTemperatureData();

  return (
    <>
      <div class="flex flex-row flex-wrap justify-around gap-y-8">
        <SensorChart
          name="Sensor 1"
          data={temperatureData.value.map((data) => data.t0)}
          xAxis={temperatureData.value.map((data) => data.time)}
          color="#D8FFDD"
        />
        <SensorChart
          name="Sensor 2"
          data={temperatureData.value.map((data) => data.t1)}
          xAxis={temperatureData.value.map((data) => data.time)}
          color="#85C7F2"
        />
        <SensorChart
          name="Sensor 3"
          data={temperatureData.value.map((data) => data.t2)}
          xAxis={temperatureData.value.map((data) => data.time)}
          color="#CAA8F5"
        />
      </div>
    </>
  );
});
