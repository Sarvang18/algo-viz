import { ChatRequestError, parseChatPayload, requestChatCompletion } from './chatCore.js';

type HeaderValue = string | string[] | undefined;

export interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, HeaderValue>;
  socket?: { remoteAddress?: string | null };
}

export interface ApiResponse {
  setHeader(name: string, value: string | number | readonly string[]): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
  end(): void;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();
const RATE_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT = 20;
const MAX_BODY_BYTES = 50_000;

const firstHeader = (value: HeaderValue): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const clientIp = (req: ApiRequest): string =>
  firstHeader(req.headers['x-forwarded-for'])?.split(',')[0]?.trim()
  || firstHeader(req.headers['x-real-ip'])
  || req.socket?.remoteAddress
  || 'unknown';

const consumeRateLimit = (ip: string): { allowed: boolean; remaining: number; resetAt: number } => {
  const now = Date.now();
  if (rateBuckets.size > 1_000) {
    for (const [key, bucket] of rateBuckets) if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
  const current = rateBuckets.get(ip);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + RATE_WINDOW_MS }
    : current;
  bucket.count++;
  rateBuckets.set(ip, bucket);
  return { allowed: bucket.count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - bucket.count), resetAt: bucket.resetAt };
};

const requestOriginAllowed = (req: ApiRequest): boolean => {
  const origin = firstHeader(req.headers.origin);
  if (!origin) return true;
  const forwardedHost = firstHeader(req.headers['x-forwarded-host']);
  const host = forwardedHost ?? firstHeader(req.headers.host);
  const configured = (process.env.ALLOWED_CHAT_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  if (configured.includes(origin)) return true;
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
};

const parseBody = (body: unknown): unknown => {
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ChatRequestError(400, 'The request body is not valid JSON.');
  }
};

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');

  if (!requestOriginAllowed(req)) {
    res.status(403).json({ error: 'Origin is not allowed.' });
    return;
  }

  const origin = firstHeader(req.headers.origin);
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const contentLength = Number(firstHeader(req.headers['content-length']) ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    res.status(413).json({ error: 'Request body is too large.' });
    return;
  }

  const rate = consumeRateLimit(clientIp(req));
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
  res.setHeader('X-RateLimit-Remaining', rate.remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(rate.resetAt / 1_000));
  if (!rate.allowed) {
    res.setHeader('Retry-After', Math.ceil((rate.resetAt - Date.now()) / 1_000));
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, '');
  if (!apiKey) {
    res.status(503).json({ error: 'Chat is not configured.' });
    return;
  }

  try {
    const payload = parseChatPayload(parseBody(req.body));
    const reply = await requestChatCompletion(apiKey, payload, process.env.GROQ_MODEL);
    res.status(200).json({ reply });
  } catch (error: unknown) {
    if (error instanceof ChatRequestError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Chat request failed:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Chat request failed.' });
  }
}
