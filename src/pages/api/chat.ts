import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, context } = await request.json();

    // Using Groq API (free, fast, and powerful)
    // You can get free API key from: https://console.groq.com
    const GROQ_API_KEY = import.meta.env.GROQ_API_KEY || 'gsk_demo_key';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and good quality
        messages: [
          {
            role: 'system',
            content: context || 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // Fallback response if API fails
      return new Response(
        JSON.stringify({
          message: `I'm Adam's AI assistant! I can help you learn about:\n\n• My experience as an IT Trainer at Enigma Camp\n• My technical skills (Java Spring Boot, React, Angular)\n• My projects and portfolio\n• My education and certifications\n\nWhat would you like to know?`
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const botMessage = data.choices[0]?.message?.content || 'I apologize, I could not process that request.';

    return new Response(
      JSON.stringify({ message: botMessage }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Chat API error:', error);

    // Fallback response
    return new Response(
      JSON.stringify({
        message: "I'm here to help you learn about Adam Maulana! Ask me about his experience, skills, projects, or how to contact him. 😊"
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
