import { type RequestHandler } from "@builder.io/qwik-city";

function getTemperatureFromQuery(query: URLSearchParams, name: string) {
  const value = query.get(name);
  if (value === null) {
    throw new Error("null temperature: " + name);
  }
  return parseFloat(value);
}

export const onGet: RequestHandler = async ({ platform, query, json }) => {
  const doubles = [
    getTemperatureFromQuery(query, "t0"),
    getTemperatureFromQuery(query, "t1"),
    getTemperatureFromQuery(query, "t2"),
  ];
  console.log("Got sensor data:", { doubles });
  platform.SENSORS?.writeDataPoint({
    /// [TEMP0, TEMP1, TEMP2]
    doubles,
    /// [BLOWER INDEX]
    indexes: ["b1"],
  });

  json(201, "OK");
};
