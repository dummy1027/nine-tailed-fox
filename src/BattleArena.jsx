import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

const RANK_ORDER = ['beginner', 'veteran', 'expert', 'master', 'grandmaster'];
const RANK_COLORS = {
  beginner: '#95a5a6',
  veteran: '#3498db',
  expert: '#9b59b6',
  master: '#f39c12',
  grandmaster: '#e74c3c'
};

export default function BattleArena() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [opponent, setOpponent] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [battleState, setBattleState] = useState('loading');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const isDev = import.meta.env.DEV;

  const getRank = (score) => {
    if (score < 100) return 'beginner';
    if (score < 300) return 'veteran';
    if (score < 600) return 'expert';
    if (score < 1000) return 'master';
    return 'grandmaster';
  };

  const handleLeaveBattle = useCallback(async () => {
    if (!isDev && user) {
      try {
        await supabase.from('battle_queue').update({ status: 'lost' }).eq('user_id', user.id).eq('status', 'matched');
      } catch (err) {
        console.error('Leave battle error:', err);
      }
    }
    setShowLeaveModal(false);
    navigate('/ranking');
  }, [user, isDev, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (battleState === 'ready') {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [battleState]);

  useEffect(() => {
    const handlePopState = () => {
      if (battleState === 'ready') {
        setShowLeaveModal(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [battleState]);

  useEffect(() => {
    const findMatch = async () => {
      if (!user && !isDev) {
        navigate('/ranking');
        return;
      }

      try {
        if (isDev) {
          setOpponent({
            username: 'DevOpponent',
            score: 500,
            rank_title: 'expert',
            rating: 1500,
            streak: 5
          });
          setBattleState('ready');
          setLoading(false);
          return;
        }

        const { data: matchData } = await supabase
          .from('battle_queue')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'matched')
          .maybeSingle();

        if (matchData) {
          const { data: opponentData } = await supabase
            .from('battle_queue')
            .select('*')
            .eq('status', 'matched')
            .neq('user_id', user.id)
            .maybeSingle();

          if (opponentData) {
            setOpponent(opponentData);
            setBattleState('ready');
          }
        }

        const { data: problems } = await supabase
          .from('items')
          .select('*')
          .limit(10);

        if (problems && problems.length > 0) {
          const randomProblem = problems[Math.floor(Math.random() * problems.length)];
          setProblem(randomProblem);
        }

        setLoading(false);
      } catch (err) {
        console.error('Battle arena error:', err);
        setLoading(false);
      }
    };

    findMatch();
  }, [user, navigate, isDev]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>⚔️</div>
          <h2 style={{ fontSize: '1.5rem' }}>배틀 아레나 로딩 중...</h2>
        </div>
      </div>
    );
  }

  if (!isDev && (battleState === 'loading' || !opponent)) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>😕</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>매칭된 상대가 없습니다</h2>
          <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '25px' }}>랭킹에서 다시 배틀에 참여해주세요.</p>
          <Link to="/ranking" style={{ padding: '12px 30px', backgroundColor: '#004aad', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: '600' }}>
            랭킹으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '80px 20px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }} className="text-gradient">⚔️ Battle Arena</h1>
          <button onClick={() => setShowLeaveModal(true)} style={{ padding: '10px 20px', backgroundColor: 'var(--theme-surface)', borderRadius: '10px', color: 'var(--theme-text)', textDecoration: 'none', border: '1px solid var(--theme-border)', cursor: 'pointer' }}>
            ← 나가기
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '2px solid #2ecc71', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👤</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>나</h3>
            <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px' }}>{user?.username || 'Player1'}</p>
            <span style={{
              marginTop: '8px', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
              backgroundColor: `${RANK_COLORS[getRank(profile?.score || 0)]}20`,
              color: RANK_COLORS[getRank(profile?.score || 0)]
            }}>
              {getRank(profile?.score || 0)}
            </span>
            <p style={{ marginTop: '10px', fontSize: '14px', color: 'var(--theme-secondary-text)' }}>
              점수: {profile?.score || 0}
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '2px solid #e74c3c', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👤</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>상대</h3>
            <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px' }}>{opponent.username}</p>
            <span style={{
              marginTop: '8px', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
              backgroundColor: `${RANK_COLORS[opponent.rank_title] || '#95a5a6'}20`,
              color: RANK_COLORS[opponent.rank_title] || '#95a5a6'
            }}>
              {opponent.rank_title || 'beginner'}
            </span>
            <p style={{ marginTop: '10px', fontSize: '14px', color: 'var(--theme-secondary-text)' }}>
              점수: {opponent.score}
            </p>
          </div>
        </div>

        <div style={{ padding: '30px', backgroundColor: 'var(--theme-surface)', borderRadius: '16px', border: '1px solid var(--theme-border)' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '15px', textAlign: 'center' }}>문제</h2>
          {problem ? (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#cb6ce6' }}>{problem.name}</h3>
              <p style={{ color: 'var(--theme-secondary-text)', lineHeight: '1.6' }}>{problem.description}</p>
              <button
                onClick={() => navigate('/c-preview')}
                style={{
                  marginTop: '20px', padding: '12px 30px', borderRadius: '10px',
                  backgroundColor: '#004aad', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer'
                }}
              >
                코드 작성하기
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--theme-secondary-text)' }}>문제를 불러오는 중...</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{
            padding: '15px 25px',
            backgroundColor: 'var(--theme-surface)',
            borderRadius: '12px',
            border: '1px solid var(--theme-border)',
            display: 'inline-block'
          }}>
            <span style={{ color: 'var(--theme-secondary-text)', fontSize: '14px' }}>제한 시간: </span>
            <span style={{ fontWeight: '700', color: '#e74c3c' }}>30:00</span>
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--theme-surface)', padding: '30px', borderRadius: '16px',
            border: '1px solid var(--theme-border)', maxWidth: '400px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>배틀 포기 시 패배 처리됩니다</h3>
            <p style={{ color: 'var(--theme-secondary-text)', marginBottom: '25px' }}>
              정말 배틀에서 나가시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLeaveModal(false)}
                style={{
                  padding: '12px 25px', borderRadius: '10px',
                  backgroundColor: '#2ecc71', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer'
                }}
              >
                남기
              </button>
              <button
                onClick={handleLeaveBattle}
                style={{
                  padding: '12px 25px', borderRadius: '10px',
                  backgroundColor: '#e74c3c', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer'
                }}
              >
                나가기 (패배)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}