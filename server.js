import { useEffect, useState } from 'react'

function App() {
  const [serverMessage, setServerMessage] = useState('서버 연결 중...')

  useEffect(() => {
    // 아까 만든 서버 주소로 요청을 보냅니다
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => {
        setServerMessage(data.result) // "서버가 정상적으로 응답하고 있습니다!" 가 담깁니다
      })
      .catch(err => {
        console.error("에러 발생:", err)
        setServerMessage('서버 연결 실패 ㅠㅠ')
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🦊 구미호 프로젝트</h1>
      <p>서버 응답 결과: <strong>{serverMessage}</strong></p>
    </div>
  )
}

export default App