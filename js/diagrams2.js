/* 2과목 도해 (정적 SVG) */
(function () {
  const { T, R, L, P, C, E, PG, B, A, svg } = S;
  const D = DIAGRAMS;
  const COL = ['a', 'b', 'c', 'd', 'e', 'f'];

  D.dsClass = () => {
    const g = [['단순 구조', 'g', ['정수', '실수', '문자', '문자열']], ['선형 구조', 'a', ['배열', '선형 리스트', '연결 리스트', '스택', '큐', '데크']], ['비선형 구조', 'c', ['트리', '그래프']], ['파일 구조', 'g', ['순차 파일', '색인 파일', '직접 파일']]];
    let s = B(360, 4, 160, 36, '자료 구조', { c: 'hot', b: true, s: 15 });
    s += L(440, 40, 440, 56) + L(120, 56, 770, 56);
    g.forEach(([t, c, items], i) => {
      const x = 14 + i * 218;
      s += L(x + 103, 56, x + 103, 70) + B(x, 70, 206, 40, t, { c, b: true, s: 15 });
      items.forEach((it, j) => { s += B(x + 20, 122 + j * 36, 166, 30, it, { c: 'g', r: 15 }); });
    });
    s += T(14 + 218 + 103, 350, '1:1 선후 관계\n데이터가 한 줄로 나열', { c: 'a', b: true, s: 12.5, lh: 17 });
    s += T(14 + 436 + 103, 350, '1:N, N:M 관계\n계층·망 구조', { c: 'c', b: true, s: 12.5, lh: 17 });
    return svg(880, 380, s, { label: '자료구조의 분류' });
  };

  D.vmodel = () => {
    const lv = [['요구사항 분석', '인수 테스트'], ['시스템 설계', '시스템 테스트'], ['아키텍처 설계', '통합 테스트'], ['모듈(상세) 설계', '단위 테스트']];
    let s = '';
    lv.forEach(([l, r], i) => {
      const y = 28 + i * 68, xl = 20 + i * 70, xr = 670 - i * 70;
      s += L(xl + 190, y + 23, xr, y + 23, { c: 'dot', end: 'arr', start: 'arr' });
      s += B(xl, y, 190, 46, l, { c: COL[i], b: true }) + B(xr, y, 190, 46, r, { c: COL[i], b: true });
      if (i < 3) { s += A(xl + 95, y + 46, xl + 165, y + 68); s += A(xr + 25, y + 68, xr + 95, y + 46); }
    });
    s += B(340, 300, 200, 46, '구현 (코딩)', { c: 'g', b: true });
    s += A(325, 274, 380, 300) + A(500, 300, 555, 274);
    s += T(120, 14, '개발 (분해·설계)', { b: true, c: 'm' }) + T(760, 14, '검증 (통합·테스트)', { b: true, c: 'm' });
    s += T(440, 370, '점선 = 같은 수준의 개발 산출물 ↔ 테스트가 대응  ·  테스트 계획은 개발 초기부터', { s: 12.5, c: 'm' });
    return svg(880, 388, s, { label: 'V-모델: 개발 단계와 테스트 단계의 대응' });
  };

  D.driverStub = () => {
    let s = R(14, 8, 420, 270, { c: 'g', r: 14 }) + R(446, 8, 420, 270, { c: 'g', r: 14 });
    s += T(224, 28, '하향식(Top-Down) 통합 → 스텁(Stub)', { b: true, s: 14, c: 'c' });
    s += B(160, 52, 128, 44, 'Main\n(테스트 대상)', { c: 'a', b: true, lh: 15 });
    s += B(60, 150, 116, 44, '모듈 A\n(실제)', { c: 'a', lh: 15 }) + B(270, 150, 130, 44, '모듈 B\n스텁(가짜)', { c: 'y', lh: 15 });
    s += A(200, 96, 118, 150) + A(250, 96, 335, 150);
    s += T(224, 222, '테스트 대상이 "호출하는" 하위 모듈의 대역\n(하위 미완성 → 임시 응답을 돌려줌)', { s: 12.5, lh: 18 });
    s += T(224, 262, 'Stub = 그루터기(아래쪽에 남은 부분)', { s: 12, c: 'c', b: true });
    s += T(656, 28, '상향식(Bottom-Up) 통합 → 드라이버(Driver)', { b: true, s: 14, c: 'b' });
    s += B(590, 52, 136, 44, '드라이버(가짜)\n테스트 도구', { c: 'y', lh: 15 });
    s += B(590, 150, 136, 44, '모듈 X\n(테스트 대상)', { c: 'a', b: true, lh: 15 });
    s += A(658, 96, 658, 150) + T(700, 124, '호출', { s: 12, c: 'm' }) + L(618, 150, 618, 96, { c: 'dash e', end: 'arr-e' }) + T(580, 124, '결과', { s: 12, c: 'e', a: 'end' });
    s += T(656, 222, '테스트 대상을 "호출하는" 상위 모듈의 대역\n(입력 데이터 전달·결과 확인)', { s: 12.5, lh: 18 });
    s += T(656, 262, 'Driver = 운전자(위에서 몰고 간다)', { s: 12, c: 'b', b: true });
    s += T(440, 300, '구분 요령: 내가 "부르는(아래)" 모듈 대신 = 스텁 / 나를 "부르는(위)" 모듈 대신 = 드라이버', { s: 13, b: true, c: 'd' });
    return svg(880, 316, s, { label: '테스트 드라이버와 스텁 비교' });
  };

  D.oracle = () => {
    let s = B(20, 70, 100, 50, '테스트 입력', { c: 'g' }) + A(120, 95, 170, 95);
    s += B(170, 60, 150, 70, '시험 대상\n(SUT)', { c: 'a', b: true, lh: 18 }) + A(320, 95, 380, 95) + T(350, 80, '실제 결과', { s: 11.5, c: 'm' });
    s += B(170, 170, 150, 50, '테스트 오라클', { c: 'd', b: true }) + A(70, 120, 70, 195) + A(70, 195, 170, 195) + A(320, 195, 380, 195) + T(350, 180, '기대 결과', { s: 11.5, c: 'm' });
    s += PG([[430, 70], [490, 120], [430, 170], [370, 120]], { c: 'c' }) + T(430, 120, '비교', { b: true });
    s += A(490, 120, 560, 120);
    s += B(560, 70, 110, 38, 'PASS', { c: 'b', b: true }) + B(560, 132, 110, 38, 'FAIL', { c: 'e', b: true });
    s += P('M520,120 V89 H560', { end: 'arr' }) + P('M520,120 V151 H560', { end: 'arr' });
    s += T(770, 95, '오라클 = 테스트 결과의\n참/거짓을 판단하는 기준', { s: 12.5, c: 'm', lh: 18 });
    return svg(880, 245, s, { label: '테스트 오라클 개념' });
  };

  D.bigO = () => {
    const X0 = 70, Y0 = 290, W = 480, H = 260, NX = 10, NY = 64;
    const fx = n => X0 + (n / NX) * W, fy = v => Y0 - (Math.min(v, NY) / NY) * H;
    let s = L(X0, Y0, X0 + W + 10, Y0, { end: 'arr' }) + L(X0, Y0, X0, Y0 - H - 10, { end: 'arr' });
    s += T(X0 + W, Y0 + 18, '입력 크기 n', { a: 'end', s: 12, c: 'm' }) + T(X0 - 8, Y0 - H - 14, '연산 횟수', { a: 'start', s: 12, c: 'm' });
    const fns = [['O(1)', n => 2, 'b'], ['O(log n)', n => Math.log2(n), 'f'], ['O(n)', n => n, 'a'], ['O(n log n)', n => n * Math.log2(n), 'c'], ['O(n²)', n => n * n, 'e'], ['O(2ⁿ)', n => Math.pow(2, n), 'd']];
    fns.forEach(([nm, f, c], i) => {
      let d = '', started = false;
      for (let n = nm === 'O(log n)' || nm === 'O(n log n)' ? 1 : 0.2; n <= NX + 1e-6; n += 0.1) {
        const v = f(n); if (v > NY) { d += (started ? 'L' : 'M') + S.n1(fx(n)) + ',' + S.n1(fy(NY)); break; }
        d += (started ? 'L' : 'M') + S.n1(fx(n)) + ',' + S.n1(fy(v)); started = true;
      }
      s += P(d, { c: c + ' thick' });
      const y = 60 + i * 34;
      s += L(620, y, 660, y, { c: c + ' thick' }) + T(672, y, nm, { a: 'start', b: true, s: 14 });
    });
    s += T(620, 280, '빠름 ─────────▶ 느림\nO(1) < O(log n) < O(n)\n< O(n log n) < O(n²) < O(2ⁿ)', { a: 'start', s: 12.5, c: 'm', lh: 19 });
    return svg(880, 320, s, { label: '시간복잡도 증가율 비교 그래프' });
  };

  D.eai = () => {
    let s = '';
    const cell = (ox, oy, t) => R(ox, oy, 428, 196, { c: 'g', r: 12 }) + T(ox + 214, oy + 16, t, { b: true, s: 14 });
    const app = (x, y, n) => B(x - 34, y - 15, 68, 30, n, { c: 'a', s: 12 });
    // 점대점
    let ox = 6, oy = 4; s += cell(ox, oy, '① Point-to-Point (점대점)');
    const p = [[ox + 110, oy + 62, 'A'], [ox + 318, oy + 62, 'B'], [ox + 110, oy + 150, 'C'], [ox + 318, oy + 150, 'D']];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) s += L(p[i][0], p[i][1], p[j][0], p[j][1], { c: 'thin' });
    p.forEach(q => s += app(q[0], q[1], '앱 ' + q[2]));
    s += T(ox + 214, oy + 106, '직접 1:1 연결 (N(N-1)/2)', { s: 11, c: 'e' });
    // 허브앤스포크
    ox = 446; s += cell(ox, oy, '② Hub & Spoke (허브 앤 스포크)');
    const hub = [ox + 214, oy + 106];
    [[ox + 80, oy + 60], [ox + 350, oy + 60], [ox + 80, oy + 152], [ox + 350, oy + 152]].forEach((q, i) => s += L(hub[0], hub[1], q[0], q[1]) + app(q[0], q[1], '앱 ' + 'ABCD'[i]));
    s += C(hub[0], hub[1], 28, { c: 'hot' }) + T(hub[0], hub[1], '허브', { c: 'w', b: true });
    // 메시지 버스
    ox = 6; oy = 208; s += cell(ox, oy, '③ Message Bus (메시지 버스)');
    s += R(ox + 30, oy + 100, 368, 14, { c: 'd', r: 7 }) + T(ox + 214, oy + 107, '메시지 버스(미들웨어)', { c: 'd', s: 11, b: true });
    [[ox + 90, oy + 52], [ox + 250, oy + 52], [ox + 90, oy + 162], [ox + 250, oy + 162]].forEach((q, i) => s += L(q[0], q[1] + (q[1] < oy + 100 ? 15 : -15), q[0], oy + (q[1] < oy + 100 ? 100 : 114)) + app(q[0], q[1], '앱 ' + 'ABCD'[i]));
    s += T(ox + 345, oy + 52, '어댑터로\n버스에 연결', { s: 11, c: 'm', lh: 14 });
    // 하이브리드
    ox = 446; s += cell(ox, oy, '④ Hybrid (하이브리드)');
    [[ox + 90, oy + 106], [ox + 338, oy + 106]].forEach((q, i) => {
      s += L(q[0], q[1], q[0], q[1] - 50) + L(q[0], q[1], q[0], q[1] + 50);
      s += app(q[0], q[1] - 54, '앱 ' + 'AB'[i]) + app(q[0], q[1] + 54, '앱 ' + 'CD'[i]);
      s += C(q[0], q[1], 22, { c: 'hot' }) + T(q[0], q[1], '허브', { c: 'w', s: 12, b: true });
    });
    s += L(ox + 112, oy + 106, ox + 316, oy + 106, { c: 'thick d' }) + T(ox + 214, oy + 90, '버스', { s: 12, c: 'd', b: true });
    return svg(880, 410, s, { label: 'EAI 구축 유형 4가지' });
  };

  D.json = () => {
    const lines = [
      [['{', '']],
      [['  ', ''], ['"name"', 'a'], [': ', ''], ['"홍길동"', 'b'], [',', '']],
      [['  ', ''], ['"age"', 'a'], [': ', ''], ['21', 'c'], [',', '']],
      [['  ', ''], ['"student"', 'a'], [': ', ''], ['true', 'd'], [',', '']],
      [['  ', ''], ['"scores"', 'a'], [': [', ''], ['90', 'c'], [', ', ''], ['85', 'c'], [', ', ''], ['77', 'c'], ['],', '']],
      [['  ', ''], ['"address"', 'a'], [': { ', ''], ['"city"', 'a'], [': ', ''], ['"Seoul"', 'b'], [', ', ''], ['"zip"', 'a'], [': ', ''], ['null', 'e'], [' }', '']],
      [['}', '']],
    ];
    let s = '';
    lines.forEach((ln, i) => {
      s += `<text x="24" y="${34 + i * 32}" class="t mono" style="font-size:15px;white-space:pre" xml:space="preserve">` + ln.map(([t, c]) => `<tspan${c ? ` class="${c}"` : ''}>${S.esc(t)}</tspan>`).join('') + '</text>';
    });
    s += `<rect x="8" y="8" width="520" height="232" rx="10" class="bx n"/>`;
    const note = [[1, 'a', '속성(Key): 반드시 큰따옴표 문자열'], [1, 'b', '값(Value): 문자열 "…"'], [2, 'c', '값: 숫자(number)'], [3, 'd', '값: 불리언(true / false)'], [4, 'c', '값: 배열 [ … ] (순서 있는 목록)'], [5, 'a', '값: 객체 { … } (중첩 가능)'], [5, 'e', '값: null (값 없음)']];
    note.forEach(([ln, c, t], i) => {
      const y = 34 + i * 32;
      s += T(552, y, '■', { a: 'start', c, s: 15 }) + T(574, y, t, { a: 'start', s: 13 });
    });
    s += T(440, 262, '"속성(Key) : 값(Value)" 의 쌍(Pair) 집합 · 쉼표(,)로 구분 · 중괄호 {} = 객체 · 대괄호 [] = 배열 · 주석 불가', { s: 12.5, c: 'd', b: true });
    return svg(880, 280, s, { label: 'JSON 구조 설명' });
  };

  D.ipsec = () => {
    const rows = [
      ['원본 패킷', [['IP 헤더', 70, 'g'], ['TCP', 60, 'g'], ['데이터', 100, 'g']], null, null],
      ['전송 모드 + AH', [['IP 헤더', 70, 'g'], ['AH', 60, 'c'], ['TCP', 60, 'g'], ['데이터', 100, 'g']], [0, 3], null],
      ['전송 모드 + ESP', [['IP 헤더', 70, 'g'], ['ESP 헤더', 70, 'c'], ['TCP', 60, 'g'], ['데이터', 90, 'g'], ['ESP 트레일러', 90, 'c'], ['ESP 인증', 70, 'c']], [1, 4], [2, 4]],
      ['터널 모드 + AH', [['새 IP', 64, 'a'], ['AH', 56, 'c'], ['원본 IP', 66, 'g'], ['TCP', 56, 'g'], ['데이터', 90, 'g']], [0, 4], null],
      ['터널 모드 + ESP', [['새 IP', 64, 'a'], ['ESP 헤더', 70, 'c'], ['원본 IP', 66, 'g'], ['TCP', 54, 'g'], ['데이터', 74, 'g'], ['ESP 트레일러', 90, 'c'], ['ESP 인증', 70, 'c']], [1, 5], [2, 5]],
    ];
    let s = '';
    s += L(24, 18, 54, 18, { c: 'b thick' }) + T(62, 18, '인증(무결성) 범위', { a: 'start', s: 12, c: 'b' }) + L(200, 18, 230, 18, { c: 'e thick' }) + T(238, 18, '암호화(기밀성) 범위', { a: 'start', s: 12, c: 'e' });
    s += T(420, 18, 'IP 헤더·ESP 인증은 암호화되지 않음 (ESP는 인증 범위에 새 IP 헤더 미포함)', { a: 'start', s: 11.5, c: 'm' });
    rows.forEach(([name, blocks, au, en], i) => {
      const y = 44 + i * 94;
      s += T(14, y + 20, name, { a: 'start', b: true, s: 13.5 });
      let x = 190; const xs = [];
      blocks.forEach(([t, w, c]) => { xs.push([x, w]); s += B(x, y, w, 40, t, { c, s: 12, r: 4 }); x += w; });
      if (au) { const a0 = xs[au[0]][0], a1 = xs[au[1]][0] + xs[au[1]][1]; s += P(`M${a0},${y + 46} V${y + 52} H${a1} V${y + 46}`, { c: 'b thick' }); }
      if (en) { const a0 = xs[en[0]][0] + 3, a1 = xs[en[1]][0] + xs[en[1]][1] - 3; s += P(`M${a0},${y + 60} V${y + 66} H${a1} V${y + 60}`, { c: 'e thick' }); }
    });
    s += T(660, 130, 'AH: 프로토콜 번호 51\n무결성 + 인증(+재전송 방지)\n암호화 없음', { a: 'start', s: 12.5, c: 'c', b: true, lh: 18 });
    s += T(660, 320, 'ESP: 프로토콜 번호 50\n기밀성(암호화) + 무결성 + 인증', { a: 'start', s: 12.5, c: 'c', b: true, lh: 18 });
    return svg(880, 520, s, { label: 'IPSec AH와 ESP의 전송/터널 모드 패킷 구조' });
  };

  D.drm = () => {
    let s = '';
    const top = [['콘텐츠 제공자', 'Content Provider\n저작권자·콘텐츠 보유', 'a'], ['패키저', 'Packager\n암호화·메타데이터 → 보안 컨테이너', 'b'], ['콘텐츠 분배자', 'Distributor\n유통·판매 서버', 'c'], ['콘텐츠 소비자', 'Customer\nDRM 컨트롤러 → 재생', 'd']];
    top.forEach(([k, d, c], i) => {
      const x = 14 + i * 218;
      s += R(x, 24, 190, 84, { c }) + T(x + 95, 44, k, { b: true, s: 14 }) + T(x + 95, 78, d, { s: 11.5, c: 'm', lh: 16 });
      if (i < 3) s += A(x + 190, 66, x + 218, 66);
    });
    s += R(280, 220, 320, 78, { c: 'hot', r: 14 }) + T(440, 244, '클리어링 하우스 (Clearing House)', { b: true, s: 14.5, c: 'w' }) + T(440, 274, '라이선스 발급·결제·키 관리·사용 권한 관리·사용 내역 정산', { s: 11.5, c: 'w' });
    s += L(109, 108, 109, 190, { c: 'dash' }); s += P('M109,190 H310 V220', { c: 'dash', end: 'arr' });
    s += T(125, 150, '콘텐츠 정보·\n사용 규칙 등록', { a: 'start', s: 11, c: 'm', lh: 14 });
    s += P('M545,108 V160 H400 V220', { c: 'dash', end: 'arr' });
    s += T(555, 150, '유통·판매 내역', { a: 'start', s: 11, c: 'm' });
    s += L(775, 108, 775, 190, { c: 'e dash', start: 'arr-e' }); s += P('M775,190 H570 V220', { c: 'e dash', end: 'arr-e' });
    s += T(783, 150, '① 라이선스 요청\n② 키·권한 발급', { a: 'start', s: 11, c: 'e', lh: 14 });
    s += T(440, 326, '암호화된 콘텐츠는 라이선스(복호화 키 + 이용 권한)가 있어야만 소비자가 사용 가능', { s: 12.5, c: 'd', b: true });
    return svg(880, 346, s, { label: 'DRM 구성 요소와 흐름' });
  };

  D.scm = () => {
    let s = B(14, 56, 150, 54, '기존 소스\n(로컬 파일)', { c: 'g', lh: 16 });
    s += A(164, 83, 300, 83) + T(232, 68, '가져오기\nImport', { s: 12, b: true, c: 'a', lh: 14 });
    s += R(300, 36, 280, 94, { c: 'hot', r: 16 }) + T(440, 66, '저장소 (Repository)', { b: true, c: 'w', s: 15 }) + T(440, 96, '버전 이력·최신본 보관 (공유)', { c: 'w', s: 12 });
    s += B(300, 250, 280, 66, '작업 디렉터리 (Working Copy)\n개발자 PC에서 수정', { c: 'b', b: true, lh: 20 });
    s += A(340, 130, 340, 250) + T(332, 190, '체크아웃\nCheck-out', { s: 12, b: true, c: 'a', a: 'end', lh: 14 });
    s += A(440, 250, 440, 130) + T(448, 190, '체크인 / 커밋\nCheck-in / Commit', { s: 12, b: true, c: 'c', a: 'start', lh: 14 });
    s += A(540, 130, 540, 250, { c: 'dash' }) + T(548, 190, '동기화\nUpdate(Sync)', { s: 12, b: true, c: 'd', a: 'start', lh: 14 });
    s += T(40, 215, '※ 충돌(Conflict) 발생 시\n수정 후 다시 커밋', { a: 'start', s: 12, c: 'e', lh: 17 });
    s += T(640, 100, '저장소: 최종 버전 파일 보관\n가져오기: 처음 등록\n체크아웃: 수정하려고 받아옴\n체크인: 수정본 저장소에 반영\n커밋: 변경 확정(충돌 시 수정)\n동기화: 최신 저장소 → 작업본', { a: 'start', s: 12, c: 'm', lh: 20 });
    return svg(880, 336, s, { label: '형상 관리 버전 등록 기능' });
  };

  D.pareto = () => {
    const v = [50, 30, 6, 4, 3, 2, 2, 1, 1, 1];
    const X0 = 70, Y0 = 250, H = 210, bw = 40, gap = 10;
    let s = L(X0, Y0, X0 + 10 * (bw + gap) + 4, Y0) + L(X0, Y0, X0, Y0 - H - 6);
    let cum = 0, pts = [];
    v.forEach((n, i) => {
      const x = X0 + 8 + i * (bw + gap), h = (n / 50) * H;
      s += `<rect x="${x}" y="${Y0 - h}" width="${bw}" height="${h}" rx="3" class="bx ${i < 2 ? 'e' : 'a'}"/>` + T(x + bw / 2, Y0 + 14, 'M' + (i + 1), { s: 11, c: 'm' }) + T(x + bw / 2, Y0 - h - 9, n, { s: 11 });
      cum += n; pts.push([x + bw / 2, Y0 - (cum / 100) * H]);
    });
    s += P('M' + pts.map(p => p.map(S.n1).join(',')).join(' L'), { c: 'c thick' });
    pts.forEach(p => s += C(p[0], p[1], 3.5, { c: 'c' }));
    s += T(X0 - 8, Y0 - H, '80%', { a: 'end', s: 11, c: 'c' }) + T(X0 - 8, Y0, '0', { a: 'end', s: 11, c: 'm' });
    s += L(X0, Y0 - 0.8 * H, X0 + 10 * (bw + gap), Y0 - 0.8 * H, { c: 'dot thin c' });
    s += T(X0 + 255, Y0 - H - 14, '결함 수(막대) · 누적 비율(선)', { s: 12, c: 'm' });
    s += `<rect x="${X0 + 8}" y="${Y0 - H - 4}" width="${2 * (bw + gap) - 10}" height="${H + 4}" class="bx n" style="stroke:var(--e);stroke-dasharray:4 3" rx="4"/>`;
    s += T(640, 60, '상위 20% 모듈(M1, M2)\n= 전체 결함의 80%', { a: 'start', b: true, c: 'e', s: 13.5, lh: 20 });
    s += T(640, 124, '파레토 법칙 (80:20)\n→ 결함 집중(Defect Clustering)\n→ 결함이 몰린 모듈에\n    테스트 자원을 집중', { a: 'start', s: 12.5, lh: 20 });
    return svg(880, 290, s, { label: '파레토 법칙과 결함 집중' });
  };

  D.whiteFlow = () => {
    const nd = { 1: [90, 28], 2: [90, 96], 3: [30, 166], 4: [150, 166], 5: [90, 236], 6: [190, 236], 7: [90, 312] };
    const r = 17;
    const ed = (a, b, o = {}) => {
      const [x1, y1] = nd[a], [x2, y2] = nd[b], dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
      return L(x1 + dx / d * r, y1 + dy / d * r, x2 - dx / d * (r + 2), y2 - dy / d * (r + 2), Object.assign({ end: 'arr' }, o));
    };
    let s = '';
    [[1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6], [5, 7]].forEach(([a, b]) => s += ed(a, b));
    s += P('M196,252 C196,282 130,282 104,250', { end: 'arr' });
    Object.entries(nd).forEach(([k, [x, y]]) => s += C(x, y, r, { c: [2, 5].includes(+k) ? 'c' : 'a' }) + T(x, y, k, { b: true }));
    s += T(250, 70, '노드(N)=7  간선(E)=8', { a: 'start', s: 12.5 });
    const code = ['1  read(x)', '2  if (x > 0)', '3      a = 1', '   else', '4      a = 2', '5  while (a < 10)', '6      a = a * 2', '7  print(a)'];
    code.forEach((l, i) => s += `<text x="330" y="${34 + i * 24}" class="t mono" style="font-size:13px;white-space:pre" xml:space="preserve">${S.esc(l)}</text>`);
    s += T(520, 70, 'V(G) = E − N + 2 = 8 − 7 + 2 = 3', { a: 'start', b: true, c: 'd', s: 14 });
    s += T(520, 98, '= 조건(분기) 노드 수 + 1 = 2 + 1 = 3\n= 폐영역(바깥 포함) 수 = 3\n→ 독립 경로 3개 = 최소 테스트 케이스 수', { a: 'start', s: 12.5, lh: 19 });
    s += T(520, 176, '기본 경로 (Basis Path)', { a: 'start', b: true, s: 13 });
    s += T(520, 216, '① 1-2-3-5-7\n② 1-2-4-5-7\n③ 1-2-3-5-6-5-7', { a: 'start', s: 12.5, c: 'mono', lh: 20 });
    return svg(880, 350, s, { label: '제어 흐름 그래프와 순환 복잡도 계산' });
  };

  D.partition = () => {
    let s = '';
    s += `<rect x="30" y="50" width="280" height="38" class="bx e"/><rect x="310" y="50" width="280" height="38" class="bx b"/><rect x="590" y="50" width="260" height="38" class="bx e"/>`;
    s += T(170, 69, '무효 클래스 (x < 1)', { b: true }) + T(450, 69, '유효 클래스 (1 ≤ x ≤ 100)', { b: true }) + T(720, 69, '무효 클래스 (x > 100)', { b: true });
    s += T(170, 28, '동치 분할: 클래스별 대표값 1개씩만', { s: 12.5, c: 'm' });
    [[110, '-5'], [450, '50'], [720, '150']].forEach(([x, v]) => s += C(x, 112, 8, { c: 'c' }) + T(x, 134, v, { b: true, s: 13 }));
    s += L(30, 170, 850, 170, { c: 'thin' });
    [[282, '0'], [310, '1'], [338, '2'], [562, '99'], [590, '100'], [618, '101']].forEach(([x, v], i) => s += C(x, 170, 7, { c: i % 3 === 1 ? 'hot' : 'd' }) + T(x, 192, v, { b: true, s: 13 }));
    s += T(300, 218, '경계값 분석: 경계 바로 아래·경계·바로 위', { s: 12.5, c: 'd', b: true }) + T(590, 218, '(min−1, min, min+1 / max−1, max, max+1)', { s: 12, c: 'm' });
    return svg(880, 236, s, { label: '동치 분할과 경계값 분석' });
  };

  D.ide = () => {
    const sat = [['코드 편집기', '자동 완성·구문 강조'], ['컴파일러·인터프리터', '번역·실행'], ['디버거', '중단점·변수 감시'], ['빌드 도구', 'Ant·Maven·Gradle'], ['형상 관리 연동', 'Git·SVN'], ['테스트·프로파일러', '단위 테스트·성능']];
    let s = '';
    sat.forEach(([k, d], i) => {
      const th = -Math.PI / 2 + i * Math.PI / 3, x = 440 + 280 * Math.cos(th), y = 150 + 108 * Math.sin(th);
      s += L(440, 150, x, y, { c: 'dash thin' }) + R(x - 90, y - 26, 180, 52, { c: COL[i] }) + T(x, y - 8, k, { b: true, s: 13 }) + T(x, y + 11, d, { s: 11.5, c: 'm' });
    });
    s += C(440, 150, 46, { c: 'hot' }) + T(440, 150, 'IDE\n통합개발환경', { c: 'w', b: true, lh: 17 });
    s += T(440, 300, '예: Eclipse · IntelliJ IDEA · Visual Studio · VS Code · NetBeans · Android Studio · Xcode · PyCharm', { s: 12.5, c: 'd', b: true });
    return svg(880, 318, s, { label: 'IDE 구성 요소' });
  };

  D.lifecycleFlow = () => {
    const st = ['릴리즈 계획', '패키징', '배포', '사용자 설치', '업데이트·패치'];
    let s = '';
    st.forEach((t, i) => { s += B(14 + i * 176, 20, 156, 46, t, { c: COL[i], b: true }); if (i < 4) s += A(170 + i * 176, 43, 190 + i * 176, 43); });
    return svg(880, 86, s, { label: '소프트웨어 패키징 흐름' });
  };
})();
