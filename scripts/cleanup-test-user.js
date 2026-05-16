import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY?.includes('your_')
  ? process.env.SUPABASE_ANON_KEY
  : process.env.SUPABASE_SERVICE_KEY;

const sb = createClient(url, key);
const userId = process.argv[2];
if (!userId) {
  console.error('사용법: node cleanup-test-user.js <user-uuid>');
  process.exit(1);
}
const { error } = await sb.auth.admin.deleteUser(userId);
if (error) console.error('실패:', error.message);
else console.log('삭제 성공:', userId);
