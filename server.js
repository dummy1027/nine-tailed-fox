import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import supabase from './src/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 서버 상태 확인
app.get('/api/test', (req, res) => {
    res.json({ result: '🦊 서버가 살아있습니다!' });
});

// --- 커뮤니티 API ---

// 게시글 목록 조회
app.get('/api/posts', async (req, res) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 게시글 작성
app.post('/api/posts', async (req, res) => {
    const { title, content, author, textAlign } = req.body;
    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, author, text_align: textAlign }])
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// 조회수/좋아요 업데이트
app.patch('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { views, likes } = req.body;
    const updateData = {};
    if (views !== undefined) updateData.views = views;
    if (likes !== undefined) updateData.likes = likes;
    
    const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DB 연결 확인
app.get('/api/db-test', async (req, res) => {
    const { data, error } = await supabase.from('posts').select('*').limit(1);
    if (error) {
        return res.status(500).json({ 
            result: '❌ DB 연결 실패', 
            error: error.message 
        });
    }
    res.json({ 
        result: '✅ DB 연결 성공! 🦊', 
        data 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});