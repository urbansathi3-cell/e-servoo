export default async function handler(req, res) {
  try {
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({
        success: false,
        message: "APPS_SCRIPT_URL is not configured",
      });
    }

    // Forward query parameters
    const query = new URLSearchParams(req.query).toString();

    const targetUrl = query
      ? `${APPS_SCRIPT_URL}?${query}`
      : APPS_SCRIPT_URL;

    const options = {
      method: req.method,
      headers: {},
    };

    // Forward body for POST/PUT/PATCH
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      options.headers["Content-Type"] = "application/json";
      options.body =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body || {});
    }

    const response = await fetch(targetUrl, options);

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: response.ok,
        message: text,
      };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Apps Script proxy error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not connect to Apps Script",
      error: error.message,
    });
  }
}