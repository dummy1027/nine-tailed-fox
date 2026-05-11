-- 커뮤니티 댓글 테이블 생성
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS 비활성화 (테스트용) 또는 정책 추가
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable SELECT access for all users" ON comments
  FOR SELECT USING (TRUE);

CREATE POLICY "Enable INSERT access for all users" ON comments
  FOR INSERT WITH CHECK (TRUE);
