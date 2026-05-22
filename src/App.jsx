import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Settings, Activity, CheckCircle2, XCircle, Clock, Image, Globe, Monitor } from 'lucide-react';
import './App.css';
import CPreview from './CPreview';
import Community from './Community';
import Profile from './Profile';
import ProfileSettings from './ProfileSettings';
import BattleArena from './BattleArena';
import logo from './assets/logo.png';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import AuthModal from './AuthModal';

function App() {
  return (
    <AuthProvider>
      {/* 이전에 작성하셨던 Router, Routes, Navbar 등의 레이아웃 코드 */}
      <div className="app-container">
        <img src={logo} alt="Logo" />
        {/* 예시 구조 */}
        <Routes>
          <Route path="/battle" element={<BattleArena />} />
          {/* 다른 라우트들... */}
        </Routes>
      </div>
    </AuthProvider>
  );
}
function NavAuthArea({ onOpen }) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  if (user) {
    const name = profile?.username || user.email?.split('@')[0] || '사용자';
    return (
      <div className="auth-buttons">
        <button className="profile-btn" onClick={() => navigate('/profile')} title="프로필">
          <User size={18} />
          <span>{name}</span>
        </button>
        <button className="settings-btn" onClick={() => navigate('/settings')} title="설정">
          <Settings size={18} />
        </button>
        <button className="login-btn" onClick={logout}>로그아웃</button>
      </div>
    );
  }
  return (
    <div className="auth-buttons">
      <button className="login-btn" onClick={() => onOpen('login')}>로그인</button>
      <button className="signup-btn" onClick={() => onOpen('signup')}>회원가입</button>
    </div>
  );
}



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

      {/* 통합 카드 섹션: 테마 대응 버전 */}
<section className="main-grid-section">
  <div className="main-card-grid">
    
    {/* 1. 커뮤니티 */}
    <div className="community-card small" onClick={() => navigate('/community')}>
      <div className="community-content">
        <span className="tag accent-purple">COMMUNITY</span>
        <h2>사람들의 Paradox 프로젝트</h2>
        <p>직접 만든 C언어 프로그램을 공유하고 피드백을 받아보세요.</p>
      </div>
    </div>

    {/* 2. 문제집 */}
    <div className="community-card small" onClick={() => navigate('/workbook')}>
      <div className="community-content">
        <span className="tag accent-purple">WORKBOOK</span>
        <h2>C언어 문제집</h2>
        <p>문제를 풀면서 C언어 실력을 향상시키세요.</p>
      </div>
    </div>

    {/* 3. 서버 상태 */}
    <div className="community-card small" onClick={() => navigate('/server-status')}>
      <div className="community-content">
        <span className="tag accent-blue">SERVER STATUS</span>
        <h2>Paradox 서버 상태</h2>
        <p>서버의 운영 상태와 성능을 실시간으로 확인하세요.</p>
      </div>
    </div>

    {/* 4. 랭킹 */}
    <div className="community-card small" onClick={() => navigate('/ranking')}>
      <div className="community-content">
        <span className="tag accent-purple">RANKING</span>
        <h2>실시간 랭킹 확인</h2>
        <p>친구들과 점수를 비교하고 성취감을 느껴보세요.</p>
      </div>
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

// CodeUp.kr 기초 100제 기반 문제집
import { problems } from './problems';
import { levelColors, levelLabels } from './constants';

const KEYWORDS = [
  'printf', 'scanf', 'include', 'stdio.h', 'stdlib.h', 'string.h', 'math.h',
  'int', 'main', 'return', 'void', 'if', 'else', 'while', 'for', 'char',
  'float', 'double', 'switch', 'case', 'break', 'continue', 'struct', 'typedef',
  '#include', '#define'
];

const FUNCTION_KEYWORDS = ['printf', 'scanf', 'main', 'if', 'while', 'for', 'switch', 'sizeof'];

const C_TEMPLATE = "#include <stdio.h>\n\nint main() {\n\t\n\treturn 0;\n}";

const Workbook = () => {
  const { user, profile } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('output');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [testInput, setTestInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestIndex, setSuggestIndex] = useState(0);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestPos, setSuggestPos] = useState({ top: 0, left: 0 });
  const [activeLine, setActiveLine] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState(() => {
    const saved = localStorage.getItem('paradox_solved');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (profile && Array.isArray(profile.solved_problems)) {
      const saved = localStorage.getItem('paradox_solved');
      const localSolved = saved ? JSON.parse(saved) : [];
      
      const mergedSolved = Array.from(new Set([...localSolved, ...profile.solved_problems]));
      
      if (mergedSolved.length !== localSolved.length) {
        setSolvedProblems(mergedSolved);
        localStorage.setItem('paradox_solved', JSON.stringify(mergedSolved));
      }
    }
  }, [profile]);

  const textareaRef = useRef(null);
  const mirrorRef = useRef(null);
  const preRef = useRef(null);

  const currentProblems = problems[selectedLevel];

  const updateSuggestPos = (textBeforeCursor) => {
    if (!mirrorRef.current || !textareaRef.current) return;

    const mirror = mirrorRef.current;
    mirror.textContent = textBeforeCursor;
    const span = document.createElement('span');
    span.textContent = '|';
    mirror.appendChild(span);

    const { offsetTop, offsetLeft } = span;
    setSuggestPos({
      top: offsetTop + 25,
      left: offsetLeft
    });
  };

  const handleSelectSuggestion = (suggestion) => {
    const start = textareaRef.current.selectionStart;
    const value = userCode;

    const lastWordMatch = value.substring(0, start).match(/[\w#.]+$/);
    if (!lastWordMatch) return;

    const wordStart = start - lastWordMatch[0].length;

    let insertValue = suggestion;
    let cursorShift = suggestion.length;

    if (FUNCTION_KEYWORDS.includes(suggestion)) {
      insertValue += '()';
      cursorShift += 1;
    }

    const newCode = value.substring(0, wordStart) + insertValue + value.substring(start);

    setUserCode(newCode);
    setShowSuggest(false);

    setTimeout(() => {
      textareaRef.current.focus();
      const newPos = wordStart + cursorShift;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (showSuggest) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestIndex(prev => (prev + 1) % suggestions.length);
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelectSuggestion(suggestions[suggestIndex]);
        return;
      } else if (e.key === 'Escape') {
        setShowSuggest(false);
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      const newCode = value.substring(0, start) + '\t' + value.substring(end);
      setUserCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineUntilCursor = value.substring(lineStart, start);
      const indentationMatch = lineUntilCursor.match(/^\s*/);
      const currentIndentation = indentationMatch ? indentationMatch[0] : '';

      let newText = '\n' + currentIndentation;
      let cursorOffset = 1 + currentIndentation.length;

      if (value[start - 1] === '{' && value[start] === '}') {
        newText = '\n' + currentIndentation + '\t\n' + currentIndentation;
        cursorOffset = 1 + currentIndentation.length + 1;
      } else if (lineUntilCursor.trim().endsWith('{')) {
        newText += '\t';
        cursorOffset += 1;
      }

      const newCode = value.substring(0, start) + newText + value.substring(end);
      setUserCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + cursorOffset;
        }
      }, 0);
    } else if (e.key === '}') {
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLineBeforeCursor = value.substring(currentLineStart, start);

      if (/^\s*$/.test(currentLineBeforeCursor)) {
        e.preventDefault();
        let balance = 1;
        let matchIndex = -1;
        for (let i = start - 1; i >= 0; i--) {
          if (value[i] === '}') balance++;
          else if (value[i] === '{') balance--;
          if (balance === 0) { matchIndex = i; break; }
        }

        let targetIndent = '';
        if (matchIndex !== -1) {
          const matchLineStart = value.lastIndexOf('\n', matchIndex - 1) + 1;
          const matchLine = value.substring(matchLineStart, matchIndex);
          const match = matchLine.match(/^\s*/);
          targetIndent = match ? match[0] : '';
        } else {
          targetIndent = currentLineBeforeCursor.replace(/\t$/, '').replace(/    $/, '');
        }

        const newCode = value.substring(0, currentLineStart) + targetIndent + '}' + value.substring(end);
        setUserCode(newCode);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = currentLineStart + targetIndent.length + 1;
          }
        }, 0);
      }
    } else if (['{', '(', '[', '"', "'"].includes(e.key)) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const pairs = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
      const char = e.key;
      const pair = pairs[char];
      const newCode = value.substring(0, start) + char + pair + value.substring(end);
      setUserCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
        }
      }, 0);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const updateActiveLine = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selectionStart = textareaRef.current.selectionStart;
    const lineIndex = text.substring(0, selectionStart).split('\n').length - 1;
    setActiveLine(lineIndex);
  };

  const highlightCode = (code) => {
    const tokens = [];
    const regex = /(\/\*[\s\S]*?\*\/|\/\/.*|#\w+|"[^"]*"|\b(int|char|float|double|void|if|else|for|while|return|include|define|stdio|stdlib|string|main)\b|\b\d+\b|[{}();])/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', value: code.substring(lastIndex, match.index) });
      }
      const value = match[0];
      if (value.startsWith('//') || value.startsWith('/*')) tokens.push({ type: 'comment', value });
      else if (value.startsWith('#')) tokens.push({ type: 'preprocessor', value });
      else if (value.startsWith('"')) tokens.push({ type: 'string', value });
      else if (['int', 'char', 'float', 'double', 'void', 'if', 'else', 'for', 'while', 'return'].includes(value)) tokens.push({ type: 'keyword', value });
      else if (['include', 'define', 'stdio', 'stdlib', 'string', 'main'].includes(value)) tokens.push({ type: 'function', value });
      else if (/\d+/.test(value)) tokens.push({ type: 'number', value });
      else if (['{', '}', '(', ')', ';', ','].includes(value)) tokens.push({ type: 'punctuation', value });
      else tokens.push({ type: 'text', value });
      lastIndex = match.index + value.length;
    }
    if (lastIndex < code.length) tokens.push({ type: 'text', value: code.substring(lastIndex) });
    return tokens;
  };

  const renderHighlightedCode = (code) => {
    const tokens = highlightCode(code);
    return tokens.map((token, i) => {
      let color = '#cb6ce6';
      if (token.type === 'comment') color = '#6b7280';
      else if (token.type === 'preprocessor') color = '#60a5fa';
      else if (token.type === 'string') color = '#4ade80';
      else if (token.type === 'keyword') color = '#f472b6';
      else if (token.type === 'function') color = '#fbbf24';
      else if (token.type === 'number') color = '#fb923c';
      else if (token.type === 'punctuation') color = '#94a3b8';
      return <span key={i} style={{ color, fontWeight: 'normal' }}>{token.value}</span>;
    });
  };

  const validateCSyntax = (code) => {
    const errors = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;
      
      if (line === '') continue;
      if (line.startsWith('//') || line.startsWith('/*')) continue;
      if (line.startsWith('#include') || line.startsWith('#define')) continue;
      if (line.endsWith('{') || line.endsWith('}')) continue;
      if (line.endsWith(';')) continue;
      if (line.startsWith('if') || line.startsWith('for') || line.startsWith('while') || line.startsWith('else')) continue;
      if (line.startsWith('return') || line.startsWith('break') || line.startsWith('continue')) continue;
      
      if (/^\w+/.test(line) && !line.endsWith(';') && !line.endsWith('{')) {
        errors.push({ line: lineNum, code: 'E2001', message: `세미콜론이 없습니다. (${lineNum}번째 줄)` });
      }
    }
    
    return errors;
  };

  const getSimulatedOutput = (code, input) => {
    const syntaxErrors = validateCSyntax(code);
    if (syntaxErrors.length > 0) {
      return { error: syntaxErrors[0] };
    }

    const printfMatches = code.match(/printf\s*\(\s*"((?:[^"\\]|\\.)*)"(?:,\s*[^)]+)?\s*\)/g);
    if (!printfMatches) return "";

    let finalOutput = "";
    const inputParts = input ? input.trim().split(/\s+/) : [];
    
    const scanfMatch = code.match(/scanf\s*\(\s*"[^"]*"\s*,\s*([^)]+)\s*\)/);
    const varOrder = scanfMatch ? scanfMatch[1].split(',').map(v => v.trim().replace(/&/g, '')) : [];
    
    const printfArgsMatch = code.match(/printf\s*\(\s*"[^"]*"\s*,\s*([^)]+)\s*\)/);
    const printfArgNames = printfArgsMatch ? printfArgsMatch[1].split(',').map(v => v.trim()) : [];
    
    const varMap = {};
    varOrder.forEach((name, idx) => {
      varMap[name] = inputParts[idx] || '';
    });

    printfMatches.forEach(m => {
      const match = m.match(/printf\s*\(\s*"((?:[^"\\]|\\.)*)"/);
      if (match) {
        let text = match[1];
        let argIdx = 0;
        text = text.replace(/%d|%s|%f|%lf|%c/g, (matchStr) => {
          const argName = printfArgNames[argIdx++];
          if (argName && varMap[argName] !== undefined) {
            return varMap[argName];
          }
          return inputParts[argIdx - 1] || "";
        });
        text = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        finalOutput += text;
      }
    });
    return finalOutput;
  };

  const handleRun = () => {
    if (!userCode.trim()) return;
    setResultType('run');

    const finalInput = testInput || selectedProblem.input || "";
    const result = getSimulatedOutput(userCode, finalInput);
    
    if (result && result.error) {
      setOutput(`[${result.error.code}] ${result.error.message}`);
      setIsCorrect(false);
    } else if (result || userCode.includes('printf')) {
      setOutput(result);
      setIsCorrect(null);
    } else {
      setOutput('[E1002] 출력 오류: printf 문을 찾을 수 없거나 출력할 내용이 없습니다.');
      setIsCorrect(false);
    }
  };

  const handleCheck = () => {
    if (!userCode.trim()) return;
    setResultType('check');

    const result = getSimulatedOutput(userCode, selectedProblem.input);
    
    if (result && result.error) {
      setOutput(`[${result.error.code}] ${result.error.message}`);
      setIsCorrect(false);
      return;
    }

    const simulatedOutput = result;
    const expectedOutput = selectedProblem.output.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

    const isMatched = simulatedOutput.trim() === expectedOutput.trim();

    setIsCorrect(isMatched);
    setOutput('');

    if (isMatched && !solvedProblems.includes(selectedProblem.id)) {
      const newSolved = [...solvedProblems, selectedProblem.id];
      setSolvedProblems(newSolved);
      localStorage.setItem('paradox_solved', JSON.stringify(newSolved));

      if (user) {
        supabase
          .from('profiles')
          .update({ solved_problems: newSolved })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) console.error('Error syncing solved problems to DB:', error);
          });
      }
    }
  };

  const handleReset = () => {
    setUserCode(C_TEMPLATE);
    setOutput('');
    setIsCorrect(null);
    setResultType(null);
  };

  const openProblem = (problem) => {
    setSelectedProblem(problem);
    setUserCode(C_TEMPLATE); // 기본 템플릿 제공
    setTestInput("");
    setOutput('');
    setIsCorrect(null);
    setResultType(null);
    setShowCode(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }} className="text-gradient">문제집</h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '40px', fontSize: '16px' }}>단계별로 C언어를 학습해보세요!</p>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          {Object.keys(problems).map(level => (
            <button
              key={level}
              onClick={() => { setSelectedLevel(level); setSelectedProblem(null); }}
              style={{
                padding: '12px 30px',
                borderRadius: '10px',
                backgroundColor: selectedLevel === level ? levelColors[level] : 'var(--theme-surface)',
                color: selectedLevel === level ? 'white' : 'var(--theme-text)',
                border: '2px solid ' + (selectedLevel === level ? levelColors[level] : 'var(--theme-border)'),
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
            >
              {levelLabels[level]}
            </button>
          ))}
        </div>

        {!selectedProblem ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {currentProblems.map((problem, index) => (
              <div
                key={problem.id}
                onClick={() => openProblem(problem)}
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '1px solid var(--theme-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = levelColors[selectedLevel]; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--theme-border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{
                    backgroundColor: levelColors[selectedLevel],
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {levelLabels[selectedLevel]}
                  </span>
                  <span style={{ color: 'var(--theme-secondary-text)', fontSize: '14px' }}>문제 {index + 1}</span>
                  {solvedProblems.includes(problem.id) && (
                    <span style={{
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: 'var(--theme-text)' }}>{problem.title}</h3>
                <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px', lineHeight: '1.5' }}>{problem.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <button
              onClick={() => { setSelectedProblem(null); setShowCode(false); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--theme-secondary-text)',
                cursor: 'pointer',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '16px'
              }}
            >
              ← 문제 목록으로
            </button>

            <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '20px', padding: '40px', border: '1px solid var(--theme-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <span style={{
                  backgroundColor: levelColors[selectedLevel],
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  {levelLabels[selectedLevel]}
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{selectedProblem.title}</h2>
                {solvedProblems.includes(selectedProblem.id) && (
                  <span style={{
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ solved
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--theme-secondary-text)', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
                {selectedProblem.description}
              </p>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--theme-bg)', borderRadius: '12px', border: '1px solid var(--theme-border)', textAlign: 'left' }}>
                  <h4 style={{ color: '#2ecc71', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>📥 입력 예시</h4>
                  <code style={{ color: 'var(--theme-text)', whiteSpace: 'pre-wrap', fontFamily: 'Consolas, Monaco, monospace', fontSize: '14px', textAlign: 'left' }}>
                    {selectedProblem.input || '(없음)'}
                  </code>
                </div>
                <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--theme-bg)', borderRadius: '12px', border: '1px solid var(--theme-border)', textAlign: 'left' }}>
                  <h4 style={{ color: '#e74c3c', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>📤 출력 예시</h4>
                  <code style={{ color: 'var(--theme-text)', whiteSpace: 'pre-wrap', fontFamily: 'Consolas, Monaco, monospace', fontSize: '14px', textAlign: 'left' }}>
                    {selectedProblem.output}
                  </code>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>코드 작성</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setShowCode(!showCode)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--theme-bg)',
                        border: '1px solid var(--theme-border)',
                        color: 'var(--theme-text)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {showCode ? '답안 숨기기' : '답안 보기'}
                    </button>
                    <button
                      onClick={handleReset}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--theme-bg)',
                        border: '1px solid var(--theme-border)',
                        color: 'var(--theme-secondary-text)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      초기화
                    </button>
                  </div>
                </div>

                {showCode ? (
                  <code style={{
                    display: 'block',
                    backgroundColor: '#000',
                    padding: '20px',
                    borderRadius: '12px',
                    color: '#cb6ce6',
                    whiteSpace: 'pre',
                    fontFamily: 'Consolas, Monaco, monospace',
                    lineHeight: '1.6',
                    fontSize: '14px',
                    overflowX: 'auto',
                    textAlign: 'left'
                  }}>
                    {selectedProblem.answer}
                  </code>
                ) : (
                  <div style={{ 
                    position: 'relative', 
                    backgroundColor: '#000', 
                    borderRadius: '12px', 
                    height: '350px', 
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    {/* Line Numbers Gutter */}
                    <div style={{
                      width: '45px',
                      backgroundColor: '#0d0d0e',
                      color: '#4b4b4d',
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      padding: '20px 0',
                      textAlign: 'center',
                      userSelect: 'none',
                      borderRight: '1px solid #1c1c1e',
                      zIndex: 3,
                      overflow: 'hidden'
                    }}>
                      {userCode.split('\n').map((_, i) => (
                        <div key={i} style={{ color: i === activeLine ? '#cb6ce6' : '#4b4b4d' }}>{i + 1}</div>
                      ))}
                    </div>

                    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                      {/* Active Line Highlight */}
                      <div style={{
                        position: 'absolute',
                        top: activeLine * (14 * 1.6) + 20, // (fontSize * lineHeight) + padding
                        left: 0,
                        width: '100%',
                        height: 14 * 1.6,
                        backgroundColor: 'rgba(203, 110, 230, 0.05)',
                        borderLeft: '2px solid #cb6ce6',
                        pointerEvents: 'none',
                        zIndex: 1
                      }} />

                      {/* Mirror Div for position calculation */}
                      <div
                        ref={mirrorRef}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          padding: '20px',
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          visibility: 'hidden',
                          width: '100%',
                          zIndex: -1,
                          pointerEvents: 'none',
                          textAlign: 'left',
                          letterSpacing: 'normal',
                          tabSize: 4,
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      />

                      {/* Auto-complete Suggestions */}
                      {showSuggest && (
                        <div
                          style={{
                            position: 'absolute',
                            top: suggestPos.top,
                            left: suggestPos.left,
                            backgroundColor: '#1c1c1e',
                            border: '1px solid #3a3a3c',
                            borderRadius: '8px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            zIndex: 10,
                            minWidth: '150px',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}
                        >
                          {suggestions.map((s, i) => (
                            <div
                              key={i}
                              onMouseEnter={() => setSuggestIndex(i)}
                              onClick={() => handleSelectSuggestion(s)}
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: i === suggestIndex ? 'rgba(203, 110, 230, 0.2)' : 'transparent',
                                color: i === suggestIndex ? '#cb6ce6' : '#fff',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <span>{s}</span>
                              <span style={{ fontSize: '10px', color: '#5c5e62', marginLeft: '10px' }}>Keyword</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <pre
                        ref={preRef}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          margin: 0,
                          padding: '20px',
                          color: '#cb6ce6',
                          backgroundColor: 'transparent',
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          overflow: 'auto',
                          pointerEvents: 'none',
                          textAlign: 'left',
                          zIndex: 2,
                          letterSpacing: 'normal',
                          tabSize: 4,
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      >
                        {renderHighlightedCode(userCode)}
                      </pre>
                      <textarea
                        ref={textareaRef}
                        value={userCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUserCode(val);
                          const start = e.target.selectionStart;
                          const lastWordMatch = val.substring(0, start).match(/[\w#.]+$/);

                          if (lastWordMatch) {
                            const lastWord = lastWordMatch[0];
                            const filtered = KEYWORDS.filter(k => k.startsWith(lastWord) && k !== lastWord);
                            if (filtered.length > 0) {
                              setSuggestions(filtered);
                              setSuggestIndex(0);
                              setShowSuggest(true);
                              updateSuggestPos(val.substring(0, start));
                            } else {
                              setShowSuggest(false);
                            }
                          } else {
                            setShowSuggest(false);
                          }
                          updateActiveLine();
                        }}
                        onKeyDown={(e) => {
                          handleKeyDown(e);
                          setTimeout(updateActiveLine, 0);
                        }}
                        onClick={updateActiveLine}
                        onKeyUp={updateActiveLine}
                        onScroll={handleScroll}
                        spellCheck={false}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          margin: 0,
                          padding: '20px',
                          backgroundColor: 'transparent',
                          color: 'transparent',
                          caretColor: 'white',
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          border: 'none',
                          outline: 'none',
                          resize: 'none',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          textAlign: 'left',
                          zIndex: 4,
                          letterSpacing: 'normal',
                          tabSize: 4,
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center' }}>
                  <button
                    onClick={handleRun}
                    style={{
                      padding: '10px 25px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #004aad 0%, #005cbf 100%)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ▶ 실행
                  </button>
                  <input 
                    type="text" 
                    placeholder="실행 시 입력값 (선택)"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--theme-bg)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                      fontSize: '14px',
                      flex: 1
                    }}
                  />
                  <button
                    onClick={handleCheck}
                    style={{
                      padding: '10px 25px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #cb6ce6 0%, #9b4dca 100%)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ 확인
                  </button>
                </div>

                {resultType === 'run' && output && (
                  <div style={{ backgroundColor: 'var(--theme-bg)', borderRadius: '10px', padding: '15px', marginTop: '15px', border: '1px solid var(--theme-border)' }}>
                    <p style={{ color: '#8e8e93', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>출력 결과</p>
                    <pre style={{ color: output.startsWith('[E') ? '#f87171' : '#4ade80', fontFamily: 'Consolas, Monaco, monospace', fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
                  </div>
                )}

                {resultType === 'check' && isCorrect !== null && (
                  <div style={{ backgroundColor: isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', borderRadius: '10px', padding: '15px', marginTop: '15px', border: '1px solid ' + (isCorrect ? '#2ecc71' : '#e74c3c') }}>
                    <p style={{ color: isCorrect ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                      {isCorrect ? '🎉 정답!' : '❌ 오답'}
                    </p>
                  </div>
                )}
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '12px',
                borderLeft: '4px solid #3498db',
                textAlign: 'left'
              }}>
                <h4 style={{ color: '#3498db', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>💡 힌트</h4>
                <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px', lineHeight: '1.5' }}>{selectedProblem.hint}</p>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--tesla-blue)', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>← 돌아가기</Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ⭕ App.jsx의 const Ranking 시작부터 끝나는 구역까지만 찾아서 덮어쓰기 하세요!
const Ranking = () => {
  // 자바스크립트 순서 에러(TDZ) 방지를 위해 내부 최상단에 상수 고정
  const RANK_ORDER = ['beginner', 'veteran', 'expert', 'master', 'grandmaster'];
  const RANK_COLORS = {
    beginner: '#95a5a6',
    veteran: '#3498db',
    expert: '#9b59b6',
    master: '#f39c12',
    grandmaster: '#e74c3c'
  };

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rankings, setRankings] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(false);

  const getRank = (score) => {
    if (score < 100) return 'beginner';
    if (score < 300) return 'veteran';
    if (score < 600) return 'expert';
    if (score < 1000) return 'master';
    return 'grandmaster';
  };

  const fetchRankingData = async (searchWord = '') => {
    setLoading(true);
    try {
      const orderField = sortBy === 'rating' ? 'rating' : 'score';
      let query = supabase
        .from('profiles')
        .select('username, score, solved_problems, rating, streak')
        .order(orderField, { ascending: false });

      if (searchWord.trim() !== '') {
        query = query.ilike('username', `%${searchWord}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const calculatedRank = data.map((user, index) => ({
        rank: index + 1,
        rankTitle: getRank(user.score || 0),
        ...user
      }));

      setRankings(calculatedRank);
    } catch (error) {
      console.error('Ranking data load failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData(searchQuery);
  }, [searchQuery, sortBy]);

  const getTierColor = (title) => {
    const key = title ? title.toLowerCase() : 'beginner';
    return RANK_COLORS[key] || '#95a5a6';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }} className="text-gradient">
          Ranking
        </h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '20px', fontSize: '16px' }}>
          다른 사용자들과 점수를 비교하고 순위를 확인하세요!
        </p>

        {/* 티어 안내 바 */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '30px', padding: '14px 20px',
          backgroundColor: 'var(--theme-surface)', borderRadius: '12px', border: '1px solid var(--theme-border)',
          justifyContent: 'center', flexWrap: 'wrap'
        }}>
          {RANK_ORDER.map((rank) => (
            <div key={rank} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
              backgroundColor: `${RANK_COLORS[rank]}15`, borderRadius: '8px', border: `1px solid ${RANK_COLORS[rank]}40`
            }}>
              <span style={{
                padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                backgroundColor: RANK_COLORS[rank], color: 'white', textTransform: 'uppercase'
              }}>
                {rank}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--theme-secondary-text)' }}>
                {rank === 'beginner' ? '0' : rank === 'veteran' ? '100' : rank === 'expert' ? '300' : rank === 'master' ? '600' : '1000'}+
              </span>
            </div>
          ))}
        </div>

        {/* 🎯 ① 사용자 검색창 [위]에 매치 버튼 배치 + ② 같은 색상 그라데이션 + ③ 정확히 절반 반반 길이 분할 */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          {/* 랜덤 매치 버튼 (꽉 찬 시그니처 그라데이션) */}
          <button 
            className="btn paradox-bg" 
            style={{ 
              flex: 1, // 50%의 공간을 정확히 차지
              padding: '16px 0', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              borderRadius: '12px',
              border: 'none',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }} 
            onClick={() => navigate('/battle-arena')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ⚔️ 랜덤 매치
          </button>
          
          {/* 비공개 매치 버튼 (랜덤 매치와 완전히 100% 동일한 꽉 찬 시그니처 그라데이션) */}
          <button 
            className="btn paradox-bg" 
            style={{ 
              flex: 1, // 50%의 공간을 정확히 차지
              padding: '16px 0', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              borderRadius: '12px',
              border: 'none',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }} 
            onClick={() => navigate('/private-battle')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🔒 비공개 매치
          </button>
        </div>

        {/* 사용자 검색창 (매치 버튼 아래로 깔끔하게 배치) */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="검색할 사용자의 닉네임을 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '14px 20px', fontSize: '15px', borderRadius: '12px',
              backgroundColor: 'var(--theme-surface)', border: '1px solid var(--theme-border)',
              color: 'var(--theme-text)', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 정렬 버튼들 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setSortBy('solved')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              backgroundColor: sortBy === 'solved' ? '#cb6ce6' : 'var(--theme-surface)',
              color: sortBy === 'solved' ? 'white' : 'var(--theme-text)'
            }}
          >
            🏆 문제 푼수
          </button>
          <button
            onClick={() => setSortBy('rating')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              backgroundColor: sortBy === 'rating' ? '#f39c12' : 'var(--theme-surface)',
              color: sortBy === 'rating' ? 'white' : 'var(--theme-text)'
            }}
          >
            ⭐ 레이팅
          </button>
        </div>

        {/* 랭킹 메인 테이블 */}
        <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 100px', padding: '16px 20px', backgroundColor: 'var(--theme-bg)', borderBottom: '1px solid var(--theme-border)', fontWeight: '600', fontSize: '14px', color: 'var(--theme-secondary-text)' }}>
            <div>Rank</div>
            <div>User</div>
            <div style={{ textAlign: 'center' }}>Score</div>
            <div style={{ textAlign: 'center' }}>Solved</div>
            <div style={{ textAlign: 'center' }}>Rating</div>
          </div>

          {loading ? (
            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--theme-secondary-text)' }}>유저 정보를 조회하는 중... 🚀</div>
          ) : rankings.length === 0 ? (
            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--theme-secondary-text)' }}>랭커가 존재하지 않습니다.</div>
          ) : (
            rankings.slice().sort((a, b) => {
              if (sortBy === 'solved') return (b.solved_problems?.length || 0) - (a.solved_problems?.length || 0);
              return (b.rating || 0) - (a.rating || 0);
            }).map((user, index) => (
              <div
                key={user.username || index}
                style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 100px', padding: '16px 20px',
                  borderBottom: index < rankings.length - 1 ? '1px solid var(--theme-border)' : 'none', alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: '700' }}>
                  {index + 1 <= 3 ? (
                    <span style={{ color: index + 1 === 1 ? '#ffd700' : index + 1 === 2 ? '#c0c0c0' : '#cd7f32' }}>
                      {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : '🥉'} {index + 1}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--theme-secondary-text)' }}>{index + 1}</span>
                  )}
                </div>
                <div style={{ fontWeight: '500' }}>
                  {user.username || '익명 유저'}
                  <span style={{
                    marginLeft: '8px', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600',
                    backgroundColor: `${getTierColor(user.rankTitle)}20`, color: getTierColor(user.rankTitle), textTransform: 'uppercase'
                  }}>
                    {user.rankTitle}
                  </span>
                </div>
                <div style={{ textAlign: 'center', color: '#cb6ce6', fontWeight: '600' }}>{(user.score || 0).toLocaleString()}</div>
                <div style={{ textAlign: 'center', color: 'var(--theme-text)' }}>{user.solved_problems?.length || 0}개</div>
                <div style={{ textAlign: 'center', color: '#f39c12', fontWeight: '600' }}>{user.rating || '-'}</div>
              </div>
            ))
          )}
        </div>

        {/* 뒤로가기 링크 */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <span 
            onClick={() => navigate('/')} 
            style={{ color: '#3498db', cursor: 'pointer', fontSize: '16px', fontWeight: '500', textDecoration: 'underline' }}
          >
            ← 메인 화면으로 돌아가기
          </span>
        </div>
      </div>
    </div>
  );
};

const statusConfig = {
  online: { color: '#23a559', icon: CheckCircle2, label: 'Operational' },
  offline: { color: '#ed4245', icon: XCircle, label: 'Outage' },
  degraded: { color: '#f0b232', icon: Clock, label: 'Degraded' },
};

const ServerCard = ({ server, formatUptime }) => {
  const config = statusConfig[server?.status] || { color: '#23a559', icon: CheckCircle2, label: 'Unknown' };
  const StatusIcon = config.icon;
  const ServerIcon = server?.icon || Activity;
  const serverColor = server?.color || '#23a559';
  const serverName = server?.name || 'Unknown Server';
  const gradientId = serverName.replace(/[^a-zA-Z0-9]/g, '_');

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
          <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)' }}>{serverName}</span>
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


      <div style={{ height: '100px', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={server.history || []}>
            <defs>
              <linearGradient id={`gradient-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
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
              fill={`url(#gradient-${gradientId})`}
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

  // 🔽 이 부분을 추가해 주세요! (그래프가 정상적으로 나오게 해줍니다)
  const [realtimeHistory, setRealtimeHistory] = useState({
    api: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 30 + Math.random() * 20 })),
    mediaProxy: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 60 + Math.random() * 30 })),
    gateway: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 120 + Math.random() * 80 })),
    webPages: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, value: 8 + Math.random() * 8 }))
  });

  const [dynamicServers, setDynamicServers] = useState({
    api: { name: 'API', status: 'online', latency: 42, cpu: '0.85', memory: { used: 512, total: 8192, percent: '6.25' }, uptime: 86400 * 5 },
    mediaProxy: { name: 'Media Proxy', status: 'online', latency: 78, cpu: '0.42', memory: { used: 2048, total: 4096, percent: '50.0' }, uptime: 86400 * 2 },
    gateway: { name: 'Gateway', status: 'online', latency: 156, cpu: '0.31', memory: { used: 1024, total: 2048, percent: '45.0' }, uptime: 86400 * 12 },
webPages: { name: 'Server Web Pages', status: 'online', latency: 12, cpu: '0.18', memory: { used: 1536, total: 4096, percent: '37.5' }, uptime: 86400 * 30 }
  });

  useEffect(() => {
    const subscription = supabase
      .channel('server_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'servers_status' }, (payload) => {
        const s = payload.new;
        
        setDynamicServers(prev => ({
          ...prev,
          [s.id]: {
            ...prev[s.id],
            status: s.status,
            latency: s.latency,
            cpu: s.cpu,
            memory: { 
              used: s.memory_used, 
              total: s.memory_total, 
              percent: ((s.memory_used / s.memory_total) * 100).toFixed(1) 
            },
            uptime: s.uptime
          }
        }));

        setRealtimeHistory(prev => {
          const historyKey = s.id === 'webPages' ? 'webPages' : s.id;
          const currentHistory = prev[historyKey] || [];
          const newHistory = [...currentHistory.slice(1), { time: '0s', value: s.latency }];
          return {
            ...prev,
            [historyKey]: newHistory.map((item, i) => ({ 
              ...item, 
              time: `${newHistory.length - 1 - i}s` 
            }))
          };
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${mins}분`;
    return `${mins}분`;
  };

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
            backgroundClip: 'text',
            lineHeight: '1.4',
            display: 'inline-block',
            padding: '5px 0'
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
          {Object.values(dynamicServers)
            .filter(s => s.name !== 'Server Web Pages')
            .map((server) => (
            <ServerCard key={server.name} server={{...server, history: realtimeHistory[server.name === 'API' ? 'api' : server.name === 'Media Proxy' ? 'mediaProxy' : 'gateway'] || []}} formatUptime={formatUptime} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '320px' }}>
            <ServerCard server={{...dynamicServers.webPages, history: realtimeHistory.webPages || []}} formatUptime={formatUptime} />
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
  const navigate = useNavigate();
  const { user, profile } = useAuth(); // 로그인 유저 정보

  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('list'); // 'list' 또는 'created'
  const [generatedCode, setGeneratedCode] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [inputCode, setInputCode] = useState('');

  // 🎯 내 역할이 방장(host)인지 참여자(guest)인지 구분하는 상태 추가
  const [myRole, setMyRole] = useState('host'); 

  // 실시간 백엔드로 연동할 데이터들
  const [hostName, setHostName] = useState('');
  const [isHostReady, setIsHostReady] = useState(false);
  const [guestName, setGuestName] = useState(null);
  const [isGuestReady, setIsGuestReady] = useState(false);

  // 내 프로필 닉네임 구하기
  const myName = profile?.username || user?.email?.split('@')[0] || '익명 유저';

  // 1️⃣ [방장] 새로운 방 생성 + Supabase 등록
  const handleCreateRoom = async () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!');
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([
          {
            room_code: code,
            host_id: user.id,
            host_name: myName,
            host_ready: false,
            guest_id: null,
            guest_name: null,
            guest_ready: false
          }
        ]);

      if (error) throw error;

      setMyRole('host');
      setHostName(myName);
      setGeneratedCode(code);
      setView('created');
    } catch (err) {
      console.error('방 생성 실패:', err.message);
    }
  };

  // 2️⃣ [참여자] 코드로 방 참가하기 ➡️ 경기장으로 바로 안 가고 '대기실'로 진입!
  const handleJoinRoom = async () => {
    if (inputCode.trim().length !== 6) {
      alert('6자리 코드를 정확히 입력해주세요!');
      return;
    }
    if (!user) {
      alert('로그인이 필요합니다!');
      return;
    }

    const targetCode = inputCode.toUpperCase();

    try {
      // Supabase에서 해당 방에 내 정보 업데이트
      const { data, error } = await supabase
        .from('rooms')
        .update({
          guest_id: user.id,
          guest_name: myName
        })
        .eq('room_code', targetCode)
        .select();

      if (error || !data || data.length === 0) {
        alert('존재하지 않거나 들어갈 수 없는 방입니다!');
        return;
      }

      // 🎯 핵심: 바로 /battle-arena로 안 가고, 대기실 뷰로 전환!
      setMyRole('guest');
      setGeneratedCode(targetCode);
      setView('created');
    } catch (err) {
      console.error('방 참가 실패:', err.message);
    }
  };

  // 3️⃣ [공통] 준비 상태 토글 함수
  const toggleReady = async () => {
    const nextReadyState = !isReady;
    setIsReady(nextReadyState);

    if (!generatedCode) return;

    try {
      const updateData = myRole === 'host' 
        ? { host_ready: nextReadyState } 
        : { guest_ready: nextReadyState };

      await supabase
        .from('rooms')
        .update(updateData)
        .eq('room_code', generatedCode);
    } catch (err) {
      console.error('준비 업데이트 실패:', err.message);
    }
  };

  // 4️⃣ [실시간 연동] 대기실 내부 데이터 실시간 양방향 동기화
  useEffect(() => {
    if (!generatedCode || view !== 'created') return;

    const fetchRoomData = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', generatedCode)
        .single();
      
      if (data) {
        setHostName(data.host_name);
        setIsHostReady(data.host_ready);
        setGuestName(data.guest_name);
        setIsGuestReady(data.guest_ready);
        
        if (myRole === 'guest') setIsReady(data.guest_ready);
        if (myRole === 'host') setIsReady(data.host_ready);
      }
    };
    fetchRoomData();

    const realtimeChannel = supabase
      .channel(`room-${generatedCode}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `room_code=eq.${generatedCode}` },
        (payload) => {
          const latest = payload.new;
          setHostName(latest.host_name);
          setIsHostReady(latest.host_ready);
          setGuestName(latest.guest_name);
          setIsGuestReady(latest.guest_ready);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [generatedCode, view, myRole]);

  // 5️⃣ 경기장 진짜 최종 입장
  const handleStartBattle = () => {
    if (!generatedCode) return;
    navigate(`/battle-arena?room=${generatedCode}&mode=${myRole}`);
  };


  // ================= 렌더링 파트 =================

  // 🅰️ 대기실 뷰 (방이 생성되었거나 참가했을 때)
  if (view === 'created') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', backgroundColor: 'var(--theme-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--theme-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }} className="text-gradient">전투 대기실</h2>
          <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '25px', fontSize: '15px' }}>친구에게 아래 코드를 공유하세요</p>
          
          <div style={{ 
            background: 'linear-gradient(var(--theme-surface), var(--theme-surface)) padding-box, linear-gradient(135deg, #cb6ce6, #38b6ff) border-box',
            border: '3px dashed transparent', padding: '20px', borderRadius: '16px', marginBottom: '35px', display: 'inline-block', minWidth: '280px', boxShadow: '0 4px 20px rgba(203, 108, 230, 0.15)'
          }}>
            <span style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '8px', color: '#cb6ce6' }}>{generatedCode}</span>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: '600', color: 'var(--theme-text)' }}>
              참여자 목록 ({guestName ? '2/2' : '1/2'})
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--theme-bg)', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--theme-border)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--theme-surface)', borderBottom: '1px solid var(--theme-border)' }}>
                  <th style={{ padding: '14px 18px', fontSize: '14px', textAlign: 'left', color: 'var(--theme-secondary-text)', fontWeight: '600' }}>플레이어</th>
                  <th style={{ padding: '14px 18px', fontSize: '14px', textAlign: 'right', color: 'var(--theme-secondary-text)', fontWeight: '600' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                  <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '700', color: '#cb6ce6' }}>
                    👑 {hostName || '방장'} {myRole === 'host' && '(나)'}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '14px', textAlign: 'right', color: isHostReady ? '#2ecc71' : '#f39c12', fontWeight: '700' }}>
                    {isHostReady ? '✓ 준비 완료' : '● 대기 중'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 18px', fontSize: '14px', color: guestName ? 'var(--theme-text)' : 'var(--theme-secondary-text)', fontWeight: guestName ? '700' : '400' }}>
                    {guestName ? `⚔️ ${guestName} ${myRole === 'guest' && '(나)'}` : '👤 상대방을 기다리는 중...'}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '14px', textAlign: 'right', color: guestName ? (isGuestReady ? '#2ecc71' : '#f39c12') : 'var(--theme-secondary-text)', fontWeight: '600' }}>
                    {guestName ? (isGuestReady ? '✓ 준비 완료' : '● 대기 중') : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              onClick={toggleReady} 
              style={{ 
                padding: '14px 35px', borderRadius: '12px', backgroundColor: isReady ? '#2ecc71' : '#f39c12', border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                boxShadow: isReady ? '0 4px 12px rgba(46,204,113,0.2)' : '0 4px 12px rgba(243,156,18,0.2)', transition: 'all 0.2s ease'
              }}
            >
              {isReady ? '✓ 준비취소' : '준비하기'}
            </button>
            
            <button 
              onClick={handleStartBattle}
              className="btn paradox-bg"
              disabled={!(isHostReady && isGuestReady)}
              style={{ 
                padding: '14px 35px', borderRadius: '12px', border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', 
                boxShadow: '0 4px 15px rgba(203, 108, 230, 0.25)', transition: 'all 0.2s ease',
                opacity: (isHostReady && isGuestReady) ? 1 : 0.5
              }}
            >
              ⚔️ 경기장 입장
            </button>

            <button 
              onClick={() => setView('list')}
              style={{ 
                padding: '14px 35px', borderRadius: '12px', backgroundColor: '#e74c3c', border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(231,76,60,0.2)', transition: 'all 0.2s ease'
              }}
            >
              방 닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🅱️ 메인 방 목록 & 참여하기 화면 (중복 제거 후 '코드 입력창 개선 버전' 하나만 남김)
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }} className="text-gradient">비공개 배틀</h1>
        <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '35px', fontSize: '16px' }}>함께할 친구를 찾거나 방을 만드세요.</p>

        <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* 방 목록 */}
          <div style={{ flex: 1.5, minWidth: '300px', backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '16px 20px', backgroundColor: 'var(--theme-bg)', borderBottom: '1px solid var(--theme-border)', fontWeight: '600', fontSize: '15px', color: 'var(--theme-secondary-text)' }}>참여 가능한 방</div>
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--theme-secondary-text)', fontSize: '14px' }}>아직 생성된 방이 없어요</div>
          </div>

          {/* 참여/생성 버튼 섹션 */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 방 생성 버튼 */}
            <button 
              onClick={handleCreateRoom}
              className="btn paradox-bg"
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                border: 'none', 
                color: 'white', 
                fontSize: '16px',
                fontWeight: '700', 
                cursor: 'pointer', 
                boxShadow: '0 4px 15px rgba(203, 108, 230, 0.25)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ➕ 새로운 방 생성
            </button>

            {/* 코드 입력 참여 섹션 */}
            <div style={{ backgroundColor: 'var(--theme-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--theme-border)', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--theme-secondary-text)', display: 'block', marginBottom: '15px' }}>입장 코드로 참여</span>
              
              <input 
                placeholder="CODE6" 
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  backgroundColor: 'var(--theme-bg)',
                  border: '1px solid var(--theme-border)', 
                  color: 'var(--theme-text)',
                  textAlign: 'center', 
                  fontSize: '20px', 
                  fontWeight: '800', 
                  letterSpacing: '4px',
                  marginBottom: '15px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              
              <button 
                onClick={handleJoinRoom}
                className="btn"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  color: 'var(--theme-text)',
                  background: 'linear-gradient(var(--theme-surface), var(--theme-surface)) padding-box, linear-gradient(135deg, #cb6ce6, #38b6ff) border-box',
                  border: '2px solid transparent',
                  fontWeight: '700', 
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(56, 182, 255, 0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                🚪 방 참여하기
              </button>
            </div>
          </div>
        </div>

        {/* 하단 링크 영역 */}
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Link to="/ranking" style={{ color: '#38b6ff', textDecoration: 'underline', fontSize: '16px', fontWeight: '500' }}>
            ← 랭킹으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}; // 🎯 PrivateBattle 컴포넌트 마침 (여기서 딱 한 번만 깔끔하게 닫힙니다)


// --- 파트 4: 앱 설정 ---
function App() {
  const [message, setMessage] = useState("Loading...");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  useEffect(() => {
    fetch('https://nine-tailed-fox.onrender.com/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.result))
      .catch(err => setMessage(""));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <nav className="nav-bar">
          {/* 1. 로고 영역 */}
          <Link to="/" className="logo-container">
            <img src={logo} alt="Paradox Logo" className="logo-img" />
          </Link>

          {/* 2. 중앙 메뉴 영역 */}
          <div className="nav-menu">
            <Link to="/basics">C언어 기초</Link>
            <Link to="/community">커뮤니티</Link>
            <Link to="/workbook">문제집</Link>
            <Link to="/ranking">랭킹</Link>
            <Link to="/server-status">서버 상태</Link>
          </div>

          {/* 3. 오른쪽 버튼 영역 */}
          <NavAuthArea onOpen={openAuth} />
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/battle-arena" element={<BattleArena />} />
        </Routes>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
      </Router>
    </AuthProvider>
  );
}

export default App;