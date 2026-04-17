# Skill: Spec Review

Reusable verification protocol. Kiểm tra code thực tế có đúng với spec đã định không.

---

## Khi Nào Dùng Skill Này

Được gọi sau khi engineer agent hoàn thành implement:
- `requirements-specs-execute` — Phase: Verify
- `requirements-auto-execute` — Phase: Auto-Decision Gate
- `requirements-bug-fix` — Phase: Verify Fix

**BỎ QUA** cho task tier Junior (chỉ dùng cho Mid và Senior).

---

## Nguyên Tắc Cốt Lõi

> "Implementer có thể report sai. Đọc code thực tế, không tin vào self-report."

**Độc lập hoàn toàn** — Spec reviewer KHÔNG biết engineer nói gì. Chỉ đọc code và spec.

---

## Protocol (4 Bước)

### Bước 1 — Đọc Spec

```
1. Đọc 06-requirements-spec.md  →  lấy FR-X.Y và Acceptance Criteria của task
2. Đọc 07-design.md section liên quan  →  lấy technical design intent
3. Ghi nhớ: ĐÚNG là gì theo spec
```

### Bước 2 — Đọc Code Thực Tế

```
Với mỗi file trong files_created và files_modified:
  → Đọc FULL file content
  → Hiểu code thực sự làm gì (không phải agent nói làm gì)
```

### Bước 3 — So Sánh

Với mỗi requirement (FR-X.Y):
- Có được implement không? Ở đâu (file:line)?
- Implementation có đúng intent của spec không?

Với mỗi Acceptance Criteria (AC-X.Y):
- Criterion có được thỏa mãn bởi code không?
- Chỉ ra đoạn code cụ thể thỏa mãn nó.

Với mỗi sub-task:
- Đã xong chưa? Trong code nào?

### Bước 4 — Phát Hiện Drift

```
Missing:    Gì trong spec mà code KHÔNG có?
Scope creep: Gì trong code mà spec KHÔNG yêu cầu?
Mismatch:   Spec nói X, code làm Y?
```

---

## Output — SPEC_REVIEW_RESULT

```yaml
SPEC_REVIEW_RESULT:
  verdict: COMPLIANT | PARTIAL | NON_COMPLIANT

  requirements_check:
    - requirement: "FR-X.Y"
      status: MET | PARTIAL | MISSING
      evidence: "file.ext:line"

  acceptance_criteria_check:
    - criterion: "AC-X.1"
      status: MET | PARTIAL | MISSING
      evidence: "file.ext:line"

  sub_tasks_check:
    - sub_task: "[mô tả]"
      status: DONE | PARTIAL | MISSING

  scope_creep: []
  missing: []
  misunderstandings: []

  summary: "[1-2 câu đánh giá tổng thể]"
```

**Giới hạn output: 800 tokens.** Chỉ detail các mục PARTIAL/MISSING/MISMATCH.

---

## Verdict Rules

| Verdict | Điều kiện |
|---------|-----------|
| **COMPLIANT** | TẤT CẢ requirements MET, TẤT CẢ ACs MET, không scope creep |
| **PARTIAL** | 1-2 items PARTIAL, không có MISSING |
| **NON_COMPLIANT** | Bất kỳ requirement MISSING, hoặc mismatch nghiêm trọng |

---

## Auto-Decision Logic (cho `auto-execute`)

```
COMPLIANT   +  self-review ≥ 16/20  →  AUTO-APPROVE, tiếp tục task tiếp theo
PARTIAL     +  self-review ≥ 14/20  →  WARN + AUTO-APPROVE với note
PARTIAL     +  self-review < 14/20  →  HALT → chờ human review
NON_COMPLIANT (bất kỳ score)        →  HALT → chờ human review
```

**Human review mode** (specs-execute): Luôn hỏi user bất kể verdict.

---

## Nguyên Tắc Bất Biến

| ❌ KHÔNG | ✅ PHẢI |
|----------|---------|
| Tin self-report của agent | Đọc code thực tế |
| Skim nhanh | Đọc kỹ từng file |
| "Gần đúng cũng được" | Spec nói X → code phải làm X |
| Bỏ qua extra code | Flag scope creep rõ ràng |
