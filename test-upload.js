import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hqumvakozmicqfrbjssr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('Testing upload with service key...\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Create a test file
const testContent = Buffer.from('Test file content');

async function testUpload() {
  try {
    console.log('Attempting to upload test file...');
    
    const { data, error } = await supabase.storage
      .from('assets')
      .upload('test/test-file.txt', testContent, {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (error) {
      console.error('❌ Upload failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Upload successful!', data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl('test/test-file.txt');
      
      console.log('Public URL:', urlData.publicUrl);
      
      // Clean up
      await supabase.storage.from('assets').remove(['test/test-file.txt']);
      console.log('✅ Test file cleaned up');
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

testUpload();
