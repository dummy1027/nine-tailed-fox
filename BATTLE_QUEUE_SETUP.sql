-- battle_queue 테이블 (무작위 배틀 대기열)
CREATE TABLE IF NOT EXISTS battle_queue (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank_title TEXT DEFAULT 'beginner',
  status TEXT DEFAULT 'waiting',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS: 대기열은 모든 사용자가 조회 가능
ALTER TABLE battle_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "battle_queue_all_access" ON battle_queue;
CREATE POLICY "battle_queue_all_access" ON battle_queue
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- 오래된 대기열 자동 정리 (1시간 이상 대기 시 삭제)
DROP FUNCTION IF EXISTS cleanup_old_queue();
CREATE OR REPLACE FUNCTION cleanup_old_queue()
RETURNS void AS $$
BEGIN
  DELETE FROM battle_queue WHERE joined_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- 대기열에서 user_id 기준 중복 체크 (같은 사용자가 여러 번 대기 방지)
DROP FUNCTION IF EXISTS check_user_in_queue(INTEGER);
CREATE OR REPLACE FUNCTION check_user_in_queue(check_user_id UUID)
RETURNS battle_queue AS $$
BEGIN
  RETURN (
    SELECT * FROM battle_queue
    WHERE user_id = check_user_id AND status = 'waiting'
    ORDER BY joined_at ASC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 매칭 함수: 가장 오래 기다린 대기자 2명 반환
DROP FUNCTION IF EXISTS find_match();
CREATE OR REPLACE FUNCTION find_match()
RETURNS TABLE(id BIGINT, user_id UUID, username TEXT, score INTEGER, rating INTEGER, streak INTEGER, rank_title TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT bq.id, bq.user_id, bq.username, bq.score, bq.rating, bq.streak, bq.rank_title
  FROM battle_queue bq
  WHERE bq.status = 'waiting'
  ORDER BY bq.joined_at ASC
  LIMIT 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 대기 상태 업데이트
DROP FUNCTION IF EXISTS update_queue_status(INTEGER, TEXT);
CREATE OR REPLACE FUNCTION update_queue_status(queue_id INTEGER, new_status TEXT)
RETURNS void AS $$
BEGIN
  UPDATE battle_queue SET status = new_status WHERE id = queue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;