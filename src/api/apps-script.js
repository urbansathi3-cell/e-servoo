const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

export default async function handler(req, res) {
  try {
    const method = req.method || "GET";

    let targetUrl = GOOGLE_APPS_SCRIPT_URL;

    /* =====================================================
       GET REQUEST
    ===================================================== */

    if (method === "GET") {
      const query = new URLSearchParams(req.query || {});

      targetUrl += `?${query.toString()}`;
    }

    /* =====================================================
       POST REQUEST
    ===================================================== */

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };

    if (method !== "GET" && method !== "HEAD") {
      options.body =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body || {});
    }

    const response = await fetch(
      targetUrl,
      options
    );

    const text = await response.text();

    res.status(response.status);

    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.send(text);

  } catch (error) {
    console.error(
      "Apps Script proxy error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Apps Script proxy failed",
    });
  }
}