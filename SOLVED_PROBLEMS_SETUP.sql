-- profiles 테이블에 해결한 문제 목록을 저장할 solved_problems 컬럼 추가
-- Supabase Dashboard > SQL Editor 에서 아래 쿼리를 실행해 주세요.

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS solved_problems TEXT[] DEFAULT '{}';
