import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { loadEnvLocal } from './env.mjs'

loadEnvLocal()

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['tsx', 'mcp/aura-knowledge/server.mts'],
  env: Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== undefined)) as Record<string, string>,
})
const client = new Client({ name: 'probe', version: '1.0.0' })
await client.connect(transport)

const tools = await client.listTools()
console.log('tools:', tools.tools.map(t => t.name).join(', '))

const res = await client.callTool({ name: 'search_aura', arguments: { query: 'how many cattle', limit: 2 } })
const parsed = JSON.parse((res.content as Array<{ text: string }>)[0].text)
console.log('search hits:', parsed.count)
for (const r of parsed.results) console.log('  ·', r.sectionPath, '|', r.sourceType, '|', r.confidence)

const topics = await client.callTool({ name: 'list_aura_topics', arguments: {} })
console.log('topics:', JSON.parse((topics.content as Array<{ text: string }>)[0].text).topics.length)

const resources = await client.listResources()
console.log('resources:', resources.resources.map(r => r.uri).join(', '))

await client.close()
