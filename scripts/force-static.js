const fs = require('fs')
const path = require('path')
const dir = 'src/app/[locale]'

function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const fp = path.join(d, f)
    if (fs.statSync(fp).isDirectory()) { walk(fp); continue }
    if (!f.endsWith('page.tsx')) continue
    let c = fs.readFileSync(fp, 'utf8')
    const rel = fp.replace(/\\/g, '/')
    if (rel.includes('admin') || rel.includes('auth')) continue
    let mod = false

    if (/export const revalidate\s*=\s*\d+/.test(c)) {
      c = c.replace(/export const revalidate\s*=\s*\d+/, "export const dynamic = 'force-static'\nexport const revalidate = 3600")
      mod = true
    }
    if (c.includes("export const dynamic = 'force-dynamic'")) {
      c = c.replace("export const dynamic = 'force-dynamic'", "export const dynamic = 'force-static'\nexport const revalidate = 3600")
      mod = true
    }
    if (!mod && !c.includes('force-static') && !c.includes('force-dynamic')) {
      if (c.includes('export const metadata')) {
        c = c.replace('export const metadata', "export const dynamic = 'force-static'\n\nexport const metadata")
        mod = true
      } else if (c.includes('export default')) {
        c = c.replace('export default', "export const dynamic = 'force-static'\n\nexport default")
        mod = true
      }
    }
    if (mod) { fs.writeFileSync(fp, c, 'utf8'); console.log('OK:', rel) }
  }
}
walk(dir)
