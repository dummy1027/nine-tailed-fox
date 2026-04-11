import { useEffect, useState } from 'react'

function App() {
  const [serverMessage, setServerMessage] = useState('서버 연결 중...')

  useEffect(() => {
    // 백엔드 서버(5000번)에 데이터를 달라고 요청합니다.
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => {
        setServerMessage(data.result) 
      })
      .catch(err => {
        console.error("에러:", err)
        setServerMessage('서버가 꺼져있나봐요! (5000번 확인)')
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#ff6600' }}>🦊 구미호 프로젝트</h1>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', display: 'inline-block' }}>
        <p>서버에서 온 메시지:</p>
        <h2 style={{ color: '#333' }}>{serverMessage}</h2>
      </div>
    </div>
  )
}

export default App