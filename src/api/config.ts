export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787",
  wsUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:8787/events",
  useMock: import.meta.env.VITE_USE_MOCK !== "false",
};
