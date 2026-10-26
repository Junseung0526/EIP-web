/* SVG 헬퍼 라이브러리 — 모든 도해가 이 함수들로 그려진다 */
(function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const n1 = v => Math.round(v * 10) / 10;

  /** 텍스트 (\n 으로 줄바꿈, 세로 중앙 정렬). o: a(anchor) c(class) s(size) b(bold) i(italic) lh(line-height) */
  function T(x, y, str, o = {}) {
    const lines = String(str).split('\n'), lh = o.lh || 16, y0 = y - ((lines.length - 1) * lh) / 2;
    const st = ['font-size:' + S.n1((o.s || 13) * S.K) + 'px', o.b ? 'font-weight:700' : '', o.i ? 'font-style:italic' : ''].filter(Boolean).join(';');
    return `<text x="${n1(x)}" y="${n1(y0)}" text-anchor="${o.a || 'middle'}" class="t${o.c ? ' ' + o.c : ''}"${st ? ` style="${st}"` : ''}>` +
      lines.map((l, i) => `<tspan x="${n1(x)}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('') + '</text>';
  }
  /** 사각형. o: c(class) r(radius) */
  function R(x, y, w, h, o = {}) { return `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${o.r == null ? 3 : o.r}" class="bx${o.c ? ' ' + o.c : ''}"${o.id ? ` id="${o.id}"` : ''}/>`; }
  /** 선. o: c(class) end start (marker 이름: arr, arr-a, open, tri, dia, diaf) */
  function L(x1, y1, x2, y2, o = {}) {
    return `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="ln${o.c ? ' ' + o.c : ''}"` +
      (o.end ? ` marker-end="url(#m-${o.end})"` : '') + (o.start ? ` marker-start="url(#m-${o.start})"` : '') + (o.id ? ` id="${o.id}"` : '') + '/>';
  }
  function P(d, o = {}) {
    return `<path d="${d}" class="ln${o.c ? ' ' + o.c : ''}"` + (o.end ? ` marker-end="url(#m-${o.end})"` : '') +
      (o.start ? ` marker-start="url(#m-${o.start})"` : '') + (o.id ? ` id="${o.id}"` : '') + '/>';
  }
  function C(cx, cy, r, o = {}) { return `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${r}" class="bx${o.c ? ' ' + o.c : ''}"${o.id ? ` id="${o.id}"` : ''}/>`; }
  function E(cx, cy, rx, ry, o = {}) { return `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${rx}" ry="${ry}" class="bx${o.c ? ' ' + o.c : ''}"/>`; }
  function PG(pts, o = {}) { return `<polygon points="${pts.map(p => p.map(n1).join(',')).join(' ')}" class="bx${o.c ? ' ' + o.c : ''}"/>`; }
  function G(inner, o = {}) { return `<g${o.c ? ` class="${o.c}"` : ''}${o.id ? ` id="${o.id}"` : ''}${o.t ? ` transform="${o.t}"` : ''}${o.data ? ' ' + o.data : ''}>${inner}</g>`; }
  /** 라벨이 있는 박스 */
  function B(x, y, w, h, label, o = {}) { return R(x, y, w, h, o) + T(x + w / 2, y + h / 2, label, { c: o.tc || (/\bhot\b/.test(o.c || '') ? 'w' : undefined), s: o.s, b: o.b, lh: o.lh }); }
  function svg(w, h, inner, o = {}) { return `<svg class="dg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.label || '도해')}"${o.id ? ` id="${o.id}"` : ''}${o.maxw ? ` style="max-width:${o.maxw}px"` : ''}>${inner}</svg>`; }
  /** 화살표(선+머리) 편의 함수 */
  const A = (x1, y1, x2, y2, o = {}) => L(x1, y1, x2, y2, Object.assign({ end: 'arr' }, o));
  /** 막대 인간 (유스케이스 액터) */
  function actor(x, y, label, c) {
    return `<g>${C(x, y, 9, { c: c || '' })}${L(x, y + 9, x, y + 36)}${L(x - 15, y + 20, x + 15, y + 20)}${L(x, y + 36, x - 12, y + 54)}${L(x, y + 36, x + 12, y + 54)}${T(x, y + 70, label, { b: true })}</g>`;
  }
  /** 일반 막대/문자 폭 추정 */
  function tw(s, mono) { let w = 0; for (const ch of String(s)) w += ch.charCodeAt(0) > 255 ? 13.5 : (mono ? 7.6 : 7.2); return w * 1.1; }

  /* ───────────── 클래스 다이어그램 렌더러 ─────────────
     spec = { nodes:[{id,n,k,m:[],x,y,w,c}], edges:[[from,to,type,label]], cw,rh,pad,note }
       k: ''(class) 'a'(abstract) 'i'(interface) 'n'(노트)   m: 멤버 문자열들('---' 는 구분선)
       type: inh(상속) real(구현) assoc(연관) dep(의존) agg(집합) comp(합성) plain(선) note(노트 연결)   */
  function classDiagram(spec) {
    const nodes = spec.nodes, byId = {}, pad = spec.pad == null ? 16 : spec.pad;
    nodes.forEach(nd => {
      nd.m = nd.m || [];
      const items = [nd.n].concat(nd.m.filter(x => x !== '---'));
      nd.w = nd.w || Math.max(150, Math.ceil(Math.max(...items.map((t, i) => tw(t, i > 0 && nd.k !== 'n') * (i === 0 && nd.k !== 'n' ? 1.18 : 1) + 24))));
      const st = nd.k === 'i' || nd.k === 'a' ? 15 : 0;
      nd.hh = nd.k === 'n' ? 16 + nd.m.length * 18 : 28 + st + (nd.m.length ? 10 + nd.m.length * 18 : 4);
      nd.st = st;
      byId[nd.id] = nd;
    });
    const maxW = Math.max(...nodes.map(n => n.w)), maxH = Math.max(...nodes.map(n => n.hh));
    const labW = Math.max(0, ...(spec.edges || []).filter(e => e[3] && e[0] !== e[1]).map(e => tw(e[3]) + 28));
    const cw = spec.cw || maxW + Math.max(60, labW), rh = spec.rh || maxH + 62;
    nodes.forEach(nd => { nd.px = pad + nd.x * cw; nd.py = pad + nd.y * rh; nd.cx = nd.px + nd.w / 2; nd.cy = nd.py + nd.hh / 2; });
    const selfPad = (spec.edges || []).some(e => e[0] === e[1]) ? 96 : 0;
    const W = Math.max(...nodes.map(n => n.px + n.w)) + pad + selfPad, H = Math.max(...nodes.map(n => n.py + n.hh)) + pad;
    const clip = (nd, tx, ty) => {
      const dx = tx - nd.cx, dy = ty - nd.cy;
      if (!dx && !dy) return [nd.cx, nd.cy];
      const t = Math.min(dx ? (nd.w / 2) / Math.abs(dx) : 1e9, dy ? (nd.hh / 2) / Math.abs(dy) : 1e9);
      return [nd.cx + dx * t, nd.cy + dy * t];
    };
    let out = '';
    (spec.edges || []).forEach(([f, t, type, label, o]) => {
      const a = byId[f], b = byId[t];
      if (!a || !b) return;
      o = o || {};
      if (f === t) { // 자기 참조
        const x = a.px + a.w, y = a.py + 14;
        out += P(`M${x},${y} h34 v26 h-34`, { end: type === 'agg' ? 'dia' : type === 'comp' ? 'diaf' : 'open' });
        if (label) out += T(x + 38, y + 13, label, { a: 'start', s: 12, c: 'm' });
        return;
      }
      let [x1, y1] = clip(a, b.cx + (o.dx || 0), b.cy + (o.dy || 0)), [x2, y2] = clip(b, a.cx - (o.dx || 0), a.cy - (o.dy || 0));
      let cls = '', end = '';
      if (type === 'inh') end = 'tri';
      else if (type === 'real') { end = 'tri'; cls = 'dash'; }
      else if (type === 'assoc') end = 'open';
      else if (type === 'dep') { end = 'open'; cls = 'dash'; }
      else if (type === 'note') cls = 'dot';
      else if (type === 'agg' || type === 'comp') { [x1, y1, x2, y2] = [x2, y2, x1, y1]; end = type === 'agg' ? 'dia' : 'diaf'; }
      out += L(x1, y1, x2, y2, { c: cls, end });
      if (label) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        out += `<rect x="${n1(mx - tw(label) / 2 - 4)}" y="${n1(my - 9)}" width="${n1(tw(label) + 8)}" height="17" rx="4" class="fillc" opacity=".92"/>` + T(mx, my, label, { s: 12, c: 'm' });
      }
    });
    nodes.forEach(nd => {
      if (nd.k === 'n') {
        out += R(nd.px, nd.py, nd.w, nd.hh, { c: 'y', r: 4 });
        nd.m.forEach((l, i) => { out += T(nd.px + 8, nd.py + 16 + i * 18, l, { a: 'start', s: 12, c: 'mono' }); });
        return;
      }
      out += R(nd.px, nd.py, nd.w, nd.hh, { c: nd.c || '' });
      let y = nd.py + 14;
      if (nd.st) { out += T(nd.cx, y, nd.k === 'i' ? '«interface»' : '«abstract»', { s: 11, c: 'm' }); y += 15; }
      out += T(nd.cx, y + (nd.st ? 1 : 0), nd.n, { b: true, i: nd.k === 'a' || nd.k === 'i', s: 13.5 });
      if (nd.m.length) {
        const ly = nd.py + 26 + nd.st;
        out += L(nd.px, ly, nd.px + nd.w, ly, { c: 'thin' });
        nd.m.forEach((m, i) => {
          const yy = ly + 14 + i * 18;
          if (m === '---') out += L(nd.px, yy - 8, nd.px + nd.w, yy - 8, { c: 'thin' });
          else out += T(nd.px + 9, yy, m, { a: 'start', s: 12, c: 'mono' });
        });
      }
    });
    return svg(Math.max(W, 300), H, out, { label: spec.label || '클래스 다이어그램' });
  }

  window.S = { K: 1.12, esc, T, R, L, P, C, E, PG, G, B, A, svg, actor, tw, classDiagram, n1 };
  window.DIAGRAMS = window.DIAGRAMS || {};
})();
