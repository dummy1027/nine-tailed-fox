import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, ImageRun, HeightRule,
} from 'docx';

const REPO = path.resolve(import.meta.dirname, '..');
const OUT_DIR = 'C:\\Users\\USER\\Desktop\\연구일지';
const SHOTS = path.resolve(import.meta.dirname, 'screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ===== 조원 정보 =====
const MEMBERS = [
  { name: '이현준', account: 'Lee5190',   role: '팀원' },
  { name: '배도훈', account: 'dummy1027', role: '팀원' },
];
const ACCOUNT_TO_NAME = Object.fromEntries(MEMBERS.map(m => [m.account.toLowerCase(), m.name]));
function displayAuthor(account) {
  return ACCOUNT_TO_NAME[(account || '').toLowerCase()] || account;
}

// ===== 영재성 기준 (정보영재원) =====
// 작성자 표기는 한 줄 코멘트로 — 한국 정보영재원에서 일반적으로 평가하는 5대 영역
const CRITERIA = [
  { key: '창의성',       desc: '새로운 아이디어를 떠올리고 기존 방식을 다르게 시도한 사례' },
  { key: '문제해결력',   desc: '오류·장애·요구사항을 분석하고 해결한 과정' },
  { key: '과제집착력',   desc: '하나의 과제를 끝까지 파고들어 완성도를 끌어올린 노력' },
  { key: '협업·의사소통', desc: '역할 분담, Git 협업, 코드 리뷰·머지 등 팀워크 경험' },
  { key: '논리적 사고력', desc: '문제를 단계적으로 분해하고 알고리즘·구조로 표현한 점' },
];

// ===== 날짜별 작업 영역과 영재성 매핑 (수기 큐레이션 + 휴리스틱 보완) =====
// 각 날짜에서 어느 페이지 스크린샷이 가장 어울리는지, 어떤 영재성 항목이 두드러졌는지를 큐레이션.
const DAY_META = {
  '2026-04-11': {
    title: '프로젝트 기반 구축 및 Supabase 백엔드 연동',
    screenshots: ['home'],
    highlights: {
      '창의성':       'C언어 학습 + 커뮤니티 + 문제집을 하나의 플랫폼으로 구성하기로 한 초기 기획.',
      '문제해결력':   'Supabase 와 Express 를 연동해 인증·데이터 관리 기반을 설계.',
      '과제집착력':   '초기 셋업 과정에서 반복적인 시도("ㅈㄴ힘들다") 끝에 안정된 환경을 확보.',
      '협업·의사소통': 'GitHub 저장소를 개설하고 두 명이 동일한 코드베이스를 공유하기 시작.',
      '논리적 사고력': 'Express 라우팅과 Supabase 클라이언트 분리 등 책임 분리 구조 정립.',
    },
  },
  '2026-05-05': {
    title: '기능 추가 시험 운영',
    screenshots: ['home'],
    highlights: {
      '과제집착력':   '연휴 중에도 기능 점검을 시도하며 프로젝트 흐름을 끊지 않음.',
    },
  },
  '2026-05-09': {
    title: '랜딩 페이지·디자인 시스템·문제집·커뮤니티 카드 일괄 구축',
    screenshots: ['home', 'basics', 'c-preview'],
    highlights: {
      '창의성':       'Paradox 라는 컨셉으로 그라데이션·지뢰찾기 인터랙션 등 차별화된 UI 적용.',
      '문제해결력':   '복구 1~4차 시도를 거치며 깨진 빌드/충돌을 단계적으로 복원.',
      '과제집착력':   '하루 40여 회의 커밋으로 디자인·내용·로고·페이지 구성을 동시에 끌어올림.',
      '협업·의사소통': 'PR 머지(#2) 및 두 계정의 동시 작업을 git 으로 정렬.',
      '논리적 사고력': 'C언어 맛보기 페이지에서 코드 예제와 설명을 단계별로 배치.',
    },
  },
  '2026-05-10': {
    title: '커뮤니티 본격 완성 (다중 사용자·자동완성·줄바꿈)',
    screenshots: ['community'],
    highlights: {
      '창의성':       '코드 자동완성 시스템을 직접 구축해 학습 친화적 UX 제공.',
      '문제해결력':   '다중 사용자 환경에서 발생한 버그를 픽스하며 커뮤니티 안정화.',
      '과제집착력':   '커서·줄바꿈·자동완성 등 사소한 UX 디테일까지 다듬음.',
      '협업·의사소통': '두 명이 동일 화면을 번갈아 수정하며 다중 사용자 시나리오를 함께 검증.',
      '논리적 사고력': '커뮤니티 데이터 흐름(글·작성자·정렬)을 일관된 구조로 정리.',
    },
  },
  '2026-05-11': {
    title: '댓글·대댓글 시스템과 서버 상태 그래프',
    screenshots: ['community', 'server-status'],
    highlights: {
      '창의성':       '재귀적 대댓글 UI 와 서버 상태 그래프(recharts) 도입.',
      '문제해결력':   '환경 차이로 인한 동작 불일치를 추적해 호환성 확보("남의 컴에서 안되면 되게 해").',
      '과제집착력':   '복구 시스템을 추가로 가동하며 안정성에 집착.',
      '협업·의사소통': '서로 다른 컴퓨터에서의 재현 차이를 공유해 환경 문제를 풀어냄.',
      '논리적 사고력': '댓글의 부모-자식 관계를 트리 구조로 모델링.',
    },
  },
  '2026-05-12': {
    title: '랭킹·검색·서버 복구',
    screenshots: ['ranking', 'workbook'],
    highlights: {
      '창의성':       '랭킹 시스템과 커뮤니티 검색을 신규 도입.',
      '문제해결력':   '서버 상태가 깨졌을 때 1·2차 복구 시도로 정상화.',
      '과제집착력':   '"문제집"의 결함을 인지하고 재정비까지 마무리.',
      '협업·의사소통': '두 사람이 번갈아 복구를 시도하고 결과를 git 으로 공유.',
      '논리적 사고력': '랭킹 산정과 검색 인덱싱 로직을 정리.',
    },
  },
  '2026-05-14': {
    title: '서버 모니터링·API 키 오류 해결',
    screenshots: ['server-status'],
    highlights: {
      '문제해결력':   'API 키 오류를 추적해 환경 변수 적용 방식을 보정.',
      '과제집착력':   '모니터링 화면의 디테일(시간 표시 등)을 끝까지 다듬음.',
      '논리적 사고력': '서버 측 통계 수집 흐름을 단순화하고 시간 표기를 정리.',
    },
  },
  '2026-05-15': {
    title: '서버 구조 변경과 기출 문제집 정비',
    screenshots: ['workbook', 'server-status'],
    highlights: {
      '문제해결력':   '서버 변경에 따른 영향 범위를 파악하고 클라이언트 호출 경로를 보정.',
      '과제집착력':   '기출문제집을 풀어내면서 문제집 페이지 콘텐츠를 완성도 있게 마무리.',
      '협업·의사소통': '동일 시점에 두 사람의 커밋을 머지하여 발표 직전 정렬.',
    },
  },
};

// ===== git 로그 수집 =====
const SEP = '\x1f', REC = '\x1e';
const fmt = ['%H', '%ai', '%an', '%ae', '%s', '%b'].join(SEP) + REC;
const raw = execSync(`git -C "${REPO}" log --all --no-merges --pretty=format:"${fmt}"`, {
  encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
});
const commits = raw.split(REC).map(s => s.replace(/^\s+/, '')).filter(Boolean).map(line => {
  const [hash, isoDate, author, email, subject, body] = line.split(SEP);
  return { hash, isoDate, author, email, subject: subject || '', body: (body || '').trim() };
});
for (const c of commits) {
  try {
    const files = execSync(`git -C "${REPO}" show --name-status --pretty=format: ${c.hash}`, {
      encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    }).trim().split(/\r?\n/).filter(Boolean).map(l => {
      const [status, ...rest] = l.split(/\s+/);
      return { status, path: rest.join(' ') };
    });
    c.files = files;
  } catch { c.files = []; }
}
const byDate = new Map();
for (const c of commits) {
  const d = c.isoDate.slice(0, 10);
  if (!byDate.has(d)) byDate.set(d, []);
  byDate.get(d).push(c);
}
for (const list of byDate.values()) list.sort((a, b) => a.isoDate.localeCompare(b.isoDate));

// ===== docx 빌더 =====
const FONT = '맑은 고딕';
function txt(text, opts = {}) {
  return new TextRun({
    text, font: FONT,
    size: opts.size || 22,
    bold: !!opts.bold,
    color: opts.color,
    italics: !!opts.italics,
  });
}
function P(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [txt(text, opts)];
  return new Paragraph({
    children: runs,
    alignment: opts.align,
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60 },
  });
}
function border() {
  const b = { style: BorderStyle.SINGLE, size: 4, color: '888888' };
  return { top: b, bottom: b, left: b, right: b };
}
function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'E7EEF7' },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [txt(text, { bold: true })] })],
    borders: border(),
  });
}
function bodyCell(text, width, opts = {}) {
  const runs = Array.isArray(text) ? text : [txt(String(text || ''), opts)];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({ alignment: opts.align, children: runs })],
    borders: border(),
    columnSpan: opts.columnSpan,
  });
}
function spanCell(text, width, span, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    columnSpan: span,
    children: [new Paragraph({ alignment: opts.align, children: [txt(text, opts)] })],
    borders: border(),
  });
}

function dayOfWeekKo(dateStr) {
  const dow = ['일', '월', '화', '수', '목', '금', '토'];
  return dow[new Date(dateStr + 'T00:00:00').getDay()];
}

function headerInfoTable(dateStr, list, dayMeta) {
  const accounts = [...new Set(list.map(c => c.author))];
  const names = accounts.map(displayAuthor);
  const teamLine = MEMBERS.map(m => `${m.name}(${m.account})`).join(', ');
  const dayAuthors = accounts.map(a => `${displayAuthor(a)}(${a})`).join(', ') || '-';
  const dow = dayOfWeekKo(dateStr);

  return new Table({
    width: { size: 10800, type: WidthType.DXA },
    rows: [
      new TableRow({ children: [
        headerCell('일시', 1800),
        bodyCell(`${dateStr} (${dow})`, 3600),
        headerCell('작성자(전체)', 1800),
        bodyCell(teamLine, 3600),
      ]}),
      new TableRow({ children: [
        headerCell('연구 주제', 1800),
        spanCell(dayMeta?.title || list[0]?.subject || '연구 활동', 9000, 3),
      ]}),
      new TableRow({ children: [
        headerCell('당일 작성자', 1800),
        bodyCell(dayAuthors, 3600),
        headerCell('커밋 수', 1800),
        bodyCell(`${list.length}건`, 3600),
      ]}),
    ],
  });
}

function memberInfoTable() {
  return new Table({
    width: { size: 10800, type: WidthType.DXA },
    rows: [
      new TableRow({ children: [
        headerCell('이름', 2400),
        headerCell('GitHub 계정', 3000),
        headerCell('역할', 2400),
        headerCell('비고', 3000),
      ]}),
      ...MEMBERS.map(m => new TableRow({ children: [
        bodyCell(m.name, 2400, { align: AlignmentType.CENTER }),
        bodyCell(m.account, 3000, { align: AlignmentType.CENTER }),
        bodyCell(m.role, 2400, { align: AlignmentType.CENTER }),
        bodyCell('Paradox 프로젝트 공동 개발', 3000),
      ]})),
    ],
  });
}

function commitTable(list) {
  const W = { time: 1000, author: 1700, msg: 5200, files: 2900 };
  const head = new TableRow({ tableHeader: true, children: [
    headerCell('시간', W.time),
    headerCell('작성자', W.author),
    headerCell('작업 내용 (커밋 메시지)', W.msg),
    headerCell('변경 파일', W.files),
  ]});
  const rows = list.map(c => {
    const time = c.isoDate.slice(11, 16);
    const filesArr = c.files && c.files.length
      ? c.files.slice(0, 8).map(f => `${f.status} ${f.path}`)
      : ['-'];
    if (c.files && c.files.length > 8) filesArr.push(`... (외 ${c.files.length - 8}건)`);
    const msgRuns = [txt(c.subject, { bold: true })];
    if (c.body) {
      msgRuns.push(new TextRun({ text: '', break: 1 }));
      msgRuns.push(txt(c.body, { size: 20, color: '555555' }));
    }
    return new TableRow({ children: [
      bodyCell(time, W.time, { align: AlignmentType.CENTER }),
      bodyCell(`${displayAuthor(c.author)}\n(${c.author})`, W.author, { align: AlignmentType.CENTER }),
      new TableCell({
        width: { size: W.msg, type: WidthType.DXA },
        children: [new Paragraph({ children: msgRuns })],
        borders: border(),
      }),
      new TableCell({
        width: { size: W.files, type: WidthType.DXA },
        children: filesArr.map(line => new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [txt(line, { size: 18 })],
        })),
        borders: border(),
      }),
    ]});
  });
  return new Table({ width: { size: 10800, type: WidthType.DXA }, rows: [head, ...rows] });
}

function criteriaTable(dayMeta, list) {
  const highlights = dayMeta?.highlights || {};
  const W = { key: 2200, desc: 3200, evidence: 5400 };
  const head = new TableRow({ tableHeader: true, children: [
    headerCell('영재성 요소', W.key),
    headerCell('평가 관점', W.desc),
    headerCell('해당 일자 관찰 내용', W.evidence),
  ]});
  const rows = CRITERIA.map(c => {
    const evidence = highlights[c.key] || autoEvidence(c.key, list);
    return new TableRow({ children: [
      bodyCell(c.key, W.key, { align: AlignmentType.CENTER, bold: true }),
      bodyCell(c.desc, W.desc, { size: 20 }),
      bodyCell(evidence, W.evidence),
    ]});
  });
  return new Table({ width: { size: 10800, type: WidthType.DXA }, rows: [head, ...rows] });
}

// 큐레이션이 없을 때 커밋 메시지를 활용한 보조 코멘트
function autoEvidence(key, list) {
  if (!list.length) return '해당 일자 관찰 사항 없음';
  const subjects = list.map(c => c.subject).filter(Boolean).slice(0, 3).join(', ');
  return `해당 일자 활동 요약: ${subjects}`;
}

async function imageParagraphs(names) {
  const paras = [];
  for (const n of names) {
    const file = path.join(SHOTS, `${n}.png`);
    if (!fs.existsSync(file)) continue;
    const buf = fs.readFileSync(file);
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({
        data: buf,
        transformation: { width: 520, height: 325 },
      })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [txt(`[그림] ${n} 화면`, { size: 18, italics: true, color: '666666' })],
    }));
  }
  return paras;
}

// ===== 생성 루프 =====
const sortedDates = [...byDate.keys()].sort();
console.log(`총 ${sortedDates.length}일치 연구일지 생성 중...`);

for (const date of sortedDates) {
  const list = byDate.get(date);
  const meta = DAY_META[date] || {};
  const shotNames = meta.screenshots && meta.screenshots.length ? meta.screenshots : ['home'];

  const sections = [
    P('연구 일지', { bold: true, size: 40, align: AlignmentType.CENTER, after: 80 }),
    P('정보영재원 영재성 기준 기반 활동 기록', { size: 22, align: AlignmentType.CENTER, color: '666666', after: 240 }),

    P('1. 기본 정보', { bold: true, size: 28, before: 200, after: 120 }),
    headerInfoTable(date, list, meta),

    P('', { after: 80 }),
    P('2. 팀 구성', { bold: true, size: 28, before: 200, after: 120 }),
    memberInfoTable(),

    P('', { after: 80 }),
    P('3. 작업 내역 (Git 커밋 기록)', { bold: true, size: 28, before: 200, after: 120 }),
    commitTable(list),

    P('', { after: 80 }),
    P('4. 결과 화면 스크린샷', { bold: true, size: 28, before: 200, after: 120 }),
    ...(await imageParagraphs(shotNames)),

    P('', { after: 80 }),
    P('5. 정보영재원 영재성 기준 분석', { bold: true, size: 28, before: 200, after: 120 }),
    criteriaTable(meta, list),

    P('', { after: 80 }),
    P('6. 자기 평가 및 다음 계획', { bold: true, size: 28, before: 200, after: 120 }),
    P(meta.title
        ? `오늘은 "${meta.title}"을(를) 중심으로 작업하였다. 위의 영재성 기준 분석에서 보이듯, 단순 코드 작성을 넘어 협업·문제해결·창의적 아이디어 적용이 함께 이루어졌다. 다음 작업에서는 미흡한 부분을 보완하고 사용자 피드백을 반영해 완성도를 더 높일 계획이다.`
        : '오늘은 프로젝트 보조 작업을 진행했다. 다음에는 메인 흐름과 연결되는 기능을 보강할 예정이다.'),
  ];

  const doc = new Document({
    creator: `${MEMBERS.map(m => m.name).join(' / ')}`,
    title: `연구일지 ${date}`,
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{
      properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
      children: sections,
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const file = path.join(OUT_DIR, `연구일지_${date}.docx`);
  fs.writeFileSync(file, buf);
  console.log(`  ✓ ${file}  (${list.length}건 / 스크린샷 ${shotNames.length}장)`);
}
console.log('완료');
