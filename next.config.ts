const dotenv = require('dotenv');
const fs = require('fs');

// Determine the environment
const environment = process.env.NODE_ENV || 'development';
const envFile = `.env.${environment}`;

// Check and load the appropriate environment file
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`Loaded environment variables from ${envFile}`);
} else if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log(`Loaded environment variables from .env.local`);
} else {
  console.warn('No .env file found!');
}

module.exports = {
  reactStrictMode: true,
};
