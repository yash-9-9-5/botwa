import fs from 'fs';
import path from 'path';

// Function to fix import statements in compiled JS files
function fixImportExtensions(filePath) {
  if (!filePath.endsWith('.js')) return;

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add .js extension to relative imports (./ and ../)
    const updatedContent = content.replace(
      /(from\s+["'])\.\/([^"']*?)(["'])/g,
      (match, before, modulePath, after) => {
        if (modulePath.endsWith('.js')) {
          return match; // Already has .js extension
        }
        return `${before}./${modulePath}.js${after}`;
      }
    ).replace(
      /(from\s+["'])\.\.\/([^"']*?)(["'])/g,
      (match, before, modulePath, after) => {
        if (modulePath.endsWith('.js')) {
          return match; // Already has .js extension
        }
        return `${before}../${modulePath}.js${after}`;
      }
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Function to recursively process directory
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      processDirectory(itemPath);
    } else if (stat.isFile()) {
      fixImportExtensions(itemPath);
    }
  }
}

// Start processing from dist directory
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  processDirectory(distPath);
  console.log('Import fixing completed!');
} else {
  console.log('dist directory does not exist. Run build first.');
}