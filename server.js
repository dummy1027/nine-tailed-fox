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

// DB 연결 확인
app.get('/api/db-test', async (req, res) => {
    const { data, error } = await supabase.from('items').select('*').limit(1);
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