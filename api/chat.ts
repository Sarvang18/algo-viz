import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
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

    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCVTOn76vllmdE3kj1qK0Etk-AC2-uK8Rc';

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are "AlgoBot", an expert tutor in Data Structures and Algorithms. You are integrated into a visualization platform to help a student learn.
Context about what the user is currently doing: ${context ? context : "The user is on the main dashboard, not viewing a specific algorithm."}

Rules:
1. Always be concise, encouraging, and highly technical yet easy to understand.
2. Use markdown formatting for any code snippets or step-by-step explanations.
3. Keep your answers focused on Data Structures, Algorithms, time/space complexity, and related computer science concepts.
4. If the user asks something off-topic, politely pivot back to DSA.`;

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction,
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
