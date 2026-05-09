import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch('http://localhost:5173/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.result))
      .catch(err => setMessage("서버 연결 필요 🦊"));
  }, []);

  return (
    <div className="container">
      <nav className="nav-bar">
        <div className="logo">NINE-TAILED FOX</div>
        <div className="nav-menu">
          <span style={{margin: '0 15px', fontSize: '14px', fontWeight: '500'}}>C언어 기초</span>
          <span style={{margin: '0 15px', fontSize: '14px', fontWeight: '500'}}>강의실</span>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content" style={{textAlign: 'center'}}>
          {/* 여기에 그라데이션 적용! */}
          <h1 className="text-gradient" style={{fontSize: '60px', marginBottom: '10px'}}>
            Paradox
          </h1>
          <p style={{fontSize: '18px', color: '#393c41', fontWeight: '400'}}>
            가장 강력한 언어로 배우는 논리적 사고의 정점
          </p>
          <div style={{marginTop: '20px', color: '#5c5e62'}}>
             {message}
          </div>
        </div>

        <div className="button-group">
          {/* 버튼에도 그라데이션을 포인트로! */}
          <button className="btn paradox-bg">무료로 시작하기</button>
          <button className="btn btn-secondary">커리큘럼 보기</button>
        </div>
      </section>
      
      {/* 하단 섹션: C언어의 특징 강조 */}
      <section style={{padding: '100px 40px', backgroundColor: '#ffffff', textAlign: 'center'}}>
        <h2 style={{fontSize: '32px', fontWeight: '500'}}>왜 C언어인가요?</h2>
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
    </div>
  );
}

export default App;