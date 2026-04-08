const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const SVG_PATH = path.join(__dirname, '..', 'assets', 'icon.svg')
const OUT_DIR = path.join(__dirname, '..', 'assets')

const SIZES = [256, 512]
const ICO_SIZES = [16, 20, 24, 30, 32, 40, 48, 64, 96, 128, 256]

// Build a multi-size ICO from PNG buffers
function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length
  const headerSize = 6
  const dirEntrySize = 16
  const dirSize = dirEntrySize * count
  let offset = headerSize + dirSize

  // ICO header: reserved(2) + type(2) + count(2)
  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)       // reserved
  header.writeUInt16LE(1, 2)       // type: 1 = ICO
  header.writeUInt16LE(count, 4)   // image count

  const dirEntries = []
  for (let i = 0; i < count; i++) {
    const size = sizes[i]
    const png = pngBuffers[i]
    const entry = Buffer.alloc(dirEntrySize)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)   // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)   // height
    entry.writeUInt8(0, 2)                          // color palette
    entry.writeUInt8(0, 3)                          // reserved
    entry.writeUInt16LE(1, 4)                       // color planes
    entry.writeUInt16LE(32, 6)                      // bits per pixel
    entry.writeUInt32LE(png.length, 8)             // image data size
    entry.writeUInt32LE(offset, 12)                // offset to image data
    dirEntries.push(entry)
    offset += png.length
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers])
}

async function main() {
  const svg = fs.readFileSync(SVG_PATH)

  // Generate PNG files to keep
  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `icon-${size}.png`)
    await sharp(svg).resize(size, size).png().toFile(outPath)
    console.log(`  icon-${size}.png`)
  }

  // Generate ICO
  const pngBuffers = []
  for (const size of ICO_SIZES) {
    const buf = await sharp(svg).resize(size, size).png().toBuffer()
    pngBuffers.push(buf)
  }
  const ico = buildIco(pngBuffers, ICO_SIZES)
  const icoPath = path.join(OUT_DIR, 'icon.ico')
  fs.writeFileSync(icoPath, ico)
  console.log(`  icon.ico`)

  console.log('\nDone!')
}

main().catch(err => { console.error(err); process.exit(1) })
