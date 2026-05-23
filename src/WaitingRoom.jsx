import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

export default function WaitingRoom() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { code } = useParams(); // URL이 /room/:code 구조라고 가정합니다. (없다면 상태에서 관리)
  
  const [room, setRoom] = useState(null);
  const [myRole, setMyRole] = useState('guest'); // host 또는 guest
  const channelRef = useRef(null);

  useEffect(() => {
    if (!code || !user) return;

    // 1. 현재 방 정보 가져오기 및 내 역할(방장/게스트) 판별
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', code)
        .single();

      if (data) {
        setRoom(data);
        if (data.host_id === user.id) {
          setMyRole('host');
        } else {
          setMyRole('guest');
        }

        // 게스트가 입장했을 때 자동으로 실시간 데이터 동기화 시작
        subscribeToRoom(data.room_code);
      }
    };

    fetchRoom();

    // 2. DB 변경 감지 (게스트가 들어오거나 방이 시작됨을 감지)
    const roomChannel = supabase.channel(`room_db_${code}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'rooms', 
        filter: `room_code=eq.${code}` 
      }, (payload) => {
        setRoom(payload.new);
        
        // 🚨 [동시 진입 핵심] 방장이 게임을 시작(is_started가 true로 변경)했다면 게스트도 자동 이동!
        if (payload.new.is_started === true) {
          console.log("🚀 방장이 게임을 시작했습니다! 배틀 아레나로 이동합니다.");
          sessionStorage.setItem('current_room_code', code);
          sessionStorage.setItem('current_room_role', user.id === payload.new.host_id ? 'host' : 'guest');
          navigate(`/battle?room=${code}&mode=${user.id === payload.new.host_id ? 'host' : 'guest'}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [code, user, navigate]);

  // 3. 실시간 Broadcast 채널 구독 (신호 주고받기용)
  const subscribeToRoom = (roomCode) => {
    const ch = supabase.channel(`waiting_${roomCode}`)
      .on('broadcast', { event: 'start_game' }, () => {
        // 백업용 브로드캐스트: DB 처리가 늦을 때를 대비해 실시간 신호로도 방 이동을 트리거합니다.
        console.log("⚡ 실시간 스타트 신호 수신!");
        navigate(`/battle?room=${roomCode}&mode=guest`);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log("✅ 대기실 실시간 동기화 채널 연결 성공");
        }
      });
    channelRef.current = ch;
  };

  // 4. 🔥 방장이 "참여하기 (시작)" 버튼을 눌렀을 때 발동하는 함수
  const handleStartGame = async () => {
    if (myRole !== 'host') return; // 방장만 시작할 수 있음

    console.log("🎮 방장이 배틀 시작을 요청했습니다.");

    // (A) DB의 방 상태를 '시작됨(is_started = true)'으로 변경 -> 게스트의 postgres_changes가 이를 감지함
    const { error } = await supabase
      .from('rooms')
      .update({ 
        is_started: true,
        host_ready: true,
        guest_ready: true 
      })
      .eq('room_code', code);

    if (error) {
      console.error("방 상태 업데이트 실패:", error);
      return;
    }

    // (B) 백업용 실시간 Broadcast 신호 쏘기 (게스트 소환장)
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'start_game',
        payload: { started_by: user.id }
      });
    }

    // (C) 방장 본인도 즉시 배틀 아레나로 이동
    sessionStorage.setItem('current_room_code', code);
    sessionStorage.setItem('current_room_role', 'host');
    navigate(`/battle?room=${code}&mode=host`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.roomCard}>
        <h2 style={styles.title}>🎮 대기실 (방 코드: <span style={{color: '#cb6ce6'}}>{code}</span>)</h2>
        
        <div style={styles.playerSection}>
          <div style={styles.playerBox}>
            <div style={{fontSize: 40}}>👑</div>
            <p style={{fontWeight: 'bold'}}>{room?.host_name || '방장 대기 중...'}</p>
            <span style={styles.badge}>HOST</span>
          </div>
          
          <div style={{fontSize: 24, fontWeight: 'bold', color: '#8b8fa3'}}>VS</div>

          <div style={styles.playerBox}>
            <div style={{fontSize: 40}}>👤</div>
            <p style={{fontWeight: 'bold'}}>{room?.guest_name || '상대방 기다리는 중...'}</p>
            <span style={{...styles.badge, backgroundColor: '#3498db'}}>GUEST</span>
          </div>
        </div>

        {/* 버튼 제어: 방장에게는 시작 버튼이 보이고, 게스트에게는 대기 메시지가 보입니다. */}
        <div style={{marginTop: 40}}>
          {myRole === 'host' ? (
            <button 
              onClick={handleStartGame}
              disabled={!room?.guest_id} // 게스트가 들어와야 버튼이 활성화됨
              style={{
                ...styles.startBtn,
                opacity: room?.guest_id ? 1 : 0.5,
                cursor: room?.guest_id ? 'pointer' : 'not-allowed'
              }}
            >
              {room?.guest_id ? '⚔️ 배틀 시작하기 (동시 입장)' : '상대방 입장을 기다리는 중...'}
            </button>
          ) : (
            <div style={styles.waitingText}>
              🔒 방장이 참여하기를 누르면 배틀이 동시에 시작됩니다...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0f1117', color: '#e2e8f0', padding: 20
  },
  roomCard: {
    background: '#1a1d27', padding: 40, borderRadius: 20, border: '1px solid #2a2d3a',
    maxWidth: 600, width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: 30 },
  playerSection: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 20 },
  playerBox: {
    background: '#11131a', padding: 20, borderRadius: 14, border: '1px solid #2a2d3a', minWidth: 160
  },
  badge: {
    display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 6,
    fontSize: 11, fontWeight: 700, backgroundColor: '#e74c3c', color: 'white'
  },
  startBtn: {
    width: '100%', padding: '16px', borderRadius: 12, border: 'none', color: 'white',
    fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg, #7c3aed, #cb6ce6)',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)', transition: 'transform 0.1s'
  },
  waitingText: {
    padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
    border: '1px solid #2a2d3a', color: '#8b8fa3', fontSize: 14, fontStyle: 'italic'
  }
};