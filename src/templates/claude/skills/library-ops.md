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
|-----------------|------------|
| Verified trong actual code | 1.00 |
| Từ spec + design (reviewed) | 0.85 |
| Từ context-findings (auto-analyzed) | 0.70 |
| Từ web research (recent, multi-source) | 0.55 |
| Từ web research (single source or old) | 0.30 |

---

## Nguyên Tắc Bất Biến

1. **Library là optional** — nếu không tồn tại, bỏ qua im lặng
2. **Token budget là luật** — không bao giờ vượt quá budget đã phân bổ cho tier
3. **Deduplicate trước khi write** — luôn check Books tương tự đã có
4. **Confidence scores dựa trên evidence** — không assign max confidence cho knowledge chưa verify
