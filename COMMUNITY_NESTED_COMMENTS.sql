-- 대댓글 기능을 위해 parent_id 컬럼 추가
ALTER TABLE comments ADD COLUMN parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE;
