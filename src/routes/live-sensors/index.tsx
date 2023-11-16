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
    SELECT   toStartOfInterval(timestamp, INTERVAL '1' SECOND) AS time,
             sum(double1 * _sample_interval) AS t0,
             sum(double2 * _sample_interval) AS t1,
             sum(double3 * _sample_interval) AS t2
    FROM     SENSORS
    WHERE    index1 = 'b1'
    AND      timestamp > NOW() - INTERVAL ${SELECTION_TO_INTERVAL(selection)}
    GROUP BY time
    ORDER BY time ASC
  `;

async function query(apiToken: string, selection: IntervalSelection) {
  const body = QUERY(selection);
  console.log("Running query", body);
  return await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body,
  })
    .then((res) => res.json())
    .then((json: any) => {
      console.log("Query response", json);
      return json.data as Array<{
        time: Date;
        t0: number;
        t1: number;
        t2: number;
      }>;
    });
}

export const getTimeseries = server$(async function (
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
  const data = await query(apiToken, selection);
  return { data };
});

export const saveTimeseries = server$(async function (
  selection: IntervalSelection,
) {
  const { data } = await getTimeseries(selection);
  const R2 = this.platform.R2;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const upload = await R2.put(
    "/reports/" + Date.now().toString() + ".scv",
    [
      `time,t0,t1,t2`,
      ...data.map((d) => `${d.time},${d.t0},${d.t1},${d.t2}`),
    ].join("\n"),
  );
});

export default component$(() => {
  const selection = useSignal(IntervalSelection.FIFTEEN_MINTUES);
  const timerReload = useSignal(0);
  const saving = useSignal(false);
  const data =
    useSignal<{ t0: number; t1: number; t2: number; time: Date }[]>();
  useVisibleTask$(async ({ track }) => {
    track(() => selection.value);
    track(() => timerReload.value);
    data.value = (await getTimeseries(selection.value)).data;
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
            disableExport={saving}
            setSelection$={(newSelection) => {
              selection.value = newSelection;
            }}
            export$={async () => {
              saving.value = true;
              await saveTimeseries(selection.value);
              saving.value = false;
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
