import express from 'express';
import cors from 'cors';
import os from 'os';
import 'dotenv/config';
import supabase from './src/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const startTime = Date.now();
let prevCpuUsage = process.cpuUsage();

function getServerStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const uptime = os.uptime();

    const currentCpuUsage = process.cpuUsage(prevCpuUsage);
    prevCpuUsage = process.cpuUsage();
    const cpuPercent = (currentCpuUsage.user + currentCpuUsage.system) / 1000000 / os.cpus().length;

    return {
        api: {
            name: 'API',
            status: 'online',
            latency: Math.floor(Math.random() * 20) + 30,
            cpu: cpuPercent.toFixed(2),
            memory: {
                used: Math.floor(usedMem / 1024 / 1024),
                total: Math.floor(totalMem / 1024 / 1024),
                percent: ((usedMem / totalMem) * 100).toFixed(1)
            },
            uptime: uptime,
            history: []
        },
        mediaProxy: {
            name: 'Media Proxy',
            status: 'online',
            latency: Math.floor(Math.random() * 30) + 60,
            cpu: (cpuPercent * 0.8).toFixed(2),
            memory: {
                used: Math.floor(Math.random() * 200) + 300,
                total: 512,
                percent: ((Math.random() * 20) + 60).toFixed(1)
            },
            uptime: uptime,
            history: []
        },
        gateway: {
            name: 'Gateway',
            status: Math.random() > 0.1 ? 'online' : 'degraded',
            latency: Math.floor(Math.random() * 100) + 120,
            cpu: (cpuPercent * 1.2).toFixed(2),
            memory: {
                used: Math.floor(Math.random() * 100) + 50,
                total: 256,
                percent: ((Math.random() * 40) + 20).toFixed(1)
            },
            uptime: uptime,
            history: []
        },
        webPages: {
            name: 'Server Web Pages',
            status: 'online',
            latency: Math.floor(Math.random() * 10) + 8,
            cpu: (cpuPercent * 0.5).toFixed(2),
            memory: {
                used: Math.floor(Math.random() * 150) + 100,
                total: 512,
                percent: ((Math.random() * 30) + 30).toFixed(1)
            },
            uptime: uptime,
            history: []
        }
    };
}

let serverStats = getServerStats();
let historyLength = 20;

for (let i = 0; i < historyLength; i++) {
    serverStats.api.history.push({ time: `${i}s`, value: Math.floor(Math.random() * 20) + 30 });
    serverStats.mediaProxy.history.push({ time: `${i}s`, value: Math.floor(Math.random() * 30) + 60 });
    serverStats.gateway.history.push({ time: `${i}s`, value: Math.floor(Math.random() * 100) + 120 });
    serverStats.webPages.history.push({ time: `${i}s`, value: Math.floor(Math.random() * 10) + 8 });
}

app.get('/api/test', (req, res) => {
    res.json({ result: '🦊 서버가 살아있습니다!' });
});

app.get('/api/server-stats', (req, res) => {
    const currentStats = getServerStats();

    const updateHistory = (oldHistory, newValue, maxLength = 20) => {
        const newHistory = [...oldHistory.slice(1), { time: '0s', value: newValue }];
        for (let i = 0; i < newHistory.length; i++) {
            newHistory[i].time = `${maxLength - 1 - i}s`;
        }
        return newHistory;
    };

    serverStats = {
        api: {
            ...currentStats.api,
            history: updateHistory(serverStats.api.history, currentStats.api.latency)
        },
        mediaProxy: {
            ...currentStats.mediaProxy,
            history: updateHistory(serverStats.mediaProxy.history, currentStats.mediaProxy.latency)
        },
        gateway: {
            ...currentStats.gateway,
            history: updateHistory(serverStats.gateway.history, currentStats.gateway.latency)
        },
        webPages: {
            ...currentStats.webPages,
            history: updateHistory(serverStats.webPages.history, currentStats.webPages.latency)
        }
    };

    res.json(serverStats);
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

// --- 댓글 API ---

// 특정 게시글의 댓글 조회
app.get('/api/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('id', { ascending: true });
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 댓글 작성
app.post('/api/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { content, author, parent_id } = req.body;
    
    if (!content || !author) {
        return res.status(400).json({ error: '내용과 작성자를 입력해주세요.' });
    }

    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, content, author, parent_id }])
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});