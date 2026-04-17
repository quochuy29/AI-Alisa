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
| **COMPLIANT** | Tất cả requirements MET, tất cả ACs MET, không scope creep |
| **PARTIAL** | 1-2 mục PARTIAL, zero MISSING, scope creep nhỏ |
| **NON_COMPLIANT** | Bất kỳ requirement MISSING, hoặc hiểu sai intent của spec |

---

## Nguyên Tắc Bất Biến

1. **Đọc code, không tin claims** — không bao giờ tin self-report của agent
2. **Evidence required** — mỗi verdict MET phải cite file:line
3. **Independence** — reviewer không biết quá trình implementation
4. **Scope creep là finding** — code thêm ngoài spec phải được report
