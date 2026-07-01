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
            content: `You are the official AI assistant of E-SERVOO.
E-SERVOO is a hyperlocal service platform connecting customers with electricians, plumbers, carpenters, painters, cleaners, AC mechanics, tutors and other professionals.

Answer only questions related to E-SERVOO, bookings, workers, services, pricing, support and platform usage.
Keep replies short, friendly and helpful.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    }
  );

  const data = await response.json();

  return data.choices[0].message.content;
}