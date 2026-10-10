/**
 * توليد صور PNG حقيقية بدون مكتبات خارجية
 * og-image.png (1200x630) + apple-touch-icon.png (180x180)
 */
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

function crc32(buf) {
  let table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  let crc = -1
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ -1) >>> 0
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeAndData = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData))
  return Buffer.concat([len, typeAndData, crc])
}

function createPng(width, height, pixelFn) {
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0 // filter none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height)
      const off = y * (1 + width * 4) + 1 + x * 4
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b; raw[off + 3] = a
    }
  }
  const compressed = zlib.deflateSync(raw)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

// Lapis/gold palette
const LAPIS_900 = [15, 33, 64]
const LAPIS_700 = [24, 58, 111]
const GOLD = [212, 175, 55]
const GOLD_LIGHT = [226, 173, 49]
const SAND = [245, 240, 230]

function ogPixel(x, y, w, h) {
  // Gradient lapis background
  const t = (x / w + y / h) / 2
  const r = Math.round(LAPIS_900[0] + (LAPIS_700[0] - LAPIS_900[0]) * t * 0.5)
  const g = Math.round(LAPIS_900[1] + (LAPIS_700[1] - LAPIS_900[1]) * t * 0.5)
  const b = Math.round(LAPIS_900[2] + (LAPIS_700[2] - LAPIS_900[2]) * t * 0.5)

  // Ishtar star (centered, 8-point)
  const cx = w / 2, cy = h / 2 - 30
  const dx = x - cx, dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)
  const norm = ((angle % (Math.PI / 4)) + Math.PI / 4) % (Math.PI / 4)
  const starR = 150 * (1 - (norm / (Math.PI / 8)) * 0.35)
  if (dist < starR && dist > starR * 0.55) return [...GOLD, 255]
  if (dist <= starR * 0.55 && dist > starR * 0.35) return [...LAPIS_900, 255]
  if (dist <= starR * 0.35 && dist > 28) return [...GOLD, 255]
  if (dist <= 28 && dist > 12) return [...LAPIS_900, 255]
  if (dist <= 12) return [...GOLD, 255]

  // Border lines
  if (y < 3 || y > h - 4) return [...GOLD, 200]

  return [r, g, b, 255]
}

function iconPixel(x, y, w, h) {
  const cx = w / 2, cy = h / 2
  const dx = x - cx, dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)
  const norm = ((angle % (Math.PI / 4)) + Math.PI / 4) % (Math.PI / 4)
  const maxR = w * 0.38
  const starR = maxR * (1 - (norm / (Math.PI / 8)) * 0.35)
  if (dist < w * 0.42) {
    // Background circle
    if (dist <= starR && dist > starR * 0.6) return [...GOLD, 255]
    if (dist <= starR * 0.6 && dist > starR * 0.35) return [...LAPIS_900, 255]
    if (dist <= starR * 0.35 && dist > w * 0.06) return [...GOLD, 255]
    if (dist <= w * 0.06 && dist > w * 0.03) return [...LAPIS_900, 255]
    if (dist <= w * 0.03) return [...GOLD, 255]
    return [LAPIS_900[0], LAPIS_900[1], LAPIS_900[2], 255]
  }
  return [0, 0, 0, 0] // transparent
}

const outDir = path.join(__dirname, '..', 'public')
fs.writeFileSync(path.join(outDir, 'og-image.png'), createPng(1200, 630, ogPixel))
console.log('✓ og-image.png (1200x630)')
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180, iconPixel))
console.log('✓ apple-touch-icon.png (180x180)')
fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPng(192, 192, iconPixel))
console.log('✓ icon-192.png (192x192)')
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPng(512, 512, iconPixel))
console.log('✓ icon-512.png (512x512)')
