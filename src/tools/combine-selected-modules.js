import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory (two levels up from src/tools)
const ROOT_DIR = path.resolve(__dirname, '..', '..');

// File extensions to include (if you want *all* files, set to null)
const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Recursively get files from a directory
 */
function getFilesRecursively(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath));
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (!INCLUDE_EXTENSIONS || INCLUDE_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

/**
 * Collect files from src and prisma
 */
function collectFiles() {
  const targetDirs = ['src', 'prisma'];
  let files = [];
  for (const dir of targetDirs) {
    const fullPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath));
    }
  }
  return files;
}

/**
 * Combine into one output file
 */
function combineAll() {
  try {
    const files = collectFiles();

    if (files.length === 0) {
      console.log('❌ No files found in src/ or prisma/');
      return;
    }

    let combinedContent = '';
    console.log('📂 Combining the following files:');
    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(ROOT_DIR, filePath);
        console.log(`- ${relativePath}`);
        combinedContent += `\n/* ===== ${relativePath} ===== */\n`;
        combinedContent += content + '\n';
      } catch (error) {
        console.warn(`⚠️ Skipping ${filePath}: ${error.message}`);
      }
    }

    if (combinedContent) {
      const outputPath = path.join(__dirname, 'output-combine-all.txt');
      fs.writeFileSync(outputPath, combinedContent.trim(), 'utf-8');
      console.log(`✅ Combined ${files.length} files => ${outputPath}`);
    }
  } catch (error) {
    console.error('❌ Error combining files:', error.message);
  }
}

combineAll();

/**
 * Run:
 * node src/tools/combine-selected-modules.js
 */
