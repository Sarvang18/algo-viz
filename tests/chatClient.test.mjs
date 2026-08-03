import test from 'node:test';
import assert from 'node:assert/strict';

import { sendChatRequest } from '../src/components/Chatbot/chatClient.ts';

const payload = { message: 'Explain BFS', history: [], algorithm: 'BFS' };

test('chat client returns a valid JSON reply', async () => {
  const reply = await sendChatRequest(payload, async () => Response.json({ reply: 'Breadth-first search uses a queue.' }));
  assert.equal(reply, 'Breadth-first search uses a queue.');
});

test('chat client preserves a safe JSON API error', async () => {
  await assert.rejects(
    sendChatRequest(payload, async () => Response.json({ error: 'Chat is not configured.' }, { status: 503 })),
    /Chat is not configured/,
  );
});

test('chat client handles a plain-text hosting failure without parsing it as JSON', async () => {
  await assert.rejects(
    sendChatRequest(payload, async () => new Response('A server error has occurred', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })),
    /temporarily unavailable \(HTTP 500\)/,
  );
});

test('chat client reports network failures clearly', async () => {
  await assert.rejects(
    sendChatRequest(payload, async () => { throw new TypeError('fetch failed'); }),
    /Unable to reach AlgoBot/,
  );
});
