const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 리액트에서 이 주소로 데이터를 요청할 거예요
app.get('/api/test', (req, res) => {
  res.json({ result: "서버가 정상적으로 응답하고 있습니다!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`백엔드 서버 오픈: http://localhost:${PORT}`);
});
