export default async function handler(req: any, res: any) {
  // CORS Headers for potentially calling from other domains if needed
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history = [], message, context } = req.body;

    // Defend against keys pasted with surrounding quotes or stray whitespace
    const apiKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, '');

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured.' });
    }

    const systemInstruction = `You are "AlgoBot", an expert tutor in Data Structures and Algorithms. You are integrated into a visualization platform to help a student learn.
Context about what the user is currently doing: ${context ? context : "The user is on the main dashboard, not viewing a specific algorithm."}

Rules:
1. Always be concise, encouraging, and highly technical yet easy to understand.
2. Use markdown formatting for any code snippets or step-by-step explanations.
3. Keep your answers focused on Data Structures, Algorithms, time/space complexity, and related computer science concepts.
4. If the user asks something off-topic, politely pivot back to DSA.`;

    const messages = [
      { role: 'system', content: systemInstruction },
      ...history.map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', response.status, errText);
      return res.status(500).json({
        error: 'Failed to generate response',
        upstreamStatus: response.status,
        upstreamMessage: errText.slice(0, 300)
      });
    }

    const data = await response.json();

    return res.status(200).json({ reply: data.choices?.[0]?.message?.content ?? '' });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      stage: 'exception',
      detail: String(error?.message ?? error).slice(0, 300),
      bodyType: typeof req.body,
      hasKey: Boolean(process.env.GROQ_API_KEY)
    });
  }
}
