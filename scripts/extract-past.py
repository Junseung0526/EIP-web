"""시나공 기출 PDF → js/data/past.local.js (+ past-img/) — 개인 학습용, git 제외.
사용: python3 scripts/extract-past.py <PDF...>   (PyMuPDF 필요)"""
import sys, re, json, pathlib, pymupdf

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / 'past-img'
CIRC = '①②③④'
NOISE = re.compile(r'^(-\s*\d*\s*-?|.*저작권 안내.*|.*시나공 카페.*|.*복제하거나.*|.*옮겨 실을 수.*|.*없습니다\.?|.*기출문제 & 정답.*|.*정보처리기사 필기.*|\d회|\s*20\d\d|.*다음 문제를 읽고.*|.*답란\(.*|.*인적인 용도.*)$')

def lines_of(pg):
    W = pg.rect.width; chars = []
    for b in pg.get_text('rawdict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                for c in s['chars']:
                    x0, y0, x1, y1 = c['bbox']; chars.append(((x0 + x1) / 2, (y0 + y1) / 2, x0, c['c']))
    out = []
    for col in (0, 1):
        cs = sorted([c for c in chars if (c[0] >= W / 2) == bool(col)], key=lambda c: c[1]); ls = []
        for c in cs:
            if ls and abs(ls[-1][0] - c[1]) < 4: ls[-1][1].append(c)
            else: ls.append([c[1], [c]])
        out += [(col, y, ''.join(c[3] for c in sorted(l, key=lambda c: c[2]))) for y, l in ls]
    return out

def answers(doc):
    last = lines_of(doc[-1]) + (lines_of(doc[-2]) if len(doc) > 8 else [])
    for pg in reversed(list(doc)):
        ls = lines_of(pg)
        if any('정답' in t for _, _, t in ls): last = ls; break
    ans = {}
    for col in (0, 1):
        rows = [t for c, _, t in last if c == col and len(re.findall(f'[{CIRC}]', t)) == 5 and re.match(r'\s*\d', t)]
        for i, t in enumerate(rows[:10]):
            for k, ch in enumerate(re.findall(f'[{CIRC}]', t)):
                ans[i * 10 + col * 5 + k + 1] = CIRC.index(ch) + 1
    return ans

def extract(path, key):
    doc = pymupdf.open(path); ans = answers(doc); qs = []; cur = None; stop = False
    for pi in range(4):
        pg = doc[pi]
        figs = [im['bbox'] for im in pg.get_image_info() if im['width'] < 800 and im['bbox'][1] > 60]
        for col, y, t in lines_of(pg):
            if '제3과목' in t or (pi > 0 and '데이터베이스 구축' in t): stop = True
            if stop: break
            if NOISE.match(t.strip()) or '과목' in t: continue
            m = re.match(r'\s*(\d+)\.\s*(.*)', t)
            if m and int(m.group(1)) == (cur['n'] + 1 if cur else 1):
                cur = {'n': int(m.group(1)), 'raw': m.group(2), 'pos': (pi, col, y), 'img': []}; qs.append(cur)
            elif cur: cur['raw'] += ('\n' if re.match(f'[{CIRC}ㆍ•㉠-㉻]', t.strip()[:1] or ' ') else '') + t  # 줄 끝 자동 줄바꿈은 이어 붙임
        for fi, (x0, y0, x1, y1) in enumerate(figs):
            col = int((x0 + x1) / 2 >= pg.rect.width / 2)
            owner = [q for q in qs if q['pos'][0] == pi and q['pos'][1] == col and q['pos'][2] < y0] or \
                    [q for q in qs if (q['pos'][0], q['pos'][1]) < (pi, col)]
            if not owner or stop and owner[-1]['n'] > 40: continue
            q = owner[-1]; name = f'{key}-{q["n"]}-{len(q["img"])}.png'
            pg.get_pixmap(clip=pymupdf.Rect(x0 - 4, y0 - 4, x1 + 4, y1 + 4), dpi=200).save(IMG / name); q['img'].append('past-img/' + name)
        if stop: break
    res = []
    for q in qs[:40]:
        parts = re.split(f'\n?([{CIRC}])', q['raw'])
        stem, opts = parts[0].strip(), [p.strip() for p in parts[2::2]]
        res.append({'n': q['n'], 'subj': 1 if q['n'] <= 20 else 2, 'q': stem, 'o': opts, 'a': ans.get(q['n']), 'img': q['img']})
    return res

if __name__ == '__main__':
    IMG.mkdir(exist_ok=True); data = []
    for p in sys.argv[1:]:
        y, r = re.search(r'(20\d\d)년\s*(\d)회', pathlib.Path(p).name).groups()
        qs = extract(p, f'{y}-{r}')
        bad = [q['n'] for q in qs if len(q['o']) != 4 or not q['a']]
        print(f'{y}년 {r}회: {len(qs)}문항, 확인 필요 {bad}')
        data.append({'id': f'{y}-{r}', 'title': f'{y}년 {r}회', 'qs': qs})
    data.sort(key=lambda e: e['id'], reverse=True)
    (ROOT / 'js/data/past.local.js').write_text('window.PAST = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
