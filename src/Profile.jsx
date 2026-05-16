import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState({ posts: 0, comments: 0 });
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author', profile?.username);

      const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('author', profile?.username);

      setStats({ posts: postCount || 0, comments: commentCount || 0 });
    };

    const saved = localStorage.getItem('paradox_solved');
    setSolvedCount(saved ? JSON.parse(saved).length : 0);

    fetchStats();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="text-gradient" style={{ fontSize: '24px' }}>로딩 중...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '36px', marginBottom: '20px' }}>프로필</h1>
        <p style={{ color: 'var(--theme-secondary-text)' }}>로그인이 필요합니다.</p>
      </div>
    );
  }

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '알 수 없음';

  return (
    <div className="container" style={{ padding: '100px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="profile-header" style={{
          background: 'var(--theme-surface)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid var(--theme-border)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'var(--paradox-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {profile.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="text-gradient" style={{ fontSize: '32px', marginBottom: '5px' }}>
                {profile.display_name || profile.username}
              </h1>
              <p style={{ color: 'var(--theme-secondary-text)', fontSize: '16px' }}>
                @{profile.username}
              </p>
              <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px', marginTop: '10px' }}>
                가입일: {joinDate}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            background: 'var(--theme-surface)',
            borderRadius: '16px',
            padding: '25px',
            textAlign: 'center',
            border: '1px solid var(--theme-border)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--tesla-blue)' }}>{stats.posts}</div>
            <div style={{ color: 'var(--theme-secondary-text)', marginTop: '5px' }}>게시글</div>
          </div>
          <div style={{
            background: 'var(--theme-surface)',
            borderRadius: '16px',
            padding: '25px',
            textAlign: 'center',
            border: '1px solid var(--theme-border)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--tesla-blue)' }}>{stats.comments}</div>
            <div style={{ color: 'var(--theme-secondary-text)', marginTop: '5px' }}>댓글</div>
          </div>
          <div style={{
            background: 'var(--theme-surface)',
            borderRadius: '16px',
            padding: '25px',
            textAlign: 'center',
            border: '1px solid var(--theme-border)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--tesla-blue)' }}>{solvedCount}</div>
            <div style={{ color: 'var(--theme-secondary-text)', marginTop: '5px' }}>해결한 문제</div>
          </div>
        </div>

        <div style={{
          background: 'var(--theme-surface)',
          borderRadius: '16px',
          padding: '25px',
          border: '1px solid var(--theme-border)'
        }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--theme-text)' }}>계정 정보</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--theme-secondary-text)' }}>아이디</span>
              <span style={{ color: 'var(--theme-text)' }}>{profile.username}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--theme-secondary-text)' }}>이메일</span>
              <span style={{ color: 'var(--theme-text)' }}>{user.email || '미설정'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}