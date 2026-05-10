import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CPreview = () => {
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const problem = {
    title: 'Hello, World! 출력하기',
    description: 'printf를 사용하여 "Hello, World!"를 출력하는 코드를 완성하세요.',
    expected: 'printf("Hello, World!");'
  };

  // 스크롤 동기화: 텍스트 박스를 내리면 하이라이트 배경도 같이 내려가게 함
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleRun = () => {
    if (code.includes(problem.expected)) {
      setOutput('Hello, World!');
      setIsCorrect(true);
    } else {
      setOutput('출력 오류: 코드를 다시 확인하세요.');
      setIsCorrect(false);
    }
  };

  const handleCheck = () => {
    const hasCorrect = code.includes(problem.expected);
    setIsCorrect(hasCorrect);
    setOutput(hasCorrect ? '' : '정답이 아닙니다. 다시 시도해보세요.');
  };

  const handleReset = () => {
    setCode(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
    setOutput('');
    setIsCorrect(null);
  };

  // 하이라이트 로직
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

  const renderHighlightedCode = () => {
    const tokens = highlightCode(code);
    return tokens.map((token, i) => {
      let color = '#cb6ce6'; // 기본 텍스트
      if (token.type === 'comment') color = '#6b7280';
      else if (token.type === 'preprocessor') color = '#60a5fa';
      else if (token.type === 'string') color = '#4ade80';
      else if (token.type === 'keyword') color = '#f472b6';
      else if (token.type === 'function') color = '#fbbf24';
      else if (token.type === 'number') color = '#fb923c';
      else if (token.type === 'punctuation') color = '#94a3b8';
      return <span key={i} style={{ color }}>{token.value}</span>;
    });
  };

  // 공통 스타일 (두 레이어를 완전히 겹치게 만드는 핵심)
  const editorStyle = {
    margin: 0,
    padding: '20px',
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontSize: '16px',
    lineHeight: '1.5',
    tabSize: '4',
    letterSpacing: 'normal',
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap', // 줄바꿈 대응
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#171a20', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#5c5e62', textDecoration: 'none', fontSize: '14px' }}>← 돌아가기</Link>
        <h1 style={{ fontSize: '2rem', marginTop: '20px', textAlign: 'left' }}>C언어 맛보기</h1>

        <div style={{ backgroundColor: '#1c1c1e', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#cb6ce6', marginBottom: '10px' }}>{problem.title}</h2>
          <p style={{ color: '#8e8e93', marginBottom: '20px' }}>{problem.description}</p>

          {/* 에디터 컨테이너 */}
          <div style={{ position: 'relative', backgroundColor: '#000', borderRadius: '10px', height: '300px', overflow: 'hidden' }}>
            
            {/* 하단: 하이라이트 된 텍스트 표시 레이어 */}
            <pre
              ref={preRef}
              style={{
                ...editorStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                color: 'transparent',
                backgroundColor: 'transparent',
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 1
              }}
            >
              {renderHighlightedCode()}
            </pre>

            {/* 상단: 실제 입력 창 (글자는 투명하게, 커서만 보이게 함) */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              style={{
                ...editorStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                color: 'transparent', // 글자색을 투명하게 해서 뒤의 하이라이트가 보이게 함
                caretColor: 'white',   // 커서만 하얗게 표시
                border: 'none',
                outline: 'none',
                resize: 'none',
                zIndex: 2,
                overflow: 'auto'
              }}
            />
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={handleRun} style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #004aad 0%, #005cbf 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>실행</button>
            <button onClick={handleCheck} style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #cb6ce6 0%, #9b4dca 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>확인</button>
            <button onClick={handleReset} style={{ padding: '12px 30px', backgroundColor: '#2c2c2e', color: '#8e8e93', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>초기화</button>
          </div>

          {output && (
            <div style={{ backgroundColor: isCorrect ? '#0a3d0a' : '#3d0a0a', borderRadius: '10px', padding: '15px', marginTop: '15px' }}>
              <p style={{ color: isCorrect ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>{isCorrect ? '🎉 정답!' : '❌ 오답'}</p>
              <p style={{ color: '#fff', marginTop: '10px', fontFamily: 'monospace' }}>출력: {output}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CPreview;