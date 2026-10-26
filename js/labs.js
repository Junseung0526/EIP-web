/* 인터랙티브 실습 도구 (labs) */
(function () {
  const { T, R, L, P, C, B, A, svg } = S;
  const D = DIAGRAMS;
  const $ = (el, s) => el.querySelector(s);
  const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
  const seg = (items, cur, attr) => `<span class="seg">${items.map(([v, t]) => `<button data-${attr}="${v}" class="${v === cur ? 'on' : ''}">${t}</button>`).join('')}</span>`;
  const bindSeg = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach(b => b.onclick = () => { el.querySelectorAll(`[data-${attr}]`).forEach(x => x.classList.toggle('on', x === b)); fn(b.dataset[attr]); });

  /* ───────── 화이트박스: 커버리지 판정기 ───────── */
  D.whiteLab = el => {
    const cases = [['T', 'T'], ['T', 'F'], ['F', 'T'], ['F', 'F']];
    let sel = new Set([0]);
    el.innerHTML = `<pre style="margin:0 0 10px"><code>if (A &amp;&amp; B) {
    S1;          // else 없음 → S1 실행 여부가 문장 커버리지 기준
}</code></pre>
      <div class="ctl" id="wlc"></div>
      <div class="ctl"><button class="btn sm" data-p="0">문장만 (TT)</button><button class="btn sm" data-p="1">조건만 (TF + FT)</button><button class="btn sm" data-p="2">MC/DC 최소 (TT·TF·FT)</button><button class="btn sm" data-p="3">전부</button><button class="btn sm" data-p="x">초기화</button></div>
      <div class="tbl" id="wlr"></div><div class="note" id="wln"></div>`;
    const presets = { 0: [0], 1: [1, 2], 2: [0, 1, 2], 3: [0, 1, 2, 3], x: [] };
    const draw = () => {
      $(el, '#wlc').innerHTML = cases.map((c, i) => `<button class="btn ${sel.has(i) ? 'on' : ''}" data-i="${i}">A=${c[0]} B=${c[1]} → ${c[0] === 'T' && c[1] === 'T' ? '결정 참' : '결정 거짓'}</button>`).join('');
      const set = [...sel].map(i => cases[i]), has = i => sel.has(i);
      const dec = has(0) && set.some(c => !(c[0] === 'T' && c[1] === 'T'));
      const both = k => set.some(c => c[k] === 'T') && set.some(c => c[k] === 'F');
      const cond = both(0) && both(1);
      const rows = [
        ['구문(문장) 커버리지', 'S1 실행', has(0), '1개 (TT)'],
        ['결정(분기) 커버리지', '결정이 참·거짓 모두', dec, '2개 (TT + 아무 거짓)'],
        ['조건 커버리지', 'A·B 각각 T/F 모두', cond, '2개 (TF + FT 가능)'],
        ['조건/결정 커버리지', '조건 + 결정 모두', cond && dec, '2개 (TT + FF)'],
        ['MC/DC', '각 조건이 단독으로 결과에 영향', has(0) && has(1) && has(2), '3개 (n+1: TT·TF·FT)'],
        ['다중 조건 커버리지', '모든 조합 2ⁿ', sel.size === 4, '4개 (전부)'],
      ];
      $(el, '#wlr').innerHTML = `<table><tr><th>기법</th><th>기준</th><th>충족</th><th>최소 테스트</th></tr>${rows.map(r => `<tr class="${r[2] ? 'hl-row' : ''}"><td class="k">${r[0]}</td><td>${r[1]}</td><td><b style="color:var(${r[2] ? '--b' : '--e'})">${r[2] ? '충족' : '미충족'}</b></td><td>${r[3]}</td></tr>`).join('')}</table>`;
      $(el, '#wln').innerHTML = cond && !dec && sel.size ? '조건 커버리지는 만족하지만 결정이 한 번도 참이 되지 않아 S1이 실행되지 않았습니다. 조건 커버리지가 결정 커버리지를 포함하지 않는 대표 사례입니다.' : !sel.size ? '테스트 케이스를 선택하면 충족되는 커버리지가 표시됩니다.' : `선택한 케이스: ${set.map(c => c.join('')).join(', ')}`;
      el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const i = +b.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); draw(); });
    };
    el.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { sel = new Set(presets[b.dataset.p]); draw(); });
    draw();
  };

  /* ───────── 블랙박스: 동치 분할 · 경계값 탐침 ───────── */
  D.partLab = el => {
    let mn = 1, mx = 100, x = 50;
    el.innerHTML = `<div class="ctl"><label>유효 범위 최소 <input type="number" id="pmn" value="1" style="width:76px"></label><label>최대 <input type="number" id="pmx" value="100" style="width:76px"></label></div>
      <div class="ctl"><label>입력값 x = <b id="pxv">50</b></label><input type="range" id="px" style="width:min(520px,70%)"></div>
      <div id="psv"></div><div class="note" id="pnote"></div>`;
    const draw = () => {
      mn = +$(el, '#pmn').value; mx = Math.max(mn + 5, +$(el, '#pmx').value);
      const lo = mn - 40, hi = mx + 40, sl = $(el, '#px'); sl.min = lo; sl.max = hi;
      x = Math.min(hi, Math.max(lo, +sl.value || x)); sl.value = x; $(el, '#pxv').textContent = x;
      const X0 = 40, W = 800, f = v => X0 + (v - lo) / (hi - lo) * W;
      let s = `<rect x="${X0}" y="50" width="${f(mn) - X0}" height="34" class="bx e"/><rect x="${f(mn)}" y="50" width="${f(mx) - f(mn)}" height="34" class="bx b"/><rect x="${f(mx)}" y="50" width="${X0 + W - f(mx)}" height="34" class="bx e"/>`;
      s += T(f(mn) / 2 + X0 / 2 + 20, 67, '무효 (x < ' + mn + ')', { s: 12, b: true }) + T((f(mn) + f(mx)) / 2, 67, `유효 (${mn} ≤ x ≤ ${mx})`, { s: 12, b: true }) + T((f(mx) + X0 + W) / 2, 67, '무효 (x > ' + mx + ')', { s: 12, b: true });
      [mn - 1, mn, mn + 1, mx - 1, mx, mx + 1].forEach(v => { s += C(f(v), 110, 6, { c: 'd' }) + T(f(v), 130, v, { s: 11.5, b: true }); });
      s += T(X0, 24, '경계값: min−1, min, min+1, max−1, max, max+1', { a: 'start', s: 12, c: 'm' });
      s += `<path d="M${f(x)},96 l-8,-14 l16,0 z" class="fill" style="fill:var(--accent)"/>` + T(f(x), 150, 'x=' + x, { b: true, c: 'a', s: 13 });
      $(el, '#psv').innerHTML = svg(880, 170, s, { label: '동치 분할과 경계값 위치' });
      const valid = x >= mn && x <= mx, bnd = [mn - 1, mn, mn + 1, mx - 1, mx, mx + 1].includes(x);
      $(el, '#pnote').innerHTML = `x = <b>${x}</b> → ${valid ? '<b style="color:var(--b)">유효 동치 클래스</b>' : '<b style="color:var(--e)">무효 동치 클래스</b>' + (x < mn ? '(하한 미만)' : '(상한 초과)')} · ${bnd ? '<b style="color:var(--d)">경계값 분석 대상 값</b>' : '경계값 아님 (동치 분할의 대표값으로는 충분)'}`;
    };
    el.querySelectorAll('input').forEach(i => i.oninput = draw);
    draw();
  };

  /* ───────── 시간복잡도: n 슬라이더 ───────── */
  D.bigOLab = el => {
    el.innerHTML = `<div class="ctl"><label>입력 크기 n = <b id="bn">100</b></label><input type="range" id="bs" min="0" max="3" step="0.05" value="2" style="width:min(520px,70%)"></div><div id="bsv"></div><div class="note">연산 1회 = 1ns(초당 10억 회)로 가정한 소요 시간입니다. 막대는 로그 스케일입니다.</div>`;
    const fmtT = s => s < 1e-6 ? '순간' : s < 1e-3 ? (s * 1e6).toFixed(0) + ' µs' : s < 1 ? (s * 1e3).toFixed(1) + ' ms' : s < 60 ? s.toFixed(1) + ' 초' : s < 3600 ? (s / 60).toFixed(1) + ' 분' : s < 86400 ? (s / 3600).toFixed(1) + ' 시간' : s < 3.15e7 ? (s / 86400).toFixed(1) + ' 일' : s < 3.15e16 ? (s / 3.15e7).toExponential(1) + ' 년' : '우주 나이 초과';
    const fmtN = v => v === Infinity || v > 1e21 ? '10^' + Math.round(Math.log10(v)) : v >= 1e7 ? v.toExponential(2) : Math.round(v).toLocaleString();
    const draw = () => {
      const n = Math.max(1, Math.round(Math.pow(10, +$(el, '#bs').value))); $(el, '#bn').textContent = n.toLocaleString();
      const lg = Math.log2(Math.max(n, 2));
      const rows = [['O(1)', 1, 'b'], ['O(log n)', lg, 'f'], ['O(n)', n, 'a'], ['O(n log n)', n * lg, 'c'], ['O(n²)', n * n, 'e'], ['O(2ⁿ)', n > 1000 ? Infinity : Math.pow(2, n), 'd']];
      let s = '';
      rows.forEach(([nm, v, c], i) => {
        const y = 14 + i * 46, ln = v === Infinity ? 99 : Math.log10(Math.max(v, 1)), w = Math.min(1, ln / 18) * 520;
        s += T(10, y + 16, nm, { a: 'start', b: true, s: 14, c }) + `<rect x="130" y="${y + 2}" width="520" height="28" rx="4" class="bx g"/><rect x="130" y="${y + 2}" width="${Math.max(3, w)}" height="28" rx="4" class="bx ${c} anim"/>`;
        s += T(662, y + 10, fmtN(v), { a: 'start', s: 12.5, b: true }) + T(662, y + 25, fmtT(v === Infinity ? 1e300 : v * 1e-9), { a: 'start', s: 11.5, c: 'm' });
      });
      $(el, '#bsv').innerHTML = svg(880, 296, s, { label: '입력 크기별 연산 횟수' });
    };
    $(el, '#bs').oninput = draw; draw();
  };

  /* ───────── EAI: 연결 수 비교 ───────── */
  D.eaiLab = el => {
    el.innerHTML = `<div class="ctl"><label>연동할 애플리케이션 수 N = <b id="en">5</b></label><input type="range" id="es" min="2" max="10" value="5" style="width:min(420px,60%)"></div><div id="esv"></div><div class="note" id="enote"></div>`;
    const draw = () => {
      const n = +$(el, '#es').value; $(el, '#en').textContent = n;
      const pts = (cx, cy, r) => [...Array(n)].map((_, i) => { const th = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(th), cy + r * Math.sin(th)]; });
      let s = '';
      // P2P
      let p = pts(150, 130, 90);
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s += L(p[i][0], p[i][1], p[j][0], p[j][1], { c: 'thin e' });
      p.forEach(q => s += C(q[0], q[1], 9, { c: 'a' }));
      s += T(150, 250, 'Point-to-Point', { b: true, s: 13.5 }) + T(150, 272, `연결 ${n * (n - 1) / 2}개  N(N−1)/2`, { s: 12.5, c: 'e', b: true });
      // Hub
      p = pts(440, 130, 90);
      p.forEach(q => s += L(440, 130, q[0], q[1], { c: 'thin' }) + C(q[0], q[1], 9, { c: 'a' }));
      s += C(440, 130, 20, { c: 'hot' }) + T(440, 130, '허브', { c: 'w', s: 11, b: true });
      s += T(440, 250, 'Hub & Spoke', { b: true, s: 13.5 }) + T(440, 272, `연결 ${n}개  N`, { s: 12.5, c: 'b', b: true });
      // Bus
      const bx = 620, bw = 240;
      s += R(bx, 120, bw, 20, { c: 'd', r: 6 }) + T(bx + bw / 2, 130, '메시지 버스', { s: 11, c: 'd', b: true });
      for (let i = 0; i < n; i++) { const x = bx + 14 + i * (bw - 28) / Math.max(n - 1, 1), top = i % 2 === 0; s += L(x, top ? 120 : 140, x, top ? 84 : 176) + C(x, top ? 76 : 184, 9, { c: 'a' }); }
      s += T(740, 250, 'Message Bus', { b: true, s: 13.5 }) + T(740, 272, `연결 ${n}개  N`, { s: 12.5, c: 'b', b: true });
      $(el, '#esv').innerHTML = svg(880, 290, s, { label: 'EAI 유형별 연결 수 비교' });
      $(el, '#enote').innerHTML = `N=${n}일 때 점대점은 <b>${n * (n - 1) / 2}</b>개, 허브·버스는 <b>${n}</b>개의 연결이 필요합니다. 연동 대상이 늘수록 점대점은 급격히 복잡해집니다.`;
    };
    $(el, '#es').oninput = draw; draw();
  };

  /* ───────── 버전 관리 시뮬레이터 ───────── */
  D.vcLab = el => {
    let repo = [], wc = null, log = ['저장소가 비어 있습니다. 먼저 "가져오기(Import)"를 실행하세요.'];
    el.innerHTML = `<div class="ctl" id="vcb"></div><div id="vcs"></div><div class="out" id="vcl" style="text-align:left;line-height:1.8"></div>`;
    const say = m => { log.push(m); if (log.length > 6) log.shift(); };
    const draw = () => {
      const head = repo.length;
      const btn = (id, t, ok) => `<button class="btn sm ${ok ? '' : ''}" data-a="${id}" ${ok ? '' : 'disabled style="opacity:.4;cursor:not-allowed"'}>${t}</button>`;
      $(el, '#vcb').innerHTML = [
        btn('imp', '가져오기 (Import)', !head), btn('co', '체크아웃 (Check-out)', head && !wc), btn('edit', '파일 수정', !!wc && !wc.conflict),
        btn('ci', '체크인 / 커밋', !!wc), btn('mate', '동료가 커밋', !!head), btn('up', '동기화 (Update)', !!wc), btn('res', '충돌 해결', !!wc && wc.conflict), btn('rst', '초기화', true)].join('');
      let s = R(30, 20, 360, 150, { c: 'hot', r: 8 }) + T(210, 42, '저장소 (Repository)', { c: 'w', b: true, s: 14 });
      for (let i = 0; i < head; i++) { const x = 60 + i * Math.min(60, 300 / Math.max(head, 1)); s += (i ? L(x - 22, 100, x, 100, { c: 'thin' }) : '') + `<circle cx="${x}" cy="100" r="15" class="bx ${i === head - 1 ? 'b' : 'g'}"/>` + T(x, 100, 'v' + (i + 1), { s: 11, b: true }); }
      if (!head) s += T(210, 100, '(비어 있음)', { c: 'w', s: 12 });
      s += T(210, 148, head ? `최신(HEAD) = v${head}` : '', { c: 'w', s: 12 });
      s += R(490, 20, 360, 150, { c: wc ? (wc.conflict ? 'e' : 'b') : 'g', r: 8 }) + T(670, 42, '작업 디렉터리 (Working Copy)', { b: true, s: 14 });
      if (wc) {
        s += T(670, 90, `기준 버전: v${wc.base}${wc.base < head ? '  (저장소가 더 최신)' : ''}`, { s: 13, b: true }) + T(670, 116, wc.conflict ? '⚠ 충돌 표시 포함 — 해결 후 커밋' : wc.dirty ? '수정됨 (커밋 필요)' : '변경 없음', { s: 12.5, c: wc.conflict ? 'e' : wc.dirty ? 'c' : 'm', b: true });
      } else s += T(670, 100, '(체크아웃 전)', { c: 'm', s: 12.5 });
      s += wc ? A(390, 70, 490, 70, { c: 'dash' }) + A(490, 130, 390, 130) : '';
      $(el, '#vcs').innerHTML = svg(880, 190, s, { label: '저장소와 작업 디렉터리' });
      $(el, '#vcl').innerHTML = log.map(l => '› ' + l).join('<br>');
      el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => act(b.dataset.a));
    };
    const act = a => {
      const head = repo.length;
      if (a === 'imp') { repo = [1]; say('Import: 파일을 저장소에 처음 등록 → v1'); }
      else if (a === 'co') { wc = { base: head, dirty: false, conflict: false }; say(`Check-out: 저장소 v${head}을 작업 디렉터리로 받아옴`); }
      else if (a === 'edit') { wc.dirty = true; say('작업 디렉터리에서 파일 수정'); }
      else if (a === 'mate') { repo.push(repo.length + 1); say(`동료가 커밋 → 저장소 v${repo.length}`); }
      else if (a === 'ci') {
        if (wc.conflict) say('커밋 거부: 충돌을 먼저 해결해야 합니다.');
        else if (wc.base < head) say(`커밋 거부(충돌): 저장소가 v${head}로 더 최신입니다. 동기화(Update) 후 병합하고 다시 커밋`);
        else if (!wc.dirty) say('커밋할 변경 사항이 없습니다.');
        else { repo.push(repo.length + 1); wc.base = repo.length; wc.dirty = false; say(`Check-in/Commit 성공 → 새 버전 v${repo.length}`); }
      }
      else if (a === 'up') {
        if (wc.base === head) say('이미 최신입니다.');
        else if (wc.dirty) { wc.base = head; wc.conflict = true; say(`Update: v${head} 반영 중 내 수정과 충돌 발생 → 충돌 해결 필요`); }
        else { wc.base = head; say(`Update(동기화): 최신 v${head}을 작업 디렉터리에 반영`); }
      }
      else if (a === 'res') { wc.conflict = false; say('충돌 해결 완료 → 이제 커밋할 수 있습니다.'); }
      else if (a === 'rst') { repo = []; wc = null; log = ['초기화했습니다.']; }
      draw();
    };
    draw();
  };

  /* ───────── IPSec: 프로토콜 · 모드 선택기 ───────── */
  D.ipsecLab = el => {
    let proto = 'ESP', mode = 'tunnel';
    const defs = {
      'AH-transport': [[['IP 헤더', 'g', 90], ['AH', 'c', 80], ['TCP', 'g', 80], ['데이터', 'g', 140]], [0, 3], null],
      'AH-tunnel': [[['새 IP', 'a', 80], ['AH', 'c', 70], ['원본 IP', 'g', 90], ['TCP', 'g', 70], ['데이터', 'g', 120]], [0, 4], null],
      'ESP-transport': [[['IP 헤더', 'g', 80], ['ESP 헤더', 'c', 90], ['TCP', 'g', 70], ['데이터', 'g', 110], ['ESP 트레일러', 'c', 100], ['ESP 인증', 'c', 80]], [1, 4], [2, 4]],
      'ESP-tunnel': [[['새 IP', 'a', 70], ['ESP 헤더', 'c', 90], ['원본 IP', 'g', 80], ['TCP', 'g', 60], ['데이터', 'g', 90], ['ESP 트레일러', 'c', 100], ['ESP 인증', 'c', 80]], [1, 5], [2, 5]],
    };
    el.innerHTML = `<div class="ctl">${seg([['AH', 'AH'], ['ESP', 'ESP']], proto, 'p')} ${seg([['transport', '전송 모드'], ['tunnel', '터널 모드']], mode, 'm')}</div><div id="isv"></div><div class="tbl" id="ist"></div>`;
    const draw = () => {
      const [blocks, au, en] = defs[proto + '-' + mode];
      let x = 40, xs = [], s = '';
      blocks.forEach(([t, c, w]) => { xs.push([x, w]); s += B(x, 30, w, 48, t, { c, s: 12, r: 4 }); x += w; });
      const a0 = xs[au[0]][0], a1 = xs[au[1]][0] + xs[au[1]][1];
      s += P(`M${a0},86 V94 H${a1} V86`, { c: 'b thick' }) + T(a0, 112, '인증(무결성) 범위', { a: 'start', s: 12, c: 'b', b: true });
      if (en) { const e0 = xs[en[0]][0] + 3, e1 = xs[en[1]][0] + xs[en[1]][1] - 3; s += P(`M${e0},124 V132 H${e1} V124`, { c: 'e thick' }) + T(e0, 150, '암호화(기밀성) 범위', { a: 'start', s: 12, c: 'e', b: true }); }
      $(el, '#isv').innerHTML = svg(880, 168, s, { label: 'IPSec 패킷 구조' });
      const yes = '<b style="color:var(--b)">예</b>', no = '<b style="color:var(--e)">아니오</b>';
      $(el, '#ist').innerHTML = `<table><tr><th>항목</th><th>${proto} · ${mode === 'tunnel' ? '터널' : '전송'}</th></tr>
        <tr><td class="k">기밀성(암호화)</td><td>${proto === 'ESP' ? yes : no}</td></tr><tr><td class="k">무결성 · 인증</td><td>${yes}</td></tr>
        <tr><td class="k">원본 IP 헤더</td><td>${mode === 'transport' ? '그대로 노출 (페이로드만 보호)' : proto === 'ESP' ? '캡슐화되어 암호화됨 + 새 IP 헤더 추가' : '캡슐화(보호)되지만 암호화는 아님 + 새 IP 헤더 추가'}</td></tr>
        <tr><td class="k">주 용도</td><td>${mode === 'transport' ? '호스트 ↔ 호스트' : '게이트웨이 ↔ 게이트웨이 (VPN)'}</td></tr><tr><td class="k">프로토콜 번호</td><td>${proto === 'AH' ? '51' : '50'}</td></tr></table>`;
    };
    bindSeg(el, 'p', v => { proto = v; draw(); }); bindSeg(el, 'm', v => { mode = v; draw(); });
    draw();
  };

  /* ───────── 통합 테스트: 스텁/드라이버 시뮬레이터 ───────── */
  D.integLab = el => {
    const N = { Main: [440, 40], A: [250, 130], B: [630, 130], C: [150, 220], D: [350, 220], E: [630, 220] };
    const PAR = { A: 'Main', B: 'Main', C: 'A', D: 'A', E: 'B' };
    const ORD = { td: ['Main', 'A', 'B', 'C', 'D', 'E'], bu: ['C', 'D', 'E', 'A', 'B', 'Main'] };
    let mode = 'td', k = 1;
    el.innerHTML = `<div class="ctl">${seg([['td', '하향식 (Top-Down)'], ['bu', '상향식 (Bottom-Up)']], mode, 'm')}</div><div class="ctl"><button class="btn sm" id="il0">◀ 이전</button><span id="ilk"></span><button class="btn sm pri" id="il1">다음 통합 ▶</button></div><div id="ilv"></div><div class="note" id="iln"></div>`;
    const draw = () => {
      const ord = ORD[mode], integ = new Set(ord.slice(0, k)); let s = '';
      const show = {};
      Object.keys(N).forEach(n => { if (integ.has(n)) show[n] = 'real'; });
      if (mode === 'td') Object.keys(PAR).forEach(c => { if (!integ.has(c) && integ.has(PAR[c])) show[c] = 'stub'; });
      else Object.keys(PAR).forEach(c => { const p = PAR[c]; if (integ.has(c) && !integ.has(p)) show[p] = 'driver'; });
      Object.keys(PAR).forEach(c => { const p = PAR[c]; if (show[c] && show[p]) s += L(N[p][0], N[p][1] + 20, N[c][0], N[c][1] - 20, { end: 'arr', c: show[c] === 'real' && show[p] === 'real' ? '' : 'dash' }); });
      Object.keys(N).forEach(n => {
        const [x, y] = N[n], t = show[n];
        if (!t) { s += R(x - 55, y - 20, 110, 40, { c: 'g' }).replace('class="bx g"', 'class="bx g faint"') + T(x, y, n, { c: 'm', s: 13 }); return; }
        const cls = t === 'real' ? 'a' : 'y';
        s += `<rect x="${x - 55}" y="${y - 20}" width="110" height="40" rx="3" class="bx ${cls}"${t === 'real' ? '' : ' style="stroke-dasharray:5 3"'}/>` + T(x, y - (t === 'real' ? 0 : 6), n, { b: true, s: 14 }) + (t === 'real' ? '' : T(x, y + 10, t === 'stub' ? '스텁(가짜 하위)' : '드라이버(가짜 상위)', { s: 10.5, c: 'm' }));
      });
      $(el, '#ilv').innerHTML = svg(880, 270, s, { label: '통합 테스트 순서와 스텁·드라이버' });
      const fakes = Object.values(show).filter(v => v !== 'real').length;
      $(el, '#ilk').textContent = ` ${k} / 6 단계 — 통합 순서: ${ord.slice(0, k).join(' → ')} `;
      $(el, '#iln').innerHTML = `${mode === 'td' ? '상위 모듈부터 통합하면 아직 없는 하위 모듈 자리에 <b>스텁</b>이 필요합니다.' : '하위 모듈부터 통합하면 아직 없는 상위 모듈을 대신해 호출해 줄 <b>드라이버</b>가 필요합니다.'} 현재 필요한 ${mode === 'td' ? '스텁' : '드라이버'}: <b>${fakes}개</b>`;
    };
    el.querySelector('#il0').onclick = () => { k = Math.max(1, k - 1); draw(); };
    el.querySelector('#il1').onclick = () => { k = Math.min(6, k + 1); draw(); };
    bindSeg(el, 'm', v => { mode = v; k = 1; draw(); });
    draw();
  };

  /* ───────── 결합도 · 응집도: 클릭하여 예제 보기 ───────── */
  const LAD = {
    coupling: { top: '강함(나쁨)', bot: '약함(좋음)', rows: [
      ['내용', 'Content', 'e', '다른 모듈의 내부 데이터·코드를 직접 참조·수정하거나 중간으로 분기', '// 모듈 A가 모듈 B의 내부 상태를 직접 조작\nB.internalCounter++;        // 내부 변수 직접 수정\ngoto B_middle_of_function;  // 다른 모듈 중간으로 점프', '다른 모듈의 "내부"를 직접'],
      ['공통', 'Common', 'e', '여러 모듈이 같은 전역(공유) 데이터 영역을 사용', 'int g_config;                 // 전역 변수\nvoid a() { g_config = 1; }\nvoid b() { use(g_config); }', '전역 변수·공유 메모리'],
      ['외부', 'External', 'c', '외부에서 정한 데이터 형식·통신 프로토콜·장치 인터페이스를 공유', '// 두 모듈이 같은 파일 포맷(CSV 컬럼 순서)에 의존\nwriteReport(csvFormatV1);\nreadReport(csvFormatV1);', '외부 포맷·프로토콜·장치'],
      ['제어', 'Control', 'c', '제어 신호(플래그)를 넘겨 상대 모듈의 내부 논리를 제어', 'void print(int mode) {    // mode 로 동작 결정\n  if (mode == 1) printPdf();\n  else printText();\n}', '플래그·제어 코드 전달'],
      ['스탬프', 'Stamp', 'a', '자료 구조(레코드·객체)를 통째로 전달하고 일부만 사용', 'void ship(Order o) {      // Order 전체를 받고\n  deliver(o.address);       // 주소만 사용\n}', '구조체·객체 통째로 전달'],
      ['자료', 'Data', 'b', '필요한 값만 매개변수로 전달 (가장 바람직)', 'int add(int a, int b) { return a + b; }', '필요한 값만 인자로'],
    ] },
    cohesion: { top: '강함(좋음)', bot: '약함(나쁨)', rows: [
      ['기능적', 'Functional', 'b', '모든 요소가 하나의 기능만 수행 (최선)', 'int calcTax(int price) {\n  return price * 10 / 100;   // 세금 계산 하나만\n}', '단일 기능'],
      ['순차적', 'Sequential', 'b', '한 요소의 출력이 다음 요소의 입력이 됨', 'raw   = read();\nclean = parse(raw);        // 앞 출력 → 뒤 입력\nsave(clean);', '출력 → 입력 파이프라인'],
      ['교환(통신)적', 'Communicational', 'f', '같은 입력 또는 출력 자료를 사용하는 요소들', 'void report(Record r) {\n  print(r);                 // 같은 자료 r 을\n  log(r);                   // 함께 사용\n}', '같은 자료를 공유'],
      ['절차적', 'Procedural', 'a', '정해진 순서대로 수행해야 하는 요소들(자료 연관은 없음)', 'login();\nloadMenu();\ncheckPermission();          // 순서가 중요', '실행 순서가 중요'],
      ['시간적', 'Temporal', 'c', '특정 시점에 함께 실행되는 요소들 (초기화·종료)', 'void init() {\n  openDB(); loadConfig(); clearCache();   // 시작할 때 한꺼번에\n}', '같은 시간대에 실행'],
      ['논리적', 'Logical', 'e', '논리적으로 유사한 기능을 묶고 인자로 선택', 'void io(int type) {\n  if (type == 1) readFile();\n  else writeFile();\n}', '유사 기능 + 선택 인자'],
      ['우연적', 'Coincidental', 'e', '서로 관련 없는 기능들이 모여 있음 (최악)', 'void misc() {\n  calcTax(); sendMail(); drawLogo();   // 서로 무관\n}', '관련 없는 기능 모음'],
    ] },
  };
  D.ladderLab = (el, arg) => {
    const d = LAD[arg || 'coupling'], n = d.rows.length;
    let cur = 0;
    el.innerHTML = `<div class="lad"><div class="lad-l"><div class="lad-ax">${d.top}</div>${d.rows.map((r, i) => `<button class="lad-r" data-i="${i}" style="--w:${100 - i * (55 / (n - 1))}%;--c:var(--${r[2]})"><b>${i + 1}. ${r[0]}</b><small>${r[1]}</small></button>`).join('')}<div class="lad-ax">${d.bot}</div></div><div class="lad-d" id="ld"></div></div>`;
    const draw = () => {
      el.querySelectorAll('.lad-r').forEach((b, i) => b.classList.toggle('on', i === cur));
      const r = d.rows[cur];
      $(el, '#ld').innerHTML = `<h4>${cur + 1}. ${r[0]} ${arg === 'cohesion' ? '응집도' : '결합도'} <span style="text-transform:none;letter-spacing:0">${r[1]}</span></h4><p style="margin:6px 0 10px">${r[3]}</p><pre style="margin:0"><code>${S.esc(r[4])}</code></pre><p style="margin:10px 0 0"><span class="chip ${r[2]}">키워드</span>${r[5]}</p>`;
    };
    el.querySelectorAll('.lad-r').forEach(b => b.onclick = () => { cur = +b.dataset.i; draw(); });
    draw();
  };

  /* ───────── UML 관계 맞추기 ───────── */
  D.relQuiz = el => {
    const REL = [
      ['의존', 'dash', 'open', false, 'A가 B를 일시적으로 사용 (매개변수·지역변수)'], ['연관', '', 'open', false, 'A가 B를 필드로 참조하는 장기 관계'],
      ['일반화', '', 'tri', false, '자식 → 부모 상속(is-a), 실선 + 빈 삼각형'], ['실체화', 'dash', 'tri', false, '클래스 → 인터페이스 구현, 점선 + 빈 삼각형'],
      ['집합', '', 'dia', true, '전체-부분, 생명주기 독립 (빈 마름모)'], ['합성', '', 'diaf', true, '전체와 부분의 생명주기가 같음 (찬 마름모)'],
    ];
    let score = 0, total = 0, streak = 0, cur = null;
    el.innerHTML = `<div id="rqs"></div><div class="ctl" id="rqo"></div><div class="note" id="rqn"></div><div class="out" id="rqt"></div>`;
    const next = () => {
      cur = REL[Math.floor(Math.random() * REL.length)];
      const [, cls, end, whole] = cur;
      let s = B(160, 40, 140, 56, 'A', { c: 'a', b: true, s: 15 }) + B(580, 40, 140, 56, 'B', { c: 'b', b: true, s: 15 });
      s += whole ? L(580, 68, 300, 68, { end, c: cls }) : L(300, 68, 580, 68, { end, c: cls });
      $(el, '#rqs').innerHTML = svg(880, 130, s, { label: '관계 맞추기 문제' });
      $(el, '#rqo').innerHTML = shuffle(REL).map(r => `<button class="btn" data-n="${r[0]}">${r[0]}</button>`).join('');
      $(el, '#rqn').textContent = '그림의 선과 화살표 모양이 나타내는 UML 관계는?';
      el.querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
        const ok = b.dataset.n === cur[0]; total++; ok ? (score++, streak++) : (streak = 0);
        el.querySelectorAll('[data-n]').forEach(x => { x.disabled = true; if (x.dataset.n === cur[0]) x.classList.add('on'); });
        $(el, '#rqn').innerHTML = `<b style="color:var(--${ok ? 'b' : 'e'})">${ok ? '정답' : '오답'}</b> — ${cur[0]}: ${cur[4]} <button class="btn sm pri" id="rqx">다음 문제</button>`;
        $(el, '#rqt').textContent = `정답 ${score}/${total} · 연속 ${streak}`;
        $(el, '#rqx').onclick = next;
      });
    };
    next();
  };

  /* ───────── 디자인 패턴: 키워드 → 패턴 ───────── */
  D.patGame = el => {
    const PS = window.PATTERNS || [];
    let score = 0, total = 0, streak = 0;
    el.innerHTML = `<div class="note" style="font-size:15px;color:var(--text)" id="pgq"></div><div class="ctl" id="pgo"></div><div class="note" id="pgn"></div><div class="out" id="pgt"></div>`;
    const next = () => {
      const p = PS[Math.floor(Math.random() * PS.length)], key = p.keys[Math.floor(Math.random() * p.keys.length)];
      const opts = shuffle([p].concat(shuffle(PS.filter(x => x !== p && x.cat === p.cat)).slice(0, 3)));
      $(el, '#pgq').innerHTML = `시험 키워드 <mark>${key}</mark> 에 해당하는 패턴은?`;
      $(el, '#pgo').innerHTML = opts.map(o => `<button class="btn" data-id="${o.id}">${o.kr} <small style="color:var(--muted)">${o.en}</small></button>`).join('');
      $(el, '#pgn').textContent = '같은 분류의 패턴끼리 보기로 나옵니다.';
      el.querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
        const ok = b.dataset.id === p.id; total++; ok ? (score++, streak++) : (streak = 0);
        el.querySelectorAll('[data-id]').forEach(x => { x.disabled = true; if (x.dataset.id === p.id) x.classList.add('on'); });
        $(el, '#pgn').innerHTML = `<b style="color:var(--${ok ? 'b' : 'e'})">${ok ? '정답' : '오답'}</b> — ${p.kr}: ${p.intent} <button class="btn sm pri" id="pgx">다음 문제</button>`;
        $(el, '#pgt').textContent = `정답 ${score}/${total} · 연속 ${streak}`;
        $(el, '#pgx').onclick = next;
      });
    };
    next();
  };
})();
