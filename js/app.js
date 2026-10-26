/* 앱 본체: 라우터 · 사이드바 · 학습 페이지 · 퀴즈 · 암기카드 · 검색 · 총정리 */
(function () {
  const App = (window.App = window.App || {});
  App.timers = App.timers || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const main = $('#main'), side = $('#side');
  const TOPICS = window.TOPICS, QUIZ = window.QUIZ, SCOPE = window.SCOPE;
  const byId = Object.fromEntries(TOPICS.map(t => [t.id, t]));
  const SUBJ = { 1: '1과목 · 소프트웨어 설계', 2: '2과목 · 소프트웨어 개발' };
  const esc = S.esc;

  /* 장·절 번호: 과목별로 그룹=장, 그룹 내 순서=절 (예: 2.3) */
  const NUM = {}, GNUM = {};
  [1, 2].forEach(sj => {
    const l = TOPICS.filter(t => t.subj === sj), gs = [...new Set(l.map(t => t.group))];
    gs.forEach((g, gi) => { GNUM[sj + g] = gi + 1; l.filter(t => t.group === g).forEach((t, ti) => { NUM[t.id] = `${gi + 1}.${ti + 1}`; }); });
  });

  /* ───── 상태 저장 (localStorage 불가 환경 대비) ───── */
  const KEY = 'eip-state-v1';
  let state = { done: {}, wrong: [], answered: 0, correct: 0, known: {} };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* 무시 */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 무시 */ } };

  /* 패턴 카드 → 암기카드/검색 데이터에 편입 */
  TOPICS.forEach(t => { t.cards = t.cards || []; });
  (window.PATTERNS || []).forEach(p => {
    const t = byId[{ c: 'gof-creational', s: 'gof-structural', b: 'gof-behavioral' }[p.cat]];
    if (!t) return;
    t.cards.push([`"${p.keys[0]}" — 어떤 디자인 패턴?`, `${p.kr} (${p.en})`]);
    t.cards.push([`${p.kr} 패턴의 의도는?`, p.intent]);
  });

  /* ───── 도해 마운트 ───── */
  function mountDiagrams(root) {
    $$('[data-diagram]', root).forEach(el => {
      const fn = DIAGRAMS[el.dataset.diagram];
      if (!fn) { el.innerHTML = `<p class="note">도해 "${esc(el.dataset.diagram)}" 없음</p>`; return; }
      try {
        const r = fn(el, el.dataset.arg || undefined);
        if (typeof r === 'string') el.innerHTML = r;
        else if (r && r.raw) el.innerHTML = r.html;
      } catch (e) { el.innerHTML = `<p class="note">도해 오류: ${esc(e.message)}</p>`; console.error(e); }
    });
  }

  /* ───── 사이드바 ───── */
  function renderSide(cur) {
    let h = '';
    [1, 2].forEach(sj => {
      const list = TOPICS.filter(t => t.subj === sj), done = list.filter(t => state.done[t.id]).length;
      h += `<div class="subj"><span>${SUBJ[sj]}</span><span>${done}/${list.length}</span></div>`;
      [...new Set(list.map(t => t.group))].forEach(g => {
        const items = list.filter(t => t.group === g), open = items.some(t => t.id === cur) || (!cur && GNUM[sj + g] === 1);
        h += `<details class="grp" ${open ? 'open' : ''}><summary><span class="gn">${GNUM[sj + g]}</span>${g}<span class="cnt">${items.filter(t => state.done[t.id]).length}/${items.length}</span></summary>` +
          items.map(t => `<a class="nav-i${t.id === cur ? ' on' : ''}${state.done[t.id] ? ' done' : ''}" href="#/t/${t.id}"><span class="nn">${NUM[t.id]}</span><span>${esc(t.title)}</span></a>`).join('') + '</details>';
      });
    });
    side.innerHTML = h;
  }
  const setNavTop = path => $$('.topnav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + path));

  /* ───── 홈 ───── */
  function pageHome() {
    const tot = TOPICS.length, done = TOPICS.filter(t => state.done[t.id]).length, pct = Math.round(done / tot * 100);
    const rate = state.answered ? Math.round(state.correct / state.answered * 100) : 0;
    const hot = [['tree-traversal', '트리 순회'], ['driver-stub', '드라이버와 스텁'], ['blackbox', '영어 기출 (동치 분할)'], ['complexity', 'O(N log₂N)과 합병 정렬'], ['postfix', '중위 → 후위 변환'], ['ipsec', 'IPSec: AH · ESP'], ['gof-intro', 'GoF 23패턴'], ['vc-func', '버전 등록 6기능']];
    const next = TOPICS.find(t => !state.done[t.id]);
    const book = sj => {
      const list = TOPICS.filter(t => t.subj === sj);
      return `<section class="book"><h2>${SUBJ[sj]}</h2>` + [...new Set(list.map(t => t.group))].map(g =>
        `<div class="ch"><h3><span class="gn">${GNUM[sj + g]}</span>${g}</h3><ol>` +
        list.filter(t => t.group === g).map(t => `<li class="${state.done[t.id] ? 'done' : ''}"><a href="#/t/${t.id}"><span class="nn">${NUM[t.id]}</span>${esc(t.title)}</a></li>`).join('') + '</ol></div>').join('') + '</section>';
    };
    return `<header class="hero"><p class="crumbs">1·2과목 중간고사 대비 · 기출 범위 2024/2 – 2025/8</p><h1>정보처리기사 학습 노트</h1>
      <p class="lead">교수님이 지정한 <b>${SCOPE.length}개 항목</b>을 개념 설명, 도해, 시뮬레이터, 예상문제로 정리했습니다. 왼쪽 목차에서 장별로 읽거나 아래 목차에서 바로 이동할 수 있습니다.</p>
      <div class="hero-act">${next ? `<a class="btn pri" href="#/t/${next.id}">${done ? '이어서 학습' : '처음부터 학습'} — ${NUM[next.id]} ${esc(next.title)}</a>` : ''}<a class="btn" href="#/scope">시험 범위 체크리스트</a><a class="btn" href="#/quiz">문제풀이</a></div></header>
      <div class="stat"><div class="card"><div class="n">${pct}%</div><div class="l">학습 진도 (${done}/${tot})</div></div><div class="card"><div class="n">${QUIZ.length}</div><div class="l">문제 은행</div></div><div class="card"><div class="n">${state.answered ? rate + '%' : '–'}</div><div class="l">누적 정답률</div></div><div class="card"><div class="n">${state.wrong.length}</div><div class="l">오답 노트</div></div></div>
      <h2 class="plain">교수님 강조 항목</h2><ul class="quick">${hot.map(([id, l]) => `<li><a href="#/t/${id}">${l}</a></li>`).join('')}</ul>
      <div class="books">${book(1)}${book(2)}</div>
      <div class="callout warn"><b>참고</b>문제 은행은 기출 유형을 바탕으로 만든 예상문제입니다. 교수님이 언급하신 2문항(영어 문제, 정렬 복잡도)만 실제 출제 문항이며, 용어는 수업 자료와 대조해 확인하세요.</div>`;
  }

  /* ───── 학습 페이지 ───── */
  function pageTopic(id) {
    const t = byId[id];
    if (!t) return '<article class="article"><h1>페이지를 찾을 수 없습니다</h1><a href="#/">홈으로</a></article>';
    const i = TOPICS.indexOf(t), prev = TOPICS[i - 1], next = TOPICS[i + 1];
    const qn = QUIZ.filter(q => q.t === id).length;
    const doneBtn = `<button class="btn ${state.done[id] ? 'on' : 'pri'}" data-done>${state.done[id] ? '학습 완료 (취소)' : '학습 완료로 표시'}</button>`;
    return `<article class="article"><header class="th"><p class="crumbs">${SUBJ[t.subj].split(' · ')[0]} / ${GNUM[t.subj + t.group]} ${esc(t.group)} / <span style="color:var(--accent)">${NUM[id]}</span></p><h1>${esc(t.title)}</h1>${t.en ? `<span class="en">${esc(t.en)}</span>` : ''}</header>
      ${t.exam ? `<div class="callout exam"><b>출제 포인트</b>${t.exam}</div>` : ''}
      ${t.body}
      <div class="donebar">${doneBtn}${qn ? `<a class="btn" href="#/quiz?topic=${id}">이 주제 문제 (${qn})</a>` : ''}${t.cards.length ? `<a class="btn" href="#/cards?topic=${id}">암기카드 (${t.cards.length})</a>` : ''}</div>
      <nav class="pager">${prev ? `<a href="#/t/${prev.id}"><small>이전 · ${NUM[prev.id]}</small>${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="next" href="#/t/${next.id}"><small>다음 · ${NUM[next.id]}</small>${esc(next.title)}</a>` : ''}</nav></article>
      <aside class="rail"><nav class="toc" aria-label="이 페이지"><h4>이 페이지</h4><div id="tocList"></div></nav>
      <div class="rail-act">${doneBtn}${qn ? `<a href="#/quiz?topic=${id}">문제 풀기 (${qn})</a>` : ''}${t.cards.length ? `<a href="#/cards?topic=${id}">암기카드 (${t.cards.length})</a>` : ''}</div></aside>`;
  }

  /* ───── 시험 범위 ───── */
  function pageScope() {
    const row = ([s, label, id]) => `<div class="scope-row ${state.done[id] ? 'done' : ''}"><span class="st">${state.done[id] ? '✔' : '○'}</span><a href="#/t/${id}">${esc(label)}</a></div>`;
    return `<h1>시험 범위 체크리스트</h1><p class="en">교수님이 수업 전날 지정해 준 항목 전체 — 클릭하면 해당 학습 페이지로 이동합니다.</p>
      ${[1, 2].map(s => `<h2>${SUBJ[s]}</h2><div class="card">${SCOPE.filter(x => x[0] === s).map(row).join('')}</div>`).join('')}`;
  }

  /* ───── 암기카드 ───── */
  function pageCards(params) {
    const topic = params.get('topic');
    let deck = [];
    TOPICS.forEach(t => { if (!topic || t.id === topic) t.cards.forEach((c, k) => deck.push({ id: t.id + ':' + k, t: t.id, q: c[0], a: c[1], s: t.subj })); });
    return { deck, html: `<h1>암기카드</h1><p class="en">${topic ? esc(byId[topic].title) + ' 주제' : '전체 주제'} — ${deck.length}장 · 카드를 클릭하면 뒤집힙니다 (Space: 뒤집기, ←/→ 이동)</p>
      <div class="ctl" style="display:flex;gap:8px;flex-wrap:wrap"><span class="seg" id="cSubj"><button data-s="0" class="on">전체</button><button data-s="1">1과목</button><button data-s="2">2과목</button></span><span class="seg" id="cMode"><button data-m="all" class="on">모든 카드</button><button data-m="unk">모르는 카드만</button></span><button class="btn sm" id="cShuf">섞기</button>${topic ? '<a class="btn sm" href="#/cards">전체 보기</a>' : ''}</div>
      <div id="cArea"></div>` };
  }
  function initCards(deck) {
    let s = 0, mode = 'all', idx = 0, cur = deck.slice();
    const area = $('#cArea');
    const apply = () => { cur = deck.filter(c => (!s || c.s === s) && (mode === 'all' || !state.known[c.id])); idx = Math.min(idx, Math.max(cur.length - 1, 0)); draw(); };
    const draw = () => {
      if (!cur.length) { area.innerHTML = '<div class="card" style="text-align:center">표시할 카드가 없습니다</div>'; return; }
      const c = cur[idx];
      area.innerHTML = `<div class="fc" id="fc"><div class="fc-in"><div class="fc-f"><small>${SUBJ[c.s]} · ${esc(byId[c.t].title)}</small>${esc(c.q)}</div><div class="fc-b"><small>정답</small>${esc(c.a)}</div></div></div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;align-items:center"><button class="btn" id="cP">◀</button><span>${idx + 1} / ${cur.length}</span><button class="btn" id="cN">▶</button></div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><button class="btn" id="cNo">모름</button><button class="btn pri" id="cYes">암기 완료</button></div>`;
      $('#fc').onclick = () => $('#fc').classList.toggle('flip');
      $('#cP').onclick = () => { idx = (idx - 1 + cur.length) % cur.length; draw(); };
      $('#cN').onclick = () => { idx = (idx + 1) % cur.length; draw(); };
      $('#cYes').onclick = () => { state.known[c.id] = 1; save(); mode === 'unk' ? apply() : (idx = (idx + 1) % cur.length, draw()); };
      $('#cNo').onclick = () => { delete state.known[c.id]; save(); idx = (idx + 1) % cur.length; draw(); };
    };
    $$('#cSubj button').forEach(b => b.onclick = () => { s = +b.dataset.s; $$('#cSubj button').forEach(x => x.classList.toggle('on', x === b)); idx = 0; apply(); });
    $$('#cMode button').forEach(b => b.onclick = () => { mode = b.dataset.m; $$('#cMode button').forEach(x => x.classList.toggle('on', x === b)); idx = 0; apply(); });
    $('#cShuf').onclick = () => { deck.sort(() => Math.random() - .5); idx = 0; apply(); };
    App.key = e => { const t = e.target.tagName; if (t === 'INPUT' || t === 'TEXTAREA') return; if (e.key === ' ') { e.preventDefault(); $('#fc') && $('#fc').classList.toggle('flip'); } else if (e.key === 'ArrowRight') $('#cN') && $('#cN').click(); else if (e.key === 'ArrowLeft') $('#cP') && $('#cP').click(); };
    apply();
  }

  /* ───── 퀴즈 ───── */
  function pageQuiz(params) {
    const topic = params.get('topic');
    const topicOpts = TOPICS.map(t => `<option value="${t.id}" ${t.id === topic ? 'selected' : ''}>${t.subj}과목 · ${esc(t.title)}</option>`).join('');
    return `<div class="qwrap"><h1>문제풀이</h1><p class="en">보기 순서는 매번 섞입니다. 틀린 문제는 오답 노트에 자동 저장됩니다.</p>
      <div class="card"><div style="display:grid;gap:10px">
        <label>범위 <select id="qScope"><option value="all">전체</option><option value="1">1과목</option><option value="2">2과목</option><option value="topic" ${topic ? 'selected' : ''}>특정 주제</option><option value="prof">교수님 언급 문제(영어·복잡도)</option><option value="wrong">오답 노트 (${state.wrong.length})</option></select></label>
        <label id="qTopicW" style="${topic ? '' : 'display:none'}">주제 <select id="qTopic">${topicOpts}</select></label>
        <label>문항 수 <select id="qN"><option>10</option><option>20</option><option>30</option><option value="999">전부</option></select></label>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" id="qGo">시작</button><button class="btn" id="qMock">모의고사 (각 과목 10문항 · 총 20)</button></div></div></div>
      <div id="qArea"></div></div>`;
  }
  function initQuiz() {
    const sc = $('#qScope');
    sc.onchange = () => { $('#qTopicW').style.display = sc.value === 'topic' ? '' : 'none'; };
    const pick = (list, n) => list.slice().sort(() => Math.random() - .5).slice(0, n);
    const start = qs => { if (!qs.length) { $('#qArea').innerHTML = '<div class="callout warn"><b>알림</b>해당 조건의 문제가 없습니다.</div>'; return; } run(qs); };
    $('#qGo').onclick = () => {
      const v = sc.value, n = +$('#qN').value;
      let l = QUIZ;
      if (v === '1' || v === '2') l = QUIZ.filter(q => byId[q.t].subj === +v);
      else if (v === 'topic') l = QUIZ.filter(q => q.t === $('#qTopic').value);
      else if (v === 'prof') l = QUIZ.filter(q => q.src === 'prof');
      else if (v === 'wrong') l = QUIZ.filter(q => state.wrong.includes(q.id));
      start(pick(l, n));
    };
    $('#qMock').onclick = () => start(pick(QUIZ.filter(q => byId[q.t].subj === 1), 10).concat(pick(QUIZ.filter(q => byId[q.t].subj === 2), 10)));
    if (sc.value === 'topic') $('#qGo').click();
  }
  function run(qs) {
    let i = 0, ok = 0; const wrongs = [], area = $('#qArea');
    const show = () => {
      if (i >= qs.length) {
        const pct = Math.round(ok / qs.length * 100);
        area.innerHTML = `<div class="card"><h2 style="margin-top:0">결과: ${ok} / ${qs.length} (${pct}%)</h2><div class="bar b"><i style="width:${pct}%"></i></div>${wrongs.length ? `<h3>틀린 문제</h3><ul>${wrongs.map(q => `<li>${esc(q.q.split('\n')[0])} → <b>${esc(q.opts[q.a])}</b> · <a href="#/t/${q.t}">${esc(byId[q.t].title)}</a></li>`).join('')}</ul>` : '<p>전 문항 정답입니다.</p>'}<button class="btn pri" id="qAgain">다시 풀기</button></div>`;
        $('#qAgain').onclick = () => run(qs.slice().sort(() => Math.random() - .5));
        return;
      }
      const q = qs[i], order = q.opts.map((_, k) => k).sort(() => Math.random() - .5);
      area.innerHTML = `<div class="card"><div class="q-head"><span class="chip">${i + 1} / ${qs.length}</span><span class="chip a">${esc(byId[q.t].title)}</span>${q.src === 'prof' ? '<span class="chip e">교수님 언급</span>' : ''}</div><div class="bar" style="margin-bottom:10px"><i style="width:${i / qs.length * 100}%"></i></div>
        <div class="q-text">${esc(q.q)}</div>${order.map((k, n) => `<button class="q-opt" data-k="${k}">${n + 1}. ${esc(q.opts[k])}</button>`).join('')}<div class="q-exp" id="qExp"></div></div>`;
      $$('.q-opt', area).forEach(b => b.onclick = () => {
        const k = +b.dataset.k, right = k === q.a;
        $$('.q-opt', area).forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('ok'); });
        if (!right) b.classList.add('no');
        state.answered++; if (right) { ok++; state.correct++; state.wrong = state.wrong.filter(w => w !== q.id); } else { wrongs.push(q); if (!state.wrong.includes(q.id)) state.wrong.push(q.id); }
        save();
        $('#qExp').innerHTML = `<div class="callout ${right ? 'tip' : 'exam'}"><b>${right ? '정답' : '오답'}</b>${esc(q.exp)} <a href="#/t/${q.t}">개념 보기 →</a></div><button class="btn pri" id="qNext">${i + 1 < qs.length ? '다음 문제' : '결과 보기'}</button>`;
        $('#qNext').onclick = () => { i++; show(); };
      });
    };
    show();
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ───── 핵심 요약(암기 요령 모음) ───── */
  function pageCheat() {
    const M = [
      ['개발 모형', '나선형 4단계 = 계위개고 (계획→위험분석→개발→고객평가)', 'spiral'],
      ['XP 가치', '의·단·피·용·존 (의사소통·단순성·피드백·용기·존중)', 'xp'],
      ['요구사항 개발', '도·분·명·확 (도출→분석→명세→확인)', 'req-process'],
      ['도출 기법', '청설브워프유 (청취·설문·브레인스토밍·워크샵·프로토타이핑·유스케이스)', 'req-elicit'],
      ['DFD', '프로세스(원) · 자료 흐름(화살표) · 자료 저장소(평행선) · 단말(사각형)', 'dfd'],
      ['자료 사전', '= 정의, + 연결, ( ) 생략, [ | ] 선택, { } 반복, * * 설명', 'dd'],
      ['UML 구조 6', '클·객·컴·배·복·패', 'uml-struct'],
      ['UML 행위 7', '유·순·커·상·활·상·타', 'uml-behav'],
      ['UML 관계', '의존=점선 열린화살표 / 일반화=실선 빈삼각형 / 실체화=점선 빈삼각형 / 집합=빈마름모 / 합성=찬마름모', 'uml-rel'],
      ['UI 원칙', '직·유·학·유 (직관성·유효성·학습성·유연성)', 'ui-principles'],
      ['25010 품질', '기능적합·성능효율·호환·사용·신뢰·보안·유지보수·이식', 'iso25000'],
      ['결합도(강→약)', '내공외제스자', 'coupling'],
      ['응집도(강→약)', '기순교절시논우', 'cohesion'],
      ['SOLID', 'SRP 단일책임 · OCP 개방폐쇄 · LSP 리스코프치환 · ISP 인터페이스분리 · DIP 의존역전', 'solid'],
      ['GoF 생성 5', '추빌팩프싱', 'gof-creational'],
      ['GoF 구조 7', '어브컴데퍼플프', 'gof-structural'],
      ['GoF 행위 11', '책커인반중메옵상전템방', 'gof-behavioral'],
      ['트리 순회', '전위 VLR / 중위 LVR / 후위 LRV (점: 왼쪽·아래·오른쪽)', 'tree-traversal'],
      ['최대 간선 수', '무방향 n(n−1)/2 · 방향 n(n−1)', 'graph-edges'],
      ['정렬 복잡도', '선택·삽입·버블 O(n²) / 합병·힙 O(n log n) / 퀵 평균 O(n log n)', 'complexity'],
      ['DRM 구성', '제·패·보·분·컨·클·소', 'drm-comp'],
      ['DRM 기술', '암·키·파·식·표·정·크·인', 'drm-tech'],
      ['버전 관리', '가져오기=최초등록 / 체크아웃=받아옴 / 체크인=올림 / 커밋=충돌 해결 후 확정 / 동기화=최신 반영', 'vc-func'],
      ['테스트 원리', '결함 집중=파레토 80:20 / 살충제 패러독스=같은 테스트 반복의 한계', 'test-principles'],
      ['화이트박스', '구문 < 결정 < 조건 < 조건/결정 < MC/DC < 다중조건 · V(G)=E−N+2', 'whitebox'],
      ['블랙박스', 'Equivalence Partitioning(동치 분할) · Boundary Value(경계값) · Cause-Effect(원인-결과) · Comparison(비교)', 'blackbox'],
      ['드라이버/스텁', '드라이버=상위(호출자) 대역=상향식 / 스텁=하위(피호출) 대역=하향식', 'driver-stub'],
      ['오라클', '참 > 샘플링 > 휴리스틱 · 일관성 검사', 'test-oracle'],
      ['EAI', '점·허·메·하 (Point-to-Point · Hub&Spoke · Message Bus · Hybrid)', 'eai'],
      ['IPSec', 'AH=무결성·인증(암호화 X, 51) / ESP=암호화+무결성·인증(50) / 전송=페이로드만 / 터널=전체 캡슐화', 'ipsec'],
    ];
    return `<h1>핵심 요약</h1><p class="en">암기 요령과 핵심 한 줄 — 항목을 누르면 상세 페이지로 이동합니다.</p><div class="tw"><table><tr><th>주제</th><th>핵심 요약</th></tr>${M.map(([a, b, id]) => `<tr><td class="k"><a href="#/t/${id}">${a}</a></td><td>${esc(b)}</td></tr>`).join('')}</table></div>
      <h2>후위·전위 변환 예</h2><div class="card"><code>A+B*C-D/E</code> → 후위 <b>ABC*+DE/-</b> · 전위 <b>-+A*BC/DE</b><br><code>(A+B)*C</code> → 후위 <b>AB+C*</b> · 전위 <b>*+ABC</b></div>
      <h2>회전별 결과 (8 3 4 9 7)</h2>${H.tbl(['정렬', '1회전', '2회전'], [['삽입', '3 8 4 9 7', '3 4 8 9 7'], ['선택', '3 8 4 9 7', '3 4 8 9 7'], ['버블', '3 4 8 7 9', '3 4 7 8 9']])}`;
  }

  /* ───── 검색 ───── */
  let index = null;
  function buildIndex() {
    const tmp = document.createElement('div');
    index = TOPICS.map(t => { tmp.innerHTML = t.body; return { t, text: (t.title + ' ' + (t.en || '') + ' ' + tmp.textContent + ' ' + t.cards.map(c => c.join(' ')).join(' ')).toLowerCase() }; });
  }
  function pageSearch(q) {
    if (!index) buildIndex();
    const k = q.trim().toLowerCase();
    if (!k) return '<h1>검색</h1><p>검색어를 입력하세요.</p>';
    const res = index.map(x => { const pos = x.text.indexOf(k); if (pos < 0) return null; const title = x.t.title.toLowerCase().includes(k) || (x.t.en || '').toLowerCase().includes(k); return { x, score: title ? 0 : 1, pos }; }).filter(Boolean).sort((a, b) => a.score - b.score);
    return `<h1>검색: "${esc(q)}"</h1><p>${res.length}건</p>${res.map(({ x, pos }) => `<a class="sr" href="#/t/${x.t.id}"><b>${esc(x.t.title)}</b> <small>${SUBJ[x.t.subj]}</small><br><small>…${esc(x.text.slice(Math.max(0, pos - 30), pos + 70))}…</small></a>`).join('') || '<p>결과가 없습니다.</p>'}`;
  }

  /* 콜아웃: 라벨 뒤 내용을 하나의 블록으로 묶어 2열 배치가 가능하게 한다 */
  function wrapCallouts() {
    $$('.callout', main).forEach(c => {
      const b = c.firstElementChild;
      if (!b || b.tagName !== 'B' || c.querySelector(':scope>.cb')) return;
      c.classList.add('cbx'); const w = document.createElement('div'); w.className = 'cb';
      while (b.nextSibling) w.appendChild(b.nextSibling);
      c.appendChild(w);
    });
  }

  /* 오른쪽 '이 페이지' 목차 + 스크롤 위치 표시 */
  function buildToc() {
    const hs = $$('.article h2, .article .pat>h3', main), box = $('#tocList');
    if (!box) return;
    if (hs.length < 2) { $('.toc', main).style.display = 'none'; return; }
    box.innerHTML = hs.map((h, i) => { h.id = 'sec-' + i; return `<a href="#/t/${main.dataset.cur}" data-s="sec-${i}" class="${h.tagName === 'H3' ? 'sub' : ''}">${esc(h.textContent.replace(/\s+/g, ' ').trim())}</a>`; }).join('');
    $$('a', box).forEach(a => a.onclick = e => { e.preventDefault(); $('#' + a.dataset.s).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if (!('IntersectionObserver' in window)) return;
    const links = Object.fromEntries($$('a', box).map(a => [a.dataset.s, a]));
    App.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$('a', box).forEach(x => x.classList.remove('on')); links[e.target.id].classList.add('on'); } }), { rootMargin: '-72px 0px -70% 0px' });
    hs.forEach(h => App.io.observe(h));
  }

  /* ───── 라우터 ───── */
  function route() {
    App.timers.forEach(clearInterval); App.timers.length = 0; App.key = null;
    if (App.io) { App.io.disconnect(); App.io = null; }
    document.body.classList.remove('menu');
    const [path, qs] = (location.hash.slice(2) || '').split('?'), params = new URLSearchParams(qs || '');
    const [a, b] = path.split('/');
    let html = '', after = null, cur = null;
    main.dataset.cur = b || '';
    if (a === 't') { cur = b; html = pageTopic(b); after = () => { mountDiagrams(main); buildToc(); $$('[data-done]', main).forEach(btn => btn.onclick = () => { state.done[b] ? delete state.done[b] : (state.done[b] = 1); save(); route(); }); }; }
    else if (a === 'scope') html = pageScope();
    else if (a === 'quiz') { html = pageQuiz(params); after = initQuiz; }
    else if (a === 'cards') { const r = pageCards(params); html = r.html; after = () => initCards(r.deck); }
    else if (a === 'cheat') html = pageCheat();
    else if (a === 'search') html = pageSearch(params.get('q') || '');
    else html = pageHome();
    const y = window.scrollY;
    main.innerHTML = a === 't' ? `<div class="page">${html}</div>` : `<div class="page solo"><article class="article">${html}</article></div>`;
    wrapCallouts();
    renderSide(cur); setNavTop(a || '');
    if (after) after();
    wrapCallouts();
    document.title = (cur && byId[cur] ? byId[cur].title + ' · ' : '') + '정보처리기사 학습 노트';
    if (a === 't' && main.dataset.last === b) window.scrollTo(0, y); else window.scrollTo(0, 0);
    main.dataset.last = cur || '';
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('keydown', e => App.key && App.key(e));
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { e.preventDefault(); $('#search').focus(); } });
  $('#menuBtn').onclick = () => document.body.classList.toggle('menu');
  $('#scrim').onclick = () => document.body.classList.remove('menu');
  $('#themeBtn').onclick = () => {
    const root = document.documentElement, dark = (root.dataset.theme || 'dark') === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('eip-theme', root.dataset.theme); } catch (e) { /* 무시 */ }
  };
  $('#searchForm').onsubmit = e => { e.preventDefault(); location.hash = '#/search?q=' + encodeURIComponent($('#search').value); };
  route();
})();
