# Skill: Tier Routing

Reusable routing logic. Xác định engineer agent phù hợp cho task và đóng gói context để truyền đi.

---

## Khi Nào Dùng Skill Này

Được gọi bởi:
- `requirements-specs-execute` — Phase: Delegate to Agent
- `requirements-auto-execute` — Phase: Delegate per task
- `requirements-bug-fix` — Phase: Fix Implementation

---

## Bước 1 — Xác Định Tier

### Đọc `_Agent Level:_` trong task từ `08-tasks.md`

```
_Agent Level: Junior_  →  junior-engineer
_Agent Level: Mid_     →  mid-engineer       ← DEFAULT nếu thiếu field
_Agent Level: Senior_  →  senior-engineer
```

**Nếu field `_Agent Level:_` không có** → mặc định `Mid`.

### Bảng Tier Reference

| Tier | Agent | Model | Phạm Vi |
|------|-------|-------|---------|
| **Junior** | `junior-engineer` | Haiku | Data models, config, types, CRUD đơn giản, CSS, scaffolding |
| **Mid** | `mid-engineer` | Sonnet | Feature tiêu chuẩn, CRUD có validation/auth, API, UI, tests |
| **Senior** | `senior-engineer` | Opus | Security/auth/crypto/payment, thuật toán phức tạp, kiến trúc đa context |

---

## Bước 2 — Kiểm Tra Scope

Trước khi giao task, xác nhận task phù hợp tier được chỉ định:

**Junior escalation triggers** (chuyển lên Mid nếu task có bất kỳ):
- Business logic phức tạp
- Validation/auth rules
- Multi-table relationships
- Error handling flows

**Mid escalation triggers** (chuyển lên Senior nếu task có bất kỳ):
- Authentication / session / JWT
- Encryption / hashing / signing
- Payment processing
- > 3 service dependencies
- Performance-critical paths

---

## Bước 3 — Đóng Gói Context

Tạo `TASK_CONTEXT` package trước khi invoke agent. Nội dung tuỳ tier:

### Junior Context Package (tối giản)
```yaml
TASK_CONTEXT:
  task_number: [N]
  description: "[mô tả ngắn gọn]"
  sub_tasks: ["item 1", "item 2"]
  files_to_create: ["path/file.ext"]
  files_to_modify: ["path/existing.ext"]
  # KHÔNG cần: rationale, trade-offs, architecture context
```

### Mid Context Package (standard)
```yaml
TASK_CONTEXT:
  task_number: [N]
  description: "[mô tả]"
  sub_tasks: ["item 1", "item 2"]
  requirements: ["FR-X.Y", "TR-Z"]
  design_section: "07-design.md § [Section]"
  approach_hint: "[1-2 câu gợi ý approach]"
  files_to_create: [...]
  files_to_modify: [...]
  library_context: "[inject từ library-ops nếu có]"
```

### Senior Context Package (đầy đủ)
```yaml
TASK_CONTEXT:
  task_number: [N]
  description: "[mô tả đầy đủ]"
  sub_tasks: [...]
  requirements: ["FR-X.Y", "TR-Z"]
  acceptance_criteria: ["AC-X.1", "AC-X.2"]
  design_section: "07-design.md § [Section]"
  architecture_context: "[relevant architectural decisions]"
  security_requirements: "[nếu có]"
  performance_requirements: "[nếu có]"
  files_to_create: [...]
  files_to_modify: [...]
  library_context: "[inject từ library-ops nếu có]"
```

---

## Bước 4 — Invoke Agent

```
1. Compose TASK_CONTEXT theo template tier tương ứng
2. Gọi agent phù hợp (junior-engineer / mid-engineer / senior-engineer) bằng Agent tool
3. Đợi agent hoàn thành
4. Chuyển sang verification (spec-review skill)
```

---

## Nguyên Tắc Bất Biến

1. **Không bỏ qua scope check** — luôn verify task phù hợp tier trước khi delegate
2. **Escalate up, never down** — nếu task vượt capability của tier, chuyển lên tier cao hơn
3. **Context phù hợp tier** — Junior nhận tối giản, Senior nhận đầy đủ
4. **Default là Mid** — khi không chắc chắn, dùng Mid tier
