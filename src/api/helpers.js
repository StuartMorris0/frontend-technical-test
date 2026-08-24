/**
 * Fetch JSON from a URL using the native Fetch API.
 *
 * Rejects with `Error("Request to <url> failed: <reason>")` on any
 * failure (network, HTTP, or JSON parse).
 *
 * @param {string} apiUrl
 * @return {Promise<Object>}
 */
export async function request(apiUrl) {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    throw new Error(`Request to ${apiUrl} failed: ${err.message}`);
  }
}
