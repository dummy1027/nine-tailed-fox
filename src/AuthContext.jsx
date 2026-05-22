import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, solved_problems, score, rating')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Failed to load profile with solved_problems column, falling back...', error.message);
        const fallback = await supabase
          .from('profiles')
          .select('id, username, display_name, bio')
          .eq('id', userId)
          .maybeSingle();
        data = fallback.data;
      }
      setProfile(data || null);
    } catch (err) {
      console.error('loadProfile error:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.id) {
        loadProfile(data.session.user.id);
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user?.id) {
        loadProfile(s.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async ({ identifier, password }) => {
    let email = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmail) {
      const r = await fetch(`${API_BASE}/api/auth/lookup-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error || '존재하지 않는 계정입니다.');
      email = b.email;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = /invalid|credentials/i.test(error.message)
        ? '아이디/이메일 또는 비밀번호가 올바르지 않습니다.' : error.message;
      throw new Error(msg);
    }
  }, []);

  const signup = useCallback(async ({ email, username, password }) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email || null, username, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || '회원가입에 실패했습니다.');
    // 가입 직후 자동 로그인: 이메일이 없으면 username 으로 진행
    await login({ identifier: email || username, password });
    return body.user;
  }, [login]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, profile, setProfile, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return ctx;
}
