/* 영어 병기 용어집
   GLOSSARY: 주제 id → { 표·굵은 글씨 칸의 정확한 글자: 영어 }
   TERMS:    전 주제 공통 — 본문에 나오는 한글 용어 → 영어 (정처기 필기에서 영어로도 자주 나오는 것들) */
window.GLOSSARY = {
  coupling: { '내용': 'Content coupling', '공통': 'Common coupling', '외부': 'External coupling', '제어': 'Control coupling', '스탬프': 'Stamp coupling', '자료': 'Data coupling' },
  cohesion: { '기능적': 'Functional cohesion', '순차적': 'Sequential cohesion', '교환(통신)적': 'Communicational cohesion', '절차적': 'Procedural cohesion', '시간적': 'Temporal cohesion', '논리적': 'Logical cohesion', '우연적': 'Coincidental cohesion' }
};
window.TERMS = {
  /* 개발 모형 · 프로세스 */
  '폭포수 모형': 'Waterfall Model', '프로토타입 모형': 'Prototype Model', '나선형 모형': 'Spiral Model', '애자일': 'Agile',
  '스크럼 마스터': 'Scrum Master', '스크럼': 'Scrum', '스프린트 백로그': 'Sprint Backlog', '스프린트 리뷰': 'Sprint Review', '스프린트': 'Sprint',
  '제품 백로그': 'Product Backlog', '제품 책임자': 'Product Owner', '일일 스크럼': 'Daily Scrum', '회고': 'Retrospective',
  '페어 프로그래밍': 'Pair Programming', '지속적 통합': 'Continuous Integration', '테스트 주도 개발': 'Test-Driven Development', '리팩토링': 'Refactoring',
  '소규모 릴리즈': 'Small Releases', '단순 설계': 'Simple Design', '위험 분석': 'Risk Analysis', '소프트웨어 생명주기': 'SDLC',
  /* 요구사항 · 분석 */
  '비기능 요구사항': 'Non-functional Requirements', '기능 요구사항': 'Functional Requirements', '요구사항 도출': 'Requirements Elicitation',
  '요구사항 분석': 'Requirements Analysis', '요구사항 명세': 'Requirements Specification', '요구사항 검증': 'Requirements Validation',
  '요구사항': 'Requirements', '브레인스토밍': 'Brainstorming', '인터뷰': 'Interview', '프로토타이핑': 'Prototyping', '유스케이스': 'Use Case',
  '자료 흐름도': 'Data Flow Diagram', '자료 사전': 'Data Dictionary', '자료 저장소': 'Data Store', '소단위 명세서': 'Mini-spec', '목업': 'Mockup',
  /* UML */
  '클래스 다이어그램': 'Class Diagram', '객체 다이어그램': 'Object Diagram', '컴포넌트 다이어그램': 'Component Diagram', '배치 다이어그램': 'Deployment Diagram',
  '복합체 구조 다이어그램': 'Composite Structure Diagram', '패키지 다이어그램': 'Package Diagram', '유스케이스 다이어그램': 'Use Case Diagram',
  '순차 다이어그램': 'Sequence Diagram', '상태 다이어그램': 'State Diagram', '활동 다이어그램': 'Activity Diagram', '통신 다이어그램': 'Communication Diagram',
  '타이밍 다이어그램': 'Timing Diagram', '상호작용 개요 다이어그램': 'Interaction Overview Diagram', '구조 다이어그램': 'Structure Diagram', '행위 다이어그램': 'Behavior Diagram',
  '일반화 관계': 'Generalization', '실체화 관계': 'Realization', '의존 관계': 'Dependency', '연관 관계': 'Association', '집합 관계': 'Aggregation', '합성 관계': 'Composition',
  '액터': 'Actor', '다중성': 'Multiplicity', '스테레오타입': 'Stereotype',
  /* 객체지향 · 설계 */
  '캡슐화': 'Encapsulation', '상속': 'Inheritance', '다형성': 'Polymorphism', '추상화': 'Abstraction', '정보 은닉': 'Information Hiding', '집단화': 'Aggregation',
  '오버로딩': 'Overloading', '오버라이딩': 'Overriding', '인스턴스': 'Instance', '인터페이스': 'Interface', '메서드': 'Method', '메소드': 'Method',
  '단일 책임 원칙': 'Single Responsibility Principle', '개방-폐쇄 원칙': 'Open-Closed Principle', '개방폐쇄 원칙': 'Open-Closed Principle', '리스코프 치환 원칙': 'Liskov Substitution Principle',
  '인터페이스 분리 원칙': 'Interface Segregation Principle', '의존 역전 원칙': 'Dependency Inversion Principle', '결합도': 'Coupling', '응집도': 'Cohesion', '모듈': 'Module',
  /* 아키텍처 · 패턴 */
  '파이프-필터': 'Pipe and Filter', '모델-뷰-컨트롤러': 'Model-View-Controller', '마스터-슬레이브': 'Master-Slave', '클라이언트-서버': 'Client-Server', '피어 투 피어': 'Peer-to-Peer',
  '브로커': 'Broker', '미들웨어': 'Middleware', '디자인 패턴': 'Design Pattern', '아키텍처 패턴': 'Architecture Pattern',
  '싱글톤': 'Singleton', '추상 팩토리': 'Abstract Factory', '팩토리 메서드': 'Factory Method', '빌더': 'Builder', '어댑터': 'Adapter', '브리지': 'Bridge', '컴포지트': 'Composite',
  '데코레이터': 'Decorator', '퍼사드': 'Facade', '플라이웨이트': 'Flyweight', '프록시': 'Proxy', '옵저버': 'Observer', '템플릿 메서드': 'Template Method', '반복자': 'Iterator',
  '중재자': 'Mediator', '메멘토': 'Memento', '방문자': 'Visitor', '책임 연쇄': 'Chain of Responsibility', '인터프리터': 'Interpreter',
  /* 품질 · UI */
  '사용자 인터페이스': 'User Interface (UI)', '직관성': 'Intuitiveness', '학습성': 'Learnability', '유연성': 'Flexibility', '사용성': 'Usability', '신뢰성': 'Reliability',
  '유지보수성': 'Maintainability', '이식성': 'Portability', '호환성': 'Compatibility', '성능 효율성': 'Performance Efficiency', '기능 적합성': 'Functional Suitability',
  /* 테스트 */
  '화이트박스': 'White-box', '블랙박스': 'Black-box', '단위 테스트': 'Unit Test', '통합 테스트': 'Integration Test', '시스템 테스트': 'System Test', '인수 테스트': 'Acceptance Test',
  '회귀 테스트': 'Regression Test', '테스트 드라이버': 'Test Driver', '테스트 스텁': 'Test Stub', '테스트 오라클': 'Test Oracle', '테스트 케이스': 'Test Case',
  '구문 커버리지': 'Statement Coverage', '분기 커버리지': 'Branch Coverage', '조건 커버리지': 'Condition Coverage', '경로 커버리지': 'Path Coverage', '커버리지': 'Coverage',
  '경계값 분석': 'Boundary Value Analysis', '동등 분할': 'Equivalence Partitioning', '원인-효과 그래프': 'Cause-Effect Graph', '결정 테이블': 'Decision Table', '상태 전이': 'State Transition',
  '파레토 법칙': 'Pareto Principle', '살충제 패러독스': 'Pesticide Paradox', '결함 집중': 'Defect Clustering', '정적 분석': 'Static Analysis', '동적 분석': 'Dynamic Analysis',
  '코드 인스펙션': 'Code Inspection', '워크스루': 'Walkthrough', '동료 검토': 'Peer Review', '결함': 'Defect', '검증': 'Verification', '확인': 'Validation',
  /* 자료구조 · 알고리즘 */
  '연결 리스트': 'Linked List', '이진 트리': 'Binary Tree', '이진 탐색': 'Binary Search', '스택': 'Stack', '큐': 'Queue', '데크': 'Deque', '트리': 'Tree', '그래프': 'Graph',
  '전위 순회': 'Preorder', '중위 순회': 'Inorder', '후위 순회': 'Postorder', '전위': 'Preorder', '중위': 'Inorder', '후위': 'Postorder', '정점': 'Vertex', '간선': 'Edge', '차수': 'Degree',
  '해시 함수': 'Hash Function', '해싱': 'Hashing', '충돌': 'Collision', '시간복잡도': 'Time Complexity', '공간복잡도': 'Space Complexity',
  '합병 정렬': 'Merge Sort', '병합 정렬': 'Merge Sort', '퀵 정렬': 'Quick Sort', '힙 정렬': 'Heap Sort', '버블 정렬': 'Bubble Sort', '선택 정렬': 'Selection Sort', '삽입 정렬': 'Insertion Sort',
  '선형 구조': 'Linear Structure', '비선형 구조': 'Non-linear Structure',
  /* 개발 환경 · 배포 · 보안 · 통합 */
  '통합 개발 환경': 'IDE (Integrated Development Environment)', '소프트웨어 패키징': 'Software Packaging', '디지털 저작권 관리': 'DRM (Digital Rights Management)',
  '형상 관리': 'SCM (Software Configuration Management)', '버전 관리': 'Version Control', '빌드': 'Build', '저장소': 'Repository', '커밋': 'Commit', '체크아웃': 'Checkout', '체크인': 'Check-in',
  '포인트 투 포인트': 'Point-to-Point', '허브 앤 스포크': 'Hub and Spoke', '메시지 버스': 'Message Bus', '하이브리드': 'Hybrid',
  '인증 헤더': 'Authentication Header (AH)', '터널 모드': 'Tunnel Mode', '전송 모드': 'Transport Mode', '속성-값 쌍': 'Attribute-Value Pair'
};
