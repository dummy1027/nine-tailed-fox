import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const rawServiceKey = process.env.SUPABASE_SERVICE_KEY;
// 플레이스홀더인지 확인 후 실제 키만 사용
const supabaseServiceKey = (rawServiceKey && !rawServiceKey.includes('your_')) 
    ? rawServiceKey 
    : process.env.SUPABASE_ANON_KEY;

// 디버그: 값이 제대로 로드됐는지 확인
console.log('🔍 SUPABASE_URL:', supabaseUrl);
console.log('🔍 KEY 앞 20자:', supabaseServiceKey?.substring(0, 20));

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ SUPABASE_URL 또는 SUPABASE_SERVICE_KEY가 .env에 없습니다!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('✅ Supabase 클라이언트 생성 완료!');

export default supabase;
