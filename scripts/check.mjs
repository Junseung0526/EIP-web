// 데이터 무결성 검사: 브라우저 없이 data/*.js 를 로드해 참조·정답 인덱스를 검증한다.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const win = { DIAGRAMS: {} };
const ctx = vm.createContext({ window: win, console, Math, Object, Array, String, JSON, Number, Set });
ctx.window = ctx; Object.assign(ctx, { DIAGRAMS: {}, S: undefined });
const load = f => vm.runInContext(readFileSync(new URL('../' + f, import.meta.url), 'utf8'), ctx, { filename: f });
// svg.js / diagrams 는 DOM 불필요 (문자열 생성만)
['js/svg.js', 'js/diagrams1.js', 'js/diagrams2.js', 'js/patterns.js'].forEach(load);
ctx.document = { createElement: () => ({}) };
// interactive.js 는 DOM 의존 함수 정의만 하므로 로드 가능
load('js/interactive.js');
['js/data/subject1.js', 'js/data/subject1b.js', 'js/data/subject2.js', 'js/data/subject2b.js', 'js/data/scope.js', 'js/data/quiz.js'].forEach(load);

const { TOPICS, QUIZ, SCOPE, PATTERNS } = ctx;
const ids = new Set(TOPICS.map(t => t.id));
const errors = [];
if (ids.size !== TOPICS.length) errors.push('중복된 토픽 id');
SCOPE.forEach(([, label, id]) => { if (!ids.has(id)) errors.push(`scope: 없는 토픽 ${id} (${label})`); });
QUIZ.forEach(q => {
  if (!ids.has(q.t)) errors.push(`quiz #${q.id}: 없는 토픽 ${q.t}`);
  if (!(q.a >= 0 && q.a < q.opts.length)) errors.push(`quiz #${q.id}: 정답 인덱스 범위 오류`);
  if (new Set(q.opts).size !== q.opts.length) errors.push(`quiz #${q.id}: 중복 보기`);
});
TOPICS.forEach(t => {
  for (const m of t.body.matchAll(/data-diagram="([^"]+)"/g)) if (!ctx.DIAGRAMS[m[1]]) errors.push(`${t.id}: 없는 도해 ${m[1]}`);
});
if (PATTERNS.length !== 23) errors.push(`GoF 패턴 수 ${PATTERNS.length} (23이어야 함)`);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`OK — 토픽 ${TOPICS.length}, 범위 ${SCOPE.length}, 문제 ${QUIZ.length}, 패턴 ${PATTERNS.length}`);
