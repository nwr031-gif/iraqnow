/**
 * OpenNext patches for Windows + Next.js 16 compatibility:
 * 1) Windows: fall back to copying when symlink creation fails (EPERM).
 * 2) Next.js 16: inline `preview-props.json` in loadManifest (not covered by OpenNext glob).
 * يعمل تلقائياً بعد npm install عبر postinstall
 */
const fs = require('fs')
const path = require('path')

let patchedAny = false

/* ═══════════ 1) Windows symlink fallback ═══════════ */
const copyFile = path.join(
  __dirname, '..', 'node_modules', '@opennextjs', 'aws', 'dist', 'build', 'copyTracedFiles.js'
)

if (fs.existsSync(copyFile)) {
  let content = fs.readFileSync(copyFile, 'utf8')

  const needle = `        if (symlink) {
            try {
                symlinkSync(symlink, to);
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }`

  const replacement = `        if (symlink) {
            try {
                symlinkSync(symlink, to);
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    // Windows fallback (no admin/developer mode): copy target instead of symlink
                    try {
                        cpSync(from, to, { recursive: true, dereference: true });
                    }
                    catch (e2) {
                        logger.debug("Error copying symlinked file:", e2);
                        erroredFiles.push(to);
                    }
                }
            }
        }`

  if (!content.includes('dereference: true') && content.includes(needle)) {
    content = content.replace(needle, replacement)
    fs.writeFileSync(copyFile, content)
    console.log('[patch-opennext] ✓ patched symlink fallback for Windows')
    patchedAny = true
  } else if (content.includes('dereference: true')) {
    console.log('[patch-opennext] symlink patch already applied')
  }
}

/* ═══════════ 2) inline preview-props.json for Next.js 16 ═══════════ */
const loadManifestFile = path.join(
  __dirname, '..', 'node_modules', '@opennextjs', 'cloudflare', 'dist', 'cli', 'build', 'patches', 'plugins', 'load-manifest.js'
)

if (fs.existsSync(loadManifestFile)) {
  let content = fs.readFileSync(loadManifestFile, 'utf8')

  const globNeedle = `"**/{*-manifest,required-server-files,prefetch-hints}.json"`
  const globReplacement = `"**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json"`

  if (!content.includes('preview-props') && content.includes(globNeedle)) {
    content = content.replace(globNeedle, globReplacement)
    fs.writeFileSync(loadManifestFile, content)
    console.log('[patch-opennext] ✓ patched loadManifest to inline preview-props.json')
    patchedAny = true
  } else if (content.includes('preview-props')) {
    console.log('[patch-opennext] preview-props patch already applied')
  }
}

if (!patchedAny) {
  console.log('[patch-opennext] nothing to patch (already up to date)')
}
