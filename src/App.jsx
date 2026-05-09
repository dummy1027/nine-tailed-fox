import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// --- 1. 메인 페이지 컴포넌트 ---
const Home = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content" style={{textAlign: 'center'}}>
          <h1 className="text-gradient" style={{fontSize: '60px', marginBottom: '10px'}}>Paradox</h1>
          <p style={{fontSize: '18px', color: '#393c41'}}>가장 강력한 언어로 배우는 논리적 사고의 정점</p>
          <div style={{marginTop: '20px', color: '#5c5e62'}}>{message}</div>
        </div>
        <div className="button-group">
          <button className="btn paradox-bg">무료로 시작하기</button>
          <button className="btn btn-secondary">커리큘럼 보기</button>
        </div>
      </section>
      
      {/* 특징 섹션 */}
      <section style={{padding: '100px 40px', backgroundColor: '#ffffff', textAlign: 'center'}}>
        <h2 style={{fontSize: '32px'}}>왜 C언어인가요?</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '50px'}}>
          <div style={{width: '250px'}}>
            <h3 className="text-gradient">Performance</h3>
            <p>하드웨어의 성능을 최대로 끌어내는 로우 레벨 제어</p>
          </div>
          <div style={{width: '250px'}}>
            <h3 className="text-gradient">Fundamentals</h3>
            <p>메모리 구조부터 배우는 탄탄한 프로그래밍 기초</p>
          </div>
        </div>
      </section>

      {/* 커뮤니티 카드 */}
      <section className="community-section">
        <div className="community-card" onClick={() => navigate('/community')}>
          <div className="community-content">
            <span className="tag">Community</span>
            <h2>사람들의 Paradox 프로젝트</h2>
            <p>직접 만든 C언어 프로그램을 공유하고 피드백을 받아보세요.</p>
            <button className="paradox-button">커뮤니티 입장하기</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 2. 커뮤니티 페이지 컴포넌트 ---
const Community = () => {
  return (
    <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1 className="text-gradient">Community</h1>
      <p style={{color: '#8e8e93', marginTop: '20px'}}>준비 중인 커뮤니티 공간입니다. 곧 여러분의 프로젝트를 공유할 수 있어요!</p>
      <Link to="/" style={{display: 'inline-block', marginTop: '40px', color: 'var(--tesla-blue)'}}>
        ← 메인으로 돌아가기
      </Link>
    </div>
  );
};

// --- 3. 문제집 페이지 컴포넌트 ---
const Workbook = () => {
  return (
    <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1 className="text-gradient">Workbook</h1>
      <p style={{color: '#8e8e93', marginTop: '20px'}}>C언어 마스터를 위한 엄선된 문제집입니다. 곧 공개됩니다!</p>
      <Link to="/" style={{display: 'inline-block', marginTop: '40px', color: 'var(--tesla-blue)'}}>
        ← 메인으로 돌아가기
      </Link>
    </div>
  );
};

// --- 4. 전체 앱 설정 ---
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
          <Link to="/" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>C언어 기초</Link>
          <Link to="/community" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>커뮤니티</Link>
          <Link to="/workbook" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>문제집</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/community" element={<Community />} />
        <Route path="/workbook" element={<Workbook />} />
      </Routes>
    </Router>
  );
}

export default App;