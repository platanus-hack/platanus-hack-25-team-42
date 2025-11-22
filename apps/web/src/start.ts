import { createMiddleware, createStart } from "@tanstack/react-start";

const requestLogger = createMiddleware().server(async ({ next, request }) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${request.method} ${request.url} - Starting`);

  try {
    const response = await next();
    const duration = Date.now() - startTime;

    console.log(
      `[${timestamp}] ${request.method} ${request.url} - ${response.response.status} (${duration}ms)`
    );

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
      error
    );
    throw error;
  }
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [requestLogger],
  };
});
