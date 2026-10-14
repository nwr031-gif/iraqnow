/**
 * reimage-all.cjs â€” Ø¥Ø¹Ø§Ø¯Ø© ØªØµÙˆÙŠØ± ÙƒÙ„ Ø§Ù„Ù…Ù‚Ø§Ù„Ø§Øª Ø°Ø§Øª ØµÙˆØ± Ø§Ù„Ù…Ø³Ø¨Ø­ Ø§Ù„Ø¹Ø§Ù… Ø¨ØµÙˆØ± Ù…ÙˆØ¶ÙˆØ¹ÙŠØ© Ù…Ø·Ø§Ø¨Ù‚Ø©
 * NIM ÙŠÙ‚ØªØ±Ø­ imageQuery Ù„ÙƒÙ„ Ù…Ù‚Ø§Ù„Ø© â†’ Commons (ØµØ§Ø±Ù…) â†’ Openverse â†’ PATCH
 * Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…: node reimage-all.cjs  (Ø®Ù„ÙÙŠØ© Ù…Ø¹ Ø³Ø¬Ù„ progress.log)
 */
const https = require('https')
const fs = require('fs')
const path = require('path')

const ROOT = 'D:/ui/iraqnow'
const secrets = JSON.parse(fs.readFileSync(path.join(ROOT, 'ai-worker/.deploy.secrets.json'), 'utf8'))
const NIM_KEY = secrets.NIM_KEY
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const LOG = path.join(__dirname, 'progress.log')

function log(m) {
  const line = `[${new Date().toISOString().slice(11, 19)}] ${m}`
  console.log(line)
  fs.appendFileSync(LOG, line + '\n')
}


