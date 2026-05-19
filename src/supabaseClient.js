import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 👈 src/supabaseClient.js 파일을 불러옵니다
import './Ranking.css';

function Ranking() {
  const [searchQuery, setSearchQuery] = useState(''); // 검색창 입력값 상태
  const [rankingList, setRankingList] = useState([]); // DB에서 가져온 랭킹 목록
  const [loading, setLoading] = useState(false);      // 로딩 애니메이션용 상태

  // Supabase에서 실시간으로 랭킹 및 검색 데이터를 가져오는 함수
  const fetchRankingData = async (searchWord = '') => {
    setLoading(true);
    try {
      // 1. 기본 쿼리: 'profiles' 테이블에서 점수(score)가 높은 순으로 정렬해서 가져옴
      let query = supabase
        .from('profiles')
        .select('username, score, tier')
        .order('score', { ascending: false });

      // 2. 사용자가 검색창에 뭔가를 입력했다면 해당 유저만 필터링 (ilike는 대소문자 무시)
      if (searchWord.trim() !== '') {
        query = query.ilike('username', `%${searchWord}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // 3. 가져온 순서대로 1위, 2위... 순위(rank) 번호를 매겨서 상태에 저장
      const calculatedRank = data.map((user, index) => ({
        rank: index + 1,
        ...user
      }));

      setRankingList(calculatedRank);
    } catch (error) {
      console.error('랭킹 데이터를 가져오는데 실패했습니다:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색어가 바뀔 때마다 Supabase DB에 실시간으로 다시 요청 보냄
  useEffect(() => {
    fetchRankingData(searchQuery);
  }, [searchQuery]);

  // 매치 버튼 클릭 이벤트
  const handleMatchStart = (type) => {
    alert(`${type} 매치를 준비 중입니다!`);
  };

  return (
    <div className="ranking-container">
      <h1 className="ranking-title">실시간 랭킹</h1>

      {/* ⚔️ 매치 버튼 영역 */}
      <div className="match-button-container">
        <button className="match-btn active-match" onClick={() => handleMatchStart('일반')}>
          일반 매치
        </button>
        <button className="match-btn private-match" onClick={() => handleMatchStart('비공개')}>
          비공개 매치
        </button>
      </div>

      {/* 🔍 매치 버튼 밑 사용자 검색창 */}
      <div className="search-box-container">
        <input
          type="text"
          className="user-search-input"
          placeholder="검색할 유저의 닉네임을 입력하세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-btn" onClick={() => setSearchQuery('')}>초기화</button>
        )}
      </div>

      {/* 🏆 랭킹 리스트 결과창 */}
      <div className="ranking-list">
        {loading ? (
          <div className="loading-box">유저 정보를 조회하는 중... 🚀</div>
        ) : rankingList.length > 0 ? (
          rankingList.map((user) => (
            <div key={user.username} className="ranking-item">
              <span className="user-rank">{user.rank}위</span>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-tier">{user.tier || 'Unranked'}</span>
              </div>
              <span className="user-score">{user.score} 점</span>
            </div>
          ))
        ) : (
          <div className="no-result">
            "<strong>{searchQuery}</strong>"에 해당하는 사용자가 없습니다. 😥
          </div>
        )}
      </div>
    </div>
  );
}

export default Ranking;