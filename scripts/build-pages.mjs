/**
 * بناء الموقع للنشر على Cloudflare Pages — متعدد المنصات
 * الخطوات: next build → opennext → prepare → extract
 */
import { spawnSync } from 'child_process'

process.env.SKIP_WRANGLER_CONFIG_CHECK = 'yes'

function run(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true })
  if (r.status !== 0) {
    console.error(`❌ فشلت الخطوة: ${cmd} ${args.join(' ')}`)
    process.exit(r.status || 1)
  }
}

run('npm', ['run', 'build'])
run('npx', ['opennextjs-cloudflare', 'build'])
run('node', ['scripts/prepare-pages-deploy.mjs'])
run('node', ['scripts/extract-static-html.js'])
run('node', ['scripts/sync-meilisearch.cjs'])

console.log('\n✅ البناء اكتمل — pages-deploy جاهز')
