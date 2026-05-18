import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const queryUsername = searchParams.get('username');
  const [stats, setStats] = useState({ posts: 0, comments: 0 });
  const [viewedProfile, setViewedProfile] = useState(null);
  const [viewedStats, setViewedStats] = useState({ posts: 0, comments: 0 });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchViewedProfile = async () => {
      setProfileLoading(true);
      // username 또는 display_name으로 프로필 검색 (게시물 작성자가 display_name으로 저장될 수 있으므로)
      let { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, created_at, solved_problems')
        .eq('username', queryUsername)
        .maybeSingle();

      if (error) {
        console.warn('Failed to load viewed profile with solved_problems column, falling back...', error.message);
        const fallback = await supabase
          .from('profiles')
          .select('id, username, display_name, bio, created_at, solved_problems')
          .eq('username', queryUsername)
          .maybeSingle();
        data = fallback.data;
      }

      // username으로 못 찾으면 display_name으로 재검색
      if (!data) {
        let result = await supabase
          .from('profiles')
          .select('id, username, display_name, bio, created_at, solved_problems')
          .eq('display_name', queryUsername)
          .maybeSingle();
        data = result.data;
        
        if (result.error) {
          console.warn('Failed to load viewed profile with solved_problems column, falling back...', result.error.message);
          const fallback = await supabase
            .from('profiles')
            .select('id, username, display_name, bio, created_at, solved_problems')
            .eq('display_name', queryUsername)
            .maybeSingle();
          data = fallback.data;
        }
      }
      setViewedProfile(data);
      console.log('[DEBUG fetchViewedProfile] setViewedProfile called with:', data);

      if (data) {
        const { count: postCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('author', data.display_name || data.username);

        const { count: commentCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('author', data.display_name || data.username);

        setViewedStats({ posts: postCount || 0, comments: commentCount || 0 });
      }
      setProfileLoading(false);
    };

    if (queryUsername) {
      if (!profile || queryUsername !== profile.username) {
        fetchViewedProfile();
      }
    } else {
      setViewedProfile(null);
      setViewedStats({ posts: 0, comments: 0 });
    }
  }, [queryUsername, profile]);

  const isOwnProfile = !queryUsername || (profile && queryUsername === profile.username);
  const displayProfile = isOwnProfile ? profile : viewedProfile;
  const displayStats = isOwnProfile ? stats : viewedStats;
  
  // 해결한 문제 수 계산: 본인 프로필일 때는 로컬스토리지 우선(실시간 반영용), 그 외에는 DB의 solved_problems 배열 우선
  const getSolvedCount = () => {
    console.log('[DEBUG getSolvedCount] isOwnProfile:', isOwnProfile, 'queryUsername:', queryUsername);
    console.log('[DEBUG getSolvedCount] viewedProfile:', viewedProfile);
    console.log('[DEBUG getSolvedCount] viewedProfile?.solved_problems:', viewedProfile?.solved_problems);
    if (isOwnProfile) {
      const saved = localStorage.getItem('paradox_solved');
      if (saved) return JSON.parse(saved).length;
      return profile?.solved_problems?.length || 0;
    }
    return viewedProfile?.solved_problems?.length || 0;
  };

  const displaySolvedCount = getSolvedCount();

  useEffect(() => {
    if (!user || !profile) return;

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

    fetchStats();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="text-gradient" style={{ fontSize: '24px' }}>로딩 중...</div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="text-gradient" style={{ fontSize: '24px' }}>로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '36px', marginBottom: '20px' }}>프로필</h1>
        <p style={{ color: 'var(--theme-secondary-text)' }}>로그인이 필요합니다.</p>
      </div>
    );
  }

  if (!isOwnProfile && !viewedProfile && queryUsername && !profileLoading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '36px', marginBottom: '20px' }}>프로필</h1>
        <p style={{ color: 'var(--theme-secondary-text)' }}>존재하지 않는 사용자입니다.</p>
      </div>
    );
  }

  const joinDate = displayProfile?.created_at ? new Date(displayProfile.created_at).toLocaleDateString('ko-KR', {
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
              {displayProfile?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="text-gradient" style={{ fontSize: '32px', marginBottom: '5px' }}>
                {displayProfile?.display_name || displayProfile?.username}
              </h1>
              <p style={{ color: 'var(--theme-secondary-text)', fontSize: '16px' }}>
                @{displayProfile?.username}
              </p>
              {!isOwnProfile && (
                <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px', marginTop: '5px' }}>
                  ({queryUsername}님의 프로필)
                </p>
              )}
              <p style={{ color: 'var(--theme-secondary-text)', fontSize: '14px', marginTop: '10px' }}>
                가입일: {joinDate}
              </p>
              {displayProfile?.bio && (
                <p style={{ color: 'var(--theme-text)', fontSize: '15px', marginTop: '15px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {displayProfile?.bio}
                </p>
              )}
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--tesla-blue)' }}>{displayStats.posts}</div>
            <div style={{ color: 'var(--theme-secondary-text)', marginTop: '5px' }}>게시글</div>
          </div>
          <div style={{
            background: 'var(--theme-surface)',
            borderRadius: '16px',
            padding: '25px',
            textAlign: 'center',
            border: '1px solid var(--theme-border)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--tesla-blue)' }}>{displayStats.comments}</div>
            <div style={{ color: 'var(--theme-secondary-text)', marginTop: '5px' }}>댓글</div>
          </div>
          <div style={{
              background: 'var(--theme-surface)',
              borderRadius: '16px',
              padding: '25px',
              textAlign: 'center',
              border: '1px solid var(--theme-border)'
            }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--tesla-blue)' }}>{displaySolvedCount}</div>
            <div style={{ color: 'var(--theme-secondary-text)', marginTop: '5px' }}>해결한 문제</div>
            </div>
        </div>

        {isOwnProfile && (
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
                <span style={{ color: 'var(--theme-text)' }}>{profile?.username}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--theme-secondary-text)' }}>이메일</span>
                <span style={{ color: 'var(--theme-text)' }}>{user.email || '미설정'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}