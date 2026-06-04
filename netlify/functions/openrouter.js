export async function handler(event) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const { prompt } = JSON.parse(event.body);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemma-4-31b-it",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}