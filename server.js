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

// --- 인증 API ---

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9_가-힣]{2,20}$/;

// 이메일 없이 가입한 계정용 내부 도메인 (실제 이메일이 아님)
const INTERNAL_EMAIL_DOMAIN = 'noemail.paradox.local';

// 회원가입: username + 비밀번호 (이메일은 선택)
app.post('/api/auth/signup', async (req, res) => {
    const { email: rawEmail, username, password } = req.body || {};
    const email = (rawEmail || '').trim();

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }
    if (email && !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: '올바른 이메일 형식이 아닙니다.' });
    }
    if (!USERNAME_RE.test(username)) {
        return res.status(400).json({ error: '아이디는 2~20자의 한글/영문/숫자/_ 만 사용할 수 있습니다.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' });
    }

    const { data: dupe, error: dupeErr } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', username)
        .maybeSingle();
    if (dupeErr) {
        return res.status(500).json({
            error: 'profiles 테이블을 조회할 수 없습니다. USERS_SETUP.sql 을 Supabase 에서 실행했는지 확인해주세요.',
            detail: dupeErr.message,
        });
    }
    if (dupe) {
        return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });
    }

    // 이메일이 없으면 username 기반 내부 이메일을 생성 (Supabase Auth 요구사항 충족용)
    const authEmail = email || `${username.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;

    const { data, error } = await supabase.auth.admin.createUser({
        email: authEmail,
        password,
        email_confirm: true,
        user_metadata: { username, has_real_email: !!email },
    });
    if (error) {
        const msg = /already registered|already exists/i.test(error.message)
            ? (email ? '이미 가입된 이메일입니다.' : '이미 사용 중인 아이디입니다.')
            : error.message;
        return res.status(400).json({ error: msg });
    }

    const { error: upsertErr } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, username }, { onConflict: 'id' });
    if (upsertErr) {
        // 프로필 저장 실패 시 방금 만든 auth 계정을 롤백
        await supabase.auth.admin.deleteUser(data.user.id);
        return res.status(500).json({
            error: 'profiles 저장에 실패했습니다. USERS_SETUP.sql 을 실행했는지 확인해주세요.',
            detail: upsertErr.message,
        });
    }

    res.json({ user: { id: data.user.id, username, email: email || null } });
});

// username -> email 조회 (username 으로 로그인할 때 사용)
app.post('/api/auth/lookup-email', async (req, res) => {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'username 이 필요합니다.' });

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', username)
        .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!profile) return res.status(404).json({ error: '존재하지 않는 아이디입니다.' });

    const { data, error: userErr } = await supabase.auth.admin.getUserById(profile.id);
    if (userErr || !data?.user) return res.status(500).json({ error: '계정 조회에 실패했습니다.' });

    res.json({ email: data.user.email });
});

// username 중복 확인
app.get('/api/auth/check-username', async (req, res) => {
    const username = String(req.query.username || '').trim();
    if (!USERNAME_RE.test(username)) {
        return res.json({ available: false, reason: 'invalid' });
    }
    const { data } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', username)
        .maybeSingle();
    res.json({ available: !data });
});

app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});