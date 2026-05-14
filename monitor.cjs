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
        .from('servers_status')
        .upsert({
          id: server.id,
          name: server.name,
          status: 'online',
          latency: Math.floor(Math.random() * 30) + 10,
          cpu: parseFloat((cpu.currentLoad / 100).toFixed(2)),
          memory_used: Math.round(mem.active / (1024 * 1024)),
          memory_total: Math.round(mem.total / (1024 * 1024)),
          uptime: Math.floor(time.uptime)
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