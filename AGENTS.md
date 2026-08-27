<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 작업 라우팅 지침

이 저장소의 작업은 질문의 종류를 먼저 분류한 뒤, 해당 원본 문서만 읽고 시작한다. 작업 시작 시 모든 문서를 한꺼번에 읽지 않는다.

## 원본 문서 라우팅

| 질문·작업 종류 | 먼저 읽을 원본 | 읽지 않아도 되는 문서 |
|---|---|---|
| 재고 의미·업무 규칙·기능 범위·완료 기준 | [`docs/01-requirements.md`](docs/01-requirements.md) | 아키텍처·QA 문서 전체 |
| 시스템 구조·기술 선택·데이터 흐름·구현 제약 | [`docs/06-architecture.md`](docs/06-architecture.md) | 요구사항·QA 문서 전체 |
| 특정 작업의 범위·상태·완료 조건 | 해당 GitHub Issue | 모든 저장소 문서 |
| 검증 결과의 기준·판정·증거·실패 분류 | [`docs/harness/02-verification.md`](docs/harness/02-verification.md) §3~§9 | 판정 이후 반복 절차 |
| 판정 이후 반복·재검증·인계·종료 | [`docs/harness/03-loop.md`](docs/harness/03-loop.md) §3~§8, §10 | 검증 결과의 판정 기준 |
| 반복 절차의 미결정 정책 확인 | [`docs/harness/03-loop.md`](docs/harness/03-loop.md) §9 | 확정된 반복 규칙 |
| 검증 계획·기존 QA 체크리스트 | [`docs/07-plan.md`](docs/07-plan.md) | 새 검증 판정·반복 절차 |
| 현재 구현 상태·인계·미완료 작업 | [`docs/HANDOVER.md`](docs/HANDOVER.md) | 전체 기획 문서 |
| 사용자 흐름·화면 행동·시나리오 | [`docs/03-scenarios.md`](docs/03-scenarios.md) | 아키텍처·운영 문서 전체 |
| UI·인터랙션·반응형·접근성 | [`docs/05-design.md`](docs/05-design.md) | 도메인·운영 문서 전체 |
| 사용자 유형·목표·설계 긴장점 | [`docs/02-personas.md`](docs/02-personas.md) | 구현·QA 문서 전체 |
| 차별화 장치·오늘 할 일·팝업 리포트 | [`docs/04-engagement.md`](docs/04-engagement.md) | 아키텍처 문서 전체 |
| SSOT·원본 관계·충돌 해결 | [`docs/harness/01-SSOT.md`](docs/harness/01-SSOT.md) | 다른 문서 전체 |
| 실행·설치·명령어 안내 | [`README.md`](README.md) | 도메인·설계 문서 전체 |

재고 도메인과 아키텍처가 동시에 영향을 받는 작업은 `docs/01-requirements.md`를 먼저 읽고 `docs/06-architecture.md`를 이어서 읽는다. 개별 작업에 관한 질문은 해당 Issue를 먼저 읽고, Issue가 참조하는 원본만 추가로 읽는다.

## 탐색 확대 규칙

다음 순서를 지킨다.

1. 질문을 위 표의 한 종류 또는 복수 종류로 분류한다.
2. 분류된 원본 문서의 관련 절만 읽는다. 문서 전체를 읽을 필요가 없으면 필요한 범위로 제한한다.
3. 원본으로 판단할 수 있으면 탐색을 멈춘다.
4. 다음 경우에만 탐색 범위를 넓힌다.
   - 라우팅된 원본에 답이 없는 경우
   - 라우팅된 원본이 다른 원본을 명시적으로 참조하는 경우
   - 문서 간 충돌 여부를 확인해야 하는 경우
   - 현재 상태나 실제 검증 결과가 필요한 경우
   - 사용자가 명시적으로 전체 조사를 요청한 경우
5. 범위를 넓힐 때는 먼저 직접 참조된 문서, 그다음 관련 보조 문서, 마지막으로 저장소 전체 순서로 확장한다. 확장 이유를 작업 기록이나 최종 답변에 간단히 남긴다.

## SSOT 우선순위

- 재고 도메인의 원본은 `docs/01-requirements.md`다.
- 아키텍처의 원본은 `docs/06-architecture.md`다.
- 개별 작업의 원본은 해당 GitHub Issue다.
- `docs/07-plan.md`는 기존 검증 계획 참고 문서다.
- `docs/HANDOVER.md`는 현재 상태·인계 참고 문서이며 요구사항이나 아키텍처를 자동으로 바꾸지 않는다.
- 원본 간 충돌은 임의로 해소하지 않는다. `NEEDS_HUMAN` 상태를 선언하고 사람의 판단을 요청한다.
- 상세 관계, 충돌 처리, 변경 승인·파괴적 작업·근거·추정·비밀 보호 규칙은 [`docs/harness/01-SSOT.md`](docs/harness/01-SSOT.md)를 따른다.
- 검증 결과의 기준·판정·증거·실패 분류는 [`docs/harness/02-verification.md`](docs/harness/02-verification.md) §3~§9를 따른다.
- 판정 이후의 반복·재검증·세션/에이전트 인계·사람 개입·종료는 [`docs/harness/03-loop.md`](docs/harness/03-loop.md) §3~§8, §10을 따른다. 구현 전 문서의 초안·미결정 사항(§9)을 확인하고, 확정되지 않은 권장안을 새 규칙으로 추정하지 않는다.
- 반복 절차의 권위·관계는 [`docs/harness/01-SSOT.md`](docs/harness/01-SSOT.md) §1~§2, §5~§6에서 확인한다.

## 작업별 검증·반복 절차

- 검증 계획과 기존 QA 체크리스트는 [`docs/07-plan.md`](docs/07-plan.md)를 참고한다. 새 검증 판정이나 반복 규칙의 근거로 사용하지 않는다.
- 현재 상태·인계 참고는 [`docs/HANDOVER.md`](docs/HANDOVER.md)를 사용한다. 최신 검증 결과, Attempt 수, Loop State는 해당 문서에서 추정하지 않는다.
- Issue의 최대 횟수·종료 조건·Issue별 테스트·범위는 해당 GitHub Issue를 따른다.
- Issue가 `NEEDS_HUMAN`이거나 03-loop §9의 미결정 사항과 관련되면 사람의 결정 전 구현·예산 변경·대상 변경을 하지 않는다.
- 검증 결과만으로 다음 구현을 자동 결정하지 않는다. `02-verification.md`의 판정과 `03-loop.md`의 절차를 모두 확인한다.
- 실행 증거와 반복 상태가 없으면 과거 문서·대화·브랜치 이름으로 시도 횟수를 추정하지 않는다.

## 검증·구현 루프 상태

- `docs/harness/02-verification.md`는 검증 판정 원본이고, `docs/harness/03-loop.md`는 현재 반복 절차 초안이다.
- `03-loop.md`의 Attempt Ledger, 원자적 번호 예약, CI·Issue 연계는 아직 구현되지 않았다. 존재한다고 가정하지 않는다.
- 기존 `docs/07-plan.md`와 `docs/HANDOVER.md`의 기록은 참고 또는 `HISTORICAL` 자료로만 취급한다.
- `03-loop.md`를 정식 정책이나 자동화 규칙으로 승격·변경하려면 관련 원본과 GitHub Issue를 먼저 확인한다.
- 검증 또는 구현 반복 규칙을 새로 만들거나 변경할 때는 `01-SSOT.md`의 승인·충돌·변경 관리 규칙을 따른다.

## 작업 시작·변경 규칙

- 작업을 시작하기 전에 관련 GitHub Issue가 있는지 확인한다. Issue가 없으면 없는 상태를 명시하고 임의의 Issue를 만들지 않는다.
- 도메인 규칙을 바꾸는 작업은 `docs/01-requirements.md`를, 기술 구조를 바꾸는 작업은 `docs/06-architecture.md`를 먼저 확인한다.
- 원본에 없는 규칙을 추정해 구현하지 않는다.
- 사람이 SSOT 수정을 직접 요청하면 요청 범위 안에서 받아들인다.
- 사용자가 요청하지 않은 문서·코드·설정은 변경하지 않는다.
- 파일을 수정하기 전 대상 파일을 읽고 주변의 문체·명명·구조를 따른다.
- 파괴적 명령, 원격 변경, 커밋, 푸시는 사용자 요청 또는 명시적 승인 없이 실행하지 않는다.

## Next.js 작업 주의

Next.js 관련 코드를 작성할 때는 저장소에 설치된 버전의 가이드를 먼저 확인한다.

- 관련 가이드 위치: `node_modules/next/dist/docs/`
- `AGENTS.md`의 Next.js 자동 생성 블록은 삭제하거나 임의로 수정하지 않는다.
- 현재 Next.js의 라우팅·API·파일 구조가 학습된 일반적인 Next.js와 다를 수 있으므로, 코드 작성 전에 관련 가이드를 확인한다.
