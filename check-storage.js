import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hqumvakozmicqfrbjssr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkStorage() {
  console.log('Checking storage buckets...\n');
  
  // List all buckets
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  
  console.log('Available buckets:');
  buckets.forEach(bucket => {
    console.log(`- ${bucket.name} (${bucket.public ? 'PUBLIC' : 'PRIVATE'})`);
  });
  
  // Check if assets bucket exists
  const assetsBucket = buckets.find(b => b.name === 'assets');
  
  if (!assetsBucket) {
    console.log('\n❌ "assets" bucket does not exist! Creating it...');
    
    const { data, error } = await supabase.storage.createBucket('assets', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (error) {
      console.error('Failed to create bucket:', error);
    } else {
      console.log('✅ Created "assets" bucket successfully!');
    }
  } else {
    console.log('\n✅ "assets" bucket exists');
    console.log('   Public:', assetsBucket.public);
  }
}

checkStorage();
