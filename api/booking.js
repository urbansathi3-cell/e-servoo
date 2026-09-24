export default async function handler(req, res) {
  const allowedOrigins = [
    "https://e-servoo.com",
    "https://www.e-servoo.com",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const APPS_SCRIPT_URL =
      process.env.APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({
        success: false,
        message:
          "APPS_SCRIPT_URL is not configured",
      });
    }

    /*
    =
    GET REQUEST
    Example:

    /api/booking?action=workerBookings&worker=Mahendra
    =
    */

    if (req.method === "GET") {
      const query = new URLSearchParams();

      Object.entries(req.query || {}).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null
          ) {
            query.append(
              key,
              String(value)
            );
          }
        }
      );

      const targetUrl =
        `${APPS_SCRIPT_URL}?${query.toString()}`;

      const response = await fetch(
        targetUrl,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const text =
        await response.text();

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
    }

    /*
    =
    POST REQUEST
    =
    */

    if (req.method === "POST") {
      const response = await fetch(
        APPS_SCRIPT_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            req.body || {}
          ),
          redirect: "follow",
        }
      );

      const text =
        await response.text();

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
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error(
      "Booking proxy error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Could not connect to booking server",
      error: error.message,
    });
  }
}