// Temporary script to reset password in production
import { ConvexHttpClient } from 'convex/browser';

const client = new ConvexHttpClient('https://cheery-finch-992.convex.cloud');

async function checkUser() {
  try {
    // First, let's try to register to see what happens
    console.log('Trying to register again (should fail if user exists)...');
    const registerResult = await client.mutation('auth:register', {
      email: 'test@test.com',
      password: 'Test123456',
      name: 'Test User',
      phone: '',
    });
    console.log('Register result:', registerResult);
  } catch (error) {
    console.log('Register failed (expected if user exists):', error.message);
  }

  try {
    console.log('\nTesting login with test@test.com...');
    const result = await client.mutation('auth:login', {
      email: 'test@test.com',
      password: 'Test123456',
    });
    console.log('Login Success:', result);
  } catch (error) {
    console.error('\nLogin Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

checkUser();
