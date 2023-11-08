import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead, server$ } from "@builder.io/qwik-city";

import { SensorChart } from "~/components/sensor-chart/sensor-chart";
import {
  IntervalSelection,
  IntervalSelectionBar,
} from "~/components/ui/interval-selection-bar/interval-selection-bar";

const ENDPOINT =
  "https://api.cloudflare.com/client/v4/accounts/00afccb96609b332b12ebafa18a20cd8/analytics_engine/sql";

const SELECTION_TO_INTERVAL = (selection: IntervalSelection) => {
  switch (selection) {
    case IntervalSelection.FIVE_MINTUES:
      return `'5' MINUTE`;
    case IntervalSelection.FIFTEEN_MINTUES:
      return `'15' MINUTE`;
    case IntervalSelection.ONE_HOUR:
      return `'1' HOUR`;
    case IntervalSelection.EIGHT_HOURS:
      return `'8' HOUR`;
  }
};

const QUERY = (selection: IntervalSelection) => `
    SELECT toStartOfInterval(timestamp, INTERVAL '1' SECOND) AS time,
           double1 AS t0,
           double2 AS t1,
           double3 AS t2
    FROM   SENSORS
    WHERE  index1 = 'b1'
    AND    timestamp > NOW() - INTERVAL ${SELECTION_TO_INTERVAL(selection)}
  `;

async function query(
  signal: AbortSignal,
  apiToken: string,
  selection: IntervalSelection,
) {
  return await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: QUERY(selection),
    signal,
  })
    .then((res) => res.json())
    .then((json: any) => {
      return json.data as Array<{
        time: Date;
        t0: number;
        t1: number;
        t2: number;
      }>;
    });
}

export const getTimeseries = server$(async function (
  signal: AbortSignal,
  selection: IntervalSelection,
) {
  if (!this.platform.env?.CF_PAGES) {
    const gen = () => {
      return {
        time: new Date(),
        t0: Math.random() * 20,
        t1: Math.random() * 20,
        t2: Math.random() * 20,
      };
    };
    return {
      data: [
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
        gen(),
      ],
    };
  }

  const apiToken = this.platform.env.API_TOKEN;
  const data = await query(signal, apiToken, selection);
  return { data };
});

export default component$(() => {
  const selection = useSignal(IntervalSelection.FIFTEEN_MINTUES);
  const timerReload = useSignal(0);
  const data =
    useSignal<{ t0: number; t1: number; t2: number; time: Date }[]>();
  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => selection.value);
    track(() => timerReload.value);
    const controller = new AbortController();
    cleanup(() => {
      controller.abort();
    });
    data.value = (await getTimeseries(controller.signal, selection.value)).data;
  });
  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => selection.value);

    const interval = setInterval(() => {
      timerReload.value++;
    }, 5000);

    cleanup(() => {
      clearInterval(interval);
    });
  });

  const times = useComputed$(() => data.value?.map((data) => data.time) ?? []);
  const series0 = useComputed$(() => data.value?.map((data) => data.t0) ?? []);
  const series1 = useComputed$(() => data.value?.map((data) => data.t1) ?? []);
  const series2 = useComputed$(() => data.value?.map((data) => data.t2) ?? []);

  return (
    <>
      <div class="mx-auto flex max-w-screen-xl flex-col gap-8 px-4">
        <div>
          <IntervalSelectionBar
            selection={selection.value}
            setSelection$={(newSelection) => {
              selection.value = newSelection;
            }}
          />
        </div>
        <div class="flex flex-row flex-wrap justify-around gap-y-8">
          <SensorChart
            name="Sensor 1"
            data={series0}
            xAxis={times}
            color="#D8FFDD"
          />
          <SensorChart
            name="Sensor 2"
            data={series1}
            xAxis={times}
            color="#85C7F2"
          />
          <SensorChart
            name="Sensor 3"
            data={series2}
            xAxis={times}
            color="#CAA8F5"
          />
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Grupo REV - Monitoreo",
  meta: [
    {
      name: "description",
      content: "Grupo REV. Monitoreo en tiempo real de sensores.",
    },
  ],
};
