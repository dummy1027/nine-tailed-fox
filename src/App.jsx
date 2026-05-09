// ... 상단 import 부분은 그대로 유지 ...

// --- 3. 문제집 페이지 컴포넌트 (새로 추가) ---
const Workbook = () => {
  return (
    <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1 className="text-gradient">Workbook</h1>
      <p style={{color: '#8e8e93', marginTop: '20px'}}>
        C언어 마스터를 위한 엄선된 문제집입니다. 곧 공개됩니다!
      </p>
      <Link to="/" style={{display: 'inline-block', marginTop: '40px', color: 'var(--tesla-blue)'}}>
        ← 메인으로 돌아가기
      </Link>
    </div>
  );
};

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
          {/* 추가된 문제집 메뉴 */}
          <Link to="/workbook" style={{margin: '0 15px', color: 'inherit', textDecoration: 'none'}}>문제집</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/community" element={<Community />} />
        {/* 추가된 문제집 경로 */}
        <Route path="/workbook" element={<Workbook />} />
      </Routes>
    </Router>
  );
}

export default App;