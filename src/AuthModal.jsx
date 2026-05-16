import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export default function AuthModal({ open, onClose, initialMode = 'login' }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError('');
      setIdentifier('');
      setEmail('');
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        if (!identifier || !password) throw new Error('아이디/이메일과 비밀번호를 입력해주세요.');
        await login({ identifier, password });
      } else {
        if (password !== passwordConfirm) throw new Error('비밀번호 확인이 일치하지 않습니다.');
        await signup({ email, username, password });
      }
      onClose();
    } catch (err) {
      setError(err.message || '문제가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onMouseDown={onClose}>
      <div className="auth-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="닫기">×</button>

        <div className="auth-modal-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            로그인
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            회원가입
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'login' ? (
            <>
              <label className="auth-label">아이디 또는 이메일</label>
              <input
                className="auth-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                autoFocus
              />
              <label className="auth-label">비밀번호</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </>
          ) : (
            <>
              <label className="auth-label">아이디</label>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="2~20자, 한글/영문/숫자/_"
                autoComplete="username"
                autoFocus
              />
              <label className="auth-label">
                이메일 <span className="auth-label-optional">(선택)</span>
              </label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="비밀번호 찾기 등에 사용 (비워둬도 됩니다)"
                autoComplete="email"
              />
              <label className="auth-label">비밀번호</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                autoComplete="new-password"
              />
              <label className="auth-label">비밀번호 확인</label>
              <input
                className="auth-input"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
          </button>
        </form>
      </div>
    </div>
  );
}
