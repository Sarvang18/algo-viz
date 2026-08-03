import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { ChatRequestError, parseChatPayload, requestChatCompletion } from './api/chatCore.ts'

const MAX_LOCAL_BODY_BYTES = 50_000

const localChatApi = (apiKey: string | undefined, model: string | undefined): Plugin => ({
  name: 'local-chat-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      if (req.method !== 'POST') {
        res.statusCode = req.method === 'OPTIONS' ? 204 : 405
        res.end(req.method === 'OPTIONS' ? undefined : JSON.stringify({ error: 'Method not allowed.' }))
        return
      }
      if (!apiKey) {
        res.statusCode = 503
        res.end(JSON.stringify({ error: 'Chat is not configured. Add GROQ_API_KEY to .env.' }))
        return
      }

      try {
        const chunks: Buffer[] = []
        let totalBytes = 0
        for await (const chunk of req) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
          totalBytes += buffer.length
          if (totalBytes > MAX_LOCAL_BODY_BYTES) throw new ChatRequestError(413, 'Request body is too large.')
          chunks.push(buffer)
        }
        const raw = Buffer.concat(chunks).toString('utf8')
        let body: unknown
        try {
          body = JSON.parse(raw) as unknown
        } catch {
          throw new ChatRequestError(400, 'The request body is not valid JSON.')
        }
        const payload = parseChatPayload(body)
        const reply = await requestChatCompletion(apiKey, payload, model)
        res.statusCode = 200
        res.end(JSON.stringify({ reply }))
      } catch (error: unknown) {
        const status = error instanceof ChatRequestError ? error.status : 500
        const message = error instanceof ChatRequestError ? error.message : 'Chat request failed.'
        res.statusCode = status
        res.end(JSON.stringify({ error: message }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), localChatApi(env.GROQ_API_KEY, env.GROQ_MODEL)],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler|react-redux|@reduxjs)/ },
              { name: 'motion-vendor', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)/ },
              { name: 'markdown-vendor', test: /node_modules[\\/](react-markdown|remark-|rehype-|unified|micromark|mdast-|hast-|unist-)/ },
              { name: 'editor-vendor', test: /node_modules[\\/](@monaco-editor|monaco-editor)/ },
              { name: 'export-vendor', test: /node_modules[\\/]html-to-image/ },
              { name: 'icons-vendor', test: /node_modules[\\/]lucide-react/ },
            ],
          },
        },
      },
    },
  }
})
