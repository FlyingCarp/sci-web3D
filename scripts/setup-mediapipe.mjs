/**
 * setup-mediapipe.mjs
 *
 * One-time setup script. Run: node scripts/setup-mediapipe.mjs
 *
 * 1. Copies MediaPipe WASM files from node_modules to public/mediapipe/
 * 2. Downloads hand_landmarker.task model to public/models/
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const WASM_SRC = path.join(ROOT, 'node_modules/@mediapipe/tasks-vision/wasm');
const WASM_DEST = path.join(ROOT, 'public/mediapipe');
const MODEL_DEST = path.join(ROOT, 'public/models');
const MODEL_FILENAME = 'hand_landmarker.task';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
    console.log(`  Copied: ${file}`);
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    const request = (u) =>
      https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          return;
        }
        const total = parseInt(res.headers['content-length'] || '0', 10);
        let received = 0;
        res.on('data', (chunk) => {
          received += chunk.length;
          if (total) {
            process.stdout.write(`\r  Downloading... ${((received / total) * 100).toFixed(1)}%`);
          }
        });
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          process.stdout.write('\n');
          resolve();
        });
      }).on('error', reject);
    request(url);
  });
}

async function main() {
  // 1. Copy WASM files
  console.log('\n[1/2] Copying WASM files...');
  copyDir(WASM_SRC, WASM_DEST);
  console.log(`  → public/mediapipe/ (${fs.readdirSync(WASM_DEST).length} files)`);

  // 2. Download model
  const modelPath = path.join(MODEL_DEST, MODEL_FILENAME);
  if (fs.existsSync(modelPath)) {
    const size = (fs.statSync(modelPath).size / 1024 / 1024).toFixed(1);
    console.log(`\n[2/2] Model already exists (${size} MB), skipping download.`);
  } else {
    console.log('\n[2/2] Downloading hand_landmarker.task model...');
    await download(MODEL_URL, modelPath);
    const size = (fs.statSync(modelPath).size / 1024 / 1024).toFixed(1);
    console.log(`  → public/models/hand_landmarker.task (${size} MB)`);
  }

  console.log('\nSetup complete. You can now run: npm run dev\n');
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message);
  process.exit(1);
});
