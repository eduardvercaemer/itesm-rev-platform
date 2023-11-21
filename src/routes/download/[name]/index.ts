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

  // Convert ArrayBuffer stream to Uint8Array stream.
  const readableStream = file.body as ReadableStream<ArrayBuffer>;
  const { writable, readable } = new TransformStream({
    transform: (chunk: ArrayBuffer, controller) => {
      controller.enqueue(new Uint8Array(chunk));
    },
  });
  readableStream.pipeTo(writable);

  send(
    new Response(readable, {
      status: 200,
      headers: new Headers({
        "Content-Type":
          file.httpMetadata?.contentType ?? "application/octet-stream",
      }),
    }),
  );
};
