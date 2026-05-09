import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// --- 파트 1: 왼쪽 외곽 배치 지뢰찾기 ---
const Minesweeper = () => {
  return (
    <div className="minesweeper-box" style={{
      position: 'absolute', // 절대 위치 설정
      left: '-400px',      // 중앙 컨테이너 기준 왼쪽으로 400px 이동 (화면 밖 배치)
      top: '50px',
      width: '320px', 
      height: '380px', 
      backgroundColor: '#1c1c1e', 
      borderRadius: '25px', 
      border: '1px solid #333',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#8e8e93', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      zIndex: 10
    }}>
      <div style={{fontSize: '40px', marginBottom: '10px'}}>💣</div>
      <h3 style={{color: 'white', margin: '5px 0'}}>Minesweeper</h3>
      <p style={{fontSize: '12px', marginBottom: '20px'}}>논리력 테스트 존</p>
      
      {/* 4x4 그리드 예시 */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{width: '35px', height: '35px', backgroundColor: '#2c2c2e', borderRadius: '8px'}}></div>
        ))}
      </div>
    </div>
  );
};

// --- 1. 메인 페이지 컴포넌트 (레이아웃 대공사) ---
const Home = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* 히어로 섹션: 지뢰찾기를 좌측 끝으로, 텍스트를 중앙/우측으로 */}
      <section className="hero-section" style={{
        display: 'flex', alignItems: 'center', padding: '100px 5%', minHeight: '70vh', position: 'relative'
      }}>
        {/* 좌측: 지뢰찾기 (공간을 넉넉히 차지) */}
        <div className="hero-left" style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
          <Minesweeper />
        </div>

        {/* 우측: 텍스트 및 버튼 (중앙에서 약간 우측 배치) */}
        <div className="hero-right" style={{ flex: '1.5', textAlign: 'left', paddingLeft: '50px' }}>
          <h1 className="text-gradient" style={{fontSize: '80px', marginBottom: '15px', fontWeight: '800'}}>
            Paradox
          </h1>
          <p style={{fontSize: '22px', color: '#393c41', maxWidth: '500px', lineHeight: '1.4'}}>
            가장 강력한 언어로 배우는<br />논리적 사고의 정점
          </p>
          <div style={{marginTop: '25px', color: '#5c5e62', fontSize: '16px'}}>{message}</div>
          
          <div className="button-group" style={{marginTop: '40px', justifyContent: 'flex-start'}}>
            <button className="btn paradox-bg" style={{padding: '15px 40px', fontSize: '18px'}}>무료로 시작하기</button>
          </div>
        </div>
      </section>
      
      {/* 특징 및 커뮤니티 섹션 유지 */}
      <section style={{padding: '100px 40px', backgroundColor: '#ffffff', textAlign: 'center'}}>
        <h2 style={{fontSize: '32px'}}>왜 C언어인가요?</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '50px'}}>
          <div style={{width: '250px'}}><h3 className="text-gradient">Performance</h3><p>최고의 속도와 제어력</p></div>
          <div style={{width: '250px'}}><h3 className="text-gradient">Fundamentals</h3><p>프로그래밍의 뿌리</p></div>
        </div>
      </section>

      <section className="community-section">
        <div className="community-card" onClick={() => navigate('/community')}>
          <div className="community-content">
            <span className="tag">Community</span>
            <h2>사람들의 Paradox 프로젝트</h2>
            <button className="paradox-button">입장하기</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 2. C언어 기초 페이지 (새로 추가) ---
const Basics = () => {
  return (
    <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1 className="text-gradient" style={{fontSize: '50px'}}>C언어 기초</h1>
      <div style={{maxWidth: '800px', margin: '40px auto', textAlign: 'left', backgroundColor: '#1c1c1e', padding: '40px', borderRadius: '20px', color: 'white'}}>
        <h3>1. Hello, World!</h3>
        <p style={{color: '#8e8e93'}}>모든 프로그래밍의 시작은 출력부터입니다.</p>
        <code style={{display: 'block', backgroundColor: '#000', padding: '20px', borderRadius: '10px', marginTop: '10px', color: '#cb6ce6'}}>
          printf("Hello, Paradox!");
        </code>
      </div>
      <Link to="/" style={{color: 'var(--tesla-blue)', textDecoration: 'none'}}>← 돌아가기</Link>
    </div>
  );
};

// --- 나머지 컴포넌트들 ---
const Community = () => (
  <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
    <h1 className="text-gradient">Community</h1>
    <Link to="/">돌아가기</Link>
  </div>
);

const Workbook = () => (
  <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
    <h1 className="text-gradient">Workbook</h1>
    <Link to="/">돌아가기</Link>
  </div>
);

// --- 앱 설정 ---
function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch('http://localhost:5173/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.result))
      .catch(err => setMessage("서버 연결 필요 🦊"));
  }, []);

  return (
    <Router>
      <nav className="nav-bar">
        <Link to="/" className="logo" style={{textDecoration: 'none'}}>NINE-TAILED FOX</Link>
        <div className="nav-menu">
          <Link to="/basics" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>C언어 기초</Link>
          <Link to="/community" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>커뮤니티</Link>
          <Link to="/workbook" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>문제집</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/basics" element={<Basics />} />
        <Route path="/community" element={<Community />} />
        <Route path="/workbook" element={<Workbook />} />
      </Routes>
    </Router>
  );
}

export default App;