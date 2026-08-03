export interface ChatRequestPayload {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
  algorithm: string | null;
}

interface ChatResponseBody {
  reply?: unknown;
  error?: unknown;
}

const isResponseBody = (value: unknown): value is ChatResponseBody =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const responseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json() as unknown;
    } catch {
      return null;
    }
  }

  // Consume non-JSON bodies without showing hosting-provider internals to users.
  await response.text().catch(() => '');
  return null;
};

export async function sendChatRequest(
  payload: ChatRequestPayload,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  let response: Response;
  try {
    response = await fetcher('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Unable to reach AlgoBot. Check your connection and try again.');
  }

  const body = await responseBody(response);
  if (!response.ok) {
    const apiError = isResponseBody(body) && typeof body.error === 'string'
      ? body.error.trim()
      : '';
    throw new Error(apiError || `AlgoBot is temporarily unavailable (HTTP ${response.status}).`);
  }

  const reply = isResponseBody(body) && typeof body.reply === 'string'
    ? body.reply.trim()
    : '';
  if (!reply) throw new Error('AlgoBot returned an invalid response. Please try again.');
  return reply;
}
