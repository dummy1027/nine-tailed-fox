import { supabase } from './src/supabaseClient.js';
import 'dotenv/config';

console.log('Testing Supabase query...');
try {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, solved_problems')
    .eq('id', 'c6f05567-cb82-47f7-9273-cdea51e8f3ec')
    .maybeSingle();
    
  console.log('Query result:', { data, error });
  
  if (error) {
    console.log('Attempting fallback query...');
    const fallback = await supabase
      .from('profiles')
      .select('id, username, display_name, bio')
      .eq('id', 'c6f05567-cb82-47f7-9273-cdea51e8f3ec')
      .maybeSingle();
    console.log('Fallback result:', fallback);
  }
} catch (err) {
  console.error('Thrown error:', err);
}
