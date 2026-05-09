import React from 'react';
import { Link } from 'react-router-dom';

const CPreview = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#171a20',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>C언어 맛보기</h1>
      <p style={{ color: '#8e8e93', fontSize: '1.2rem', marginBottom: '40px' }}>
        Coming Soon...
      </p>
      <Link to="/" style={{
        padding: '12px 30px',
        background: 'linear-gradient(135deg, #004aad 0%, #cb6ce6 100%)',
        color: 'white',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        뒤로 가기
      </Link>
    </div>
  );
};

export default CPreview;