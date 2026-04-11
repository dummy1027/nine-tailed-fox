# Supabase + Express Backend

기본 Supabase 백엔드 세팅이 완료되었습니다.

## 📋 설정 단계

### 1. Supabase 프로젝트 생성
- [Supabase](https://supabase.com)에 접속하여 프로젝트 생성
- `Settings` → `API` 에서 다음 정보 복사:
  - `Project URL` → `SUPABASE_URL`
  - `anon public` key → `SUPABASE_ANON_KEY`
  - `service_role` secret → `SUPABASE_SERVICE_KEY`

### 2. 환경 설정
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (복사한 키 입력)
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
PORT=3000
```

### 3. 데이터베이스 세팅
- Supabase 대시보드의 **SQL Editor**로 이동
- `DATABASE_SETUP.sql` 파일의 내용을 복사하여 실행
- 이렇게 하면 `items` 테이블과 RLS 정책이 생성됩니다

### 4. 서버 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 모드 (nodemon 사용)
npm run dev

# 또는 일반 실행
npm start
```

서버는 `http://localhost:3000` 에서 실행됩니다.

## 🔌 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 서버 상태 확인 |
| GET | `/api/items` | 모든 아이템 조회 |
| POST | `/api/items` | 새 아이템 생성 |
| GET | `/api/items/:id` | 특정 아이템 조회 |
| PUT | `/api/items/:id` | 아이템 수정 |
| DELETE | `/api/items/:id` | 아이템 삭제 |

## 📝 테스트 예시

```bash
# 모든 items 조회
curl http://localhost:3000/api/items

# 새 item 생성
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "This is a test item"
  }'

# 특정 item 조회
curl http://localhost:3000/api/items/1

# Item 수정
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item",
    "description": "Updated description"
  }'

# Item 삭제
curl -X DELETE http://localhost:3000/api/items/1
```

## 📚 구조

```
.
├── server.js              # Express 서버 메인 파일
├── package.json          # 의존성 정의
├── .env.example          # 환경 변수 예시
├── .gitignore           # Git 무시 파일
└── DATABASE_SETUP.sql   # 데이터베이스 초기화 SQL
```

## 🔐 보안 노트

- Row Level Security (RLS)가 활성화되어 있습니다
- 프로덕션 환경에서는 RLS 정책을 더 엄격하게 설정하세요
- `SUPABASE_SERVICE_KEY`는 절대 클라이언트에 노출하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있으니 커밋하지 마세요

## 다음 단계

- 필요한 테이블 추가 (DATABASE_SETUP.sql 수정)
- 인증 추가 (JWT 토큰)
- API 유효성 검사 미들웨어 추가
- 에러 처리 강화
