/**
 * Single place that knows how to talk to the FastAPI backend.
 * Native fetch only — no axios, no client wrapper library.
 */

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/** Which algorithms the backend can actually run, and where. */
export const ENDPOINTS = {
  "Bubble Sort": "/api/sorting/bubble",
  "Insertion Sort": "/api/sorting/insertion",
};

export const isImplemented = (algorithm) => algorithm in ENDPOINTS;

export class ApiError extends Error {}

async function postJson(path, body, signal) {
  let response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Cannot reach the backend. Start FastAPI on port 8000 and try again.",
    );
  }

  if (!response.ok) {
    // FastAPI puts validation problems in `detail`, which may be a string
    // or a list of pydantic errors. Flatten either into one readable line.
    let detail = `Request failed with status ${response.status}.`;
    try {
      const payload = await response.json();
      if (typeof payload.detail === "string") detail = payload.detail;
      else if (Array.isArray(payload.detail))
        detail = payload.detail.map((item) => item.msg).join("; ");
    } catch {
      /* body was not JSON; keep the generic message */
    }
    throw new ApiError(detail);
  }

  return response.json();
}

/**
 * Ask the backend for the full step sequence of one algorithm.
 * The frontend never computes steps itself — it only replays what comes back.
 */
export async function fetchSortSteps(algorithm, array, signal) {
  const path = ENDPOINTS[algorithm];
  if (!path) throw new ApiError(`${algorithm} is not implemented yet.`);

  const result = await postJson(path, { array }, signal);

  if (!Array.isArray(result.steps) || !Array.isArray(result.array ?? result.swapped_array)) {
    throw new ApiError("The backend returned an unexpected response shape.");
  }
  return result;
}
