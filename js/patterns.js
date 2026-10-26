/* GoF 디자인 패턴 23종: 데이터 + 카드 렌더러 */
(function () {
  const N = (id, n, x, y, m, o) => Object.assign({ id, n, x, y, m: m || [] }, o || {});
  const P = [];
  const add = (cat, id, kr, en, d) => P.push(Object.assign({ cat, id, kr, en }, d));

  /* ───── 생성 패턴 ───── */
  add('c', 'abstract-factory', '추상 팩토리', 'Abstract Factory', {
    intent: '구체적인 클래스를 지정하지 않고, 서로 관련되거나 의존하는 객체들의 군(Family)을 생성하는 인터페이스를 제공한다.',
    keys: ['관련 객체군(제품군) 생성', '구체 클래스 노출 X', '인터페이스로 객체군 생성'],
    ex: 'Light/Dark 테마별 Button·TextField 세트, Windows/Mac UI 위젯 세트, DB 벤더별 Connection+Statement 세트',
    cmp: '팩토리 메서드는 "제품 1종류"를 서브클래스가 생성, 추상 팩토리는 "제품군(여러 종류)"을 생성.',
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('af', 'AbstractFactory', 1, 0, ['createProductA()', 'createProductB()'], { k: 'i', c: 'a' }), N('ap', 'AbstractProduct', 2, 0, [], { k: 'i', c: 'c' }), N('f1', 'ConcreteFactory1', 0.5, 1, ['createProductA()', 'createProductB()'], { c: 'b' }), N('f2', 'ConcreteFactory2', 1.5, 1, ['createProductA()', 'createProductB()'], { c: 'b' })], edges: [['cl', 'af', 'assoc'], ['cl', 'ap', 'assoc'], ['af', 'ap', 'dep', 'creates'], ['f1', 'af', 'real'], ['f2', 'af', 'real']] },
  });
  add('c', 'builder', '빌더', 'Builder', {
    intent: '복잡한 객체의 생성 과정(절차)과 표현 방법을 분리하여, 동일한 생성 절차에서 서로 다른 표현 결과를 만든다.',
    keys: ['단계별로 객체 생성', '생성 과정과 표현 분리', 'Director(지휘자)', '점층적 생성자 문제 해결'],
    ex: 'StringBuilder, Lombok @Builder, 햄버거·컴퓨터 조립, HTML 문서 생성기',
    cmp: '추상 팩토리는 "즉시" 제품군을 반환, 빌더는 "단계별로 조립"한 뒤 마지막에 결과를 반환.',
    code: `Computer pc = new Computer.Builder()
    .cpu("i7").ram(16).ssd(512)   // 단계별 설정
    .build();                      // 마지막에 생성`,
    spec: { nodes: [N('d', 'Director', 0, 0, ['construct()'], { c: 'g' }), N('b', 'Builder', 1, 0, ['buildPartA()', 'buildPartB()', 'getResult()'], { k: 'i', c: 'a' }), N('cb', 'ConcreteBuilder', 1, 1, ['buildPartA()', 'buildPartB()', 'getResult()'], { c: 'b' }), N('p', 'Product', 2, 1, [], { c: 'c' })], edges: [['d', 'b', 'assoc'], ['cb', 'b', 'real'], ['cb', 'p', 'dep', 'creates']] },
  });
  add('c', 'factory-method', '팩토리 메서드', 'Factory Method', {
    intent: '객체 생성을 위한 인터페이스(팩토리 메서드)를 정의하되, 어떤 클래스의 인스턴스를 만들지는 서브클래스가 결정하게 한다. (Virtual Constructor)',
    keys: ['생성을 서브클래스에 위임', 'Virtual Constructor', 'Creator / Product', '상속 기반'],
    ex: 'Calendar.getInstance(), 프레임워크의 createDocument(), Logger 생성',
    cmp: '"서브클래스가 결정"이 핵심. 싱글톤은 인스턴스 1개 보장.',
    code: `abstract class Creator {
  abstract Product factoryMethod();      // 서브클래스가 결정
  void operation() { Product p = factoryMethod(); p.use(); }
}
class ConcreteCreator extends Creator {
  Product factoryMethod() { return new ConcreteProduct(); }
}`,
    spec: { nodes: [N('cr', 'Creator', 0, 0, ['factoryMethod(): Product', 'operation()'], { k: 'a', c: 'a' }), N('cc', 'ConcreteCreator', 0, 1, ['factoryMethod()'], { c: 'a' }), N('pr', 'Product', 1, 0, [], { k: 'i', c: 'c' }), N('cp', 'ConcreteProduct', 1, 1, [], { c: 'c' })], edges: [['cc', 'cr', 'inh'], ['cp', 'pr', 'real'], ['cr', 'pr', 'assoc'], ['cc', 'cp', 'dep', 'creates']] },
  });
  add('c', 'prototype', '프로토타입', 'Prototype', {
    intent: '원본 객체를 복제(clone)하여 새로운 객체를 생성한다. 생성 비용이 크거나 구체 클래스를 몰라도 복사할 수 있다.',
    keys: ['복제(Clone)', '원형을 복사해서 생성', 'Prototype Registry', 'new 대신 clone()'],
    ex: 'Object.clone(), 게임 몬스터 복제, 문서 템플릿 복사',
    cmp: '개발 "프로토타입 모형"(시제품)과 이름만 같고 전혀 다른 개념!',
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('p', 'Prototype', 1, 0, ['clone(): Prototype'], { k: 'i', c: 'a' }), N('c1', 'ConcretePrototype1', 0.5, 1, ['clone()'], { c: 'b' }), N('c2', 'ConcretePrototype2', 1.5, 1, ['clone()'], { c: 'b' })], edges: [['cl', 'p', 'assoc'], ['c1', 'p', 'real'], ['c2', 'p', 'real']] },
  });
  add('c', 'singleton', '싱글톤', 'Singleton', {
    intent: '클래스의 인스턴스를 오직 하나만 생성하고, 이에 대한 전역 접근점을 제공한다.',
    keys: ['인스턴스 단 1개', '전역 접근점', 'private 생성자 + getInstance()', '스레드 안전(synchronized, DCL)'],
    ex: '설정 관리자, 로거, 커넥션 풀, 레지스트리',
    cmp: '"하나만" 이라는 말이 나오면 싱글톤.',
    code: `class Singleton {
  private static Singleton instance;
  private Singleton() {}                       // 외부 생성 금지
  public static synchronized Singleton getInstance() {
    if (instance == null) instance = new Singleton();
    return instance;
  }
}`,
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('s', 'Singleton', 1, 0, ['-instance: Singleton', '-Singleton()', '+getInstance(): Singleton'], { c: 'a' })], edges: [['cl', 's', 'dep', 'getInstance()'], ['s', 's', 'assoc', 'instance']] },
  });

  /* ───── 구조 패턴 ───── */
  add('s', 'adapter', '어댑터', 'Adapter', {
    intent: '호환되지 않는 인터페이스를 가진 클래스를 클라이언트가 기대하는 인터페이스로 변환하여 함께 동작하게 한다.',
    keys: ['인터페이스 변환', 'Wrapper(래퍼)', '기존 클래스 재사용', '클래스 어댑터(상속)/객체 어댑터(위임)'],
    ex: '110V↔220V 변환 플러그, InputStreamReader, Arrays.asList(), 레거시 시스템 연동',
    cmp: '어댑터=이미 있는 것을 "맞추기"(사후), 브리지=처음부터 "분리 설계"(사전).',
    code: `class Adapter implements Target {
  private Adaptee adaptee;
  public void request() { adaptee.specificRequest(); }  // 변환·위임
}`,
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('t', 'Target', 1, 0, ['request()'], { k: 'i', c: 'a' }), N('ad', 'Adapter', 1, 1, ['request()'], { c: 'b' }), N('ae', 'Adaptee', 2, 1, ['specificRequest()'], { c: 'c' })], edges: [['cl', 't', 'assoc'], ['ad', 't', 'real'], ['ad', 'ae', 'assoc', '위임']] },
  });
  add('s', 'bridge', '브리지', 'Bridge', {
    intent: '추상화(Abstraction)와 구현(Implementation)을 분리하여 각각 독립적으로 확장할 수 있게 한다.',
    keys: ['추상과 구현의 분리', '두 계층 독립 확장', '상속보다 합성(has-a)', '클래스 폭발 방지'],
    ex: '도형(원/사각형) × 색상(빨강/파랑), 리모컨 × 기기, JDBC(Driver)',
    cmp: '어댑터와 구조는 비슷하나 "설계 초기부터" 계층을 분리하는 점이 다름.',
    spec: { nodes: [N('ab', 'Abstraction', 0, 0, ['impl: Implementor', 'operation()'], { k: 'a', c: 'a' }), N('ra', 'RefinedAbstraction', 0, 1, ['operation()'], { c: 'a' }), N('im', 'Implementor', 1.5, 0, ['operationImpl()'], { k: 'i', c: 'c' }), N('ia', 'ConcreteImplA', 1, 1, ['operationImpl()'], { c: 'b' }), N('ib', 'ConcreteImplB', 2, 1, ['operationImpl()'], { c: 'b' })], edges: [['ab', 'im', 'assoc', 'bridge'], ['ra', 'ab', 'inh'], ['ia', 'im', 'real'], ['ib', 'im', 'real']] },
  });
  add('s', 'composite', '컴포지트', 'Composite', {
    intent: '객체들을 트리 구조로 구성하여 부분-전체 계층(Part-Whole)을 표현하고, 개별 객체와 복합 객체를 동일하게 다루게 한다.',
    keys: ['부분-전체 계층', '트리 구조', '단일/복합 객체 동일 취급', '재귀적 구성'],
    ex: '파일 ↔ 폴더, 메뉴 ↔ 하위 메뉴, GUI Component ↔ Container',
    cmp: '"폴더 안에 폴더/파일" 같은 재귀 구조 → 컴포지트.',
    spec: { nodes: [N('co', 'Component', 1, 0, ['operation()', 'add(c)', 'remove(c)'], { k: 'a', c: 'a' }), N('lf', 'Leaf', 0, 1, ['operation()'], { c: 'b' }), N('cp', 'Composite', 2, 1, ['children', 'operation()', 'add(c)'], { c: 'b' })], edges: [['lf', 'co', 'inh'], ['cp', 'co', 'inh'], ['cp', 'co', 'agg', 'children *', { dx: -90 }]] },
  });
  add('s', 'decorator', '데코레이터', 'Decorator', {
    intent: '객체에 동적으로 새로운 책임(기능)을 추가한다. 서브클래싱보다 유연한 기능 확장 방법을 제공한다.',
    keys: ['기능을 동적으로 추가', '래핑(Wrapping)·중첩 가능', '같은 인터페이스 유지', '상속 대신 합성'],
    ex: 'Java I/O (new BufferedReader(new FileReader(..))), 커피+우유+시럽, 스크롤바 추가',
    cmp: '프록시는 "접근 제어", 데코레이터는 "기능 추가". 구조는 유사.',
    code: `Coffee c = new Milk(new Syrup(new Espresso()));  // 겹겹이 감싸기
c.cost();   // 각 데코레이터가 자기 몫을 더함`,
    spec: { nodes: [N('cm', 'Component', 1, 0, ['operation()'], { k: 'i', c: 'a' }), N('cc', 'ConcreteComponent', 0, 1, ['operation()'], { c: 'b' }), N('dc', 'Decorator', 2, 1, ['component: Component', 'operation()'], { k: 'a', c: 'c' }), N('da', 'ConcreteDecoratorA', 2, 2, ['operation()', 'addedBehavior()'], { c: 'c' })], edges: [['cc', 'cm', 'real'], ['dc', 'cm', 'real'], ['dc', 'cm', 'agg', 'wraps', { dx: -80 }], ['da', 'dc', 'inh']] },
  });
  add('s', 'facade', '퍼사드', 'Facade', {
    intent: '서브시스템 내의 복잡한 여러 인터페이스에 대해 하나의 통합된(단순한) 인터페이스를 제공한다.',
    keys: ['단일 창구(통합 인터페이스)', '복잡성 은닉', '서브시스템 결합도 감소', 'high-level 인터페이스'],
    ex: '홈시어터 "영화 시작" 버튼 하나, 서비스 계층(Service Layer), 컴파일러 인터페이스',
    cmp: '어댑터=인터페이스 "변환", 퍼사드=인터페이스 "단순화/통합".',
    spec: { nodes: [N('cl', 'Client', 0, 1, [], { c: 'g' }), N('fa', 'Facade', 1, 1, ['operation()'], { c: 'a' }), N('a', 'SubsystemA', 2, 0, [], { c: 'b' }), N('b', 'SubsystemB', 2, 1, [], { c: 'b' }), N('c', 'SubsystemC', 2, 2, [], { c: 'b' })], edges: [['cl', 'fa', 'assoc'], ['fa', 'a', 'assoc'], ['fa', 'b', 'assoc'], ['fa', 'c', 'assoc']] },
  });
  add('s', 'flyweight', '플라이웨이트', 'Flyweight', {
    intent: '공유를 통해 많은 수의 작은 객체를 효율적으로 지원(메모리 절약). 내재 상태(공유)와 외재 상태(비공유)를 분리한다.',
    keys: ['객체 공유로 메모리 절약', '내재(intrinsic)/외재(extrinsic) 상태', 'Flyweight Factory(풀)', '대량의 유사 객체'],
    ex: '문서 편집기의 글자(글리프), 게임의 나무/총알, String Pool, Integer 캐시',
    cmp: '"많은 수의 유사 객체"+"공유" → 플라이웨이트.',
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('ff', 'FlyweightFactory', 1, 0, ['pool: Map', 'getFlyweight(key)'], { c: 'a' }), N('fw', 'Flyweight', 2, 0, ['operation(extrinsic)'], { k: 'i', c: 'c' }), N('cf', 'ConcreteFlyweight', 2, 1, ['intrinsicState'], { c: 'b' })], edges: [['cl', 'ff', 'assoc'], ['ff', 'fw', 'agg', 'pool'], ['cf', 'fw', 'real']] },
  });
  add('s', 'proxy', '프록시', 'Proxy', {
    intent: '다른 객체에 대한 접근을 제어하기 위해 대리자(Surrogate)나 자리 표시자(Placeholder)를 제공한다.',
    keys: ['대리 객체·접근 제어', '가상(지연로딩)·원격·보호·캐싱 프록시', '실제 객체와 동일 인터페이스'],
    ex: '이미지 지연 로딩, RMI 원격 스텁, 권한 검사, Spring AOP, 캐시',
    cmp: '데코레이터=기능 추가, 프록시=접근 제어(생성 시점·권한·원격).',
    code: `class Proxy implements Subject {
  private RealSubject real;
  public void request() {
    if (real == null) real = new RealSubject();   // 지연 생성
    if (checkAccess()) real.request();            // 접근 제어
  }
}`,
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('su', 'Subject', 1, 0, ['request()'], { k: 'i', c: 'a' }), N('rs', 'RealSubject', 0.5, 1, ['request()'], { c: 'b' }), N('px', 'Proxy', 1.5, 1, ['real: RealSubject', 'request()'], { c: 'c' })], edges: [['cl', 'su', 'assoc'], ['rs', 'su', 'real'], ['px', 'su', 'real'], ['px', 'rs', 'assoc', '위임·제어']] },
  });

  /* ───── 행위 패턴 ───── */
  add('b', 'chain-of-responsibility', '책임 연쇄', 'Chain of Responsibility', {
    intent: '요청을 처리할 수 있는 기회를 둘 이상의 객체에 부여하여 송신자와 수신자의 결합을 없앤다. 처리할 객체를 체인으로 연결하고 처리될 때까지 전달한다.',
    keys: ['체인으로 연결된 핸들러', '요청을 다음 핸들러로 전달', '송·수신 결합도 제거', '결재 라인'],
    ex: '서블릿 필터 체인, try-catch 예외 전파, 결재 단계, 로깅 레벨, 이벤트 버블링',
    cmp: '여러 객체 중 "누가 처리할지 모를 때".',
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('h', 'Handler', 1, 0, ['next: Handler', 'handle(req)'], { k: 'a', c: 'a' }), N('ha', 'ConcreteHandlerA', 0.5, 1, ['handle(req)'], { c: 'b' }), N('hb', 'ConcreteHandlerB', 1.5, 1, ['handle(req)'], { c: 'b' })], edges: [['cl', 'h', 'assoc'], ['ha', 'h', 'inh'], ['hb', 'h', 'inh'], ['h', 'h', 'assoc', 'next']] },
  });
  add('b', 'command', '커맨드', 'Command', {
    intent: '요청(명령) 자체를 객체로 캡슐화하여 요청을 매개변수화하고, 큐잉·로깅·실행 취소(undo)를 지원한다.',
    keys: ['요청을 객체로 캡슐화', 'Undo/Redo', '큐·로그·매크로', 'Invoker – Command – Receiver'],
    ex: 'GUI 버튼 액션, 매크로 기록, 작업 큐(Runnable), 리모컨 버튼',
    cmp: '"실행 취소(undo)" 키워드 → 커맨드(또는 메멘토 — 상태 복원).',
    code: `interface Command { void execute(); void undo(); }
class LightOnCommand implements Command {
  Light light;
  public void execute() { light.on(); }
  public void undo()    { light.off(); }
}`,
    spec: { nodes: [N('iv', 'Invoker', 0, 0, ['command', 'invoke()'], { c: 'g' }), N('cm', 'Command', 1, 0, ['execute()', 'undo()'], { k: 'i', c: 'a' }), N('cc', 'ConcreteCommand', 1, 1, ['receiver', 'execute()'], { c: 'b' }), N('rc', 'Receiver', 2, 1, ['action()'], { c: 'c' }), N('cl', 'Client', 0, 1, [], { c: 'g' })], edges: [['iv', 'cm', 'assoc'], ['cc', 'cm', 'real'], ['cc', 'rc', 'assoc'], ['cl', 'cc', 'dep', 'creates']] },
  });
  add('b', 'interpreter', '인터프리터', 'Interpreter', {
    intent: '언어의 문법(Grammar)을 클래스로 표현하고, 그 문법으로 작성된 문장을 해석하는 해석기를 정의한다.',
    keys: ['문법 규칙 = 클래스', '구문 트리(AST)', 'interpret(context)', '간단한 언어·수식·정규식'],
    ex: 'SQL 파서, 정규표현식 엔진, 수식 계산기, 스크립트 언어',
    cmp: '컴포지트와 구조가 유사(트리). 터미널/논터미널 표현이 핵심 단서.',
    spec: { nodes: [N('cl', 'Client', 0, 0, [], { c: 'g' }), N('ae', 'AbstractExpression', 1, 0, ['interpret(ctx)'], { k: 'a', c: 'a' }), N('te', 'TerminalExpression', 0.5, 1, ['interpret(ctx)'], { c: 'b' }), N('ne', 'NonterminalExpression', 1.5, 1, ['expr children', 'interpret(ctx)'], { c: 'b' })], edges: [['cl', 'ae', 'assoc'], ['te', 'ae', 'inh'], ['ne', 'ae', 'inh']] },
  });
  add('b', 'iterator', '반복자', 'Iterator', {
    intent: '내부 표현을 노출하지 않고 집합 객체(컬렉션)의 요소들을 순차적으로 접근할 수 있게 한다.',
    keys: ['순차 접근', '내부 구조 은닉', 'hasNext() / next()', '순회 방식을 컬렉션과 분리'],
    ex: 'Java Iterator·for-each, DB 커서, Python iter',
    cmp: '"컬렉션을 순회"하면 반복자.',
    code: `Iterator<String> it = list.iterator();
while (it.hasNext()) { System.out.println(it.next()); }`,
    spec: { nodes: [N('ag', 'Aggregate', 0, 0, ['createIterator()'], { k: 'i', c: 'a' }), N('ca', 'ConcreteAggregate', 0, 1, ['createIterator()'], { c: 'a' }), N('it', 'Iterator', 1, 0, ['hasNext()', 'next()'], { k: 'i', c: 'c' }), N('ci', 'ConcreteIterator', 1, 1, ['hasNext()', 'next()'], { c: 'c' })], edges: [['ca', 'ag', 'real'], ['ci', 'it', 'real'], ['ag', 'it', 'dep', 'creates'], ['ci', 'ca', 'assoc', '순회']] },
  });
  add('b', 'mediator', '중재자', 'Mediator', {
    intent: '객체들 간의 복잡한 상호작용(N:N 통신)을 하나의 중재자 객체에 캡슐화하여 직접 참조를 없애고 결합도를 낮춘다.',
    keys: ['N:N → 1:N', '중재자를 통한 통신', '동료(Colleague) 간 직접 참조 X', '결합도 감소'],
    ex: '채팅방 서버, 항공 관제탑, UI 다이얼로그의 위젯 조율',
    cmp: '옵서버=1:N 단방향 통지, 중재자=양방향·집중 조정.',
    spec: { nodes: [N('ca', 'ColleagueA', 0, 0, ['mediator'], { c: 'b' }), N('cb', 'ColleagueB', 2, 0, ['mediator'], { c: 'b' }), N('cm', 'ConcreteMediator', 1, 1, ['notify(sender, ev)'], { c: 'a' }), N('cc', 'ColleagueC', 0, 2, ['mediator'], { c: 'b' }), N('md', 'Mediator', 2, 2, ['notify()'], { k: 'i', c: 'a' })], edges: [['ca', 'cm', 'assoc'], ['cb', 'cm', 'assoc'], ['cc', 'cm', 'assoc'], ['cm', 'md', 'real']] },
  });
  add('b', 'memento', '메멘토', 'Memento', {
    intent: '캡슐화를 위배하지 않고 객체의 내부 상태를 저장(스냅샷)해 두었다가 나중에 그 상태로 복원할 수 있게 한다.',
    keys: ['상태 저장·복원', 'Undo(실행 취소)', 'Originator / Memento / Caretaker', '캡슐화 유지'],
    ex: '에디터 Undo, 게임 세이브/로드, 트랜잭션 롤백, 스냅샷',
    cmp: '커맨드(undo=역연산 실행) vs 메멘토(undo=저장한 상태로 복원).',
    spec: { nodes: [N('or', 'Originator', 0, 0, ['state', 'save(): Memento', 'restore(m)'], { c: 'a' }), N('me', 'Memento', 1, 0, ['state'], { c: 'c' }), N('ct', 'Caretaker', 2, 0, ['mementos: List'], { c: 'g' })], edges: [['or', 'me', 'dep', 'creates'], ['ct', 'me', 'agg', 'holds']] },
  });
  add('b', 'observer', '옵서버', 'Observer', {
    intent: '객체의 상태가 변할 때 그 객체에 의존하는 다른 객체들에게 자동으로 통지하고 갱신되게 한다. (1:N 의존)',
    keys: ['발행-구독(Publish–Subscribe)', '1:N 의존 관계', 'notify() → update()', '이벤트 리스너'],
    ex: 'GUI 이벤트 리스너, MVC의 Model→View 통지, 유튜브 구독, 주식 시세 알림',
    cmp: '"상태 변화를 여러 객체에 통지" = 옵서버.',
    code: `class Subject {
  List<Observer> observers = new ArrayList<>();
  void attach(Observer o) { observers.add(o); }
  void notifyAll() { for (Observer o : observers) o.update(this); }
}`,
    spec: { nodes: [N('su', 'Subject', 0, 0, ['observers', 'attach(o)', 'detach(o)', 'notify()'], { c: 'a' }), N('ob', 'Observer', 1, 0, ['update()'], { k: 'i', c: 'c' }), N('cs', 'ConcreteSubject', 0, 1, ['state', 'getState()'], { c: 'a' }), N('co', 'ConcreteObserver', 1, 1, ['update()'], { c: 'c' })], edges: [['su', 'ob', 'agg', 'notifies'], ['cs', 'su', 'inh'], ['co', 'ob', 'real'], ['co', 'cs', 'assoc', '관찰']] },
  });
  add('b', 'state', '상태', 'State', {
    intent: '객체의 내부 상태가 변경될 때 행동(behavior)이 바뀌도록 한다. 상태별 행위를 클래스로 분리하여 마치 객체의 클래스가 바뀌는 것처럼 보이게 한다.',
    keys: ['상태를 객체로 표현', '상태별 행동 분리', 'if/switch 상태 분기 제거', '상태 전이'],
    ex: '자판기·신호등, TCP 연결 상태(Established/Closed), 문서 승인 단계, 미디어 플레이어',
    cmp: '전략=클라이언트가 알고리즘을 "선택", 상태=상태가 바뀌면 "스스로 전이".',
    spec: { nodes: [N('cx', 'Context', 0, 0, ['state: State', 'request()'], { c: 'a' }), N('st', 'State', 1, 0, ['handle(ctx)'], { k: 'i', c: 'c' }), N('sa', 'ConcreteStateA', 0.5, 1, ['handle(ctx)'], { c: 'b' }), N('sb', 'ConcreteStateB', 1.5, 1, ['handle(ctx)'], { c: 'b' })], edges: [['cx', 'st', 'assoc', 'state'], ['sa', 'st', 'real'], ['sb', 'st', 'real']] },
  });
  add('b', 'strategy', '전략', 'Strategy', {
    intent: '동일한 목적의 알고리즘군을 정의하고 각각을 캡슐화하여 상호 교체 가능하게 한다. 클라이언트와 독립적으로 알고리즘을 변경할 수 있다.',
    keys: ['알고리즘군 캡슐화', '런타임에 알고리즘 교체', '조건문(if/switch) 제거', 'Context + Strategy'],
    ex: '정렬 알고리즘 교체, 결제 수단(카드/현금), 이동 경로(도보/자동차), Comparator',
    cmp: '구조는 State와 동일. "알고리즘을 갈아 끼운다" → 전략.',
    code: `class Context {
  private Strategy strategy;
  void setStrategy(Strategy s) { this.strategy = s; }   // 교체
  void execute() { strategy.algorithm(); }
}`,
    spec: { nodes: [N('cx', 'Context', 0, 0, ['strategy: Strategy', 'execute()'], { c: 'a' }), N('st', 'Strategy', 1, 0, ['algorithm()'], { k: 'i', c: 'c' }), N('sa', 'ConcreteStrategyA', 0.5, 1, ['algorithm()'], { c: 'b' }), N('sb', 'ConcreteStrategyB', 1.5, 1, ['algorithm()'], { c: 'b' })], edges: [['cx', 'st', 'assoc', 'strategy'], ['sa', 'st', 'real'], ['sb', 'st', 'real']] },
  });
  add('b', 'template-method', '템플릿 메서드', 'Template Method', {
    intent: '알고리즘의 골격(순서)을 상위 클래스에서 정의하고, 일부 단계의 구체적인 구현은 서브클래스에서 재정의하게 한다.',
    keys: ['알고리즘 골격은 상위 클래스', '일부 단계는 서브클래스가 구현', '상속 기반', '훅(Hook) / 할리우드 원칙'],
    ex: '프레임워크 라이프사이클, JUnit setUp/tearDown, 음료 제조(끓이기→우리기→붓기→첨가)',
    cmp: '전략=위임(합성)으로 알고리즘 통째 교체, 템플릿 메서드=상속으로 일부 단계만 변경.',
    code: `abstract class Beverage {
  final void prepare() { boil(); brew(); pour(); addCondiments(); }  // 골격(템플릿)
  abstract void brew();            // 서브클래스가 구현
  abstract void addCondiments();
}`,
    spec: { nodes: [N('ac', 'AbstractClass', 1, 0, ['templateMethod()', 'primitiveOp1()', 'primitiveOp2()'], { k: 'a', c: 'a' }), N('ca', 'ConcreteClassA', 0.5, 1, ['primitiveOp1()', 'primitiveOp2()'], { c: 'b' }), N('cb', 'ConcreteClassB', 1.5, 1, ['primitiveOp1()', 'primitiveOp2()'], { c: 'b' }), N('nt', '', 2.1, 0, ['templateMethod() {', '  primitiveOp1();', '  primitiveOp2();', '}'], { k: 'n', w: 170 })], edges: [['ca', 'ac', 'inh'], ['cb', 'ac', 'inh'], ['nt', 'ac', 'note']] },
  });
  add('b', 'visitor', '방문자', 'Visitor', {
    intent: '객체 구조의 요소들을 변경하지 않고, 그 요소들에 대해 수행할 새로운 연산을 외부 객체(Visitor)에 정의한다.',
    keys: ['연산을 객체 구조와 분리', 'accept(visitor) / visit(element)', '더블 디스패치', '새 연산 추가 쉬움(요소 추가는 어려움)'],
    ex: '컴파일러 AST 처리, 파일 시스템 용량 계산·검색, 세금 계산',
    cmp: '"구조는 안 바꾸고 새 기능만 자주 추가" → 방문자.',
    spec: { nodes: [N('vi', 'Visitor', 0, 0, ['visitA(a)', 'visitB(b)'], { k: 'i', c: 'a' }), N('cv', 'ConcreteVisitor', 0, 1, ['visitA(a)', 'visitB(b)'], { c: 'a' }), N('el', 'Element', 2, 0, ['accept(v: Visitor)'], { k: 'i', c: 'c' }), N('ea', 'ElementA', 1.4, 1, ['accept(v)'], { c: 'b' }), N('eb', 'ElementB', 2.6, 1, ['accept(v)'], { c: 'b' })], edges: [['cv', 'vi', 'real'], ['ea', 'el', 'real'], ['eb', 'el', 'real'], ['el', 'vi', 'dep', 'v.visit(this)']] },
  });

  const CAT = { c: ['생성 패턴 (Creational)', '객체의 생성 방법을 추상화 — "어떻게 만들까"'], s: ['구조 패턴 (Structural)', '클래스·객체를 더 큰 구조로 조합 — "어떻게 엮을까"'], b: ['행위 패턴 (Behavioral)', '객체 간 책임 분배와 상호작용 — "어떻게 협력할까"'] };
  window.PATTERNS = P;
  window.PATTERN_CAT = CAT;

  DIAGRAMS.patterns = (el, arg) => {
    const list = P.filter(p => p.cat === arg);
    return {
      raw: true,
      html: list.map((p, i) => `
<section class="pat" id="p-${p.id}">
  <h3>${i + 1}. ${p.kr} <small style="color:var(--muted);font-weight:500">${p.en}</small></h3>
  <dl>
    <dt>의도</dt><dd>${p.intent}</dd>
    <dt>시험 키워드</dt><dd>${p.keys.map(k => `<mark>${k}</mark>`).join(' · ')}</dd>
    <dt>사용 예</dt><dd>${p.ex}</dd>
    <dt>헷갈릴 때</dt><dd>${p.cmp}</dd>
  </dl>
  <figure class="fig"><div class="scroll">${S.classDiagram(Object.assign({ label: p.kr + ' 구조' }, p.spec))}</div><figcaption>${p.kr}(${p.en}) 구조 — 실선 삼각형=상속, 점선 삼각형=구현, 마름모=집합/합성, 점선 화살표=의존</figcaption></figure>
  ${p.code ? `<pre><code>${S.esc(p.code)}</code></pre>` : ''}
</section>`).join('')
    };
  };
})();
