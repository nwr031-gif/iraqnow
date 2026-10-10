const fs = require('fs')
const path = require('path')

function walk(d) {
  let r = []
  for (const f of fs.readdirSync(d)) {
    const fp = path.join(d, f)
    const st = fs.statSync(fp)
    if (st.isDirectory() && !f.includes('node_modules') && !f.startsWith('.')) r.push(...walk(fp))
    else if (/\.(ts|tsx)$/.test(f)) r.push(fp)
  }
  return r
}

// Only replace simple string literals (not template literals with ${})
// This avoids corrupting template expressions
let n = 0
for (const f of walk('src')) {
  const c = fs.readFileSync(f, 'utf8')
  let modified = false
  let nc = c

  // Match exact picsum URLs in string literals (not template literals)
  const patterns = [
    ["'https://picsum.photos/seed/podcast1/600/600'", "'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80'"],
    ["'https://picsum.photos/seed/podcast2/600/600'", "'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80'"],
    ["'https://picsum.photos/seed/podcast3/600/600'", "'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80'"],
  ]

  for (const [from, to] of patterns) {
    if (nc.includes(from)) { nc = nc.split(from).join(to); modified = true }
  }

  // For template literal picsum URLs, replace just the base URL part
  if (nc.includes('picsum.photos/seed/')) {
    nc = nc.replace('picsum.photos/seed/', 'images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80&sig=')
    modified = true
  }

  if (modified) {
    fs.writeFileSync(f, nc, 'utf8')
    n++
    console.log('Fixed:', f)
  }
}
console.log('Total:', n)
