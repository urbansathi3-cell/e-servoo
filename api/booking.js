export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://e-servoo.com"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({
        success: false,
        message: "APPS_SCRIPT_URL is not configured",
      });
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

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

    return res
      .status(response.ok ? 200 : 500)
      .json(data);

  } catch (error) {
    console.error("Booking proxy error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not connect to booking server",
      error: error.message,
    });
  }
}