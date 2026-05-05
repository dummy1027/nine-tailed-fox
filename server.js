import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 서버가 잘 사나 있나 확인하는 테스트용 API
app.get('/api/test', (req, res) => {
    res.json({ result: "3전 4기! 드디어 서버 연결에 성공했습니다! 🦊" });
});

app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 활기차게 돌아가고 있습니다!`);
});