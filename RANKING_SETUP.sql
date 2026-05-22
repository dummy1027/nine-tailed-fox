-- profiles 테이블에 랭킹 관련 컬럼 추가
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS solved INTEGER DEFAULT 0;

-- 랭크 순위 함수 생성
DROP FUNCTION IF EXISTS get_user_rank(INTEGER);
CREATE OR REPLACE FUNCTION get_user_rank(user_score INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF user_score < 100 THEN RETURN 'beginner';
  ELSIF user_score < 300 THEN RETURN 'veteran';
  ELSIF user_score < 600 THEN RETURN 'expert';
  ELSIF user_score < 1000 THEN RETURN 'master';
  ELSE RETURN 'grandmaster';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;