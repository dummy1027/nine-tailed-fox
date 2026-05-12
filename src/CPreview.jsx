import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const KEYWORDS = [
  'printf', 'scanf', 'include', 'stdio.h', 'stdlib.h', 'string.h', 'math.h',
  'int', 'main', 'return', 'void', 'if', 'else', 'while', 'for', 'char',
  'float', 'double', 'switch', 'case', 'break', 'continue', 'struct', 'typedef',
  '#include', '#define'
];

const FUNCTION_KEYWORDS = ['printf', 'scanf', 'main', 'if', 'while', 'for', 'switch', 'sizeof'];

const CPreview = () => {
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [resultType, setResultType] = useState(null);

  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const mirrorRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestIndex, setSuggestIndex] = useState(0);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestPos, setSuggestPos] = useState({ top: 0, left: 0 });

  const problem = {
    title: 'Hello, World! 출력하기',
    description: 'printf를 사용하여 "Hello, World!"를 출력하는 코드를 완성하세요.',
    expected: 'Hello, World!'
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleRun = () => {
    setResultType('run');
    const printfMatch = code.match(/printf\s*\(\s*"([^"]*)"\s*\)/);
    if (printfMatch) {
      setOutput(printfMatch[1]);
    } else {
      setOutput('출력 오류: printf 문을 찾을 수 없습니다.');
    }
  };

  const handleCheck = () => {
    setResultType('check');
    const printfMatch = code.match(/printf\s*\(\s*"([^"]*)"\s*\)/);
    const userOutput = printfMatch ? printfMatch[1] : '';
    setIsCorrect(userOutput === problem.expected);
    setOutput('');
  };

  const handleReset = () => {
    setCode(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
    setOutput('');
    setIsCorrect(null);
    setResultType(null);
    setShowSuggest(false);
  };

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
    const value = code;

    const lastWordMatch = value.substring(0, start).match(/[\w#.]+$/);
    if (!lastWordMatch) return;

    const wordStart = start - lastWordMatch[0].length;

    let insertValue = suggestion;
    let cursorShift = suggestion.length;

    // 함수형 키워드인 경우 괄호를 붙이고 커서를 괄호 안으로 이동
    if (FUNCTION_KEYWORDS.includes(suggestion)) {
      insertValue += '()';
      cursorShift += 1;
    }

    const newCode = value.substring(0, wordStart) + insertValue + value.substring(start);

    setCode(newCode);
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

    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      // 현재 줄의 시작 위치와 들여쓰기 확인
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineUntilCursor = value.substring(lineStart, start);
      const indentationMatch = lineUntilCursor.match(/^\s*/);
      const currentIndentation = indentationMatch ? indentationMatch[0] : '';

      let newText = '\n' + currentIndentation;
      let cursorOffset = 1 + currentIndentation.length;

      // {와 } 사이에서 엔터를 친 경우 (3줄로 확장)
      if (value[start - 1] === '{' && value[start] === '}') {
        newText = '\n' + currentIndentation + '\t\n' + currentIndentation;
        cursorOffset = 1 + currentIndentation.length + 1; // 첫 번째 줄바꿈과 탭 뒤로 커서 이동
      } else if (lineUntilCursor.trim().endsWith('{')) {
        // 줄이 {로 끝나는 경우 들여쓰기 추가
        newText += '\t';
        cursorOffset += 1;
      }

      const newCode = value.substring(0, start) + newText + value.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + cursorOffset;
        }
      }, 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      const newCode = value.substring(0, start) + '\t' + value.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
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

          if (balance === 0) {
            matchIndex = i;
            break;
          }
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
        setCode(newCode);

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
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
        }
      }, 0);
    }
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
    boxSizing: 'border-box',
    textAlign: 'left'
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
            {/* Mirror Div (위치 계산용 숨김 디브) */}
            <div
              ref={mirrorRef}
              style={{
                ...editorStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                visibility: 'hidden',
                whiteSpace: 'pre-wrap',
                width: '100%',
                zIndex: -1,
                pointerEvents: 'none'
              }}
            />

            {/* 자동완성 메뉴 */}
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
              onChange={(e) => {
                const val = e.target.value;
                setCode(val);
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
              }}
              onKeyDown={handleKeyDown}
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

          {resultType === 'run' && output && (
            <div style={{ backgroundColor: '#1c1c1e', borderRadius: '10px', padding: '15px', marginTop: '15px', border: '1px solid #3a3a3c' }}>
              <p style={{ color: '#8e8e93', fontWeight: 'bold', marginBottom: '10px' }}>출력 결과</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '14px' }}>{output}</p>
            </div>
          )}

          {resultType === 'check' && isCorrect !== null && (
            <div style={{ backgroundColor: isCorrect ? '#0a3d0a' : '#3d0a0a', borderRadius: '10px', padding: '15px', marginTop: '15px' }}>
              <p style={{ color: isCorrect ? '#4ade80' : '#f87171', fontWeight: 'bold', fontSize: '16px' }}>
                {isCorrect ? '🎉 정답!' : '❌ 오답'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CPreview;