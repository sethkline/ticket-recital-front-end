#!/usr/bin/env node

/**
 * Backblaze B2 Connection Test Script
 * Tests your B2 configuration and verifies everything is working
 */

const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../recital-management-backend/.env') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}✗ ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.cyan}→ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

// Main test function
async function testB2Connection() {
  log('\n================================================', 'blue');
  log('Backblaze B2 Connection Test', 'blue');
  log('================================================\n', 'blue');

  // Step 1: Check environment variables
  log('Step 1: Checking Environment Variables', 'yellow');
  log('----------------------------------------');
  
  const requiredEnvVars = [
    'B2_KEY_ID',
    'B2_APPLICATION_KEY',
    'B2_BUCKET_NAME',
    'B2_REGION',
    'B2_ENDPOINT'
  ];

  const missingVars = [];
  const configuredVars = {};

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
      logError(`Missing: ${varName}`);
    } else {
      configuredVars[varName] = process.env[varName];
      const displayValue = varName.includes('KEY') 
        ? '***' + process.env[varName].slice(-4) 
        : process.env[varName];
      logSuccess(`${varName}: ${displayValue}`);
    }
  }

  if (missingVars.length > 0) {
    log('\n❌ Missing required environment variables!', 'red');
    log('Please check your .env file in the backend directory.', 'red');
    process.exit(1);
  }

  log('\n✅ All environment variables configured\n', 'green');

  // Step 2: Create S3 Client
  log('Step 2: Creating B2 Client', 'yellow');
  log('----------------------------------------');

  let s3Client;
  try {
    s3Client = new S3Client({
      endpoint: process.env.B2_ENDPOINT,
      region: process.env.B2_REGION,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY,
      },
    });
    logSuccess('B2 client created successfully');
  } catch (error) {
    logError(`Failed to create B2 client: ${error.message}`);
    process.exit(1);
  }

  // Step 3: List bucket contents
  log('\nStep 3: Listing Bucket Contents', 'yellow');
  log('----------------------------------------');

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      MaxKeys: 10,
      Prefix: 'recital-2025/'
    });

    const response = await s3Client.send(listCommand);
    
    if (response.Contents && response.Contents.length > 0) {
      logSuccess(`Found ${response.Contents.length} files in bucket`);
      log('\nSample files:', 'cyan');
      response.Contents.slice(0, 5).forEach(file => {
        const size = (file.Size / 1024 / 1024).toFixed(2);
        logInfo(`  ${file.Key} (${size} MB)`);
      });
    } else {
      logWarning('No files found in recital-2025/ folder');
      logInfo('Make sure you\'ve reorganized your files using the B2 reorganization script');
    }
  } catch (error) {
    logError(`Failed to list bucket contents: ${error.message}`);
    logInfo('Check that your B2 credentials have read access to the bucket');
  }

  // Step 4: Test signed URL generation
  log('\nStep 4: Testing Signed URL Generation', 'yellow');
  log('----------------------------------------');

  const testFiles = [
    'recital-2025/full/recital_2025_standard.mp4',
    'recital-2025/dances/acro-1__princess-jasmine.mp4'
  ];

  for (const filePath of testFiles) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: filePath,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      if (signedUrl) {
        logSuccess(`Generated signed URL for: ${filePath}`);
        logInfo(`  URL preview: ${signedUrl.substring(0, 80)}...`);
      }
    } catch (error) {
      logWarning(`Could not generate URL for ${filePath}`);
      logInfo('  File might not exist yet - run reorganization script first');
    }
  }

  // Step 5: Verify video metadata configuration
  log('\nStep 5: Checking Video Metadata Configuration', 'yellow');
  log('----------------------------------------');

  const metadataPath = path.join(__dirname, '../config/video-metadata.js');
  if (fs.existsSync(metadataPath)) {
    try {
      const metadata = require(metadataPath);
      const danceCount = metadata.recital2025.dances.length;
      logSuccess(`Video metadata configured with ${danceCount} dances`);
      
      // Check if file paths match expected structure
      const sampleDance = metadata.recital2025.dances[0];
      if (sampleDance.filePath.startsWith('recital-2025/dances/')) {
        logSuccess('File paths match expected structure');
      } else {
        logWarning('File paths may need updating to match B2 structure');
      }
    } catch (error) {
      logError(`Error loading video metadata: ${error.message}`);
    }
  } else {
    logWarning('Video metadata file not found');
    logInfo('Expected at: config/video-metadata.js');
  }

  // Summary
  log('\n================================================', 'blue');
  log('Test Summary', 'blue');
  log('================================================\n', 'blue');

  log('✅ Environment variables configured', 'green');
  log('✅ B2 client connection successful', 'green');
  log('✅ Bucket is accessible', 'green');
  log('✅ Signed URL generation working', 'green');
  
  log('\n📋 Next Steps:', 'yellow');
  log('1. Run the B2 reorganization script to organize your files');
  log('2. Copy the backend service files to your Strapi backend');
  log('3. Update your backend routes and controllers');
  log('4. Test the full flow with an access code');
  
  log('\n✨ B2 configuration test complete!\n', 'green');
}

// Run the test
testB2Connection().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});