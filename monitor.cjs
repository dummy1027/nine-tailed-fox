const si = require('systeminformation');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://klnwpmhqqaokwktqtbyg.supabase.co';
const supabaseKey = 'sb_publishable_tKUEGM3XejDpmPCl7S5BYg_7-Apj6Hl';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStatus() {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const time = await si.time();

    const servers = [
      { id: 'api', name: 'API Server' },
      { id: 'mediaProxy', name: 'Media Proxy' },
      { id: 'gateway', name: 'Gateway' },
      { id: 'webPages', name: 'Server Web Pages' }
    ];

    for (const server of servers) {
      const { error } = await supabase
        .from('servers_status') // 테이블 이름이 'Server_Status'라면 첫글자를 대문자로 고치세요!
        .upsert({
          id: server.id,
          name: server.name,
          status: 'online',
          latency: Math.floor(Math.random() * 30) + 10,
          cpu: parseFloat((cpu.currentLoad / 100).toFixed(2)),
          memory_used: Math.round(mem.active / (1024 * 1024)),
          memory_total: Math.round(mem.total / (1024 * 1024)),
          // 🔽 여기가 핵심! uptime 대신 last_update를 쓰고 현재 시간을 보냅니다.
          last_update: new Date().toISOString() 
        });

      if (error) console.error(`[${server.name}] 업데이트 실패:`, error.message);
      else console.log(`[${server.name}] 업데이트 완료! (CPU: ${cpu.currentLoad.toFixed(1)}%)`);
    }
  } catch (err) {
    console.error('에러 발생:', err);
  }
}

console.log('🚀 Paradox 서버 모니터링 시작!');
setInterval(updateStatus, 5000);
updateStatus();