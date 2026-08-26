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
| 검증 계획·기존 QA 체크리스트 | [`docs/07-plan.md`](docs/07-plan.md) | 요구사항·아키텍처 전체 |
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
- `docs/07-plan.md`는 기존 검증 계획 참고 문서이며, 새 검증 규칙은 아직 없다.
- `docs/HANDOVER.md`는 현재 상태·인계 참고 문서이며 요구사항이나 아키텍처를 자동으로 바꾸지 않는다.
- 원본 간 충돌은 임의로 해소하지 않는다. `NEEDS_HUMAN` 상태를 선언하고 사람의 판단을 요청한다.
- 상세 관계, 충돌 처리, 변경 승인·파괴적 작업·근거·추정·비밀 보호 규칙은 [`docs/harness/01-SSOT.md`](docs/harness/01-SSOT.md)를 따른다.

## 작업 시작·변경 규칙

- 작업을 시작하기 전에 관련 GitHub Issue가 있는지 확인한다. Issue가 없으면 없는 상태를 명시하고 임의의 Issue를 만들지 않는다.
- 도메인 규칙을 바꾸는 작업은 `docs/01-requirements.md`를, 기술 구조를 바꾸는 작업은 `docs/06-architecture.md`를 먼저 확인한다.
- 원본에 없는 규칙을 추정해 구현하지 않는다.
- 사람이 SSOT 수정을 직접 요청하면 요청 범위 안에서 받아들인다.
- 사용자가 요청하지 않은 문서·코드·설정은 변경하지 않는다.
- 파일을 수정하기 전 대상 파일을 읽고 주변의 문체·명명·구조를 따른다.
- 파괴적 명령, 원격 변경, 커밋, 푸시는 사용자 요청 또는 명시적 승인 없이 실행하지 않는다.

## 검증·구현 루프 상태

검증 규칙과 표준 구현·검증 루프는 아직 정의되지 않았다. 둘 다 **미정(추후 생성)**으로 취급한다.

- 존재하지 않는 검증 스크립트나 CI 절차를 있다고 가정하지 않는다.
- 기존 `docs/07-plan.md`와 `docs/HANDOVER.md`의 기록은 참고만 한다.
- 검증 규칙이나 구현·검증 루프를 새로 만들라는 요청이 있을 때만 설계·작성한다.

## Next.js 작업 주의

Next.js 관련 코드를 작성할 때는 저장소에 설치된 버전의 가이드를 먼저 확인한다.

- 관련 가이드 위치: `node_modules/next/dist/docs/`
- `AGENTS.md`의 Next.js 자동 생성 블록은 삭제하거나 임의로 수정하지 않는다.
- 현재 Next.js의 라우팅·API·파일 구조가 학습된 일반적인 Next.js와 다를 수 있으므로, 코드 작성 전에 관련 가이드를 확인한다.
