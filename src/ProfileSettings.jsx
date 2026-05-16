import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

export default function ProfileSettings() {
  const { user, profile, loading, logout, session } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: '저장에 실패했습니다: ' + error.message });
    } else {
      setMessage({ type: 'success', text: '프로필이 저장되었습니다.' });
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    if (!window.confirm('모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
      return;
    }

    try {
      const token = session?.access_token;
      if (!token) {
        alert('세션 토큰을 찾을 수 없습니다.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        alert('계정이 성공적으로 삭제되었습니다.');
        await logout();
      } else {
        const data = await response.json();
        alert(data.error || '계정 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('계정 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="text-gradient" style={{ fontSize: '24px' }}>로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '36px', marginBottom: '20px' }}>설정</h1>
        <p style={{ color: 'var(--theme-secondary-text)' }}>로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '100px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-gradient" style={{ fontSize: '36px', marginBottom: '30px' }}>설정</h1>

        <div style={{
          background: 'var(--theme-surface)',
          borderRadius: '16px',
          border: '1px solid var(--theme-border)',
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--theme-border)',
            background: 'var(--theme-bg)'
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '15px 25px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'profile' ? 'bold' : 'normal',
                color: activeTab === 'profile' ? 'var(--tesla-blue)' : 'var(--theme-secondary-text)',
                borderBottom: activeTab === 'profile' ? '2px solid var(--tesla-blue)' : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              프로필 수정
            </button>
            <button
              onClick={() => setActiveTab('account')}
              style={{
                padding: '15px 25px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'account' ? 'bold' : 'normal',
                color: activeTab === 'account' ? 'var(--tesla-blue)' : 'var(--theme-secondary-text)',
                borderBottom: activeTab === 'account' ? '2px solid var(--tesla-blue)' : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              계정
            </button>
          </div>

          <div style={{ padding: '30px' }}>
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--theme-text)',
                    fontWeight: '500'
                  }}>
                    표시 이름
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="다른 사용자에게 표시될 이름"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: '1px solid var(--theme-border)',
                      background: 'var(--theme-bg)',
                      color: 'var(--theme-text)',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--theme-text)',
                    fontWeight: '500'
                  }}>
                    아이디
                  </label>
                  <input
                    type="text"
                    value={profile?.username || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: '1px solid var(--theme-border)',
                      background: 'var(--theme-surface)',
                      color: 'var(--theme-secondary-text)',
                      fontSize: '16px'
                    }}
                  />
                  <p style={{ color: 'var(--theme-secondary-text)', fontSize: '12px', marginTop: '5px' }}>
                    아이디는 변경할 수 없습니다.
                  </p>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--theme-text)',
                    fontWeight: '500'
                  }}>
                    자기소개
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="자기소개를 입력하세요"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: '1px solid var(--theme-border)',
                      background: 'var(--theme-bg)',
                      color: 'var(--theme-text)',
                      fontSize: '16px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {message && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    background: message.type === 'error' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                    color: message.type === 'error' ? '#e74c3c' : '#2ecc71',
                    fontSize: '14px'
                  }}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '12px 30px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--paradox-gradient)',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
              </form>
            )}

            {activeTab === 'account' && (
              <div>
                <h3 style={{ marginBottom: '20px', color: 'var(--theme-text)' }}>계정 정보</h3>
                <div style={{
                  background: 'var(--theme-bg)',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '25px',
                  border: '1px solid var(--theme-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--theme-secondary-text)' }}>아이디</span>
                    <span style={{ color: 'var(--theme-text)' }}>{profile?.username}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--theme-secondary-text)' }}>이메일</span>
                    <span style={{ color: 'var(--theme-text)' }}>{user.email || '미설정'}</span>
                  </div>
                </div>

                <h3 style={{ marginBottom: '20px', color: 'var(--theme-text)' }}>계정 관리</h3>
                <button
                  onClick={logout}
                  style={{
                    padding: '12px 30px',
                    borderRadius: '10px',
                    border: '1px solid var(--theme-border)',
                    background: 'var(--theme-bg)',
                    color: 'var(--theme-text)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  로그아웃
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '12px 30px',
                    borderRadius: '10px',
                    border: '1px solid #e74c3c',
                    background: 'transparent',
                    color: '#e74c3c',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  계정 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}