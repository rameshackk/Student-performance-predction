# fix-package.ps1
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing package.json for Firebase Functions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Delete existing package.json if it exists
if (Test-Path package.json) {
    Write-Host "Removing old/corrupted package.json..." -ForegroundColor Yellow
    Remove-Item package.json -Force
    Write-Host "✓ Old package.json removed" -ForegroundColor Green
} else {
    Write-Host "No existing package.json found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Creating new package.json..." -ForegroundColor Cyan

# Create new package.json with proper content
$content = @'
{
  "name": "functions",
  "version": "1.0.0",
  "description": "Cloud Functions for Firebase",
  "main": "index.js",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "@tensorflow/tfjs-node": "^4.14.0",
    "axios": "^1.6.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "firebase-admin": "^11.11.0",
    "firebase-functions": "^4.5.0",
    "mathjs": "^11.11.1",
    "ml-kmeans": "^6.0.0",
    "ml-pca": "^4.1.1"
  },
  "devDependencies": {
    "firebase-functions-test": "^3.1.0"
  },
  "private": true,
  "author": "",
  "license": "ISC"
}
'@

# Save with UTF8 without BOM
try {
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText("$PWD\package.json", $content, $utf8NoBom)
    Write-Host "✓ package.json created successfully!" -ForegroundColor Green
    
    # Show file size to verify it's not empty
    $fileInfo = Get-Item package.json
    Write-Host "  File size: $($fileInfo.Length) bytes" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to create package.json: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking index.js..." -ForegroundColor Cyan

# Create or fix index.js
if ((Test-Path index.js)) {
    $indexFileInfo = Get-Item index.js
    if ($indexFileInfo.Length -eq 0) {
        Write-Host "index.js is empty, creating proper file..." -ForegroundColor Yellow
        
        $indexContent = @'
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Export the API
exports.api = functions.https.onRequest(app);

// Simple hello world function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Functions!");
});

console.log('Firebase Functions initialized');
'@
        Set-Content -Path index.js -Value $indexContent -Encoding UTF8
        Write-Host "✓ index.js created/updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "✓ index.js exists and has content ($($indexFileInfo.Length) bytes)" -ForegroundColor Green
    }
} else {
    Write-Host "index.js not found, creating new file..." -ForegroundColor Yellow
    
    $indexContent = @'
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Export the API
exports.api = functions.https.onRequest(app);

// Simple hello world function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Functions!");
});

console.log('Firebase Functions initialized');
'@
    Set-Content -Path index.js -Value $indexContent -Encoding UTF8
    Write-Host "✓ index.js created successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Run: npm run serve" -ForegroundColor White
Write-Host ""
Write-Host "Or run both commands:" -ForegroundColor Yellow
Write-Host "npm install && npm run serve" -ForegroundColor White
Write-Host ""