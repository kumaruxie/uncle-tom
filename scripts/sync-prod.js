import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const docsDir = path.join(rootDir, 'docs')
const rootAssetsDir = path.join(rootDir, 'assets')
const docsAssetsDir = path.join(docsDir, 'assets')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.')
  process.exit(1)
}

// 1. Copy dist/index.html to root index.html and root 404.html
const distHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
fs.writeFileSync(path.join(rootDir, 'index.html'), distHtml, 'utf-8')
fs.writeFileSync(path.join(rootDir, '404.html'), distHtml, 'utf-8')

// 2. Copy dist/index.html to docs/index.html and docs/404.html
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true })
fs.writeFileSync(path.join(docsDir, 'index.html'), distHtml, 'utf-8')
fs.writeFileSync(path.join(docsDir, '404.html'), distHtml, 'utf-8')

// 3. Copy dist/assets to root assets and docs/assets
copyRecursive(path.join(distDir, 'assets'), rootAssetsDir)
copyRecursive(path.join(distDir, 'assets'), docsAssetsDir)

// 4. Copy dist/images if exists
if (fs.existsSync(path.join(distDir, 'images'))) {
  copyRecursive(path.join(distDir, 'images'), path.join(rootDir, 'images'))
  copyRecursive(path.join(distDir, 'images'), path.join(docsDir, 'images'))
}

// 5. Copy icons and favicons
for (const file of ['favicon.svg', 'icons.svg']) {
  const p = path.join(distDir, file)
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(rootDir, file))
    fs.copyFileSync(p, path.join(docsDir, file))
  }
}

// 6. Create .nojekyll in root and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf-8')
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8')

console.log('✅ Successfully synchronized production build to root and docs!')

