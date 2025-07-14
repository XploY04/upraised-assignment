#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Ensure we're in the correct directory
const projectRoot = __dirname;
process.chdir(projectRoot);

// Check if dist/app.js exists
const appPath = path.join(projectRoot, 'dist', 'app.js');
if (!fs.existsSync(appPath)) {
  console.error('Error: dist/app.js not found at:', appPath);
  console.error('Current working directory:', process.cwd());
  console.error('Project root:', projectRoot);
  console.error('Contents of project root:', fs.readdirSync(projectRoot));
  if (fs.existsSync(path.join(projectRoot, 'dist'))) {
    console.error('Contents of dist directory:', fs.readdirSync(path.join(projectRoot, 'dist')));
  }
  process.exit(1);
}

// Start the application
console.log('Starting IMF Gadget API from:', appPath);
require(appPath);
