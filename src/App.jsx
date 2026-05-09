import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import CPreview from './CPreview';

// --- 파트 1: 왼쪽 외곽 배치 지뢰찾기 (위치 고정) ---
const Minesweeper = () => {
  return (
    <div className="minesweeper-box" style={{
      position: 'absolute', 
      left: '-380px',      // 중앙 컨테이너 기준 왼쪽으로 멀리 배치
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
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{width: '35px', height: '35px', backgroundColor: '#2c2c2e', borderRadius: '8px'}}></div>
        ))}
      </div>
    </div>
  );
};

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
        
        {/* 지뢰찾기는 왼쪽 빈 공간에 배치 */}
        <Minesweeper />

        {/* 중앙 Paradox 텍스트 영역 */}
        <div className="hero-content" style={{ textAlign: 'center', zIndex: 5 }}>
          <h1 className="text-gradient" style={{fontSize: '80px', marginBottom: '15px', fontWeight: '800'}}>
            Paradox
          </h1>
          <p style={{fontSize: '22px', color: '#393c41', maxWidth: '500px', margin: '0 auto', lineHeight: '1.4'}}>
            가장 강력한 언어로 배우는<br />논리적 사고의 정점
          </p>
          <div style={{marginTop: '25px', color: '#5c5e62'}}>{message}</div>
          <div className="button-group" style={{marginTop: '40px', justifyContent: 'center'}}>
            <button className="btn paradox-bg" style={{padding: '15px 40px', fontSize: '18px'}} onClick={() => navigate('/c-preview')}>C언어 맛보기</button>
          </div>
        </div>
      </section>

      {/* 커뮤니티 카드 섹션 */}
      <section className="community-section" style={{ paddingBottom: '100px' }}>
        <div className="community-card" onClick={() => navigate('/community')} style={{ cursor: 'pointer', margin: '0 auto', maxWidth: '900px' }}>
          <div className="community-content" style={{ padding: '60px', textAlign: 'center' }}>
            <span className="tag" style={{ color: 'var(--tesla-blue)', fontWeight: 'bold' }}>COMMUNITY</span>
            <h2 style={{ fontSize: '36px', marginTop: '10px' }}>사람들의 Paradox 프로젝트</h2>
            <p style={{ color: '#8e8e93', marginTop: '15px', fontSize: '18px' }}>직접 만든 C언어 프로그램을 공유하고 피드백을 받아보세요.</p>
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
    <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1 className="text-gradient" style={{fontSize: '50px'}}>C언어 기초</h1>
      <div style={{maxWidth: '800px', margin: '40px auto', textAlign: 'left', backgroundColor: '#1c1c1e', padding: '40px', borderRadius: '20px', color: 'white'}}>
        <h3>1. Hello, World!</h3>
        <p style={{color: '#8e8e93'}}>모든 프로그래밍의 시작은 출력부터입니다.</p>
        <code style={{display: 'block', backgroundColor: '#000', padding: '20px', borderRadius: '10px', marginTop: '10px', color: '#cb6ce6'}}>
          printf("Hello, Paradox!");
        </code>
      </div>
      <div style={{marginTop: '60px'}}>
        <Link to="/" style={{color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '18px', fontWeight: '500'}}>← 돌아가기</Link>
      </div>
    </div>
  );
};

const Community = () => (
  <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
    <h1 className="text-gradient" style={{fontSize: '50px'}}>Community</h1>
    <p style={{color: '#8e8e93', marginTop: '20px', fontSize: '18px'}}>준비 중인 커뮤니티 공간입니다. 곧 공개됩니다!</p>
    <div style={{marginTop: '60px'}}>
      <Link to="/" style={{color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '18px', fontWeight: '500'}}>← 돌아가기</Link>
    </div>
  </div>
);

const Workbook = () => (
  <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
    <h1 className="text-gradient" style={{fontSize: '50px'}}>Workbook</h1>
    <p style={{color: '#8e8e93', marginTop: '20px', fontSize: '18px'}}>C언어 마스터를 위한 엄선된 문제집입니다.</p>
    <div style={{marginTop: '60px'}}>
      <Link to="/" style={{color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '18px', fontWeight: '500'}}>← 돌아가기</Link>
    </div>
  </div>
);

// --- 파트 4: 앱 설정 ---
function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
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
        <Route path="/c-preview" element={<CPreview />} />
      </Routes>
    </Router>
  );
}

export default App;