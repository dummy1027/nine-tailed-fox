import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import CPreview from './CPreview';
import Community from './Community';
import logo from './assets/logo.png';



// --- 파트 2: 메인 페이지 (Home) ---
const Home = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ position: 'relative' }}>
      <section className="hero-section" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '100px 0',
        position: 'relative' // Minesweeper 배치의 기준점
      }}>

        {/* 중앙 Paradox 텍스트 영역 */}
        <div className="hero-content" style={{ textAlign: 'center', zIndex: 5 }}>
          <h1 className="text-gradient" style={{ fontSize: '80px', marginBottom: '15px', fontWeight: '800' }}>
            Paradox
          </h1>
          <p style={{ fontSize: '22px', color: 'var(--theme-secondary-text)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.4' }}>
            가장 강력한 언어로 배우는<br />논리적 사고의 정점
          </p>
          <div style={{ marginTop: '25px', color: 'var(--theme-secondary-text)' }}>{message}</div>
          <div className="button-group" style={{ marginTop: '40px', justifyContent: 'center' }}>
            <button className="btn paradox-bg" style={{ padding: '15px 40px', fontSize: '18px' }} onClick={() => navigate('/c-preview')}>C언어 맛보기</button>
          </div>
        </div>
      </section>

      {/* 커뮤니티 카드 섹션 */}
      <section className="community-section" style={{ paddingBottom: '100px' }}>
        <div className="community-card" onClick={() => navigate('/community')} style={{ cursor: 'pointer', margin: '0 auto', maxWidth: '900px' }}>
          <div className="community-content" style={{ padding: '60px', textAlign: 'center' }}>
            <span className="tag" style={{ color: 'var(--tesla-blue)', fontWeight: 'bold' }}>COMMUNITY</span>
            <h2 style={{ fontSize: '36px', marginTop: '10px', color: 'var(--theme-text)' }}>사람들의 Paradox 프로젝트</h2>
            <p style={{ color: 'var(--theme-secondary-text)', marginTop: '15px', fontSize: '18px' }}>직접 만든 C언어 프로그램을 공유하고 피드백을 받아보세요.</p>
            <button className="paradox-button" style={{ marginTop: '30px' }}>커뮤니티 입장하기</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 파트 3: 서브 페이지들 ---
const Basics = () => {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1 className="text-gradient" style={{ fontSize: '50px' }}>C언어 기초</h1>

      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'left', backgroundColor: 'var(--theme-surface)', padding: '40px', borderRadius: '20px', color: 'var(--theme-text)', border: '1px solid var(--theme-border)' }}>
        <h3>1. Hello, World!</h3>
        <p style={{ color: '#8e8e93' }}>모든 프로그래밍의 시작은 출력부터입니다.</p>
        <code style={{ display: 'block', backgroundColor: '#000', padding: '20px', borderRadius: '10px', marginTop: '10px', color: '#cb6ce6', whiteSpace: 'pre', fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.6' }}>
          {`#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`}
        </code>
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'left', backgroundColor: 'var(--theme-surface)', padding: '40px', borderRadius: '20px', color: 'var(--theme-text)', border: '1px solid var(--theme-border)' }}>
        <h3>2. 변수 (Variable)</h3>
        <p style={{ color: '#8e8e93' }}>변수는 데이터를 저장하는 공간입니다. C언어에서는 다양한 타입의 변수를 사용할 수 있습니다.</p>
        <code style={{ display: 'block', backgroundColor: '#000', padding: '20px', borderRadius: '10px', marginTop: '10px', color: '#cb6ce6', whiteSpace: 'pre', fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.6' }}>
          {`#include <stdio.h>

int main() {
    int age = 20;          // 정수형 변수
    float height = 175.5;  // 실수형 변수
    char grade = 'A';      // 문자형 변수

    printf("나이: %d\\n", age);
    printf("키: %.1f\\n", height);
    printf("학점: %c\\n", grade);
    return 0;
}`}
        </code>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(46, 204, 113, 0.1)', borderRadius: '10px', borderLeft: '4px solid #2ecc71' }}>
          <p style={{ color: '#2ecc71', fontSize: '14px' }}><strong>주요 데이터 타입:</strong></p>
          <ul style={{ color: '#8e8e93', fontSize: '14px', marginTop: '10px', paddingLeft: '20px' }}>
            <li><code style={{ color: '#3498db' }}>int</code> - 정수 (1, 2, 100, -5)</li>
            <li><code style={{ color: '#3498db' }}>float</code> - 실수 (3.14, -0.5)</li>
            <li><code style={{ color: '#3498db' }}>double</code> - 더 정밀한 실수</li>
            <li><code style={{ color: '#3498db' }}>char</code> - 문자 ('A', 'b', '1')</li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'left', backgroundColor: 'var(--theme-surface)', padding: '40px', borderRadius: '20px', color: 'var(--theme-text)', border: '1px solid var(--theme-border)' }}>
        <h3>3. 입력 (scanf)</h3>
        <p style={{ color: '#8e8e93' }}>scanf는 사용자로부터 입력을 받을 때 사용합니다. printf와 유사하지만, 화면에 출력하는 대신 사용자가 입력한 값을 변수에 저장합니다.</p>
        <code style={{ display: 'block', backgroundColor: '#000', padding: '20px', borderRadius: '10px', marginTop: '10px', color: '#cb6ce6', whiteSpace: 'pre', fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.6' }}>
          {`#include <stdio.h>

int main() {
    int age;
    printf("나이를 입력하세요: ");
    scanf("%d", &age);
    printf("당신의 나이는 %d세입니다.\\n", age);
    return 0;
}`}
        </code>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(155, 89, 182, 0.1)', borderRadius: '10px', borderLeft: '4px solid #9b59b6' }}>
          <p style={{ color: '#9b59b6', fontSize: '14px' }}><strong>scanf 서식 문자:</strong></p>
          <ul style={{ color: '#8e8e93', fontSize: '14px', marginTop: '10px', paddingLeft: '20px' }}>
            <li><code style={{ color: '#e74c3c' }}>%d</code> - 정수 입력</li>
            <li><code style={{ color: '#e74c3c' }}>%f</code> - 실수 입력</li>
            <li><code style={{ color: '#e74c3c' }}>%lf</code> - double형 실수 입력</li>
            <li><code style={{ color: '#e74c3c' }}>%c</code> - 문자 입력</li>
            <li><code style={{ color: '#e74c3c' }}>%s</code> - 문자열 입력</li>
          </ul>
        </div>
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: '10px', borderLeft: '4px solid #e74c3c' }}>
          <p style={{ color: '#e74c3c', fontSize: '14px' }}><strong>⚠️ 주의:</strong> scanf에서 변수 앞에 <code>&</code>를 반드시 붙여야 합니다. 이것은 변수의 주소를 참조하는 것입니다.</p>
        </div>
      </div>

      <div style={{ marginTop: '60px' }}>
        <Link to="/" style={{ color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '18px', fontWeight: '500' }}>← 돌아가기</Link>
      </div>
    </div>
  );
};

// Community component removed as it is now imported from ./Community.jsx

const Workbook = () => (
  <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
    <h1 className="text-gradient" style={{ fontSize: '50px' }}>Workbook</h1>
    <p style={{ color: 'var(--theme-secondary-text)', marginTop: '20px', fontSize: '18px' }}>다양한 C언어 예제와 연습문제가 준비되어 있습니다.</p>
    <div style={{ marginTop: '60px' }}>
      <Link to="/" style={{ color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '18px', fontWeight: '500' }}>← 돌아가기</Link>
    </div>
  </div>
);

const Ranking = () => {
  const [rankings, setRankings] = useState([
    { rank: 1, username: 'coder_master', score: 9850, solved: 156, streak: 45 },
    { rank: 2, username: 'algo_king', score: 9720, solved: 148, streak: 38 },
    { rank: 3, username: 'bit_wizard', score: 9580, solved: 142, streak: 52 },
    { rank: 4, username: 'pointer_guru', score: 9340, solved: 135, streak: 29 },
    { rank: 5, username: 'syntax_hunter', score: 9100, solved: 128, streak: 21 },
    { rank: 6, username: 'memory_lover', score: 8950, solved: 121, streak: 33 },
    { rank: 7, username: 'recursive_ninja', score: 8720, solved: 115, streak: 18 },
    { rank: 8, username: 'debug_hero', score: 8590, solved: 108, streak: 25 },
    { rank: 9, username: 'stack_overflow', score: 8340, solved: 102, streak: 15 },
    { rank: 10, username: 'heap_seeker', score: 8100, solved: 95, streak: 12 },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }} className="text-gradient">
          Ranking
        </h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '40px', fontSize: '16px' }}>
          다른 사용자들과 점수를 비교하고 순위를 확인하세요!
        </p>

        <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px 100px', padding: '16px 20px', backgroundColor: 'var(--theme-bg)', borderBottom: '1px solid var(--theme-border)', fontWeight: '600', fontSize: '14px', color: 'var(--theme-secondary-text)' }}>
            <div>Rank</div>
            <div>User</div>
            <div style={{ textAlign: 'center' }}>Score</div>
            <div style={{ textAlign: 'center' }}>Solved</div>
            <div style={{ textAlign: 'center' }}>Streak</div>
          </div>

          {rankings.map((user, index) => (
            <div
              key={user.rank}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 120px 100px',
                padding: '16px 20px',
                borderBottom: index < rankings.length - 1 ? '1px solid var(--theme-border)' : 'none',
                alignItems: 'center',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontWeight: '700' }}>
                {user.rank <= 3 ? (
                  <span style={{ color: user.rank === 1 ? '#ffd700' : user.rank === 2 ? '#c0c0c0' : '#cd7f32' }}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'} {user.rank}
                  </span>
                ) : (
                  <span style={{ color: 'var(--theme-secondary-text)' }}>{user.rank}</span>
                )}
              </div>
              <div style={{ fontWeight: '500' }}>{user.username}</div>
              <div style={{ textAlign: 'center', color: '#cb6ce6', fontWeight: '600' }}>{user.score.toLocaleString()}</div>
              <div style={{ textAlign: 'center', color: 'var(--theme-secondary-text)' }}>{user.solved}</div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                  🔥 {user.streak}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
            ← 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle2, XCircle, Clock, Wifi, Image, Globe, Monitor } from 'lucide-react';

const servers = [
  {
    name: 'API',
    status: 'online',
    uptime: 99.98,
    latency: 42,
    icon: Activity,
    color: '#23a559',
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      value: 35 + Math.random() * 20,
    })),
  },
  {
    name: 'Media Proxy',
    status: 'online',
    uptime: 99.95,
    latency: 78,
    icon: Image,
    color: '#23a559',
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      value: 65 + Math.random() * 30,
    })),
  },
  {
    name: 'Gateway',
    status: 'degraded',
    uptime: 98.72,
    latency: 156,
    icon: Globe,
    color: '#f0b232',
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      value: 120 + Math.random() * 80,
    })),
  },
];

const webPages = {
  name: 'Server Web Pages',
  status: 'online',
  uptime: 99.99,
  latency: 12,
  icon: Monitor,
  color: '#23a559',
  history: Array.from({ length: 20 }, (_, i) => ({
    time: `${i}s`,
    value: 8 + Math.random() * 8,
  })),
};

const statusConfig = {
  online: { color: '#23a559', icon: CheckCircle2, label: 'Operational' },
  offline: { color: '#ed4245', icon: XCircle, label: 'Outage' },
  degraded: { color: '#f0b232', icon: Clock, label: 'Degraded' },
};

const ServerCard = ({ server }) => {
  const config = statusConfig[server.status];
  const StatusIcon = config.icon;
  const ServerIcon = server.icon;

  return (
    <div style={{
      backgroundColor: 'var(--theme-surface)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid var(--theme-border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ServerIcon size={20} color="var(--theme-secondary-text)" />
          <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)' }}>{server.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusIcon size={16} color={config.color} />
          <span style={{ fontSize: '14px', color: config.color, fontWeight: '500' }}>{config.label}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--theme-secondary-text)', marginBottom: '4px' }}>Uptime (30d)</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-text)' }}>{server.uptime}%</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--theme-secondary-text)', marginBottom: '4px' }}>Latency</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-text)' }}>{server.latency}ms</p>
        </div>
      </div>

      <div style={{ height: '120px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={server.history}>
            <defs>
              <linearGradient id={`gradient-${server.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={server.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={server.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--theme-bg)',
                border: '1px solid var(--theme-border)',
                borderRadius: '8px',
                color: 'var(--theme-text)',
              }}
              labelStyle={{ display: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={server.color}
              strokeWidth={2}
              fill={`url(#gradient-${server.name})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ServerStatus = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--theme-bg)',
      color: 'var(--theme-text)',
      padding: '100px 20px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }} className="text-gradient">
          Server Status
        </h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '40px', fontSize: '16px' }}>
          현재 Paradox 서버가 정상적으로 작동하고 있습니다.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '24px',
        }}>
          {servers.map((server) => (
            <ServerCard key={server.name} server={server} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '320px' }}>
            <ServerCard server={webPages} />
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
            ← 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- 파트 4: 앱 설정 ---
function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.result))
      .catch(err => setMessage(""));
  }, []);

  return (
    <Router>
      <nav className="nav-bar">
        <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Paradox Logo" className="logo-img" />
        </Link>
        <div className="nav-menu">
          <Link to="/basics" style={{ margin: '0 15px', color: 'inherit', textDecoration: 'none' }}>C언어 기초</Link>
          <Link to="/community" style={{ margin: '0 15px', color: 'inherit', textDecoration: 'none' }}>커뮤니티</Link>
          <Link to="/workbook" style={{ margin: '0 15px', color: 'inherit', textDecoration: 'none' }}>문제집</Link>
          <Link to="/ranking" style={{ margin: '0 15px', color: 'inherit', textDecoration: 'none' }}>랭킹</Link>
          <Link to="/server-status" style={{ margin: '0 15px', color: 'inherit', textDecoration: 'none' }}>서버 상태</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/basics" element={<Basics />} />
        <Route path="/community" element={<Community />} />
        <Route path="/workbook" element={<Workbook />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/server-status" element={<ServerStatus />} />
        <Route path="/c-preview" element={<CPreview />} />
      </Routes>
    </Router>
  );
}

export default App;