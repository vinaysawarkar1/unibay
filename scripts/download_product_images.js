const fs = require('fs')
const path = require('path')
const https = require('https')

const root = path.join(__dirname, '..')
const outDir = path.join(root, 'public', 'products')
const sourcesFile = path.join(root, 'public', 'image-sources.json')

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow redirects
          return download(res.headers.location, dest).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) {
          file.close()
          fs.unlink(dest, () => {})
          return reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
        }
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

async function main() {
  if (!fs.existsSync(sourcesFile)) {
    console.error('Missing image-sources.json at', sourcesFile)
    process.exit(1)
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'))
  const entries = Object.entries(sources)

  console.log(`Downloading ${entries.length} images to ${outDir}`)

  for (const [filename, url] of entries) {
    const dest = path.join(outDir, filename)
    if (fs.existsSync(dest)) {
      console.log(`Skipping existing ${filename}`)
      continue
    }
    try {
      console.log(`Fetching ${url} -> ${filename}`)
      await download(url, dest)
      console.log(`Saved ${filename}`)
    } catch (err) {
      console.error(`Failed ${filename}:`, err.message)
    }
  }

  console.log('Done')
}

main()
