const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {}

export async function postJson(path, body, signal) {
  let response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Cannot reach the backend. Start FastAPI on port 8000 and try again.",
    );
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}.`;
    try {
      const payload = await response.json();
      if (typeof payload.detail === "string") detail = payload.detail;
      else if (Array.isArray(payload.detail))
        detail = payload.detail.map((item) => item.msg).join("; ");
    } catch {
      /* body was not JSON, keep the generic message */
    }
    throw new ApiError(detail);
  }

  return response.json();
}

export async function runAlgorithm(entry, payload, signal) {
  if (!entry) throw new ApiError("That algorithm is not implemented yet.");

  const result = await postJson(entry.endpoint, payload, signal);

  console.log("ALGORITHM ENTRY:", entry);
  console.log("BACKEND RESULT:", result);

  if (!Array.isArray(result.steps) || result.steps.length === 0) {
    throw new ApiError("The backend returned no steps.");
  }

  if (result.kind !== entry.kind) {
    throw new ApiError(
      `Expected ${entry.kind} steps but the backend sent ${result.kind}.`,
    );
  }

  return result;
}
