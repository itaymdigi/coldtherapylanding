const jwt = process.env.SUPABASE_SERVICE_KEY;
if (!jwt) {
  console.error('No service key found');
  process.exit(1);
}

// Decode JWT (just the payload, don't verify)
const parts = jwt.split('.');
if (parts.length !== 3) {
  console.error('Invalid JWT format');
  process.exit(1);
}

const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
console.log('JWT Payload:', JSON.stringify(payload, null, 2));
