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
  const re = /(\/\*[\s\S]*?\*\/|\/\/.*|#\w+|"[^"]*"|\b(int|char|float|double|void|if|else|for|while|return|include|define|stdio|stdlib|string|main)\b|\b\d+\b|[{}();])/g;
  let last = 0, m;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) tokens.push({ t: 'text', v: code.substring(last, m.index) });
    const v = m[0];
    if (v.startsWith('//') || v.startsWith('/*')) tokens.push({ t: 'comment', v });
    else if (v.startsWith('#')) tokens.push({ t: 'pre', v });
    else if (v.startsWith('"')) tokens.push({ t: 'str', v });
    else if (['int','char','float','double','void','if','else','for','while','return'].includes(v)) tokens.push({ t: 'kw', v });
    else if (['include','define','stdio','stdlib','string','main'].includes(v)) tokens.push({ t: 'fn', v });
    else if (/\d+/.test(v)) tokens.push({ t: 'num', v });
    else tokens.push({ t: 'punc', v });
    last = m.index + v.length;
  }
  if (last < code.length) tokens.push({ t: 'text', v: code.substring(last) });
  return tokens;
};

const tokenColor = { comment: '#6b7280', pre: '#60a5fa', str: '#4ade80', kw: '#f472b6', fn: '#fbbf24', num: '#fb923c', punc: '#94a3b8', text: '#e2e8f0' };

/* ───────── 간이 C 실행 (printf 기반) ───────── */
const simulateC = (code) => {
  const syntaxErrs = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith('//') || l.startsWith('/*') || l.startsWith('#') || l.endsWith('{') || l.endsWith('}') || l.endsWith(';'))  continue;
    if (/^(if|for|while|else|return|break|continue)/.test(l)) continue;
    if (/^\w+/.test(l) && !l.endsWith(';') && !l.endsWith('{')) {
      syntaxErrs.push(`[E2001] 세미콜론이 없습니다. (${i+1}번째 줄)`);
    }
  }
  if (syntaxErrs.length) return { ok: false, output: syntaxErrs[0] };

  // 모든 printf 추출
  const outputs = [];
  const printfRe = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"/g;
  let pm;
  while ((pm = printfRe.exec(code)) !== null) {
    let txt = pm[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
    outputs.push(txt);
  }
  if (outputs.length === 0) return { ok: false, output: '[E1002] printf 문을 찾을 수 없습니다.' };
  return { ok: true, output: outputs.join('') };
};

/* ───────── 컴포넌트 ───────── */
export default function BattleArena() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  // 매칭 상태
  const [phase, setPhase] = useState('matching'); // matching | countdown | battle | gameover
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
  const [battleResult, setBattleResult] = useState(null); // 'win' | 'lose' | 'draw'
  const [damageAnim, setDamageAnim] = useState({ my: false, opp: false });
  const [problemCount, setProblemCount] = useState(0);

  // refs
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const channelRef = useRef(null);
  const oppBotTimerRef = useRef(null);

  /* ─── 매칭 타이머 ─── */
  useEffect(() => {
    if (phase !== 'matching') return;
    const iv = setInterval(() => {
      setMatchTimer(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          // 시간 초과 → 봇 매칭
          startBotMatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line
  }, [phase]);

  /* ─── Supabase Realtime 매칭 ─── */
  useEffect(() => {
    if (phase !== 'matching') return;
    if (isDev || !user) {
      // 개발 모드: 3초 후 봇 매칭
      const t = setTimeout(() => startBotMatch(), 2000);
      return () => clearTimeout(t);
    }

    const joinQueue = async () => {
      // 큐에 등록
      await supabase.from('battle_queue').upsert({
        user_id: user.id,
        username: profile?.username || 'Player',
        score: profile?.score || 0,
        status: 'waiting',
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      // 대기중인 다른 유저 찾기
      const { data: waiting } = await supabase
        .from('battle_queue')
        .select('*')
        .eq('status', 'waiting')
        .neq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1);

      if (waiting && waiting.length > 0) {
        const opp = waiting[0];
        // 매칭 성사
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

    // Realtime subscription for queue changes
    const ch = supabase.channel('battle_queue_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'battle_queue', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.new.status === 'matched' && payload.new.room_id) {
          // Someone matched with us
          fetchOpponent(payload.new.room_id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
      // Clean up queue
      if (user) {
        supabase.from('battle_queue').delete().eq('user_id', user.id).eq('status', 'waiting');
      }
    };
    // eslint-disable-next-line
  }, [phase, user, isDev]);

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

  const subscribeToRoom = (roomId) => {
    const ch = supabase.channel(`battle_${roomId}`)
      .on('broadcast', { event: 'damage' }, (payload) => {
        // 상대가 문제를 풀었음 → 나에게 데미지
        if (payload.payload.from !== user?.id) {
          setMyHp(prev => {
            const next = Math.max(0, prev - payload.payload.amount);
            triggerDamageAnim('my');
            if (next <= 0) {
              setPhase('gameover');
              setBattleResult('lose');
            }
            return next;
          });
        }
      })
      .on('broadcast', { event: 'gameover' }, (payload) => {
        if (payload.payload.winner !== user?.id) {
          setPhase('gameover');
          setBattleResult('lose');
        }
      })
      .subscribe();
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
          setPhase('gameover');
          // 시간 종료 시 HP가 더 높은 쪽이 승리
          setBattleResult(r => {
            if (myHp > oppHp) return 'win';
            if (myHp < oppHp) return 'lose';
            return 'draw';
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, myHp, oppHp]);

  /* ─── 봇 자동 풀이 (랜덤 타이밍) ─── */
  useEffect(() => {
    if (phase !== 'battle' || !opponent?.isBot) return;
    const scheduleBotSolve = () => {
      const delay = (Math.random() * 25 + 15) * 1000; // 15~40초
      oppBotTimerRef.current = setTimeout(() => {
        // 봇이 문제를 풀었음
        setMyHp(prev => {
          const next = Math.max(0, prev - DAMAGE_PER_CORRECT);
          triggerDamageAnim('my');
          if (next <= 0) {
            setPhase('gameover');
            setBattleResult('lose');
          }
          return next;
        });
        // 다음 풀이 예약 (게임이 아직 진행 중이면)
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

  /* ─── 채점 ─── */
  const handleRun = () => {
    setResultType('run');
    const result = simulateC(code);
    setOutput(result.output);
    setIsCorrect(null);
  };

  const handleCheck = () => {
    if (!problem) return;
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
      // 상대에게 데미지
      setOppHp(prev => {
        const next = Math.max(0, prev - DAMAGE_PER_CORRECT);
        triggerDamageAnim('opp');
        if (next <= 0) {
          setPhase('gameover');
          setBattleResult('win');
          // Realtime으로 상대에게 알림
          if (channelRef.current) {
            channelRef.current.send({ type: 'broadcast', event: 'gameover', payload: { winner: user?.id } });
          }
        }
        return next;
      });

      // Realtime 데미지 전송
      if (channelRef.current) {
        channelRef.current.send({ type: 'broadcast', event: 'damage', payload: { from: user?.id, amount: DAMAGE_PER_CORRECT } });
      }

      // 새 문제
      setProblemCount(c => c + 1);
      setTimeout(() => {
        const np = getRandomBattleProblem(usedIds);
        setProblem(np);
        setUsedIds(prev => [...prev, np.originalId || np.id]);
        setCode(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
        setOutput('');
        setIsCorrect(null);
        setResultType(null);
      }, 1200);
    }
  };

  const handleReset = () => {
    setCode(`#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n}`);
    setOutput('');
    setIsCorrect(null);
    setResultType(null);
  };

  /* ─── 나가기 ─── */
  const handleLeaveBattle = useCallback(async () => {
    clearTimeout(oppBotTimerRef.current);
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    if (!isDev && user) {
      await supabase.from('battle_queue').delete().eq('user_id', user.id);
    }
    setShowLeaveModal(false);
    navigate('/ranking');
  }, [user, isDev, navigate]);

  useEffect(() => {
    const h = (e) => { if (phase === 'battle') { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [phase]);

  /* ─── 에디터 키 핸들러 ─── */
  const handleKeyDown = (e) => {
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

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ═══════════════════ RENDER ═══════════════════ */

  // ─── 매칭 중 ───
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
          {/* 펄스 링 */}
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

  // ─── 카운트다운 ───
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
            fontSize: countdown === 0 ? '3rem' : '6rem', fontWeight: 900,
            fontFamily: "'Nunito', sans-serif",
            background: 'linear-gradient(135deg, #cb6ce6, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'countBounce 0.6s ease-out'
          }}>
            {countdown === 0 ? 'FIGHT!' : countdown}
          </div>
        </div>
      </div>
    );
  }

  // ─── 게임 오버 ───
  if (phase === 'gameover') {
    const isWin = battleResult === 'win';
    const isDraw = battleResult === 'draw';
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

  // ─── 배틀 메인 ───
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
              <span style={{ color: '#8b8fa3' }}>기대 출력: </span><span style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{problem.output.replace(/\\n/g, '↵')}</span>
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
            <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
              <pre ref={preRef} style={{
                ...styles.editorBase,
                position: 'absolute', inset: 0, pointerEvents: 'none',
                color: 'transparent', background: 'transparent', overflow: 'hidden', zIndex: 1
              }}>
                {highlightCode(code).map((tk, i) => <span key={i} style={{ color: tokenColor[tk.t] || '#e2e8f0' }}>{tk.v}</span>)}
              </pre>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                spellCheck={false}
                style={{
                  ...styles.editorBase,
                  position: 'absolute', inset: 0,
                  background: '#0d0f14', color: 'transparent', caretColor: 'white',
                  border: 'none', outline: 'none', resize: 'none', zIndex: 2, overflow: 'auto'
                }}
              />
            </div>
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--theme-border, #2a2d3a)', display: 'flex', gap: 8 }}>
              <button onClick={handleRun} style={{ ...styles.btn, background: 'linear-gradient(135deg, #004aad, #005cbf)' }}>▶ 실행</button>
              <button onClick={handleCheck} style={{ ...styles.btn, background: 'linear-gradient(135deg, #7c3aed, #cb6ce6)' }}>✓ 제출</button>
              <button onClick={handleReset} style={{ ...styles.btn, background: '#2a2d3a', color: '#8b8fa3' }}>↺ 초기화</button>
              <button onClick={() => setShowLeaveModal(true)} style={{ ...styles.btn, background: 'rgba(231,76,60,0.15)', color: '#e74c3c', marginLeft: 'auto' }}>나가기</button>
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
            {/* 배틀 로그 */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--theme-border, #2a2d3a)', fontSize: 12, color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>풀이: {problemCount}문제</span>
                <span>데미지: {problemCount * DAMAGE_PER_CORRECT}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 나가기 모달 */}
      {showLeaveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, fontFamily: "'Nunito', sans-serif" }}>배틀 포기 시 패배 처리됩니다</h3>
            <p style={{ color: 'var(--theme-secondary-text, #8b8fa3)', marginBottom: 20, fontSize: 14 }}>정말 배틀에서 나가시겠습니까?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setShowLeaveModal(false)} style={{ ...styles.btn, padding: '12px 24px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>계속하기</button>
              <button onClick={handleLeaveBattle} style={{ ...styles.btn, padding: '12px 24px', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>나가기 (패배)</button>
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