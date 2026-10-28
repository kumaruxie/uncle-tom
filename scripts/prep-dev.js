import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const sourceHtml = path.join(rootDir, 'index.source.html')
const indexHtml = path.join(rootDir, 'index.html')

if (fs.existsSync(sourceHtml)) {
  fs.copyFileSync(sourceHtml, indexHtml)
  console.log('✅ Restored index.html from index.source.html for development.')
}

