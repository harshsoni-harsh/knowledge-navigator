const requiredEnvVars = ['NEXT_PUBLIC_BACKEND_URL', 'DATABASE_URL'];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
  } else {
    console.log(`${key}=${process.env[key]}`)
  }
}

console.log('All required environment variables are set.');
