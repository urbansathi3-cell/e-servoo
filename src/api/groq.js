const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function askGroq(message) {

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({

        model: "llama-3.3-70b-versatile",

        messages: [

          {
            role: "system",

            content:
              "You are E-SERVOO AI Assistant. Answer politely and help users about electricians, plumbers, cleaners, bookings, pricing and services."
          },

          {
            role: "user",

            content: message
          }

        ]

      })

    }
  );

  const data = await response.json();

  return data.choices[0].message.content;

}