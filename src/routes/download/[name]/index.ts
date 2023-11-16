import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({
  platform,
  params,
  send,
  error,
}) => {
  const name = params["name"];
  const file = await platform.R2.get(name);
  if (file === null) {
    throw error(404, `File not found: ${name}`);
  }
  const buffer = await file.arrayBuffer();
  send(200, Buffer.from(buffer));
};
