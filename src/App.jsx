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
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }} className="text-gradient">
          Ranking
        </h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '20px', fontSize: '16px' }}>
          다른 사용자들과 점수를 비교하고 순위를 확인하세요!
        </p>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button style={{
            flex: 1,
            padding: '15px 25px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #004aad 0%, #cb6ce6 100%)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(0, 74, 173, 0.3)'
          }}>
            🎲 무작위 배틀
          </button>
          <button style={{
            flex: 1,
            padding: '15px 25px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #004aad 0%, #cb6ce6 100%)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(0, 74, 173, 0.3)'
          }} onClick={() => navigate('/private-battle')}>
            🔒 비공개 배틀
          </button>
        </div>

        <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px 100px', padding: '16px 20px', backgroundColor: 'var(--theme-bg)', borderBottom: '1px solid var(--theme-border)', fontWeight: '600', fontSize: '14px', color: 'var(--theme-secondary-text)' }}>
            <div>Rank</div>
            <div>User</div>
            <div style={{ textAlign: 'center' }}>Score</div>
            <div style={{ textAlign: 'center' }}>Solved</div>
            <div style={{ textAlign: 'center' }}>Streak</div>
          </div>

          {rankings.length === 0 ? (
            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--theme-secondary-text)', fontSize: '16px' }}>
              아직 해결한 사람들이 없어요 ˃ ˄ ˂
            </div>
          ) : (
            rankings.map((user, index) => (
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
            ))
          )}
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
import { Activity, CheckCircle2, XCircle, Clock, Image, Globe, Monitor } from 'lucide-react';

const statusConfig = {
  online: { color: '#23a559', icon: CheckCircle2, label: 'Operational' },
  offline: { color: '#ed4245', icon: XCircle, label: 'Outage' },
  degraded: { color: '#f0b232', icon: Clock, label: 'Degraded' },
};

const ServerCard = ({ server, formatUptime }) => {
  const config = statusConfig[server.status] || { color: '#23a559', icon: CheckCircle2, label: 'Unknown' };
  const StatusIcon = config.icon;
  const ServerIcon = server.icon || Activity;
  const serverColor = server.color || '#23a559';

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--theme-secondary-text)', marginBottom: '4px' }}>Latency</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: server.latency > 100 ? '#f87171' : '#4ade80' }}>{server.latency}ms</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--theme-secondary-text)', marginBottom: '4px' }}>CPU Load</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: parseFloat(server.cpu) > 2 ? '#f87171' : '#4ade80' }}>{server.cpu}</p>
        </div>
      </div>

      {server.memory && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--theme-secondary-text)' }}>Memory</span>
            <span style={{ fontSize: '12px', color: 'var(--theme-text)' }}>{server.memory.used}MB / {server.memory.total}MB</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--theme-bg)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${server.memory.percent}%`,
              backgroundColor: parseFloat(server.memory.percent) > 80 ? '#f87171' : parseFloat(server.memory.percent) > 60 ? '#f0b232' : '#4ade80',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      <div style={{ fontSize: '11px', color: 'var(--theme-secondary-text)', marginBottom: '16px' }}>
        서버 가동 시간: {formatUptime ? formatUptime(server.uptime) : server.uptime}
      </div>

      <div style={{ height: '100px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={server.history}>
            <defs>
              <linearGradient id={`gradient-${server.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={serverColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={serverColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c1c1e',
                border: '1px solid #3a3a3c',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#8e8e93', marginBottom: '4px' }}
              formatter={(value) => [`${value}ms`, 'Latency']}
              labelFormatter={(label) => `${label} 전`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={serverColor}
              strokeWidth={2}
              fill={`url(#gradient-${server.name})`}
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 5, fill: serverColor, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ServerStatus = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [realtimeHistory, setRealtimeHistory] = useState({
    api: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 30 + Math.random() * 20 })),
    mediaProxy: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 60 + Math.random() * 30 })),
    gateway: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 120 + Math.random() * 80 })),
    webPages: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 8 + Math.random() * 8 }))
  });

  const serverData = {
    api: { name: 'API', status: 'online', latency: 42, cpu: '0.85', memory: { used: 512, total: 8192, percent: '62.5' }, uptime: 86400 },
    mediaProxy: { name: 'Media Proxy', status: 'online', latency: 78, cpu: '0.42', memory: { used: 256, total: 4096, percent: '50' }, uptime: 86400 },
    gateway: { name: 'Gateway', status: 'online', latency: 156, cpu: '0.31', memory: { used: 128, total: 2048, percent: '45' }, uptime: 86400 },
    webPages: { name: 'Server Web Pages', status: 'online', latency: 12, cpu: '0.18', memory: { used: 384, total: 4096, percent: '35' }, uptime: 86400 }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeHistory(prev => {
        const newHistory = {};
        const updateValue = (key, base, variance) => {
          const lastValue = prev[key][prev[key].length - 1].value;
          const change = (Math.random() - 0.5) * variance;
          const newValue = Math.max(base * 0.5, Math.min(base * 1.5, lastValue + change));
          const shifted = prev[key].slice(1);
          shifted.push({ time: '0s', value: Math.round(newValue) });
          for (let i = 0; i < shifted.length; i++) {
            shifted[i].time = `${shifted.length - 1 - i}s`;
          }
          return shifted;
        };
        newHistory.api = updateValue('api', 35, 10);
        newHistory.mediaProxy = updateValue('mediaProxy', 65, 15);
        newHistory.gateway = updateValue('gateway', 130, 40);
        newHistory.webPages = updateValue('webPages', 10, 4);
        return newHistory;
      });
      setLastUpdated(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${mins}분`;
    return `${mins}분`;
  };

  const servers = [
    { ...serverData.api, history: realtimeHistory.api },
    { ...serverData.mediaProxy, history: realtimeHistory.mediaProxy },
    { ...serverData.gateway, history: realtimeHistory.gateway }
  ];

  const webPages = { ...serverData.webPages, history: realtimeHistory.webPages };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--theme-bg)',
      color: 'var(--theme-text)',
      padding: '100px 20px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #004aad 0%, #cb6ce6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Server Status
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--theme-secondary-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              animation: 'pulse 1.5s infinite'
            }} />
            실시간 모니터링
          </div>
        </div>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '40px', fontSize: '16px' }}>
          현재 Paradox 서버가 정상적으로 작동하고 있습니다.
        </p>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
        `}</style>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '24px',
        }}>
          {servers.map((server) => (
            <ServerCard key={server.name} server={server} formatUptime={formatUptime} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '320px' }}>
            <ServerCard server={webPages} formatUptime={formatUptime} />
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

const PrivateBattle = () => {
  const [rooms, setRooms] = useState([]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }} className="text-gradient">
          비공개 배틀
        </h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '30px', fontSize: '16px' }}>
          친구들과 함께 배틀하세요!
        </p>

        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', backgroundColor: 'var(--theme-bg)', borderBottom: '1px solid var(--theme-border)', fontWeight: '600', fontSize: '14px', color: 'var(--theme-secondary-text)' }}>
              참여 가능한 방
            </div>
            {rooms.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--theme-secondary-text)', fontSize: '14px' }}>
                아직 생성된 방이 없어요
              </div>
            ) : (
              rooms.map((room, index) => (
                <div
                  key={room.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: index < rooms.length - 1 ? '1px solid var(--theme-border)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{room.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--theme-secondary-text)' }}>방장: {room.host}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--theme-secondary-text)' }}>{room.players}/2</span>
                    <span style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                      대기중
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '200px' }}>
            <button style={{
              padding: '15px 20px',
              borderRadius: '12px',
              backgroundColor: '#2ecc71',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
            }}>
              ➕ 새로운 방 생성
            </button>
            <button style={{
              padding: '15px 20px',
              borderRadius: '12px',
              backgroundColor: '#f39c12',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(243, 156, 18, 0.3)'
            }}>
              🚪 방 참여하기
            </button>
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/ranking" style={{ color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
            ← 랭킹으로 돌아가기
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
        <Route path="/private-battle" element={<PrivateBattle />} />
        <Route path="/server-status" element={<ServerStatus />} />
        <Route path="/c-preview" element={<CPreview />} />
      </Routes>
    </Router>
  );
}

export default App;