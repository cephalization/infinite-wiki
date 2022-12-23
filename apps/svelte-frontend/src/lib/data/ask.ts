import { API_HOST } from "../constants";

export const askEndpoint = (body: Record<string, unknown>) =>
  fetch(`${API_HOST}/ask`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
