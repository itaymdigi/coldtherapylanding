// Script to set up admin user in Supabase Auth
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqumvakozmicqfrbjssr.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdW12YWtvem1pY3FmcmJqc3NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYzNjE2NSwiZXhwIjoyMDc3MjEyMTY1fQ.i-UClGSkF6JbRi6T92-v4H1FMk3gFMRYZOt6ifnSm8k';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupAdminUser() {
  const adminEmail = 'itay.machlof@gmail.com';
  const adminPassword = 'Admin123!';

  try {
    // 1. Get the existing auth user
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const user = existingUser.users.find(u => u.email === adminEmail);
    
    if (!user) {
      // Create new user if doesn't exist
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          is_admin: true,
          name: 'Admin User'
        }
      });

      if (authError) {
        throw authError;
      }
      console.log('✅ New auth user created:', authData?.user?.email);
    } else {
      // Reset password for existing user
      const { data: resetData, error: resetError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: adminPassword }
      );
      
      if (resetError) {
        throw resetError;
      }
      console.log('✅ Password reset for existing user:', user.email);
    }

    // 2. Get the user ID
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const currentUser = allUsers.users.find(u => u.email === adminEmail);
    
    if (!currentUser) {
      throw new Error('User not found in auth system');
    }

    console.log('✅ User ID:', currentUser.id);

    // 3. Update the users table to ensure is_admin is set
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: currentUser.id,
        email: adminEmail,
        name: 'Admin User',
        is_admin: true,
        created_at: new Date().toISOString(),
        total_sessions: 0,
        total_duration: 0
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    console.log('✅ Profile updated:', profileData);
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 User ID:', user.id);
    console.log('🛡️  Admin Status:', profileData.is_admin);

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupAdminUser();
