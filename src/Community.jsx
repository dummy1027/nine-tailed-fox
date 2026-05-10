import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'detail', 'write'
  const [selectedPost, setSelectedPost] = useState(null);

  // New post form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [alignment, setAlignment] = useState('left');
  const [likedPosts, setLikedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'views', 'likes'
  const [searchParams, setSearchParams] = useSearchParams();

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('paradox_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Mock data
      const mockPosts = [
        { id: 1, title: 'C언어 포인터가 너무 어려워요 ㅜㅜ', author: '초보개발자', content: '포인터 개념이 너무 헷갈리는데 쉽게 설명해주실 분 계신가요?', date: '2026-05-10', views: 125, likes: 12 },
        { id: 2, title: 'Paradox 프로젝트 완성했습니다!', author: '고수C', content: '드디어 테슬라 스타일의 멋진 사이트를 완성했네요. 다들 구경오세요!', date: '2026-05-09', views: 342, likes: 56 },
        { id: 3, title: '오늘의 알고리즘 퀴즈', author: '운영자', content: '배열을 뒤집는 가장 효율적인 방법은 무엇일까요?', date: '2026-05-08', views: 89, likes: 5 }
      ];
      setPosts(mockPosts);
      localStorage.setItem('paradox_posts', JSON.stringify(mockPosts));
    }

    const savedLikes = localStorage.getItem('paradox_liked_posts');
    if (savedLikes) {
      setLikedPosts(JSON.parse(savedLikes));
    }
  }, []);

  // URL 파라미터가 변경될 때마다(또는 처음 로드될 때) 해당 게시글 열기
  useEffect(() => {
    const postId = searchParams.get('id');
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === parseInt(postId));
      if (post) {
        setSelectedPost(post);
        setView('detail');
      }
    } else if (!postId && view === 'detail') {
      setView('list');
    }
  }, [searchParams, posts]);

  const savePost = () => {
    if (!title || !content || !author) {
      alert('모든 필드를 입력해주세요!');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      author,
      content,
      textAlign: alignment,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('paradox_posts', JSON.stringify(updatedPosts));

    // Reset form and go back to list
    setTitle('');
    setContent('');
    setAuthor('');
    setView('list');
  };

  const openDetail = (post) => {
    setSearchParams({ id: post.id });
    // setView('detail')과 setSelectedPost(post)는 useEffect에서 자동으로 처리됨

    // 조회수 업데이트
    const updatedPosts = posts.map(p =>
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('paradox_posts', JSON.stringify(updatedPosts));
  };

  const handleLike = (postId) => {
    // 이미 좋아요를 누른 글인지 확인
    if (likedPosts.includes(postId)) {
      alert('이미 좋아요를 누른 게시글입니다.');
      return;
    }

    const updatedPosts = posts.map(p =>
      p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('paradox_posts', JSON.stringify(updatedPosts));

    // 좋아요 목록 업데이트
    const newLikedPosts = [...likedPosts, postId];
    setLikedPosts(newLikedPosts);
    localStorage.setItem('paradox_liked_posts', JSON.stringify(newLikedPosts));

    // 상세 보기 중인 경우 selectedPost도 업데이트
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, likes: (selectedPost.likes || 0) + 1 });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('게시글 링크가 클립보드에 복사되었습니다! 원하는 곳에 붙여넣기 하세요.');
    }).catch(err => {
      console.error('링크 복사 실패:', err);
    });
  };

  const renderList = () => {
    const sortedPosts = [...posts].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      return b.id - a.id; // 기본 최신순 (ID가 클수록 최신)
    });

    return (
      <div style={{ animation: 'fadeIn 0.5s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }} className="text-gradient">커뮤니티</h1>
          <button
            onClick={() => setView('write')}
            style={{
              padding: '12px 25px',
              borderRadius: '10px',
              backgroundColor: '#cb6ce6',
              color: 'white',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(203, 110, 230, 0.3)'
            }}
          >
            글쓰기
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[
            { id: 'latest', label: '최신순' },
            { id: 'views', label: '조회순' },
            { id: 'likes', label: '좋아요순' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSortBy(tab.id)}
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                backgroundColor: sortBy === tab.id ? 'var(--theme-surface)' : 'transparent',
                color: sortBy === tab.id ? '#cb6ce6' : 'var(--theme-secondary-text)',
                border: '1px solid ' + (sortBy === tab.id ? '#cb6ce6' : 'var(--theme-border)'),
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--theme-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--theme-border)', color: 'var(--theme-secondary-text)', fontSize: '14px' }}>
                <th style={{ padding: '20px' }}>제목</th>
                <th style={{ padding: '20px' }}>작성자</th>
                <th style={{ padding: '20px' }}>날짜</th>
                <th style={{ padding: '20px' }}>조회</th>
                <th style={{ padding: '20px' }}>좋아요</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map(post => (
                <tr
                  key={post.id}
                  onClick={() => openDetail(post)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid var(--theme-border)', transition: 'background 0.2s', color: 'var(--theme-text)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-border)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '20px', fontWeight: '500' }}>{post.title}</td>
                  <td style={{ padding: '20px', color: 'var(--theme-secondary-text)' }}>{post.author}</td>
                  <td style={{ padding: '20px', color: 'var(--theme-secondary-text)', fontSize: '14px' }}>{post.date}</td>
                  <td style={{ padding: '20px', color: 'var(--theme-secondary-text)', fontSize: '14px' }}>{post.views}</td>
                  <td style={{ padding: '20px', color: '#cb6ce6', fontSize: '14px', fontWeight: 'bold' }}>❤️ {post.likes || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDetail = () => (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <button
        onClick={() => setSearchParams({})}
        style={{ background: 'none', border: 'none', color: 'var(--theme-secondary-text)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        ← 목록으로 돌아가기
      </button>

      <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '20px', padding: '40px', border: '1px solid var(--theme-border)', color: 'var(--theme-text)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>{selectedPost.title}</h2>
        <div style={{ display: 'flex', gap: '20px', color: 'var(--theme-secondary-text)', fontSize: '14px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--theme-border)' }}>
          <span>작성자: <b>{selectedPost.author}</b></span>
          <span>날짜: {selectedPost.date}</span>
          <span>조회수: {selectedPost.views}</span>
          <span>좋아요: {selectedPost.likes || 0}</span>
        </div>
        <div style={{
          lineHeight: '1.8',
          fontSize: '18px',
          color: 'var(--theme-text)',
          whiteSpace: 'pre-wrap',
          textAlign: selectedPost.textAlign || 'left'
        }}>
          {selectedPost.content}
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button
          className="paradox-button"
          onClick={() => handleLike(selectedPost.id)}
          disabled={likedPosts.includes(selectedPost.id)}
          style={{
            padding: '12px 25px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: likedPosts.includes(selectedPost.id) ? 0.6 : 1,
            cursor: likedPosts.includes(selectedPost.id) ? 'default' : 'pointer',
            background: likedPosts.includes(selectedPost.id) ? '#2c2c2e' : 'var(--paradox-gradient)'
          }}
        >
          <span style={{ fontSize: '18px' }}>{likedPosts.includes(selectedPost.id) ? '💖' : '❤️'}</span>
          {likedPosts.includes(selectedPost.id) ? '좋아요 완료' : '좋아요'} {selectedPost.likes || 0}
        </button>
        <button
          onClick={handleShare}
          style={{
            background: 'none',
            border: '1px solid var(--theme-border)',
            color: 'var(--theme-text)',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{ fontSize: '18px' }}>🔗</span> 공유하기
        </button>
      </div>
    </div>
  );

  const renderWrite = () => (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', fontWeight: '800' }}>새 글 작성</h1>

      <div style={{ backgroundColor: 'var(--theme-surface)', borderRadius: '20px', padding: '40px', border: '1px solid var(--theme-border)', color: 'var(--theme-text)' }}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', color: 'var(--theme-secondary-text)', marginBottom: '10px', fontSize: '14px' }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: 'var(--theme-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text)', fontSize: '16px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', color: 'var(--theme-secondary-text)', marginBottom: '10px', fontSize: '14px' }}>작성자</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="닉네임"
            style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: 'var(--theme-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text)', fontSize: '16px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ color: 'var(--theme-secondary-text)', fontSize: '14px' }}>내용</label>
            <div style={{ display: 'flex', gap: '5px', backgroundColor: 'var(--theme-bg)', padding: '5px', borderRadius: '8px', border: '1px solid var(--theme-border)' }}>
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => setAlignment(align)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: alignment === align ? 'var(--theme-surface)' : 'transparent',
                    color: alignment === align ? '#cb6ce6' : 'var(--theme-secondary-text)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 작성해주세요"
            style={{
              width: '100%',
              height: '300px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: 'var(--theme-bg)',
              border: '1px solid var(--theme-border)',
              color: 'var(--theme-text)',
              fontSize: '16px',
              outline: 'none',
              resize: 'none',
              lineHeight: '1.6',
              textAlign: alignment
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={savePost}
            style={{ padding: '15px 40px', borderRadius: '10px', backgroundColor: '#cb6ce6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            등록하기
          </button>
          <button
            onClick={() => setView('list')}
            style={{ padding: '15px 40px', borderRadius: '10px', backgroundColor: '#2c2c2e', color: '#8e8e93', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '100px 20px' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--theme-text) 0%, var(--theme-secondary-text) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {view === 'list' && renderList()}
        {view === 'detail' && renderDetail()}
        {view === 'write' && renderWrite()}
      </div>
    </div>
  );
};

export default Community;
