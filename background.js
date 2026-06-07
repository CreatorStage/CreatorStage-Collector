/**
 * YT Creator Collector - Background Service Worker (Manifest V3)
 * Handles API calls to bypass Private Network Access (CNA/loopback) CORS blocks
 * in the context of content scripts.
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "apiCall") {
    const { url, method, headers, body } = message;

    const fetchOptions = {
      method: method || "GET",
      headers: headers || {}
    };

    if (body) {
      fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    fetch(url, fetchOptions)
      .then(async (response) => {
        const ok = response.ok;
        const status = response.status;
        const text = await response.text();
        sendResponse({ ok, status, text });
      })
      .catch((err) => {
        console.error("Erro na chamada de API em background:", err);
        sendResponse({ ok: false, error: err.message || "Erro de conexão com a API." });
      });

    return true; // Keep the messaging channel open for async response
  }
  return false;
});
