import { type RequestHandler } from "@builder.io/qwik-city";

function getTemperatureFromQuery(query: URLSearchParams, name: string) {
  const value = query.get(name);
  if (value === null) {
    throw new Error("null temperature: " + name);
  }
  return parseFloat(value);
}

export const onGet: RequestHandler = async ({ platform, query, json }) => {
  /// Hay tres "bloques" 1 2 y 3
  /// Cada bloque tiene temperatura interior, exterior, y humedad
  const doubles = [
    getTemperatureFromQuery(query, "ti0"),
    getTemperatureFromQuery(query, "te0"),
    getTemperatureFromQuery(query, "h0"),
    getTemperatureFromQuery(query, "ti1"),
    getTemperatureFromQuery(query, "te1"),
    getTemperatureFromQuery(query, "h1"),
    getTemperatureFromQuery(query, "ti2"),
    getTemperatureFromQuery(query, "te2"),
    getTemperatureFromQuery(query, "h2"),
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
