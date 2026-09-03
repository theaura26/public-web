#!/usr/bin/env node
/* One trap, checked mechanically.
 *
 * A backtick inside a <style jsx>{`...`}</style> block ends the template
 * literal early and the file stops parsing. It is documented in
 * DESIGN-SYSTEM.md §13 and it has still cost four broken builds, because
 * the natural way to write a CSS comment about a property is to quote
 * the property in backticks.
 *
 * Nothing else catches it until the build fails, so this does.
 *
 *   node scripts/editorial/guard-styled-jsx.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['app', 'components']
const SKIP = /node_modules|\.next/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (SKIP.test(p)) continue
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(p)) out.push(p)
  }
  return out
}

const findings = []
for (const file of ROOTS.flatMap((r) => walk(r))) {
  const src = readFileSync(file, 'utf8')
  /* Each styled-jsx block, from the opening brace-backtick to the first
     backtick that closes it. A stray backtick inside a comment would
     have ended the literal there, so anything the parser accepted is
     already clean — this looks at the source instead. */
  for (const m of src.matchAll(/<style jsx(?: global)?>\{`/g)) {
    const start = m.index + m[0].length
    const close = src.indexOf('`}', start)
    if (close === -1) continue
    const block = src.slice(start, close)
    for (const c of block.matchAll(/\/\*[\s\S]*?\*\//g)) {
      if (c[0].includes('`')) {
        const line = src.slice(0, start + c.index).split('\n').length
        findings.push(`${file}:${line}  backtick inside a styled-jsx comment`)
      }
    }
  }
}

if (findings.length) {
  console.error('\nstyled-jsx guard\n' + '='.repeat(50))
  for (const f of findings) console.error('  ' + f)
  console.error(`\n${findings.length} finding${findings.length === 1 ? '' : 's'}.`)
  console.error('A backtick ends the template literal. Write the property name plainly.\n')
  process.exit(1)
}
console.log('styled-jsx guard: clean')
