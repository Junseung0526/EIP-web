/* 인터랙티브 시뮬레이터 */
(function () {
  const { T, R, L, P, C, B, A, svg } = S;
  const D = DIAGRAMS;
  const App = (window.App = window.App || {});
  App.timers = App.timers || [];
  const every = (fn, ms) => { const id = setInterval(fn, ms); App.timers.push(id); return id; };
  const stop = id => { clearInterval(id); };
  const seg = (items, cur, attr) => `<span class="seg">${items.map(([v, t]) => `<button data-${attr}="${v}" class="${v === cur ? 'on' : ''}">${t}</button>`).join('')}</span>`;

  /* ───────── 이진 트리 레이아웃 ───────── */
  const node = (v, l, r) => ({ v, l: l || null, r: r || null });
  function layout(root, dx = 62, dy = 72, x0 = 40, y0 = 38) {
    let i = 0, maxD = 0; const all = [];
    (function go(n, d) { if (!n) return; go(n.l, d + 1); n.x = x0 + i++ * dx; n.y = y0 + d * dy; n.d = d; maxD = Math.max(maxD, d); all.push(n); go(n.r, d + 1); })(root, 0);
    return { all, w: x0 * 2 + (i - 1) * dx, h: y0 * 2 + maxD * dy - 10 };
  }
  function treeEdges(n, r = 20) {
    let s = '';
    [n.l, n.r].forEach(c => {
      if (!c) return;
      const dx = c.x - n.x, dy = c.y - n.y, d = Math.hypot(dx, dy);
      s += L(n.x + dx / d * r, n.y + dy / d * r, c.x - dx / d * r, c.y - dy / d * r);
      s += treeEdges(c, r);
    });
    return s;
  }

  /* ───────── 그래프 최대 간선 수 (정점 수가 부드럽게 변함) ───────── */
  D.graphEdges = el => {
    let n = 5, directed = false;
    el.innerHTML = `<div class="ctl"><label>정점 수 n = <b id="gn">5</b></label><input type="range" id="gr" min="2" max="8" value="5"> ${seg([['u', '무방향 그래프'], ['d', '방향 그래프']], 'u', 'm')}</div><div id="gsvg"></div><div class="out" id="gout"></div><div class="note">완전 그래프(모든 정점 쌍이 연결)일 때가 최대 간선 수입니다.</div>`;
    const alive = () => el.isConnected;
    const draw = nf => {
      const m = Math.ceil(nf - 1e-6), cx = 220, cy = 135, rad = 105, op = i => Math.max(0, Math.min(1, nf - i));
      const pts = [...Array(m)].map((_, i) => { const th = -Math.PI / 2 + i * 2 * Math.PI / nf; return [cx + rad * Math.cos(th), cy + rad * Math.sin(th)]; });
      let s = '';
      for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) {
        if (i === j || (!directed && j < i)) continue;
        const [x1, y1] = pts[i], [x2, y2] = pts[j], dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, o = Math.min(op(i), op(j));
        if (!directed) s += `<g opacity="${o}">${L(x1, y1, x2, y2, { c: 'thin' })}</g>`;
        else { const nx = -uy * 16, ny = ux * 16, mx = (x1 + x2) / 2 + nx, my = (y1 + y2) / 2 + ny; s += `<g opacity="${o}">${P(`M${S.n1(x1 + ux * 18)},${S.n1(y1 + uy * 18)} Q${S.n1(mx)},${S.n1(my)} ${S.n1(x2 - ux * 21)},${S.n1(y2 - uy * 21)}`, { c: 'thin', end: 'arr' })}</g>`; }
      }
      pts.forEach(([x, y], i) => s += `<g opacity="${op(i)}">${C(x, y, 17, { c: 'a' })}${T(x, y, 'ABCDEFGH'[i], { b: true })}</g>`);
      el.querySelector('#gsvg').innerHTML = svg(440, 270, s, { maxw: 480, label: '완전 그래프' });
    };
    const anim = S.ease(n, draw, alive, 0.16);
    const text = () => {
      const cnt = directed ? n * (n - 1) : n * (n - 1) / 2;
      el.querySelector('#gout').innerHTML = directed
        ? `방향 그래프: 최대 간선 수 = <b>n(n−1)</b> = ${n}×${n - 1} = <b>${cnt}</b>`
        : `무방향 그래프: 최대 간선 수 = <b>n(n−1)/2</b> = ${n}×${n - 1}/2 = <b>${cnt}</b>`;
      el.querySelector('#gn').textContent = n;
    };
    el.querySelector('#gr').oninput = e => { n = +e.target.value; text(); anim.to(n); };
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { directed = b.dataset.m === 'd'; el.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); text(); draw(anim.value); });
    text(); anim.set(n);
  };

  /* ───────── 트리 용어/차수 ───────── */
  D.treeTerms = el => {
    const tree = { v: 'A', c: [{ v: 'B', c: [{ v: 'E' }, { v: 'F', c: [{ v: 'K' }] }] }, { v: 'C', c: [{ v: 'G' }] }, { v: 'D', c: [{ v: 'H' }, { v: 'I' }, { v: 'J' }] }] };
    let i = 0, all = [];
    (function go(n, d, par) { n.d = d; n.par = par; n.deg = n.c ? n.c.length : 0; if (n.c) n.c.forEach(c => go(c, d + 1, n)); n.leaf = !n.c; all.push(n); })(tree, 0, null);
    i = 0; (function pos(n) { if (!n.c) n.x = 40 + i++ * 62; else { n.c.forEach(pos); n.x = (n.c[0].x + n.c[n.c.length - 1].x) / 2; } n.y = 40 + n.d * 72; })(tree);
    const W = 40 * 2 + (i - 1) * 62, H = 40 * 2 + 3 * 72 - 10;
    let mode = 'deg', sel = null;
    el.innerHTML = `<div class="ctl">${seg([['deg', '차수(Degree)'], ['lv', '레벨(Level)'], ['leaf', '단말/비단말']], 'deg', 'm')} <small>노드를 선택하면 상세 표시</small></div><div class="scroll" id="tsvg"></div><div class="note" id="tinfo"></div><div class="out" id="tsum"></div>`;
    const maxDeg = Math.max(...all.map(n => n.deg)), leaves = all.filter(n => n.leaf).map(n => n.v), height = Math.max(...all.map(n => n.d)) + 1;
    const draw = () => {
      let s = '';
      all.forEach(n => (n.c || []).forEach(c => s += L(n.x, n.y + 20, c.x, c.y - 20)));
      all.forEach(n => {
        const lab = mode === 'deg' ? n.deg : mode === 'lv' ? 'L' + (n.d + 1) : n.leaf ? '단말' : '';
        const cls = mode === 'leaf' ? (n.leaf ? 'b' : 'a') : ['g', 'a', 'b', 'c', 'd'][Math.min(n.deg, 4)] || 'g';
        s += `<g class="click" data-n="${n.v}">` + C(n.x, n.y, 20, { c: sel === n.v ? 'hot' : cls }) + T(n.x, n.y, n.v, { b: true, s: 15, c: sel === n.v ? 'w' : '' }) + `</g>`;
        if (lab !== '') s += T(n.x + 26, n.y - 15, lab, { s: 12, b: true, c: mode === 'deg' ? 'e' : 'd' });
      });
      el.querySelector('#tsvg').innerHTML = svg(W, H, s, { maxw: 640, label: '트리 용어 예시' });
      el.querySelectorAll('#tsvg [data-n]').forEach(g => g.onclick = () => { sel = g.dataset.n; draw(); info(); });
    };
    const info = () => {
      const n = all.find(x => x.v === sel);
      el.querySelector('#tinfo').innerHTML = n ? `<b>${n.v}</b> — 차수 <b>${n.deg}</b> (자식 ${n.deg}개${n.c ? ': ' + n.c.map(c => c.v).join(', ') : ''}) · 레벨 <b>${n.d + 1}</b> · 부모 ${n.par ? n.par.v : '없음(루트)'} · ${n.leaf ? '단말(리프) 노드' : '비단말 노드'}` : '노드를 클릭하면 차수·레벨·부모를 보여 줍니다.';
    };
    el.querySelector('#tsum').innerHTML = `노드 수 ${all.length} · 간선 수 ${all.length - 1} (= 노드 − 1)<br>노드의 차수 = 자식 수 / <b>트리의 차수 = 노드 차수 중 최댓값 = ${maxDeg}</b><br>단말 노드(차수 0) = {${leaves.join(', ')}} → ${leaves.length}개 · 트리 높이(깊이) = ${height} (루트를 레벨 1로 볼 때)`;
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
    draw(); info();
  };

  /* ───────── 트리 순회 (애니메이션) ───────── */
  const TRV = () => {
    const G = node('G'), H = node('H'), Dn = node('D'), E = node('E', G, H), Bn = node('B', Dn, E), F = node('F'), Cn = node('C', null, F);
    return node('A', Bn, Cn);
  };
  D.traversal = (el, arg) => {
    let mode = arg === 'in' || arg === 'post' ? arg : 'pre', step = 0, timer = null;
    const root = TRV(), lay = layout(root, 62, 76, 44, 40), R0 = 21;
    const seq = [];
    (function tour(n) { if (!n) return; seq.push({ n, t: 'pre' }); tour(n.l); seq.push({ n, t: 'in' }); tour(n.r); seq.push({ n, t: 'post' }); })(root);
    const dotPos = (n, t) => t === 'pre' ? [n.x - R0, n.y + 5] : t === 'in' ? [n.x, n.y + R0 + 1] : [n.x + R0, n.y + 5];
    const NAME = { pre: ['전위 순회 Preorder', 'V → L → R  (루트 먼저)', '노드의 왼쪽 점'], in: ['중위 순회 Inorder', 'L → V → R  (루트는 가운데)', '노드의 아래쪽 점'], post: ['후위 순회 Postorder', 'L → R → V  (루트 마지막)', '노드의 오른쪽 점'] };
    el.innerHTML = `<div class="ctl">${seg([['pre', '전위 (VLR)'], ['in', '중위 (LVR)'], ['post', '후위 (LRV)']], mode, 'm')}</div>
      <div class="ctl"><button class="btn sm" id="t0">⏮ 처음</button><button class="btn sm" id="t1">◀ 이전</button><button class="btn sm pri" id="t2">▶ 자동 재생</button><button class="btn sm" id="t3">다음 ▶</button><button class="btn sm" id="t4">끝까지 ⏭</button></div>
      <div class="scroll" id="vsvg"></div><div class="note" id="vnote"></div><div class="out" id="vout"></div>`;
    let segEls = [], nodeEls = {}, dotEls = [], badgeEls = {};
    /* DOM은 한 번만 만들고, 단계가 바뀌면 클래스/속성만 갱신 → CSS 전환으로 부드럽게 */
    const build = () => {
      let s = treeEdges(root, R0);
      for (let i = 1; i < seq.length; i++) {
        const a = seq[i - 1], b = seq[i], [x1, y1] = dotPos(a.n, a.t), [x2, y2] = dotPos(b.n, b.t);
        let d;
        if (a.n === b.n) { const cx = a.t === 'pre' ? a.n.x - R0 : a.n.x + R0; d = `M${x1},${y1} Q${cx},${a.n.y + R0 + 6} ${x2},${y2}`; }
        else { const dx = x2 - x1, dy = y2 - y1, dd = Math.hypot(dx, dy); d = `M${S.n1(x1 + dx / dd * 4)},${S.n1(y1 + dy / dd * 4)} L${S.n1(x2 - dx / dd * 6)},${S.n1(y2 - dy / dd * 6)}`; }
        s += `<path data-s="${i}" d="${d}" class="ln dash faint" marker-end="url(#m-arr)"/>`;
      }
      lay.all.forEach(n => {
        s += `<circle data-n="${n.v}" cx="${n.x}" cy="${n.y}" r="${R0}" class="bx"/><g data-t="${n.v}">${T(n.x, n.y, n.v, { b: true, s: 15 })}</g>`;
        ['pre', 'in', 'post'].forEach(t => { const [dx, dy] = dotPos(n, t); s += `<circle data-d="${n.v}:${t}" cx="${dx}" cy="${dy}" r="${t === mode ? 5 : 2.6}" class="fill c" opacity="${t === mode ? 1 : .35}"/>`; });
        s += `<g data-b="${n.v}" style="opacity:0;transition:opacity .3s">${T(n.x, n.y - R0 - 9, '', { b: true, s: 13, c: 'b' })}</g>`;
      });
      el.querySelector('#vsvg').innerHTML = svg(lay.w, lay.h + 20, s, { maxw: 600, label: NAME[mode][0] + ' 경로 애니메이션' });
      const q = sel => [...el.querySelectorAll(sel)];
      segEls = q('[data-s]'); nodeEls = {}; q('[data-n]').forEach(c => nodeEls[c.dataset.n] = [c, el.querySelector(`[data-t="${c.dataset.n}"] text`)]);
      dotEls = q('[data-d]'); badgeEls = {}; q('[data-b]').forEach(g => badgeEls[g.dataset.b] = g);
    };
    const update = () => {
      const visited = [];
      seq.forEach((q, i) => { if (i < step + 1 && q.t === mode) visited.push(q.n.v); });
      const cur = seq[step - 1];
      segEls.forEach(p => { const on = +p.dataset.s <= step; p.setAttribute('class', on ? 'ln ac seg-on' : 'ln dash faint'); p.setAttribute('marker-end', `url(#m-arr${on ? '-a' : ''})`); });
      Object.entries(nodeEls).forEach(([v, [c, t]]) => { const isCur = cur && cur.n.v === v, done = visited.includes(v); c.setAttribute('class', 'bx ' + (isCur ? 'hot' : done ? 'b' : '')); t.setAttribute('class', 't' + (isCur ? ' w' : '')); });
      dotEls.forEach(c => { const [v, t] = c.dataset.d.split(':'), idx = seq.findIndex(q => q.n.v === v && q.t === t); if (t === mode) c.setAttribute('class', 'fill ' + (idx < step ? 'b' : 'c')); });
      Object.entries(badgeEls).forEach(([v, g]) => { const o = visited.indexOf(v); g.style.opacity = o >= 0 ? 1 : 0; if (o >= 0) g.querySelector('text').textContent = o + 1; });
      el.querySelector('#vout').innerHTML = `${NAME[mode][0]} 결과: <b>${visited.join(' → ') || '(시작 전)'}</b>`;
      const q = step > 0 ? seq[step - 1] : null;
      el.querySelector('#vnote').innerHTML = step === 0 ? `규칙: <b>${NAME[mode][1]}</b> — 각 노드의 <b>${NAME[mode][2]}</b>(큰 점)을 외곽선 따라 지나갈 때 방문` : step >= seq.length ? `완료. 방문 순서 = ${visited.join(', ')}` : `${q.n.v}의 ${q.t === 'pre' ? '왼쪽' : q.t === 'in' ? '아래' : '오른쪽'} 점 도착${q.t === mode ? ` → <b>${q.n.v} 방문</b>` : ' (방문 안 함)'}`;
    };
    const setStep = v => { step = Math.max(0, Math.min(seq.length, v)); update(); };
    const playBtn = el.querySelector('#t2');
    const halt = () => { if (timer) { stop(timer); timer = null; playBtn.textContent = '▶ 자동 재생'; } };
    el.querySelector('#t0').onclick = () => { halt(); setStep(0); };
    el.querySelector('#t1').onclick = () => { halt(); setStep(step - 1); };
    el.querySelector('#t3').onclick = () => { halt(); setStep(step + 1); };
    el.querySelector('#t4').onclick = () => { halt(); setStep(seq.length); };
    playBtn.onclick = () => { if (timer) return halt(); if (step >= seq.length) step = 0; playBtn.textContent = '⏸ 일시정지'; timer = every(() => { if (step >= seq.length) return halt(); setStep(step + 1); }, 650); };
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { halt(); mode = b.dataset.m; el.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); step = 0; build(); update(); });
    build(); update();
  };

  /* ───────── 중위 → 후위/전위 변환 ───────── */
  const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  function tokenize(s) { const t = s.match(/[A-Za-z0-9.]+|[-+*/%^()]/g); return t || []; }
  function toPostfix(tok) {
    const out = [], st = [], rows = [];
    for (const t of tok) {
      let act = '';
      if (/^[A-Za-z0-9.]+$/.test(t)) { out.push(t); act = '피연산자 → 출력'; }
      else if (t === '(') { st.push(t); act = '여는 괄호 → 스택에 push'; }
      else if (t === ')') { while (st.length && st[st.length - 1] !== '(') out.push(st.pop()); if (!st.length) throw new Error('괄호 짝이 맞지 않습니다'); st.pop(); act = '닫는 괄호 → "(" 나올 때까지 pop 하여 출력'; }
      else {
        const pops = [];
        while (st.length && st[st.length - 1] !== '(' && (PREC[st[st.length - 1]] > PREC[t] || (PREC[st[st.length - 1]] === PREC[t] && t !== '^'))) { const p = st.pop(); out.push(p); pops.push(p); }
        st.push(t); act = pops.length ? `우선순위가 같거나 높은 ${pops.join(' ')} pop 후 출력, ${t} push` : `${t} push`;
      }
      rows.push([t, st.join(' ') || '∅', out.join(' ') || '∅', act]);
    }
    while (st.length) { const p = st.pop(); if (p === '(') throw new Error('괄호 짝이 맞지 않습니다'); out.push(p); rows.push(['(끝)', st.join(' ') || '∅', out.join(' '), `스택에 남은 ${p} pop → 출력`]); }
    return { out, rows };
  }
  function buildTree(post) {
    const st = [];
    for (const t of post) { if (PREC[t]) { const r = st.pop(), l = st.pop(); if (!l || !r) throw new Error('수식이 올바르지 않습니다'); st.push(node(t, l, r)); } else st.push(node(t)); }
    if (st.length !== 1) throw new Error('수식이 올바르지 않습니다');
    return st[0];
  }
  const trav = {
    pre: n => n ? [n.v, ...trav.pre(n.l), ...trav.pre(n.r)] : [],
    in: n => n ? [...trav.in(n.l), n.v, ...trav.in(n.r)] : [],
    post: n => n ? [...trav.post(n.l), ...trav.post(n.r), n.v] : [],
  };
  D.postfix = el => {
    const ex = ['A+B*C', '(A+B)*C', 'A*(B+C)/D', 'A+B*C-D/E', 'A*B+C*D', 'A^B^C'];
    el.innerHTML = `<div class="ctl"><input type="text" id="pin" value="A+B*C-D/E" size="22" spellcheck="false"><button class="btn pri sm" id="pgo">변환</button></div>
      <div class="ctl">${ex.map(e => `<button class="btn sm" data-e="${e}">${e}</button>`).join('')}</div>
      <div id="pres"></div>`;
    const run = () => {
      const box = el.querySelector('#pres');
      try {
        const tok = tokenize(el.querySelector('#pin').value);
        if (!tok.length) throw new Error('수식을 입력하세요');
        const { out, rows } = toPostfix(tok), tree = buildTree(out), lay = layout(tree, 50, 60, 34, 30);
        let s = treeEdges(tree, 17);
        lay.all.forEach(n => s += C(n.x, n.y, 17, { c: PREC[n.v] ? 'c' : 'a' }) + T(n.x, n.y, n.v, { b: true }));
        box.innerHTML = `<div class="out">후위(Postfix): <b>${out.join('')}</b> &nbsp;|&nbsp; 전위(Prefix): <b>${trav.pre(tree).join('')}</b> &nbsp;|&nbsp; 중위(Infix): <b>${trav.in(tree).join('')}</b></div>
          <div class="tbl"><table><tr><th>읽은 토큰</th><th>스택</th><th>출력</th><th>동작</th></tr>${rows.map(r => `<tr><td class="k">${S.esc(r[0])}</td><td>${S.esc(r[1])}</td><td>${S.esc(r[2])}</td><td>${S.esc(r[3])}</td></tr>`).join('')}</table></div>
          <div class="note">수식 트리 (연산자=주황, 피연산자=파랑) — 이 트리를 <b>전위/중위/후위</b> 순회한 것이 각각 전위·중위·후위 표기입니다.</div>
          <div class="scroll">${svg(lay.w, lay.h, s, { maxw: 420, label: '수식 트리' })}</div>`;
      } catch (e) { box.innerHTML = `<div class="callout warn"><b>오류</b>${S.esc(e.message)}</div>`; }
    };
    el.querySelector('#pgo').onclick = run;
    el.querySelector('#pin').onkeydown = e => { if (e.key === 'Enter') run(); };
    el.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { el.querySelector('#pin').value = b.dataset.e; run(); });
    run();
  };

  /* ───────── 스택 ───────── */
  D.stack = el => {
    const CAP = 6; let st = ['A', 'B'], msg = '값을 입력하고 PUSH / POP 을 눌러 보세요. (용량 6)', log = [], last = '', popped = null;
    el.innerHTML = `<div class="ctl"><input type="text" id="sv" size="6" maxlength="4" value="C" aria-label="값"><button class="btn pri sm" id="sp">PUSH (삽입)</button><button class="btn sm" id="so">POP (삭제)</button><button class="btn sm" id="sk">PEEK</button><button class="btn sm" id="sc">비우기</button></div><div id="ssvg"></div><div class="note" id="smsg"></div><div class="out" id="slog"></div>`;
    /* 골격(틀·TOP 포인터)은 한 번만 만들고 항목만 갱신 → 포인터가 미끄러지듯 이동 */
    let sk = L(60, 30, 60, 250, { c: 'thick' }) + L(180, 30, 180, 250, { c: 'thick' }) + L(60, 250, 180, 250, { c: 'thick' });
    for (let i = 0; i < CAP; i++) sk += `<rect x="64" y="${250 - (i + 1) * 36}" width="112" height="34" rx="4" class="bx g" opacity=".5"/>`;
    sk += '<g id="itm"></g>' + `<g id="arw" class="glide">${A(256, 0, 190, 0, { c: 'ac' })}${T(262, 0, 'TOP = 1', { a: 'start', b: true, c: 'a', s: 14 })}</g>` + T(120, 272, 'Bottom', { s: 12, c: 'm' });
    sk += T(300, 60, '삽입(PUSH): TOP + 1 후 저장\n삭제(POP): TOP 위치 값 꺼내고 TOP − 1\nLIFO: Last In, First Out\nTOP == 용량−1 → Overflow\nTOP == −1 → Underflow', { a: 'start', s: 12.5, lh: 22, c: 'm' });
    el.querySelector('#ssvg').innerHTML = svg(600, 285, sk, { maxw: 640, label: '스택 시뮬레이터' });
    const slot = (v, i, cls, tc) => `<rect x="64" y="${250 - (i + 1) * 36}" width="112" height="34" rx="4" class="bx ${cls}"/>` + T(120, 250 - (i + 1) * 36 + 17, v, { b: true, s: 15, c: tc });
    const draw = () => {
      let h = '';
      st.forEach((v, i) => { const top = i === st.length - 1; h += `<g${top && last === 'push' ? ' class="drop"' : ''}>${slot(v, i, top ? 'hot' : 'a', top ? 'w' : '')}</g>`; });
      if (last === 'pop' && popped != null) h += `<g class="leave">${slot(popped, st.length, 'hot', 'w')}</g>`;
      el.querySelector('#itm').innerHTML = h;
      const ty = st.length ? 250 - st.length * 36 + 17 : 250 + 12;
      const arw = el.querySelector('#arw'); arw.style.transform = `translateY(${ty}px)`;
      arw.querySelector('text').textContent = `TOP = ${st.length ? st.length - 1 : -1}`;
      el.querySelector('#smsg').textContent = msg;
      el.querySelector('#slog').innerHTML = log.slice(-5).join(' · ') || '&nbsp;';
    };
    const v = () => el.querySelector('#sv').value.trim() || '?';
    el.querySelector('#sp').onclick = () => { last = ''; if (st.length >= CAP) msg = 'Overflow — 스택이 가득 찼습니다'; else { const x = v(); st.push(x); last = 'push'; msg = `PUSH(${x}) 완료`; log.push(`push ${x}`); } draw(); };
    el.querySelector('#so').onclick = () => { last = ''; if (!st.length) msg = 'Underflow — 스택이 비어 있습니다'; else { popped = st.pop(); last = 'pop'; msg = `POP → ${popped} (가장 나중에 들어온 값이 먼저 나옴)`; log.push(`pop ${popped}`); } draw(); };
    el.querySelector('#sk').onclick = () => { last = ''; msg = st.length ? `PEEK → ${st[st.length - 1]} (삭제하지 않고 TOP만 확인)` : '비어 있음'; draw(); };
    el.querySelector('#sc').onclick = () => { last = ''; st = []; log = []; msg = '스택을 비웠습니다 (TOP = −1)'; draw(); };
    draw();
  };

  /* ───────── 정렬 시각화 (막대가 실제로 자리를 바꾸며 이동) ───────── */
  function frames(alg, arr0) {
    const a = arr0.slice(), n = a.length, ids = a.map((_, i) => i), F = [], snaps = [];
    const sw = (i, j) => { [a[i], a[j]] = [a[j], a[i]]; [ids[i], ids[j]] = [ids[j], ids[i]]; };
    const f = o => F.push(Object.assign({ a: a.slice(), ids: ids.slice(), cmp: [], swap: false, sorted: [], key: -1, p: snaps.length, note: '' }, o));
    const sortedSet = new Set();
    const mark = () => [...sortedSet];
    f({ note: '초기 상태' });
    if (alg === 'bubble') {
      for (let p = 0; p < n - 1; p++) {
        let swp = false;
        for (let j = 0; j < n - 1 - p; j++) {
          f({ cmp: [j, j + 1], sorted: mark(), note: `${a[j]} 와 ${a[j + 1]} 비교 → ${a[j] > a[j + 1] ? '앞이 크므로 교환' : '그대로'}` });
          if (a[j] > a[j + 1]) { sw(j, j + 1); swp = true; f({ cmp: [j, j + 1], swap: true, sorted: mark(), note: `교환 → ${a.join(' ')}` }); }
        }
        sortedSet.add(n - 1 - p); snaps.push(a.slice());
        f({ sorted: mark(), note: `${p + 1}회전 종료: 가장 큰 값 ${a[n - 1 - p]} 이(가) 맨 뒤로 확정` });
        if (!swp) { for (let i = 0; i < n; i++) sortedSet.add(i); f({ sorted: mark(), note: '교환이 없었으므로 정렬 완료(조기 종료)' }); break; }
      }
    } else if (alg === 'selection') {
      for (let i = 0; i < n - 1; i++) {
        let m = i;
        for (let j = i + 1; j < n; j++) { f({ cmp: [m, j], key: m, sorted: mark(), note: `현재 최솟값 ${a[m]} vs ${a[j]} → ${a[j] < a[m] ? a[j] + ' 이(가) 새 최솟값' : '유지'}` }); if (a[j] < a[m]) m = j; }
        if (m !== i) { sw(i, m); f({ cmp: [i, m], swap: true, sorted: mark(), note: `최솟값 ${a[i]} 을(를) ${i + 1}번째 위치로 교환` }); }
        sortedSet.add(i); snaps.push(a.slice());
        f({ sorted: mark(), note: `${i + 1}회전 종료: ${i + 1}번째 값 ${a[i]} 확정` });
      }
    } else if (alg === 'insertion') {
      sortedSet.add(0); snaps.push(a.slice()); f({ sorted: mark(), note: '첫 번째 값은 이미 정렬된 것으로 간주' });
      for (let i = 1; i < n; i++) {
        let j = i; const key = a[i];
        f({ key: j, sorted: mark(), note: `삽입할 값(key) = ${key}` });
        while (j > 0 && a[j - 1] > a[j]) {
          f({ cmp: [j - 1, j], key: j, sorted: mark(), note: `${a[j - 1]} > ${a[j]} → 한 칸 뒤로 이동` });
          sw(j - 1, j); j--;
          f({ cmp: [j, j + 1], swap: true, key: j, sorted: mark(), note: `이동 → ${a.join(' ')}` });
        }
        if (j > 0) f({ cmp: [j - 1, j], key: j, sorted: mark(), note: `${a[j - 1]} ≤ ${a[j]} → 여기에 삽입` });
        sortedSet.add(i); snaps.push(a.slice()); f({ sorted: mark(), note: `${i}회전 종료: 앞쪽 ${i + 1}개 정렬 완료` });
      }
    } else {
      (function ms(l, r) { if (l >= r) return; const m = (l + r) >> 1; ms(l, m); ms(m + 1, r);
        const idx = [...Array(r - l + 1)].map((_, k) => l + k).sort((x, y) => a[x] - a[y] || x - y), va = idx.map(k => a[k]), vi = idx.map(k => ids[k]);
        idx.forEach((_, k) => { a[l + k] = va[k]; ids[l + k] = vi[k]; });
        snaps.push(a.slice()); f({ range: [l, r], note: `[${l + 1}..${m + 1}] 와 [${m + 2}..${r + 1}] 병합 → ${a.slice(l, r + 1).join(' ')}` }); })(0, n - 1);
    }
    for (let i = 0; i < n; i++) sortedSet.add(i);
    f({ sorted: mark(), note: '정렬 완료 ✔' });
    return { F, snaps };
  }
  D.sort = (el, arg) => {
    const alg = arg || 'bubble', T0 = { bubble: ['버블 정렬', '인접한 두 값을 비교해 큰 값을 뒤로 보냄 — 1회전마다 가장 큰 값이 맨 뒤로'], selection: ['선택 정렬', '남은 구간에서 최솟값을 찾아 맨 앞과 교환'], insertion: ['삽입 정렬', '정렬된 앞부분에 새 값을 알맞은 위치에 삽입'], merge: ['합병(병합) 정렬', '반으로 나눠 각각 정렬한 뒤 병합 (분할 정복)'] };
    const CX = { bubble: 'O(n²)  (개선형 최선 O(n))', selection: 'O(n²)  (항상)', insertion: '최선 O(n) · 평균/최악 O(n²)', merge: 'O(n log n)  (항상, 추가 메모리 O(n))' };
    let arr = (arg === 'merge' ? [38, 27, 43, 3, 9, 82, 10] : [8, 3, 4, 9, 7, 5]), fr = frames(alg, arr), k = 0, timer = null, bars = [];
    const BW = 54, H = 150;
    el.innerHTML = `<div class="ctl"><label>입력(공백 구분): <input type="text" id="sin" size="22" value="${arr.join(' ')}"></label><button class="btn sm" id="sap">적용</button><button class="btn sm" id="srn">무작위</button></div>
      <div class="ctl"><button class="btn sm" id="s0">⏮</button><button class="btn sm" id="s1">◀</button><button class="btn sm pri" id="s2">▶ 재생</button><button class="btn sm" id="s3">▶</button><button class="btn sm" id="s4">⏭</button></div>
      <div id="ssvg" class="scroll"></div><div class="note" id="snote"></div><div class="tbl" id="spass"></div>
      <div class="out">${T0[alg][0]} — 시간복잡도 <b>${CX[alg]}</b></div>`;
    /* 막대 DOM은 입력이 바뀔 때만 만들고, 단계마다 위치(transform)·색만 바꿔 CSS 전환으로 이동 */
    const build = () => {
      const n = arr.length, mx = Math.max(...arr, 1), W = n * BW + 20; let s = '';
      arr.forEach((v, i) => { const h = Math.max(14, v / mx * H); s += `<g class="sbar" style="transform:translate(${14 + i * BW}px,0)"><rect x="0" y="${20 + H - h}" width="${BW - 10}" height="${h}" rx="5" class="bx a"/>${T((BW - 10) / 2, 20 + H - h - 9, v, { b: true, s: 14 })}</g>`; });
      for (let i = 0; i < n; i++) s += T(14 + i * BW + (BW - 10) / 2, 20 + H + 14, i + 1, { s: 11, c: 'm' });
      el.querySelector('#ssvg').innerHTML = svg(W, H + 52, s, { maxw: Math.max(W, 340), label: T0[alg][0] + ' 막대 시각화' });
      bars = [...el.querySelectorAll('.sbar')];
    };
    const draw = () => {
      const f = fr.F[k], n = f.a.length;
      for (let pos = 0; pos < n; pos++) {
        const id = f.ids[pos], g = bars[id]; if (!g) continue;
        g.style.transform = `translate(${14 + pos * BW}px,0)`;
        let c = 'a';
        if (f.sorted.includes(pos)) c = 'b';
        if (f.range && pos >= f.range[0] && pos <= f.range[1]) c = 'd';
        if (f.key === pos) c = 'f';
        if (f.cmp.includes(pos)) c = f.swap ? 'e' : 'c';
        g.firstChild.setAttribute('class', 'bx ' + c);
      }
      el.querySelector('#snote').innerHTML = `<b>${k}/${fr.F.length - 1}</b> · ${f.note}`;
      const rows = fr.snaps.map((a, i) => `<tr class="${i === f.p - 1 ? 'hl-row' : ''}"><td class="k">${alg === 'merge' ? '병합 ' + (i + 1) : alg === 'insertion' ? i + '회전' : (i + 1) + '회전'}</td><td>${a.join(' ')}</td></tr>`).join('');
      el.querySelector('#spass').innerHTML = `<table><tr><th>${alg === 'merge' ? '단계' : '회전(Pass)'}</th><th>결과</th></tr><tr><td class="k">초기</td><td>${arr.join(' ')}</td></tr>${rows}</table>`;
    };
    const go = v => { k = Math.max(0, Math.min(fr.F.length - 1, v)); draw(); };
    const pb = el.querySelector('#s2');
    const halt = () => { if (timer) { stop(timer); timer = null; pb.textContent = '▶ 재생'; } };
    const apply = a => { halt(); arr = a; fr = frames(alg, arr); k = 0; build(); draw(); };
    el.querySelector('#s0').onclick = () => { halt(); go(0); };
    el.querySelector('#s1').onclick = () => { halt(); go(k - 1); };
    el.querySelector('#s3').onclick = () => { halt(); go(k + 1); };
    el.querySelector('#s4').onclick = () => { halt(); go(fr.F.length - 1); };
    pb.onclick = () => { if (timer) return halt(); if (k >= fr.F.length - 1) k = 0; pb.textContent = '⏸ 정지'; timer = every(() => { if (k >= fr.F.length - 1) return halt(); go(k + 1); }, 620); };
    el.querySelector('#sap').onclick = () => { const a = el.querySelector('#sin').value.split(/[\s,]+/).map(Number).filter(x => !isNaN(x)).slice(0, 10); if (a.length >= 2) apply(a); };
    el.querySelector('#srn').onclick = () => { const a = [...Array(6)].map(() => 1 + Math.floor(Math.random() * 9)); el.querySelector('#sin').value = a.join(' '); apply(a); };
    build(); draw();
  };

  /* ───────── 해싱 ───────── */
  D.hash = el => {
    let method = 'div', coll = 'linear';
    el.innerHTML = `<div class="ctl"><label>키(공백 구분) <input type="text" id="hk" size="26" value="25 42 96 101 202 15 29"></label><label>테이블 크기 m <input type="number" id="hm" value="7" min="3" max="11" style="width:64px"></label></div>
      <div class="ctl">${seg([['div', '제산(나머지)법'], ['mid', '제곱 중간법'], ['fold', '폴딩법']], 'div', 'h')} ${seg([['linear', '선형 조사'], ['quad', '이차 조사'], ['chain', '체이닝']], 'linear', 'c')}</div>
      <div class="scroll" id="hsvg"></div><div class="tbl" id="hlog"></div>`;
    const hf = (k, m) => {
      if (method === 'div') return { h: k % m, how: `${k} mod ${m}` };
      if (method === 'mid') { const s = String(k * k), d = String(m - 1).length, st = Math.max(0, Math.floor((s.length - d) / 2)), mid = parseInt(s.substr(st, d)); return { h: mid % m, how: `${k}² = ${s} → 가운데 ${d}자리 ${mid} mod ${m}` }; }
      const g = String(k).match(/\d{1,2}(?=(\d{2})*$)/g) || [String(k)], sum = g.reduce((a, b) => a + +b, 0); return { h: sum % m, how: `${g.join(' + ')} = ${sum} mod ${m}` };
    };
    const run = () => {
      const m = Math.max(3, Math.min(11, +el.querySelector('#hm').value || 7)), keys = el.querySelector('#hk').value.split(/[\s,]+/).map(Number).filter(x => !isNaN(x) && x >= 0).slice(0, 12);
      const slot = Array(m).fill(null), chain = Array.from({ length: m }, () => []), rows = [];
      keys.forEach(k => {
        const { h, how } = hf(k, m); let idx = h, tries = 0, note = '';
        if (coll === 'chain') { chain[h].push(k); note = chain[h].length > 1 ? `충돌 → ${h}번 버킷 뒤에 연결(체인)` : `${h}번 버킷에 저장`; }
        else {
          while (slot[idx] !== null && tries < m) { tries++; idx = coll === 'linear' ? (h + tries) % m : (h + tries * tries) % m; }
          if (tries >= m) note = '테이블 가득 참 / 저장 실패(오버플로)'; else { slot[idx] = k; note = tries ? `충돌 ${tries}회 → ${coll === 'linear' ? '다음 칸' : tries + '² 칸'}씩 조사해 ${idx}번 저장` : `${idx}번 저장`; }
        }
        rows.push([k, how, h, note]);
      });
      let s = '', cw = 64;
      for (let i = 0; i < m; i++) {
        const x = 20 + i * cw, filled = coll === 'chain' ? chain[i].length : slot[i] !== null;
        s += R(x, 20, cw - 4, 40, { c: filled ? 'a' : 'g', r: 4 }) + T(x + cw / 2 - 2, 70, i, { s: 12, c: 'm' });
        if (coll === 'chain') chain[i].forEach((k, j) => { s += (j ? L(x + cw / 2 - 2, 60 + j * 38 - 10, x + cw / 2 - 2, 60 + j * 38 + 2, { end: 'arr' }) : '') + R(x + 6, 78 + j * 38, cw - 16, 28, { c: j ? 'c' : 'b', r: 14 }) + T(x + cw / 2 - 2, 92 + j * 38, k, { b: true }); });
        else if (slot[i] !== null) s += T(x + cw / 2 - 2, 40, slot[i], { b: true, s: 15 });
      }
      const hgt = coll === 'chain' ? 100 + Math.max(...chain.map(c => c.length), 1) * 38 : 90;
      el.querySelector('#hsvg').innerHTML = svg(40 + m * cw, hgt, s, { maxw: 40 + m * cw, label: '해시 테이블' });
      el.querySelector('#hlog').innerHTML = `<table><tr><th>키</th><th>해시 계산</th><th>h(k)</th><th>결과</th></tr>${rows.map(r => `<tr><td class="k">${r[0]}</td><td>${S.esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>`;
    };
    el.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { method = b.dataset.h; el.querySelectorAll('[data-h]').forEach(x => x.classList.toggle('on', x === b)); run(); });
    el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { coll = b.dataset.c; el.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b)); run(); });
    el.querySelector('#hk').oninput = run; el.querySelector('#hm').oninput = run;
    run();
  };

  /* ───────── JSON 실험실 ───────── */
  D.jsonLab = el => {
    el.innerHTML = `<textarea id="jin" rows="9" spellcheck="false">{
  "name": "홍길동",
  "age": 21,
  "student": true,
  "scores": [90, 85, 77],
  "address": { "city": "Seoul", "zip": null }
}</textarea><div class="ctl"><button class="btn pri sm" id="jgo">구조 분석</button><small>작은따옴표, 마지막 쉼표, 따옴표 없는 키는 오류로 처리됩니다.</small></div><div id="jres"></div>`;
    const tp = v => v === null ? ['null', 'e'] : Array.isArray(v) ? ['array', 'd'] : typeof v === 'object' ? ['object', 'a'] : typeof v === 'string' ? ['string', 'b'] : typeof v === 'number' ? ['number', 'c'] : ['boolean', 'f'];
    const walk = (v, key) => {
      const [t, c] = tp(v);
      const head = `${key !== undefined ? `<code>${S.esc(String(key))}</code> : ` : ''}<span class="chip ${c}">${t}</span>`;
      if (v && typeof v === 'object') return `<li>${head} ${Array.isArray(v) ? `(요소 ${v.length}개)` : `(속성 ${Object.keys(v).length}개)`}<ul>${Object.keys(v).map(k => walk(v[k], Array.isArray(v) ? '[' + k + ']' : k)).join('')}</ul></li>`;
      return `<li>${head} = <b>${S.esc(JSON.stringify(v))}</b></li>`;
    };
    const run = () => {
      const box = el.querySelector('#jres');
      try { const v = JSON.parse(el.querySelector('#jin').value); box.innerHTML = `<div class="callout tip"><b>유효한 JSON ✔</b>속성(Key)-값(Value) 쌍의 계층 구조</div><ul>${walk(v)}</ul>`; }
      catch (e) { box.innerHTML = `<div class="callout warn"><b>JSON 문법 오류</b>${S.esc(e.message)}<br>Key는 큰따옴표 문자열, 문자열은 큰따옴표, 마지막 요소 뒤 쉼표 금지, 주석 불가.</div>`; }
    };
    el.querySelector('#jgo').onclick = run; run();
  };
})();
