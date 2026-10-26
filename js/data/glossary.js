/* 영어 병기 용어집
   GLOSSARY: 주제 id → { 표·굵은 글씨 칸의 정확한 글자: 영어 }
   TERMS:    전 주제 공통 — 본문에 나오는 한글 용어 → 영어 (정처기 필기에서 영어로도 자주 나오는 것들) */
window.GLOSSARY = {
  coupling: { '내용': 'Content coupling', '공통': 'Common coupling', '외부': 'External coupling', '제어': 'Control coupling', '자료': 'Data coupling' },
  cohesion: { '기능적': 'Functional cohesion', '순차적': 'Sequential cohesion', '교환(통신)적': 'Communicational cohesion', '절차적': 'Procedural cohesion', '시간적': 'Temporal cohesion', '논리적': 'Logical cohesion', '우연적': 'Coincidental cohesion' }
};
window.TERMS = {
  /* 개발 모형 · 프로세스 */
  '폭포수 모형': 'Waterfall Model', '나선형 모형': 'Spiral Model', 
  '스프린트 리뷰': 'Sprint Review', 
  '제품 백로그': 'Product Backlog', '제품 책임자': 'Product Owner', '일일 스크럼': 'Daily Scrum', '회고': 'Retrospective',
  '페어 프로그래밍': 'Pair Programming', '지속적 통합': 'Continuous Integration', '테스트 주도 개발': 'Test-Driven Development', 
  '소규모 릴리즈': 'Small Releases', '단순 설계': 'Simple Design', '위험 분석': 'Risk Analysis', '소프트웨어 생명주기': 'SDLC',
  /* 요구사항 · 분석 */
  '비기능 요구사항': 'Non-functional Requirements', '기능 요구사항': 'Functional Requirements', '요구사항 도출': 'Requirements Elicitation',
  '요구사항 분석': 'Requirements Analysis', '요구사항 명세': 'Requirements Specification', '요구사항 검증': 'Requirements Validation',
  '요구사항': 'Requirements', 
  '자료 흐름도': 'Data Flow Diagram', '자료 사전': 'Data Dictionary', '자료 저장소': 'Data Store', '소단위 명세서': 'Mini-spec', 
  /* UML */
  '객체 다이어그램': 'Object Diagram', '배치 다이어그램': 'Deployment Diagram',
  '복합체 구조 다이어그램': 'Composite Structure Diagram', 
  '순차 다이어그램': 'Sequence Diagram', '상태 다이어그램': 'State Diagram', '활동 다이어그램': 'Activity Diagram', '통신 다이어그램': 'Communication Diagram',
  '상호작용 개요 다이어그램': 'Interaction Overview Diagram', '구조 다이어그램': 'Structure Diagram', '행위 다이어그램': 'Behavior Diagram',
  '일반화 관계': 'Generalization', '실체화 관계': 'Realization', '의존 관계': 'Dependency', '연관 관계': 'Association', '집합 관계': 'Aggregation', '합성 관계': 'Composition',
  '다중성': 'Multiplicity', 
  /* 객체지향 · 설계 */
  '캡슐화': 'Encapsulation', '상속': 'Inheritance', '다형성': 'Polymorphism', '추상화': 'Abstraction', '정보 은닉': 'Information Hiding', '집단화': 'Aggregation',
  
  '단일 책임 원칙': 'Single Responsibility Principle', '개방-폐쇄 원칙': 'Open-Closed Principle', '개방폐쇄 원칙': 'Open-Closed Principle', '리스코프 치환 원칙': 'Liskov Substitution Principle',
  '인터페이스 분리 원칙': 'Interface Segregation Principle', '의존 역전 원칙': 'Dependency Inversion Principle', '결합도': 'Coupling', '응집도': 'Cohesion', 
  /* 아키텍처 · 패턴 */
  
  
  '추상 팩토리': 'Abstract Factory', 
  '반복자': 'Iterator',
  '중재자': 'Mediator', '방문자': 'Visitor', '책임 연쇄': 'Chain of Responsibility', 
  /* 품질 · UI */
  '사용자 인터페이스': 'User Interface (UI)', '직관성': 'Intuitiveness', '유효성': 'Validity / Effectiveness', '학습성': 'Learnability', '유연성': 'Flexibility', '사용성': 'Usability', '신뢰성': 'Reliability',
  '유지보수성': 'Maintainability', '이식성': 'Portability', '호환성': 'Compatibility', '성능 효율성': 'Performance Efficiency', '기능 적합성': 'Functional Suitability',
  /* 테스트 */
  '단위 테스트': 'Unit Test', '통합 테스트': 'Integration Test', '인수 테스트': 'Acceptance Test',
  '회귀 테스트': 'Regression Test', 
  '구문 커버리지': 'Statement Coverage', '분기 커버리지': 'Branch Coverage', '조건 커버리지': 'Condition Coverage', '경로 커버리지': 'Path Coverage', 
  '경계값 분석': 'Boundary Value Analysis', '동등 분할': 'Equivalence Partitioning', '원인-효과 그래프': 'Cause-Effect Graph', '결정 테이블': 'Decision Table', '상태 전이': 'State Transition',
  '파레토 법칙': 'Pareto Principle', '살충제 패러독스': 'Pesticide Paradox', '결함 집중': 'Defect Clustering', '정적 분석': 'Static Analysis', '동적 분석': 'Dynamic Analysis',
  '워크스루': 'Walkthrough', '동료 검토': 'Peer Review', '결함': 'Defect', 
  /* 자료구조 · 알고리즘 */
  '연결 리스트': 'Linked List', '이진 트리': 'Binary Tree', '이진 탐색': 'Binary Search', 
  '전위 순회': 'Preorder', '중위 순회': 'Inorder', '후위 순회': 'Postorder', '전위': 'Preorder / Prefix', '중위': 'Inorder / Infix', '후위': 'Postorder / Postfix', '정점': 'Vertex', '간선': 'Edge', '차수': 'Degree',
  '해시 함수': 'Hash Function', '충돌': 'Collision / Conflict', '시간복잡도': 'Time Complexity', '공간복잡도': 'Space Complexity',
  '합병 정렬': 'Merge Sort', '병합 정렬': 'Merge Sort', '선택 정렬': 'Selection Sort', '삽입 정렬': 'Insertion Sort',
  '선형 구조': 'Linear Structure', '비선형 구조': 'Non-linear Structure',
  /* 보조 용어 */
  '기능 주도 개발': 'Feature-Driven Development (FDD)', '증분': 'Increment',
  '하향식 통합': 'Top-down Integration', '상향식 통합': 'Bottom-up Integration', '하향식': 'Top-down', '상향식': 'Bottom-up', '기본 경로 테스트': 'Basis Path Testing',
  '생명선': 'Lifeline', '결합 조각': 'Combined Fragment', '시스템 경계': 'System Boundary', 
  '팬인': 'Fan-in', '팬아웃': 'Fan-out',
  '완전 그래프': 'Complete Graph', '동의어': 'Synonym', '제산법': 'Division Method', '폴딩법': 'Folding Method', '제곱 중간법': 'Mid-square Method', 
  '기준선': 'Baseline', '보안 컨테이너': 'Security Container', '콘텐츠 제공자': 'Content Provider', '콘텐츠 분배자': 'Content Distributor',
  '암호화': 'Encryption', 
  /* 추가 용어 */
  '폐기형': 'Throw-away', '진화형': 'Evolutionary', '스프린트 계획 회의': 'Sprint Planning', '스프린트 검토': 'Sprint Review', '스프린트 회고': 'Sprint Retrospective',
  '투명성': 'Transparency', '짝 프로그래밍': 'Pair Programming', '개발팀': 'Developers (Development Team)',
  '설문': 'Questionnaire', '상세화': 'Leveling', '균형화': 'Balancing',
  '초기 상태': 'Initial State', '종료 상태': 'Final State', '이력 상태': 'History State', '복합 상태': 'Composite State', 
  '심미성': 'Aesthetics', '일관성': 'Consistency', '단순성': 'Simplicity', '가시성': 'Visibility', '표준화': 'Standardization', '접근성': 'Accessibility', '명확성': 'Clarity',
  '특수화': 'Specialization',
  '깊이 우선 탐색': 'Depth-First Search (DFS)', '너비 우선 탐색': 'Breadth-First Search (BFS)', '비단말 노드': 'Non-terminal Node', '단말 노드': 'Terminal (Leaf) Node', '루트': 'Root', '형제': 'Sibling',
  '전위 표기': 'Prefix Notation', '중위 표기': 'Infix Notation', '후위 표기': 'Postfix Notation', '개방 주소법': 'Open Addressing', '폐쇄 주소법': 'Closed Addressing', 
  '선형 조사': 'Linear Probing', '이차 조사': 'Quadratic Probing', '기수 변환법': 'Radix Conversion', '숫자 분석법': 'Digit Analysis', '대수적 코딩법': 'Algebraic Coding', '순환 복잡도': 'Cyclomatic Complexity',
  '형상 항목': 'Configuration Item', '형상 식별': 'Configuration Identification', '형상 통제': 'Configuration Control',
  '형상 감사': 'Configuration Audit', '형상 기록': 'Configuration Status Accounting', '가져오기': 'Import', '동기화': 'Synchronization',
  '조건/결정 커버리지': 'Condition/Decision Coverage', '다중 조건 커버리지': 'Multiple Condition Coverage',
  '변경 조건/결정 커버리지': 'MC/DC (Modified Condition/Decision Coverage)', '제어 흐름 테스트': 'Control Flow Testing', '데이터 흐름 테스트': 'Data Flow Testing', 
  '동치 클래스': 'Equivalence Class', '동치 분할': 'Equivalence Partitioning', '비교 검사': 'Comparison Testing', '오류 예측': 'Error Guessing',
  '참 오라클': 'True Oracle', '일관성 검사 오라클': 'Consistent Oracle',
  '캡슐화 보안 페이로드': 'Encapsulating Security Payload (ESP)', '기밀성': 'Confidentiality', '무결성': 'Integrity', '키 교환': 'Key Exchange', '보안 연관': 'Security Association (SA)', 
  /* 개발 환경 · 배포 · 보안 · 통합 */
  '통합 개발 환경': 'IDE (Integrated Development Environment)', '디지털 저작권 관리': 'DRM (Digital Rights Management)',
  '형상 관리': 'SCM (Software Configuration Management)', '버전 관리': 'Version Control', 
  
  '인증 헤더': 'Authentication Header (AH)', '전송 모드': 'Transport Mode', '속성-값 쌍': 'Attribute-Value Pair'
};
