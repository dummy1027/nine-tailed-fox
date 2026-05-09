import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// --- 파트 1: 왼쪽 여백에 고정될 지뢰찾기 ---
const Minesweeper = () => {
  return (
    <div className="minesweeper-box" style={{
      position: 'absolute', 
      left: '40px', // 화면 왼쪽 끝에서 적당히 띄움
      top: '50%',
      transform: 'translateY(-50%)',
      width: '280px', 
      height: '340px', 
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
      <div style={{fontSize: '30px', marginBottom: '10px'}}>💣</div>
      <h3 style={{color: 'white', margin: '5px 0', fontSize: '18px'}}>Minesweeper</h3>
      <p style={{fontSize: '11px', marginBottom: '15px'}}>논리력 테스트 존</p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px'}}>
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{width: '30px', height: '30px', backgroundColor: '#2c2c2e', borderRadius: '6px'}}></div>
        ))}
      </div>
    </div>
  );
};

// --- 파트 2: 메인 페이지 (Home) ---
const Home = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ position: 'relative', overflow: 'hidden' }}>
      <section className="hero-section" style={{
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        padding: '100px 0', 
        position: 'relative',
        minHeight: '85vh'
      }}>
        
        {/* 왼쪽의 지뢰찾기 */}
        <Minesweeper />

        {/* 중앙 콘텐츠 (Paradox + C언어 기초 코드 미리보기) */}
        <div className="hero-content" style={{ textAlign: 'center', zIndex: 5 }}>
          <h1 className="text-gradient" style={{fontSize: '80px', marginBottom: '10px', fontWeight: '800'}}>
            Paradox
          </h1>
          <p style={{fontSize: '22px', color: '#393c41', maxWidth: '550px', margin: '0 auto 30px', lineHeight: '1.4'}}>
            가장 강력한 언어로 배우는<br />논리적 사고의 정점
          </p>

          {/* ★ 다시 돌아온 C언어 기초 코드 박스 ★ */}
          <div style={{
            backgroundColor: '#111', 
            padding: '25px', 
            borderRadius: '15px', 
            textAlign: 'left', 
            width: '450px', 
            margin: '0 auto',
            border: '1px solid #222',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{display: 'flex', gap: '6px', marginBottom: '15px'}}>
              <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56'}}></div>
              <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e'}}></div>
              <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f'}}></div>
            </div>
            <code style={{color: '#d1d1d1', fontSize: '14px', lineHeight: '1.6'}}>
              <span style={{color: '#c678dd'}}>#include</span> <span style={{color: '#98c379'}}>&lt;stdio.h&gt;</span><br/><br/>
              <span style={{color: '#61afef'}}>int</span> <span style={{color: '#e5c07b'}}>main</span>() &#123;<br/>
              &nbsp;&nbsp;<span style={{color: '#e06c75'}}>printf</span>(<span style={{color: '#98c379'}}>"Hello, Paradox!"</span>);<br/>
              &nbsp;&nbsp;<span style={{color: '#c678dd'}}>return</span> <span style={{color: '#d19a66'}}>0</span>;<br/>
              &#125;
            </code>
          </div>

          <div style={{marginTop: '30px', color: '#5c5e62'}}>{message}</div>
          <div className="button-group" style={{marginTop: '40px', justifyContent: 'center'}}>
            <button className="btn paradox-bg" style={{padding: '15px 40px', fontSize: '18px'}}>무료로 시작하기</button>
          </div>
        </div>
      </section>

      {/* 커뮤니티 카드 */}
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

// --- 파트 3: 서브 페이지 컴포넌트 ---
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