import type { APIRoute } from "astro";
import OpenAI from "openai";

// Get API key from environment variables
const apiKey = import.meta.env.OPENAI_API_KEY;

// Log environment info (this will only show in server logs)
console.log("Environment:", {
  isProduction: import.meta.env.PROD,
  hasApiKey: !!apiKey,
  keyLength: apiKey ? apiKey.length : 0,
});

if (!apiKey) {
  console.error("OPENAI_API_KEY is not set in environment variables");
  throw new Error("OPENAI_API_KEY is not configured");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Request body:", body); // Log the request body

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return new Response(
      JSON.stringify({
        message: completion.choices[0].message.content,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Log the full error details
    console.error("Chat API Error:", error);

    // Return more detailed error information
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? {
                message: error.message,
                name: error.name,
                stack: error.stack,
              }
            : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
