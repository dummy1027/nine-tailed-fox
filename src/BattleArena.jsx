import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import { getRandomBattleProblem } from './problems';

/* ───────── 상수 ───────── */
const MAX_HP = 100;
const DAMAGE_PER_CORRECT = 35;
const MATCH_TIMEOUT_SEC = 30;
const BATTLE_TIME_SEC = 300; // 5분

const RANK_COLORS = {
  beginner: '#95a5a6', veteran: '#3498db', expert: '#9b59b6',
  master: '#f39c12', grandmaster: '#e74c3c'
};

const getRank = (score) => {
  if (score < 100) return 'beginner';
  if (score < 300) return 'veteran';
  if (score < 600) return 'expert';
  if (score < 1000) return 'master';
  return 'grandmaster';
};

/* ───────── C 코드 하이라이트 ───────── */
const KEYWORDS = [
  'printf','scanf','include','stdio.h','stdlib.h','string.h','math.h',
  'int','main','return','void','if','else','while','for','char',
  'float','double','switch','case','break','continue','struct','typedef',
  '#include','#define'
];
const FUNC_KW = ['printf','scanf','main','if','while','for','switch','sizeof'];

const highlightCode = (code) => {
  const tokens = [];
  const re = /(\/\*[\s\S]*?\*\/|\/\/.*|#\w+|"(?:[^"\\]|\\.)*"|%(?:\.\d+)?[diufFeEgGxXoscpaAn]|'[^']*'|\b(int|char|float|double|void|if|else|for|while|return|include|define|stdio|stdlib|string|main)\b|\b\d+\b|[{}();])/g;
  let last = 0, m;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) tokens.push({ t: 'text', v: code.substring(last, m.index) });
    const v = m[0];
    if (v.startsWith('//') || v.startsWith('/*')) tokens.push({ t: 'comment', v });
    else if (v.startsWith('#')) tokens.push({ t: 'pre', v });
    else if (v.startsWith('"')) tokens.push({ t: 'str', v });
    else if (v.startsWith('%')) tokens.push({ t: 'fmt', v });
    else if (['int','char','float','double','void','if','else','for','while','return'].includes(v)) tokens.push({ t: 'kw', v });
    else if (['include','define','stdio','stdlib','string','main'].includes(v)) tokens.push({ t: 'fn', v });
    else if (/\d+/.test(v)) tokens.push({ t: 'num', v });
    else tokens.push({ t: 'punc', v });
    last = m.index + v.length;
  }
  if (last < code.length) tokens.push({ t: 'text', v: code.substring(last) });
  return tokens;
};

const tokenColor = { comment: '#6b7280', pre: '#60a5fa', str: '#4ade80', kw: '#f472b6', fn: '#fbbf24', num: '#fb923c', punc: '#94a3b8', fmt: '#38bdf8', text: '#e2e8f0' };

/* ───────── C 실행 시뮬레이터 ───────── */
const simulateC = (code) => {
  const syntaxErrs = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith('//') || l.startsWith('/*') || l.startsWith('#') || l.endsWith('{') || l.endsWith('}')) continue;
    if (/^(if|for|while|else|return|break|continue)/.test(l)) continue;
    if (/^\w+/.test(l) && !l.endsWith(';') && !l.endsWith('{')) {
      syntaxErrs.push(`[E2001] 세미콜론이 없습니다. (${i+1}번째 줄)`);
    }
  }
  if (syntaxErrs.length) return { ok: false, output: syntaxErrs[0] };

  const varMap = {};
  const varOrder = [];
  const outputs = [];

  const evalExpr = (expr) => {
    expr = expr.trim();
    if (/^-?\d+\.?\d*$/.test(expr)) return parseFloat(expr);
    if (varMap[expr] !== undefined) return varMap[expr];
    let m = expr.match(/^(.+?)([\+\-])(.+)$/);
    if (m) {
      const left = evalExpr(m[1]);
      const right = evalExpr(m[3]);
      return m[2] === '+' ? left + right : left - right;
    }
    m = expr.match(/^(.+?)([\*\/\%])(.+)$/);
    if (m) {
      const left = evalExpr(m[1]);
      const right = evalExpr(m[3]);
      if (m[2] === '*') return left * right;
      if (m[2] === '/') return left / right;
      return left % right;
    }
    return 0;
  };

  const processPrintf = (fmt, vals) => {
    let txt = fmt.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    let idx = 0;
    txt = txt.replace(/%(?:\.\d+)?[diufFeEgGxXoscpaAn]/g, () => {
      if (idx < vals.length) {
        const v = vals[idx++];
        if (typeof v === 'number') {
          if (txt.includes('f')) return v.toFixed(1);
          return Math.round(v).toString();
        }
        return v.toString();
      }
      return '';
    });
    return txt;
  };

  code.split('\n').forEach(line => {
    const trimmed = line.trim();
    const declMatch = trimmed.match(/^(?:int|float|double|char|long)\s+(\w+)\s*(?:=\s*(.+?))?\s*;$/);
    if (declMatch) {
      const varName = declMatch[1];
      const val = declMatch[2] ? evalExpr(declMatch[2]) : Math.floor(Math.random() * 100);
      varMap[varName] = val;
      if (!varOrder.includes(varName)) varOrder.push(varName);
      return;
    }
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+?)\s*;$/);
    if (assignMatch && varMap[assignMatch[1]] !== undefined) {
      varMap[assignMatch[1]] = evalExpr(assignMatch[2]);
      return;
    }
  });

  const forRe = /for\s*\(\s*int\s+(\w+)\s*=\s*(-?\d+)\s*;\s*(\w+)\s*([<>=!]+)\s*(-?\d+)\s*;\s*(\w+)\+\+\s*\)/g;
  let forMatch;
  let loopOutputs = [];
  while ((forMatch = forRe.exec(code)) !== null) {
    const loopVar = forMatch[1];
    const start = parseInt(forMatch[2]);
    const end = parseInt(forMatch[5]);
    const afterFor = code.substring(code.indexOf(forMatch[0]) + forMatch[0].length);
    const printfRe = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"(?:,\s*([^)]+))?\s*\)/g;
    const pm = printfRe.exec(afterFor);
    if (pm) {
      const fmt = pm[1];
      const args = pm[2] ? pm[2].split(',').map(a => a.trim()) : [];
      for (let i = start; i <= end; i++) {
        varMap[loopVar] = i;
        const vals = args.map(a => varMap[a] !== undefined ? varMap[a] : evalExpr(a));
        loopOutputs.push(processPrintf(fmt, vals));
      }
    }
  }

  if (loopOutputs.length > 0) return { ok: true, output: loopOutputs.join('') };

  const ifRe = /if\s*\(\s*(.+?)\s*\)(?:\s*\{([^}]*)\})?\s*else\s*\{([^}]*)\}/g;
  let ifMatch;
  while ((ifMatch = ifRe.exec(code)) !== null) {
    const cond = ifMatch[1];
    const ifBody = ifMatch[2] || '';
    const elseBody = ifMatch[3] || '';
    const cmpMatch = cond.match(/(\w+)\s*([<>=!]+)\s*(\w+)/);
    if (cmpMatch) {
      const left = varMap[cmpMatch[1]] !== undefined ? varMap[cmpMatch[1]] : parseFloat(cmpMatch[1]);
      const right = varMap[cmpMatch[3]] !== undefined ? varMap[cmpMatch[3]] : parseFloat(cmpMatch[3]);
      let condTrue = false;
      switch (cmpMatch[2]) {
        case '==': condTrue = left === right; break;
        case '!=': condTrue = left !== right; break;
        case '<': condTrue = left < right; break;
        case '>': condTrue = left > right; break;
        case '<=': condTrue = left <= right; break;
        case '>=': condTrue = left >= right; break;
      }
      const body = condTrue ? ifBody : elseBody;
      const printfInBlock = body.match(/printf\s*\(\s*"((?:[^"\\]|\\.)*)"(?:,\s*([^)]+))?\s*\)/);
      if (printfInBlock) {
        const fmt = printfInBlock[1];
        const args = printfInBlock[2] ? printfInBlock[2].split(',').map(a => a.trim()) : [];
        const vals = args.map(a => varMap[a] !== undefined ? varMap[a] : evalExpr(a));
        return { ok: true, output: processPrintf(fmt, vals) };
      }
    }
  }

  const printfRe = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"(?:,\s*([^)]+))?\s*\)/g;
  let pm;
  while ((pm = printfRe.exec(code)) !== null) {
    const fmt = pm[1];
    const args = pm[2] ? pm[2].split(',').map(a => a.trim()) : [];
    const vals = args.map(a => varMap[a] !== undefined ? varMap[a] : evalExpr(a));
    outputs.push(processPrintf(fmt, vals));
  }

  if (outputs.length === 0) return { ok: false, output: '[E1002] printf 문을 찾을 수 없습니다.' };
  return { ok: true, output: outputs.join('') };
};

/* ───────── 컴포넌트 ───────── */
export default function BattleArena() {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  const searchParams = new URLSearchParams(window.location.search);
  
  // 🚨 [새로고침 방어] F5 대응을 위해 sessionStorage 및 URL 파라미터 다중 검증 구조 적용
  const [roomCode, setRoomCode] = useState(() => {
    return searchParams.get('room') || sessionStorage.getItem('current_room_code') || '';
  });
  const [myRole, setMyRole] = useState(() => {
    return searchParams.get('mode') || sessionStorage.getItem('current_room_role') || 'guest';
  });
  const isPrivateBattle = !!roomCode;

  // 매칭 상태
  const [phase, setPhase] = useState('matching'); 
  const [matchTimer, setMatchTimer] = useState(MATCH_TIMEOUT_SEC);
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(3);

  // 배틀 상태
  const [myHp, setMyHp] = useState(MAX_HP);
  const [oppHp, setOppHp] = useState(MAX_HP);
  const [problem, setProblem] = useState(null);
  const [usedIds, setUsedIds] = useState([]);
  const [battleTime, setBattleTime] = useState(BATTLE_TIME_SEC);
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
  const [output, setOutput] = useState('');
  const [resultType, setResultType] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [battleResult, setBattleResult] = useState(null); 
  const [ratingChange, setRatingChange] = useState(0);
  const [damageAnim, setDamageAnim] = useState({ my: false, opp: false });
  const [problemCount, setProblemCount] = useState(0);
  const battleEndedRef = useRef(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [pendingNavigate, setPendingNavigate] = useState(null);
  const mirrorRef = useRef(null);
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const oppBotTimerRef = useRef(null);
  const channelRef = useRef(null);
  const myHpRef = useRef(MAX_HP);
  const oppHpRef = useRef(MAX_HP);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestIndex, setSuggestIndex] = useState(0);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestPos, setSuggestPos] = useState({ top: 0, left: 0 });

  // 🚨 방 코드 및 역할 세션스토리지 자동 기록
  useEffect(() => {
    if (roomCode) sessionStorage.setItem('current_room_code', roomCode);
    if (myRole) sessionStorage.setItem('current_room_role', myRole);
  }, [roomCode, myRole]);

  const updateSuggestPos = (textBeforeCursor) => {
    if (!mirrorRef.current || !textareaRef.current) return;
    const mirror = mirrorRef.current;
    mirror.textContent = textBeforeCursor;
    const span = document.createElement('span');
    span.textContent = '|';
    mirror.appendChild(span);
    const { offsetTop, offsetLeft } = span;
    setSuggestPos({ top: offsetTop + 25, left: offsetLeft });
  };

  const handleSelectSuggestion = (suggestion) => {
    const start = textareaRef.current.selectionStart;
    const value = code;
    const lastWordMatch = value.substring(0, start).match(/[\w#.]+$/);
    if (!lastWordMatch) return;
    const wordStart = start - lastWordMatch[0].length;
    let insertValue = suggestion;
    let cursorShift = suggestion.length;
    if (FUNC_KW.includes(suggestion)) { insertValue += '()'; cursorShift += 1; }
    const newCode = value.substring(0, wordStart) + insertValue + value.substring(start);
    setCode(newCode);
    setShowSuggest(false);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = wordStart + cursorShift;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
      }
    }, 0);
  };

  useEffect(() => {
    myHpRef.current = myHp;
  }, [myHp]);

  useEffect(() => {
    oppHpRef.current = oppHp;
  }, [oppHp]);

  useEffect(() => {
    if (phase !== 'battle') return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '배틀 중입니다. 정말 나가시겠습니까?';
    };
    window.addEventListener('beforeunload', h);

    const handlePopState = () => {
      if (phase === 'battle') {
        window.history.pushState(null, '', window.location.href);
        setShowLeaveModal(true);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', h);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [phase]);

  /* ─── Supabase Realtime 매칭 ─── */
  useEffect(() => {
    if (phase !== 'matching') return;

    if (isPrivateBattle) {
      // 🚨 사설 방 정보 불러오고 구독 즉시 활성화
      subscribeToRoom(roomCode);

      const fetchRoomData = async () => {
        const { data } = await supabase
          .from('rooms')
          .select('*')
          .eq('room_code', roomCode)
          .single();
        
        if (data) {
          if (myRole === 'host' && data.guest_id) {
            setOpponent({
              username: data.guest_name || '상대방',
              score: 0,
              rank_title: 'beginner',
              isBot: false,
              userId: data.guest_id
            });
            setPhase('countdown');
          } else if (myRole === 'guest' && data.host_id) {
            setOpponent({
              username: data.host_name || '방장',
              score: data.host_score || 0,
              rank_title: getRank(data.host_score || 0),
              isBot: false,
              userId: data.host_id
            });
            setPhase('countdown');
          }
        }
      };

      fetchRoomData();

      const ch = supabase.channel(`room-${roomCode}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` }, (payload) => {
          const latest = payload.new;
          if (myRole === 'host' && latest.guest_id && latest.guest_ready) {
            setOpponent({
              username: latest.guest_name || '상대방',
              score: 0,
              rank_title: 'beginner',
              isBot: false,
              userId: latest.guest_id
            });
            setPhase('countdown');
          } else if (myRole === 'guest' && latest.host_id && latest.host_ready) {
            setOpponent({
              username: latest.host_name || '방장',
              score: latest.host_score || 0,
              rank_title: getRank(latest.host_score || 0),
              isBot: false,
              userId: latest.host_id
            });
            setPhase('countdown');
          }
        })
        .subscribe();

      return () => supabase.removeChannel(ch);
    }

    if (isDev || !user) {
      const t = setTimeout(() => startBotMatch(), 2000);
      return () => clearTimeout(t);
    }

    const joinQueue = async () => {
      await supabase.from('battle_queue').upsert({
        user_id: user.id,
        username: profile?.username || 'Player',
        score: profile?.score || 0,
        status: 'waiting',
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      const { data: waiting } = await supabase
        .from('battle_queue')
        .select('*')
        .eq('status', 'waiting')
        .neq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1);

      if (waiting && waiting.length > 0) {
        const opp = waiting[0];
        const roomId = [user.id, opp.user_id].sort().join('_');
        await supabase.from('battle_queue').update({ status: 'matched', room_id: roomId }).eq('user_id', user.id);
        await supabase.from('battle_queue').update({ status: 'matched', room_id: roomId }).eq('user_id', opp.user_id);

        setOpponent({
          username: opp.username,
          score: opp.score,
          rank_title: getRank(opp.score),
          isBot: false,
          userId: opp.user_id
        });
        setPhase('countdown');
        subscribeToRoom(roomId);
      }
    };

    joinQueue();

    const ch = supabase.channel('battle_queue_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'battle_queue', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.new.status === 'matched' && payload.new.room_id) {
          fetchOpponent(payload.new.room_id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
      if (user) {
        supabase.from('battle_queue').delete().eq('user_id', user.id).eq('status', 'waiting');
      }
    };
    // eslint-disable-next-line
  }, [phase, user, isDev, isPrivateBattle, roomCode, myRole]);

  const fetchOpponent = async (roomId) => {
    const { data } = await supabase
      .from('battle_queue')
      .select('*')
      .eq('room_id', roomId)
      .neq('user_id', user.id)
      .maybeSingle();
    if (data) {
      setOpponent({
        username: data.username,
        score: data.score,
        rank_title: getRank(data.score),
        isBot: false,
        userId: data.user_id
      });
      setPhase('countdown');
      subscribeToRoom(roomId);
    }
  };

  // 🚨 [실시간 수신 핵심 수리] 나뿐만 아니라 내 화면의 상대 피도 정확히 연동되게 제어
  const subscribeToRoom = (roomId) => {
    console.log("⚔️ 배틀 채널 연결 시작, 방 ID:", roomId);
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const ch = supabase.channel(`battle_${roomId}`)
      .on('broadcast', { event: 'damage' }, (payload) => {
        console.log("💥 실시간 데미지 신호 도착:", payload);
        
        // 신호를 보낸 사람이 상대방인 경우 처리
        if (payload.payload.from !== user?.id) {
          // 1. 내 체력 차감
          setMyHp(prev => {
            const next = Math.max(0, prev - payload.payload.amount);
            triggerDamageAnim('my');
            if (next <= 0) {
              const result = oppHpRef.current <= 0 ? 'draw' : 'lose';
              finalizeBattle(result);
            }
            return next;
          });

          // 2. 🚨 [연동 핵심] 상대방 화면에서 내가 맞춘 기댓값이므로 내 화면의 '상대방 피'도 강제 차감 동기화!
          setOppHp(prev => Math.max(0, prev - payload.payload.amount));
          triggerDamageAnim('opp');
        }
      })
      .on('broadcast', { event: 'gameover' }, (payload) => {
        console.log("🏁 게임오버 신호 감지:", payload);
        if (payload.payload.winner !== user?.id) {
          setPhase('gameover');
          setBattleResult('lose');
        }
      });

    ch.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log("✅ 실시간 배틀 연동 채널 구독 완전 성공!");
      }
    });
    channelRef.current = ch;
  };

  const startBotMatch = () => {
    const botNames = ['CodeNinja', 'ByteMaster', 'SyntaxSage', 'AlgoKing', 'BitWizard', 'CompileBot', 'StackHero'];
    const botScore = Math.floor(Math.random() * 800) + 100;
    setOpponent({
      username: botNames[Math.floor(Math.random() * botNames.length)],
      score: botScore,
      rank_title: getRank(botScore),
      isBot: true
    });
    setPhase('countdown');
  };

  /* ─── 카운트다운 ─── */
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      const p = getRandomBattleProblem([]);
      setProblem(p);
      setUsedIds([p.originalId || p.id]);
      setPhase('battle');
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  /* ─── 배틀 타이머 ─── */
  useEffect(() => {
    if (phase !== 'battle') return;
    const iv = setInterval(() => {
      setBattleTime(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          const result = myHpRef.current > oppHpRef.current ? 'win' : myHpRef.current < oppHpRef.current ? 'lose' : 'draw';
          finalizeBattle(result);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, finalizeBattle]);

  /* ─── 봇 자동 풀이 (랜덤 타이밍) ─── */
  useEffect(() => {
    if (phase !== 'battle' || !opponent?.isBot) return;
    const scheduleBotSolve = () => {
      const delay = (Math.random() * 25 + 15) * 1000; 
      oppBotTimerRef.current = setTimeout(() => {
        setMyHp(prev => {
          const next = Math.max(0, prev - DAMAGE_PER_CORRECT);
          triggerDamageAnim('my');
          if (next <= 0) {
            setPhase('gameover');
            setBattleResult('lose');
          }
          return next;
        });
        scheduleBotSolve();
      }, delay);
    };
    scheduleBotSolve();
    return () => clearTimeout(oppBotTimerRef.current);
    // eslint-disable-next-line
  }, [phase, opponent]);

  /* ─── 데미지 애니메이션 ─── */
  const triggerDamageAnim = (who) => {
    setDamageAnim(prev => ({ ...prev, [who]: true }));
    setTimeout(() => setDamageAnim(prev => ({ ...prev, [who]: false })), 600);
  };

  const getRatingDelta = (result) => {
    if (result === 'win') return Math.floor(myHpRef.current / 2);
    if (result === 'lose') return -(MAX_HP - myHpRef.current);
    return 0;
  };

  const applyRatingChange = useCallback(async (change) => {
    if (!user || isDev || change === 0) return;
    const currentRating = profile?.rating ?? 0;
    const newRating = Math.max(0, currentRating + change);
    const { data, error } = await supabase.from('profiles').update({ rating: newRating }).eq('id', user.id).select('rating').maybeSingle();
    if (!error && data && setProfile) {
      setProfile(prev => prev ? { ...prev, rating: data.rating } : prev);
    }
  }, [user, isDev, profile, setProfile]);

  const finalizeBattle = useCallback(async (result) => {
    if (battleEndedRef.current) return;
    battleEndedRef.current = true;
    setPhase('gameover');
    setBattleResult(result);
    const delta = getRatingDelta(result);
    setRatingChange(delta);
    await applyRatingChange(delta);
  }, [applyRatingChange]);

  /* ─── 채점 ─── */
  const handleRun = () => {
    setResultType('run');
    const result = simulateC(code);
    setOutput(result.output);
    setIsCorrect(null);
  };

  // 🚨 [송신 핵심 수리] 내가 정답을 제출했을 때 상대방에게 실시간 브로드캐스트가 확실히 꽂히게 정비
  const handleCheck = async () => {
    if (!problem) return;
    if (isCorrect === true) return;
    setResultType('check');
    const result = simulateC(code);
    if (!result.ok) {
      setOutput(result.output);
      setIsCorrect(false);
      return;
    }
    const userOut = result.output.trim();
    const expected = (problem.output || '').replace(/\\n/g, '\n').trim();
    const correct = userOut === expected;
    setIsCorrect(correct);
    setOutput('');

    if (correct) {
      const newOppHp = Math.max(0, oppHp - DAMAGE_PER_CORRECT);
      triggerDamageAnim('opp');
      setOppHp(newOppHp);

      // 🚨 [실시간 타격 전송] 상대방 화면 브라우저로 35데미지 실시간 타격 발송!
      if (channelRef.current) {
        console.log("🚀 상대방 저격 성공! 데미지 쏴줍니다.");
        channelRef.current.send({
          type: 'broadcast',
          event: 'damage',
          payload: { from: user?.id, amount: DAMAGE_PER_CORRECT }
        });
      } else {
        console.error("❌ 오류: channelRef 가 비어있어 전송에 실패했습니다.");
      }

      if (newOppHp <= 0) {
        const result = myHpRef.current <= 0 ? 'draw' : 'win';
        await finalizeBattle(result);
        if (channelRef.current) {
          channelRef.current.send({ type: 'broadcast', event: 'gameover', payload: { winner: user?.id } });
        }
        return;
      }

      setResultType(null);
      setProblemCount(c => c + 1);
      const newUsed = [...usedIds, problem.originalId || problem.id];
      const np = getRandomBattleProblem(newUsed);
      setUsedIds(newUsed);
      setTimeout(() => {
        setProblem(np);
        setCode(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
        setOutput('');
        setIsCorrect(null);
      }, 50);
    }
  };

  const handleReset = () => {
    setCode(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
    setOutput('');
    setIsCorrect(null);
    setResultType(null);
  };

  /* ─── 나가기 ─── */
  const handleLeaveBattle = useCallback(async (confirmed = false) => {
    if (phase === 'battle' && !confirmed) {
      clearTimeout(oppBotTimerRef.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (!isDev && user) {
        await supabase.from('battle_queue').delete().eq('user_id', user.id);
      }
      setShowLeaveModal(false);
      setExitConfirm(false);
      setPhase('gameover');
      setBattleResult('lose');
      return;
    }
    clearTimeout(oppBotTimerRef.current);
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    if (!isDev && user) {
      await supabase.from('battle_queue').delete().eq('user_id', user.id);
    }
    setShowLeaveModal(false);
    setExitConfirm(false);
    navigate('/ranking');
  }, [user, isDev, navigate, phase]);

  const handleForfeitAndLeave = async () => {
    if (phase === 'battle') {
      await finalizeBattle('lose');
    }
    setShowLeaveModal(false);
    setExitConfirm(false);
    if (pendingNavigate) {
      navigate(pendingNavigate);
      setPendingNavigate(null);
    } else {
      navigate('/ranking');
    }
  };

  useEffect(() => {
    if (phase !== 'battle') return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '배틀 중입니다. 정말 나가시겠습니까?';
    };
    const handlePopState = () => {
      if (phase === 'battle') {
        window.history.pushState(null, '', window.location.href);
        setShowLeaveModal(true);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', h);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', h);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'matching') return;
    if (matchTimer <= 0) {
      startBotMatch();
      return;
    }
    const timer = setTimeout(() => setMatchTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, matchTimer, opponent]);

  /* ─── 에디터 키 핸들러 ─── */
  const handleKeyDown = (e) => {
    if (showSuggest) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSuggestIndex(prev => (prev + 1) % suggestions.length); return; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSuggestIndex(prev => (prev - 1 + suggestions.length) % suggestions.length); return; }
      else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); handleSelectSuggestion(suggestions[suggestIndex]); return; }
      else if (e.key === 'Escape') { setShowSuggest(false); return; }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart, en = e.target.selectionEnd;
      const nc = code.substring(0, s) + '\t' + code.substring(en);
      setCode(nc);
      setTimeout(() => { if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = s + 1; }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = e.target.selectionStart, en = e.target.selectionEnd, val = e.target.value;
      const ls = val.lastIndexOf('\n', s - 1) + 1;
      const im = val.substring(ls, s).match(/^\s*/);
      const indent = im ? im[0] : '';
      let nt = '\n' + indent, co = 1 + indent.length;
      if (val[s - 1] === '{' && val[s] === '}') { nt = '\n' + indent + '\t\n' + indent; co = 1 + indent.length + 1; }
      else if (val.substring(ls, s).trim().endsWith('{')) { nt += '\t'; co += 1; }
      setCode(val.substring(0, s) + nt + val.substring(en));
      setTimeout(() => { if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = s + co; }, 0);
    } else if (['{', '(', '[', '"', "'"].includes(e.key)) {
      e.preventDefault();
      const s = e.target.selectionStart, en = e.target.selectionEnd, val = e.target.value;
      const pairs = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
      setCode(val.substring(0, s) + e.key + pairs[e.key] + val.substring(en));
      setTimeout(() => { if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = s + 1; }, 0);
    }
  };

  const handleCodeChange = (e) => {
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
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ═══════════════════ RENDER ═══════════════════ */

  if (phase === 'matching') {
    return (
      <div style={styles.fullPage}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          @keyframes dotPulse { 0%,80%,100% { opacity: 0.3; } 40% { opacity: 1; } }
        `}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 40px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(203,108,230,0.3)', animation: 'pulse-ring 2s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(203,108,230,0.3)', animation: 'pulse-ring 2s ease-out infinite 0.5s' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(203,108,230,0.3)', animation: 'pulse-ring 2s ease-out infinite 1s' }} />
            <div style={{
              position: 'absolute', inset: 15, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #cb6ce6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', animation: 'float 3s ease-in-out infinite'
            }}>⚔️</div>
          </div>

          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '2rem', fontWeight: 900,
            background: 'linear-gradient(90deg, #cb6ce6, #7c3aed, #cb6ce6)',
            backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite', letterSpacing: '-0.5px'
          }}>
            매칭중
            <span style={{ animation: 'dotPulse 1.4s infinite 0s' }}>.</span>
            <span style={{ animation: 'dotPulse 1.4s infinite 0.2s' }}>.</span>
            <span style={{ animation: 'dotPulse 1.4s infinite 0.4s' }}>.</span>
          </h2>

          <p style={{ color: 'var(--theme-secondary-text, #8b8fa3)', marginTop: 12, fontSize: 14 }}>
            상대를 찾고 있습니다 ({matchTimer}초)
          </p>

          <button onClick={() => navigate('/ranking')} style={{
            marginTop: 30, padding: '10px 28px', borderRadius: 10,
            background: 'transparent', border: '1px solid var(--theme-border, #333)',
            color: 'var(--theme-secondary-text, #8b8fa3)', cursor: 'pointer', fontSize: 14
          }}>
            취소
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'countdown') {
    return (
      <div style={styles.fullPage}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
          @keyframes countBounce { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
        `}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
            <div style={styles.countdownPlayer}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{profile?.username || user?.email?.split('@')[0] || 'You'}</p>
              <span style={{ ...styles.rankBadge, backgroundColor: `${RANK_COLORS[getRank(profile?.score || 0)]}25`, color: RANK_COLORS[getRank(profile?.score || 0)] }}>
                {getRank(profile?.score || 0)}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#cb6ce6', fontFamily: "'Nunito', sans-serif" }}>VS</div>
            <div style={styles.countdownPlayer}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{opponent?.isBot ? '🤖' : '👤'}</div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{opponent?.username}</p>
              <span style={{ ...styles.rankBadge, backgroundColor: `${RANK_COLORS[opponent?.rank_title] || '#95a5a6'}25`, color: RANK_COLORS[opponent?.rank_title] || '#95a5a6' }}>
                {opponent?.rank_title || 'beginner'}
              </span>
            </div>
          </div>
          <div key={countdown} style={{
            fontSize: countdown === 0 ? '3rem' : '5rem', fontWeight: 900,
            fontFamily: "'Nunito', sans-serif",
            background: 'linear-gradient(135deg, #cb6ce6, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'countBounce 0.6s ease-out',
            lineHeight: 1.2, padding: '20px'
          }}>
            {countdown === 0 ? 'FIGHT!' : countdown}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'gameover') {
    const isWin = battleResult === 'win';
    const isDraw = battleResult === 'draw';
    const ratingLabel = ratingChange === 0 ? '레이팅 변동 없음' : `${ratingChange > 0 ? '+' : ''}${ratingChange}`;
    return (
      <div style={styles.fullPage}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
          @keyframes victoryGlow { 0%,100% { text-shadow: 0 0 20px rgba(46,204,113,0.5); } 50% { text-shadow: 0 0 40px rgba(46,204,113,0.8); } }
          @keyframes defeatShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
          @keyframes fadeUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease-out' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>
            {isWin ? '🏆' : isDraw ? '🤝' : '💀'}
          </div>
          <h1 style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '3rem', fontWeight: 900,
            color: isWin ? '#2ecc71' : isDraw ? '#f39c12' : '#e74c3c',
            animation: isWin ? 'victoryGlow 2s ease-in-out infinite' : isDraw ? 'none' : 'defeatShake 0.5s ease-in-out',
            marginBottom: 10
          }}>
            {isWin ? 'VICTORY!' : isDraw ? 'DRAW' : 'DEFEAT'}
          </h1>
          <p style={{ color: 'var(--theme-secondary-text, #8b8fa3)', fontSize: 16, marginBottom: 8 }}>
            vs {opponent?.username} {opponent?.isBot ? '(Bot)' : ''}
          </p>
          <div style={{ display: 'flex', gap: 30, justifyContent: 'center', marginTop: 20, marginBottom: 30 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#8b8fa3', fontSize: 12 }}>내 HP</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: '#2ecc71' }}>{myHp}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#8b8fa3', fontSize: 12 }}>상대 HP</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: '#e74c3c' }}>{oppHp}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#8b8fa3', fontSize: 12 }}>풀이 수</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: '#cb6ce6' }}>{problemCount}</p>
            </div>
          </div>
          <p style={{ color: isWin ? '#2ecc71' : isDraw ? '#f39c12' : '#e74c3c', fontSize: 16, marginBottom: 20, fontWeight: 700 }}>{ratingLabel}</p>
          <button onClick={() => navigate('/ranking')} style={{
            padding: '14px 40px', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 16, color: 'white',
            background: 'linear-gradient(135deg, #7c3aed, #cb6ce6)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)', transition: 'transform 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            랭킹으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg, #0f1117)', color: 'var(--theme-text, #e2e8f0)', padding: '70px 16px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        @keyframes hpDamage { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        @keyframes correctFlash { 0% { box-shadow: 0 0 0 rgba(46,204,113,0); } 50% { box-shadow: 0 0 30px rgba(46,204,113,0.6); } 100% { box-shadow: 0 0 0 rgba(46,204,113,0); } }
        @keyframes wrongFlash { 0% { box-shadow: 0 0 0 rgba(231,76,60,0); } 50% { box-shadow: 0 0 30px rgba(231,76,60,0.6); } 100% { box-shadow: 0 0 0 rgba(231,76,60,0); } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 상단: 체력바 + 타이머 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          {/* 내 체력 */}
          <div style={{ animation: damageAnim.my ? 'hpDamage 0.4s ease-in-out' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>👤 {profile?.username || 'You'}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2ecc71' }}>{myHp}/{MAX_HP}</span>
            </div>
            <div style={styles.hpBarOuter}>
              <div style={{
                ...styles.hpBarInner,
                width: `${(myHp / MAX_HP) * 100}%`,
                background: myHp > 60 ? 'linear-gradient(90deg, #2ecc71, #27ae60)' : myHp > 30 ? 'linear-gradient(90deg, #f39c12, #e67e22)' : 'linear-gradient(90deg, #e74c3c, #c0392b)',
              }} />
            </div>
          </div>

          {/* 타이머 */}
          <div style={{
            padding: '8px 20px', borderRadius: 12,
            background: battleTime <= 30 ? 'rgba(231,76,60,0.15)' : 'rgba(124,58,237,0.1)',
            border: `1px solid ${battleTime <= 30 ? 'rgba(231,76,60,0.3)' : 'rgba(124,58,237,0.2)'}`,
            textAlign: 'center', minWidth: 90
          }}>
            <div style={{ fontSize: 10, color: '#8b8fa3', marginBottom: 2 }}>남은 시간</div>
            <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Nunito', sans-serif", color: battleTime <= 30 ? '#e74c3c' : '#cb6ce6' }}>
              {formatTime(battleTime)}
            </div>
          </div>

          {/* 상대 체력 */}
          <div style={{ animation: damageAnim.opp ? 'hpDamage 0.4s ease-in-out' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{opponent?.isBot ? '🤖' : '👤'} {opponent?.username}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e74c3c' }}>{oppHp}/{MAX_HP}</span>
            </div>
            <div style={styles.hpBarOuter}>
              <div style={{
                ...styles.hpBarInner,
                width: `${(oppHp / MAX_HP) * 100}%`,
                background: oppHp > 60 ? 'linear-gradient(90deg, #e74c3c, #c0392b)' : oppHp > 30 ? 'linear-gradient(90deg, #f39c12, #e67e22)' : 'linear-gradient(90deg, #2ecc71, #27ae60)',
              }} />
            </div>
          </div>
        </div>

        {/* 문제 영역 */}
        <div style={{
          padding: '16px 20px', marginBottom: 12,
          background: 'var(--theme-surface, #1a1d27)', borderRadius: 14,
          border: '1px solid var(--theme-border, #2a2d3a)',
          animation: isCorrect === true ? 'correctFlash 0.8s ease' : isCorrect === false ? 'wrongFlash 0.8s ease' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#cb6ce6', fontFamily: "'Nunito', sans-serif" }}>
              {problem?.title || '문제 로딩 중...'}
            </h3>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: 'rgba(203,108,230,0.1)', color: '#cb6ce6', fontWeight: 600
            }}>
              #{problemCount + 1}
            </span>
          </div>
          <p style={{ color: 'var(--theme-secondary-text, #8b8fa3)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {problem?.description}
          </p>
          {problem?.input && (
            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', fontSize: 13 }}>
              <span style={{ color: '#8b8fa3' }}>입력: </span><span style={{ color: '#4ade80', fontFamily: 'monospace' }}>{problem.input}</span>
            </div>
          )}
          {problem?.output && (
            <div style={{ marginTop: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', fontSize: 13 }}>
              <span style={{ color: '#8b8fa3' }}>기대 출력: </span><span style={{ color: '#fbbf24', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{problem.output.replace(/\\n/g, '\n')}</span>
            </div>
          )}
          {problem?.hint && (
            <p style={{ marginTop: 8, fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>💡 힌트: {problem.hint}</p>
          )}
        </div>

        {/* 에디터 + 결과 영역 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* 코드 에디터 */}
          <div style={{ background: 'var(--theme-surface, #1a1d27)', borderRadius: 14, border: '1px solid var(--theme-border, #2a2d3a)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--theme-border, #2a2d3a)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8b8fa3', fontWeight: 600 }}>코드 에디터</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e74c3c' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f39c12' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2ecc71' }} />
              </div>
            </div>
            <div style={{ position: 'relative', height: 320, overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
              <div style={{
                width: 45, height: '100%', background: '#0d0d0e', color: '#4b4b4d',
                fontFamily: '"Fira Code","Courier New",monospace', fontSize: 14, lineHeight: 1.6,
                padding: '16px 0', textAlign: 'center', userSelect: 'none', borderRight: '1px solid #1c1c1e',
                zIndex: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                {code.split('\n').map((_, i) => (
                  <div key={i} style={{ color: '#4b4b4d' }}>{i + 1}</div>
                ))}
              </div>

              <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <div ref={mirrorRef} style={{
                  position: 'absolute', top: 0, left: 0, padding: 16,
                  fontFamily: '"Fira Code","Courier New",monospace', fontSize: 14, lineHeight: 1.6,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-all', visibility: 'hidden', width: '100%',
                  zIndex: -1, pointerEvents: 'none', letterSpacing: 'normal', tabSize: 4
                }} />

                {showSuggest && (
                  <div style={{
                    position: 'absolute', top: suggestPos.top, left: suggestPos.left,
                    background: '#1c1c1e', border: '1px solid #3a3a3c', borderRadius: 8,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10, minWidth: 150, maxHeight: 200, overflowY: 'auto'
                  }}>
                    {suggestions.map((s, i) => (
                      <div key={i} onMouseEnter={() => setSuggestIndex(i)} onClick={() => handleSelectSuggestion(s)}
                        style={{
                          padding: '8px 12px', cursor: 'pointer',
                          background: i === suggestIndex ? 'rgba(203, 110, 230, 0.2)' : 'transparent',
                          color: i === suggestIndex ? '#cb6ce6' : '#fff', fontSize: 14, fontFamily: 'monospace'
                        }}>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                <pre ref={preRef} style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  margin: 0, padding: 16, fontFamily: '"Fira Code","Courier New",monospace',
                  fontSize: 14, lineHeight: 1.6, tabSize: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                  background: '#0d0f14', color: '#e2e8f0', overflow: 'auto', zIndex: 1, pointerEvents: 'none',
                  letterSpacing: 'normal', boxSizing: 'border-box', textAlign: 'left'
                }}>
                  {highlightCode(code).map((tk, i) => <span key={i} style={{ color: tokenColor[tk.t] || '#e2e8f0' }}>{tk.v}</span>)}
                </pre>

                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  spellCheck={false}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    margin: 0, padding: 16, fontFamily: '"Fira Code","Courier New",monospace',
                    fontSize: 14, lineHeight: 1.6, tabSize: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    background: 'transparent', color: 'transparent', caretColor: 'white',
                    border: 'none', outline: 'none', resize: 'none', zIndex: 4, overflow: 'auto',
                    letterSpacing: 'normal', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--theme-border, #2a2d3a)', display: 'flex', gap: 8 }}>
              <button onClick={handleRun} style={{ ...styles.btn, background: 'linear-gradient(135deg, #004aad, #005cbf)' }}>▶ 실행</button>
              <button onClick={handleCheck} style={{ ...styles.btn, background: 'linear-gradient(135deg, #7c3aed, #cb6ce6)' }}>✓ 제출</button>
              <button onClick={handleReset} style={{ ...styles.btn, background: '#2a2d3a', color: '#8b8fa3' }}>↺ 초기화</button>
              <button onClick={() => handleLeaveBattle()} style={{ ...styles.btn, background: 'rgba(231,76,60,0.15)', color: '#e74c3c', marginLeft: 'auto' }}>나가기</button>
            </div>
          </div>

          {/* 결과 영역 */}
          <div style={{ background: 'var(--theme-surface, #1a1d27)', borderRadius: 14, border: '1px solid var(--theme-border, #2a2d3a)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--theme-border, #2a2d3a)' }}>
              <span style={{ fontSize: 12, color: '#8b8fa3', fontWeight: 600 }}>실행 결과</span>
            </div>
            <div style={{ flex: 1, padding: 14, overflow: 'auto' }}>
              {resultType === 'run' && output && (
                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--theme-border, #2a2d3a)' }}>
                  <p style={{ color: output.startsWith('[E') ? '#f87171' : '#4ade80', fontFamily: 'monospace', fontSize: 14, whiteSpace: 'pre-wrap' }}>{output}</p>
                </div>
              )}
              {resultType === 'check' && isCorrect !== null && (
                <div style={{
                  padding: 20, borderRadius: 12, textAlign: 'center',
                  background: isCorrect ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                  border: `1px solid ${isCorrect ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`
                }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{isCorrect ? '🎉' : '❌'}</div>
                  <p style={{ fontWeight: 800, fontSize: 18, color: isCorrect ? '#2ecc71' : '#e74c3c', fontFamily: "'Nunito', sans-serif" }}>
                    {isCorrect ? '정답! -' + DAMAGE_PER_CORRECT + ' 데미지!' : '오답! 다시 시도하세요.'}
                  </p>
                  {isCorrect && <p style={{ color: '#8b8fa3', fontSize: 13, marginTop: 6 }}>다음 문제가 곧 나옵니다...</p>}
                  {!isCorrect && output && (
                    <p style={{ color: '#f87171', fontFamily: 'monospace', fontSize: 13, marginTop: 8 }}>{output}</p>
                  )}
                </div>
              )}
              {!resultType && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: 14 }}>
                  코드를 작성하고 실행하거나 제출하세요
                </div>
              )}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--theme-border, #2a2d3a)', fontSize: 12, color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>풀이: {problemCount}문제</span>
                <span>데미지: {problemCount * DAMAGE_PER_CORRECT}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, fontFamily: "'Nunito', sans-serif" }}>배틀 포기</h3>
            <p style={{ color: 'var(--theme-secondary-text, #8b8fa3)', marginBottom: 20, fontSize: 14 }}>배틀에서 나가시면 패배 처리됩니다.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => { setShowLeaveModal(false); setExitConfirm(false); }} style={{ ...styles.btn, padding: '12px 24px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>계속하기</button>
              <button onClick={handleForfeitAndLeave} style={{ ...styles.btn, padding: '12px 24px', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>나가기 (패배)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── 스타일 ───────── */
const styles = {
  fullPage: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'var(--theme-bg, #0f1117)', color: 'var(--theme-text, #e2e8f0)'
  },
  countdownPlayer: {
    padding: 20, background: 'var(--theme-surface, #1a1d27)', borderRadius: 16,
    border: '1px solid var(--theme-border, #2a2d3a)', textAlign: 'center', minWidth: 140
  },
  rankBadge: {
    display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600
  },
  hpBarOuter: {
    width: '100%', height: 14, borderRadius: 7,
    background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
  },
  hpBarInner: {
    height: '100%', borderRadius: 7, transition: 'width 0.5s ease, background 0.5s ease',
    boxShadow: '0 0 8px rgba(0,0,0,0.3)'
  },
  editorBase: {
    margin: 0, padding: 16, fontFamily: '"Fira Code","Courier New",monospace', fontSize: 14,
    lineHeight: 1.6, tabSize: 4, whiteSpace: 'pre-wrap', boxSizing: 'border-box', width: '100%', height: '100%'
  },
  btn: {
    padding: '7px 16px', borderRadius: 8, border: 'none', color: 'white',
    fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'opacity 0.2s'
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalBox: {
    background: 'var(--theme-surface, #1a1d27)', padding: 30, borderRadius: 16,
    border: '1px solid var(--theme-border, #2a2d3a)', maxWidth: 400, textAlign: 'center'
  }
};