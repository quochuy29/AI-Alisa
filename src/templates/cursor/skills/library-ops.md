# Skill: Library Ops

Reusable knowledge system. Hai thao tác: **Query** (lấy tri thức vào context) và **Harvest** (lưu tri thức sau session).

---

## Khi Nào Dùng Skill Này

**Query** — được gọi BỞI commands trước khi thực thi:
- `requirements-specs-execute` — Phase: Context Preparation
- `requirements-specs-generate` — Phase: Load context
- `requirements-bug-fix` — Phase: Root Cause Analysis

**Harvest** — được gọi BỞI `requirements-end` sau khi session hoàn thành.

---

## Cấu Trúc Library

```
requirements/.library/
├── _catalog.json          ← Index toàn bộ Books + sectionIndex
├── _rules.json            ← TTL rules, confidence thresholds
├── foundations/           ← Tech stack, folder structure, architecture
├── domain/                ← Domain glossary, business rules
├── conventions/           ← Coding conventions, anti-patterns
├── frameworks/            ← Framework-specific practices
├── patterns/              ← Reusable implementation patterns
├── decisions/             ← Architecture Decision Records (ADR)
├── research/              ← Cached Context7/Brave findings
│   ├── context7/
│   └── brave/
└── metrics/               ← Agent performance data
```

**Book** = 1 file markdown, max 2000 tokens, tối đa 8 sections.
**Shelf** = 1 thư mục, nhóm Books cùng loại.

---

## Thao Tác 1: QUERY — Lấy Tri Thức Vào Context

### Khi Library chưa có (`_catalog.json` không tồn tại)

```
→ Bỏ qua, tiếp tục workflow bình thường
→ KHÔNG báo lỗi
```

### Khi Library có dữ liệu

**1. Invoke `librarian` agent** với request:

```yaml
QUERY_REQUEST:
  query_type: "phase_injection"
  library_path: "requirements/.library/"
  workflow_phase: "[tên phase hiện tại]"
  task_tags: ["[tag từ task description]"]
  token_budget: 250   # Junior | 350 Mid | 450 Senior
  section_limit: 3    # Junior | 5 Mid   | 7 Senior
```

**2. Nhận `KNOWLEDGE_PACKAGE`** từ librarian.

**3. Inject vào context** của engineer agent trong `TASK_CONTEXT.library_context`.

---

## Thao Tác 2: HARVEST — Lưu Tri Thức Sau Session

Chạy khi `requirements-end` được gọi với session đã có task hoàn thành.

**1. Invoke `curator` agent** với request:

```yaml
CATALOGING_REQUEST:
  session_path: "[path tới session folder]"
  library_path: "requirements/.library/"
  source_files:
    - "03-context-findings.md"
    - "07-design.md"
    - "metadata.json"
  cataloging_scope: "full"
```

**2. Curator sẽ tự động:**
- Đọc source artifacts
- Classify knowledge vào đúng shelf
- Deduplicate với Books hiện có (Jaccard similarity ≥ 0.70 → merge)
- Assign confidence score theo nguồn
- Write Books + update `_catalog.json`

**3. Nhận `CATALOGING_REPORT`** — hiển thị tóm tắt cho user.

---

## Confidence Score Reference

| Nguồn tri thức | Confidence |
|----------------|-----------|
| Code review finding | 0.90 |
| Bug fix lesson | 0.90 |
| Spec-reviewer finding | 0.85 |
| Design decision | 0.80 |
| Context-findings pattern | 0.80 |
| Research-log entry | 0.70 |
| Minimum threshold | **0.60** |

Books dưới 0.60 không được tạo.

---

## TTL Rules

| Shelf | TTL |
|-------|-----|
| foundations, domain, conventions | Không hết hạn |
| frameworks, patterns, decisions | Không hết hạn |
| research/context7 | 14 ngày |
| research/brave | 14 ngày |
| metrics | Không hết hạn |

---

## Graceful Degradation

**Library là OPTIONAL** — mọi workflow đều hoạt động bình thường khi Library chưa có.

```
Nếu _catalog.json không tồn tại    → Query trả về empty, tiếp tục
Nếu librarian không invoke được    → Bỏ qua library injection, tiếp tục
Nếu curator không invoke được      → Log warning, không block requirements-end
```

---

## Nguyên Tắc Bất Biến

| ❌ KHÔNG | ✅ PHẢI |
|----------|---------|
| Tạo Book dưới confidence 0.60 | Bỏ qua nếu không đủ evidence |
| Paste toàn bộ session vào Library | Chỉ extract knowledge tái sử dụng được |
| Duplicate Books | Merge nếu Jaccard ≥ 0.70 |
| Block workflow khi Library lỗi | Graceful degradation |
| Librarian synthesize nội dung | Return section content as-is |
