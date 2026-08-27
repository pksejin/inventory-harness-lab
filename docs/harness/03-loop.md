# Inventory Harness 구현·검증 반복 절차 (초안)

> `02-verification.md`가 검증 결과를 판정한다면, 이 문서는 그 판정 이후의
> 수정·재검증·인계·종료 절차를 정한다.
>
> **상태:** 초안 — 사람의 최종 확인 필요
> **작성일:** 2026-08-27
> **범위:** GitHub Issue에 연결된 구현·검증 작업
> **제외:** 배포, 롤백, 백업·복구, 장애 대응, 모니터링

---

## 1. 책임 분리

| 문서 | 책임 |
|---|---|
| `docs/01-requirements.md` | 업무 의미와 요구사항 |
| `docs/06-architecture.md` | 시스템 구조와 구현 제약 |
| `docs/harness/02-verification.md` | 검증 대상·기준·판정·증거 |
| 이 문서 | 판정 이후의 반복·인계·종료 |
| 해당 GitHub Issue | 작업 범위와 종료 조건 |

이 문서는 `02-verification.md`의 결과를 변경하지 않는다. `BLOCKED` 뒤 같은
커밋을 다시 검증해 `PASS`가 되더라도, 이전 결과를 지우지 않고 두 실행을
모두 보존한다.

이 문서는 초안이므로, 정식 원본 등록과 자동화 규칙은 사람의 확인 후에
확정한다.

---

## 2. 핵심 용어

### Verification Run

명령이나 수동 절차를 한 번 실행하고 `02`의 상태를 부여한 기록이다.

```text
PASS | FAIL | NOT_RUN | BLOCKED | NEEDS_HUMAN | OVERRIDDEN | HISTORICAL
```

상태의 의미와 판정 기준은 `02-verification.md`에만 둔다.

### Implementation Attempt

승인된 범위의 코드·설정·테스트를 변경한 뒤 Issue별 테스트와 종료 조건을
다시 판정하는 한 사이클이다. `attempt_no`는 1부터 시작하며 Issue의
`max_attempts`를 넘을 수 없다.

### Rerun

구현 변경 없이 같은 커밋을 다시 검증하는 Verification Run이다. Rerun은
새 실행으로 기록하지만 Implementation Attempt 수에는 포함하지 않는다.

예:

- 파일 잠금·권한·DB 준비 문제를 해결한 뒤 같은 SHA 재실행
- CI runner·네트워크 등 환경 문제 후 같은 SHA 재실행
- 세션이나 에이전트가 바뀐 뒤 같은 변경 상태를 이어서 실행

환경 복구 과정에서 코드·설정·테스트가 바뀌면 새 Attempt다.

### Loop State

작업 전체의 절차 상태다. Verification Run의 판정 상태와 혼동하지 않는다.

```text
READY | IN_PROGRESS | VERIFYING | BLOCKED | NEEDS_HUMAN | COMPLETE | ABANDONED
```

Issue 양식의 `제안`, `승인 대기`, `진행 중`, `검증 대기`, `완료`,
`보류 — NEEDS_HUMAN`은 별도의 작업 workflow 상태다.

---

## 3. 한 번의 반복 절차

### 3.1 시작 전 확인

Attempt를 예약하거나 파일을 변경하기 전에 다음을 확인한다.

1. 관련 Issue, 범위, 종료 조건, Issue별 테스트가 존재한다.
2. 요구사항·아키텍처·SSOT를 라우팅했고 원본 충돌이 없다.
3. Issue의 `max_attempts`가 유효하고 이미 사용한 수와 남은 수를 확인했다.
4. branch, base SHA, worktree, 기존 변경의 소유자를 확인했다.
5. 기존 Attempt, 활성 writer, handoff 상태를 확인했다.
6. 파괴적 작업의 대상이 명확하고 폐기 가능하다.
7. 새 구현이 필요한지, 기존 SHA의 Rerun이면 충분한지 구분했다.

다음 중 하나라도 불명확하면 구현하지 않고 `NEEDS_HUMAN`으로 인계한다.

- Issue·범위·종료 조건·최대 횟수가 없음
- 원본 또는 Issue 간 충돌
- dirty 변경의 소유자가 불명확함
- 파괴적 DB 대상이 불명확함
- 활성 Attempt 또는 writer가 충돌함
- 필수 승인이나 예외 승인이 없음
- 검증 스크립트 자체 결함으로 판정할 수 없음
- 완료·폐기된 작업을 사람 승인 없이 재개하려 함

### 3.2 Attempt 실행

1. 다음 `attempt_no`를 예약하고 `attempt_id`를 만든다.
2. Issue, owner, session/agent/worktree, branch, base SHA를 기록한다.
3. 승인된 범위만 변경한다.
4. head SHA와 변경 파일을 기록한다.
5. Issue별 테스트를 실행한다.
6. Issue의 모든 종료 조건을 개별적으로 판정한다.
7. 필요한 경우 `02`의 표준 검증 게이트를 실행한다.
8. 각 Verification Run, 첫 실패 단계, 증거를 Attempt에 연결한다.
9. 아래 표에 따라 다음 상태를 결정한다.

### 3.3 판정 이후 행동

| `02` 결과 | 다음 행동 |
|---|---|
| 필수 조건 모두 `PASS` | 완료 조건 확인 후 `COMPLETE` |
| 구현 원인의 `FAIL` + 남은 Attempt | 실패를 보존하고 다음 Attempt 예약 |
| 동일 SHA의 환경 문제 `BLOCKED` | 환경 복구 후 Rerun; Attempt 수 유지 |
| `NOT_RUN` | 누락 검증 실행 또는 사유 기록; `PASS` 추정 금지 |
| `NEEDS_HUMAN` | 즉시 사람에게 인계 |
| `OVERRIDDEN` | 원래 결과와 승인 기록을 함께 보존하고 승인 범위에서만 진행 |
| `HISTORICAL` | 현재 SHA에서 별도 검증; 완료 근거로 단독 사용 금지 |
| 검증 스크립트 자체 오류 | 판정 중단 후 사람에게 인계 |

`FAIL`, `BLOCKED`, `NOT_RUN`을 자동으로 구현 실패나 성공으로 변환하지
않는다. 실패 분류와 다음 행동의 근거를 기록한다.

---

## 4. 반복 횟수 규칙

### 4.1 최대 횟수

`max_attempts`는 Issue에서 정한 불변값이다. 다음으로 초기화하거나 늘리지
않는다.

- 세션·에이전트·context 변경
- worktree·branch 변경
- 로컬과 CI 환경 변경
- Verification Rerun

최대값을 바꾸려면 사람의 명시적인 Issue 변경 또는 적용 범위가 적힌 승인
기록이 필요하다. 이전 Attempt 기록을 수정해 한도를 늘리지 않는다.

### 4.2 카운터

다음 카운터를 분리한다.

```text
attempts_started
attempts_completed
attempts_remaining
verification_runs
verification_reruns
passed_runs
failed_runs
blocked_runs
human_decision_requests
handoffs
```

권장 차감 기준은 다음과 같다.

| 이벤트 | Attempt 차감 |
|---|---:|
| 코드·설정·테스트를 변경한 뒤 재검증 | 1 |
| 동일 SHA 명령 재실행 | 0 |
| 환경만 복구한 뒤 동일 SHA 재실행 | 0 |
| 세션·에이전트·worktree 교체 후 이어받기 | 0 |
| 환경 복구 중 코드·설정·테스트 변경 | 1 |
| CI 동일 커밋 재실행 | 0 |

이 차감 기준은 초안 권장안이다. 환경 `BLOCKED`, 수동 검증, override,
완료된 Issue 재개에 대한 최종 기준은 사람의 확인이 필요하다.

### 4.3 하드 캡

다음 조건이면 추가 구현을 하지 않는다.

```text
attempts_started >= max_attempts
AND 필수 종료 조건 중 하나라도 PASS가 아님
```

이때 기존 결과를 보존하고 Loop State를 `NEEDS_HUMAN`으로 바꾼 뒤,
실패 조건·출력·시도 수·남은 판단을 인계한다. 사람 승인 없이 한도를
늘리거나 새 Attempt를 예약하지 않는다.

---

## 5. 세션·에이전트 인계

새 세션이나 에이전트는 transcript, plan, branch 이름만으로 시도 횟수를
추정하지 않는다. 정식 Loop State와 Attempt Ledger를 먼저 읽는다.

인계 순서:

1. Issue, PR, branch, base SHA 확인
2. `max`, `used`, `remaining` 확인
3. 마지막 verified SHA와 Verification Run 확인
4. 활성 Attempt의 owner와 lease 확인
5. 기존 Attempt의 Rerun인지 새 Attempt인지 결정
6. 기존 Attempt면 같은 `attempt_id`와 부모 관계 유지
7. 새 Attempt면 다음 번호를 원자적으로 예약
8. worktree와 변경 파일이 기록과 일치하는지 확인
9. `next_action`과 남은 예산을 기록하고 실행
10. 완료 또는 다음 인계를 기록

세션·에이전트 변경 자체는 새 Attempt의 근거가 아니다. 커밋되지 않은 변경은
자동 인계가 보장되지 않으므로, 보존 방법을 별도로 확인한다.

### 인계 필수 정보

```text
issue_number
loop_id
attempt_id
max_attempts
attempts_used
attempts_remaining
loop_state
branch / base_sha / head_sha / last_verified_sha
last_verification_run_id
last_status / failure_class / failure_summary
next_action
same_attempt_rerun_or_new_attempt
human_decision_required
owner / handoff_recipient / handoff_at
workspace_preservation
```

---

## 6. 정식 기록 Schema (초안)

현재 저장소에는 Attempt Ledger가 없다. 아래 형식은 구조 제안이며, 저장 위치와
권위는 사람의 결정 전까지 확정하지 않는다.

### Loop State

```yaml
schema_version: 0
issue_number: <issue>
loop_id: issue-<issue>-loop-<id>
max_attempts: <issue-value>
attempts_started: 0
attempts_completed: 0
attempts_remaining: <value>
status: READY
current_attempt_id: null
last_verified_sha: null
next_action: null
human_decision_required: false
```

### Attempt Record

```yaml
schema_version: 0
issue_number: <issue>
attempt_id: issue-<issue>-attempt-001
attempt_no: 1
max_attempts: <issue-value>
parent_attempt_id: null
session_id: <opaque-id>
agent_id: <opaque-id>
worktree_id: <opaque-id>
branch: <branch>
base_sha: <sha>
head_sha: <sha-or-null>
changed_files: []
started_at: <timestamp>
completed_at: <timestamp-or-null>
issue_test_path: tests/issues/issue-<issue>-<feature>.test.ts
verification_run_ids: []
completion_condition_results: {}
failure_class: null
failure_summary: null
handoff_status: none
evidence_links: []
```

### Verification Run Record

```yaml
schema_version: 0
verification_run_id: issue-<issue>-attempt-001-run-001
attempt_id: issue-<issue>-attempt-001
rerun_of: null
commit_sha: <verified-sha>
command_or_procedure: <command>
started_at: <timestamp>
completed_at: <timestamp>
environment: <sanitized-summary>
first_failed_gate: null
status: <02-status>
exit_code: <number-or-null>
expected: <condition>
actual: <sanitized-result>
failure_class: null
output_summary: <sanitized-summary>
evidence_links: []
```

기록에는 토큰·비밀번호·세션 시크릿·개인정보를 넣지 않는다. 이후 구현 시
append-only 보존, 스키마 버전, 중복 방지 키, 원자적 번호 예약을 정한다.

---

## 7. 사람 개입과 Override

다음 상황에서는 자동으로 반복하지 않고 `NEEDS_HUMAN`으로 중단한다.

- 원본·Issue 충돌
- 범위·소유자·완료 기준 불명확
- 최대 횟수 도달 후 미통과 조건 존재
- 보호 정책 우회 또는 필수 승인 필요
- 파괴적 대상 불명확
- 검증 스크립트 자체 오류
- 환경 `BLOCKED`를 정해진 재실행 범위에서 해결하지 못함
- Attempt 번호·활성 writer 충돌
- 자동 검증과 수동 검증 결과 불일치
- 완료된 Issue 재개

인계 기록에는 다음을 포함한다.

```text
issue / pr / loop_id / attempt_id
max / used / remaining
base_sha / head_sha / last_verified_sha
last_verification_run_id
failed_condition / first_failed_gate / gate_results
failure_class / minimal_reproduction / sanitized_failure_summary
evidence_links
one_explicit_decision_requested
allowed_next_action / forbidden_before_decision
owner / response_deadline / workspace_preservation
```

질문은 포괄적인 “진행할까요?”가 아니라 하나의 결정과 영향을 명시한다.
사람의 결정 전에는 추가 구현, 예산 변경, 대상 변경을 하지 않는다.

사람이 override를 승인해도 원래 `FAIL`·`BLOCKED`·`NOT_RUN`은 보존한다.
Override 기록에는 다음을 포함한다.

- 우회한 정책·게이트
- Issue·Attempt·commit SHA·PR·Verification Run·환경
- 승인자와 승인 시각
- 사유와 영향 범위
- 허용 행동과 일회성·만료 조건

`OVERRIDDEN`은 `PASS`가 아니며 다른 커밋·재실행·브랜치·환경에 전파하지
않는다.

---

## 8. 종료와 연결

### 완료 조건

다음이 모두 충족될 때만 Loop State를 `COMPLETE`로 한다.

- Issue 종료 조건이 모두 개별 판정됨
- 현재 검증 SHA에서 Issue별 테스트가 실제 실행됨
- 필요한 자동 게이트가 `PASS`
- 필요한 수동 검증과 증거가 있음
- 미해결 `FAIL`, `NOT_RUN`, `BLOCKED`가 없음
- `OVERRIDDEN`이면 별도 사람 승인 기록이 있음
- 검증 SHA가 의도한 PR head 또는 대상 커밋과 일치
- 이전 실패와 후속 성공 기록이 모두 보존됨
- Issue·PR·CI와 Attempt 기록이 연결됨

Aggregate CI 성공만으로 완료를 추정하지 않는다.

### 연결 정보

완료·인계 시 다음을 연결한다.

```text
Issue number
PR number
branch
base SHA / head SHA / verified SHA / merge SHA
Attempt ID and ordinal
Issue test path and result
Verification Run ID and CI run URL/ID
gate-by-gate results
previous FAIL/BLOCKED and later PASS
human decision or override scope
next action or terminal state
```

Issue 본문·PR·CI artifact·ledger가 다르면 임의로 선택하지 않고
`NEEDS_HUMAN`으로 표시한다.

---

## 9. 현재 미결정 사항

이 문서는 초안이며 다음을 사람의 결정 전까지 강제 규칙으로 선언하지 않는다.

1. Attempt Ledger의 단일 정식 저장 위치
2. Issue·Git ledger·CI artifact 충돌 시 권위 우선순위
3. 원자적 번호 예약 방식과 Issue당 단일 writer 여부
4. 최대 횟수 기본값: SSOT의 3회와 Issue 양식 YAML의 2회 중 무엇을 사용할지
5. 환경 `BLOCKED` Rerun, 수동 검증, override의 Attempt 차감 여부
6. 완료·`CLOSED` Issue 재개와 예산 처리
7. 세션·에이전트 식별자의 내부 기록 및 외부 공개 범위
8. CI artifact 보존 기간과 sanitized 로그 형식
9. Issue별 테스트의 존재·포함·실행을 자동 강제할 범위
10. 검증 스크립트의 종료 코드·예외가 불명확할 때의 공식 처리
11. `DATABASE_URL` 정규화와 `verify:prepare` 책임 범위

정책 충돌이나 승인·범위 판단이 해결되지 않으면 `NEEDS_HUMAN`으로 남긴다.

---

## 10. 구현 이후 검증 계획

03-loop를 구현한 뒤 다음을 검증한다.

- `02`는 판정, `03`은 판정 이후 절차만 담당하는가
- 같은 SHA Rerun이 새 Attempt를 만들지 않는가
- 세션·에이전트 교체가 카운터를 초기화하지 않는가
- Attempt 번호가 중복되거나 최대값을 넘지 않는가
- `BLOCKED`와 후속 `PASS`가 모두 보존되는가
- 검증 스크립트 오류가 구현 실패로 잘못 분류되지 않는가
- Issue 테스트가 현재 SHA에 포함되고 실제 실행되는가
- 하드 캡에서 추가 구현이 차단되는가
- `NEEDS_HUMAN` 결정 전 작업이 중단되는가
- Override가 원래 판정과 적용 범위를 보존하는가
- PR·SHA·CI run이 연결되는가
- Issue #4를 Attempt 1 및 `BLOCKED`→`PASS` Rerun으로 복구할 수 있는가

---

## 11. 기존 기록과 변경 관리

`docs/HANDOVER.md`와 과거 transcript는 참고 자료이며 현재 Attempt의 판정
원본이 아니다. 과거 기록은 `HISTORICAL`로 표시하고 현재 SHA에서 다시
검증한다.

이 문서 자체를 정식 정책으로 승격하거나 `01-SSOT.md`·`02-verification.md`,
Issue 양식, PR·CI를 변경하려면 사람의 승인과 별도 범위 확인이 필요하다.
정책·검증·인계 기록에는 비밀이나 개인정보를 넣지 않는다.
