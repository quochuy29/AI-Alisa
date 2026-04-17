# Skill: Research Gate

Reusable research protocol. Bắt buộc chạy TRƯỚC khi viết bất kỳ dòng code nào.

---

## Khi Nào Dùng Skill Này

Được gọi bởi bất kỳ command/agent nào cần viết code:
- `requirements-specs-execute` — Phase: Context Preparation
- `requirements-bug-fix` — Phase: Root Cause & Fix Strategy
- Engineer agents (junior/mid/senior) — trước khi implement

---

## 3 Bước Nghiên Cứu

### Bước 1 — Context7 (BẮT BUỘC với mọi library)

Với mỗi library/framework cần dùng trong task:

```
1. mcp__context7__resolve-library-id  →  tìm library ID
2. mcp__context7__get-library-docs    →  lấy docs chính xác
3. Tóm tắt key patterns (~100 tokens/library)  →  KHÔNG paste toàn bộ output
```

**Ngưỡng kích hoạt:** Có bất kỳ library/framework nào trong task → bước này BẮT BUỘC.

**Fallback nếu Context7 không có kết quả:**
1. Thử topic rộng hơn
2. Thử library ID thay thế
3. Chuyển sang Bước 2 (Brave Search)
4. Nếu vẫn không có → dùng Bước 3 (Sequential Thinking) từ first principles

---

### Bước 2 — Brave Search (NẾU cần)

Kích hoạt khi:
- Vấn đề mới, chưa có trong codebase
- Cần industry best practices
- CVE / security vulnerability lookup
- Context7 không có đủ thông tin

```
mcp__brave-search__brave_web_search  →  "[vấn đề] [library] best practice 2025"
Validate: 3+ nguồn, nguồn gần đây, consistent với Context7
```

**KHÔNG dùng Brave thay thế Context7** — Brave có thể outdated về API.

---

### Bước 3 — Sequential Thinking (NẾU logic phức tạp)

Kích hoạt khi:
- Logic có hơn 3 decision branches
- Thuật toán mới
- Security / auth / encryption flow
- Kiến trúc đa component

```
mcp__sequential-thinking__process_thought  →  reasoning có cấu trúc
mcp__sequential-thinking__generate_summary →  tóm tắt kết luận
```

---

## Research Gate Checklist

Trước khi chuyển sang viết code, xác nhận:

```
[ ] Context7 đã được gọi cho TẤT CẢ libraries trong task?
[ ] Kết quả research đã được tóm tắt (không phải raw output)?
[ ] Brave Search đã chạy nếu có vấn đề mới?
[ ] Sequential Thinking đã chạy nếu logic > 3 branches?
```

**Nếu bất kỳ checkbox nào chưa tick → DỪNG, hoàn thành trước.**

---

## Output Format

Sau khi hoàn thành research, xuất ra trước khi code:

```
RESEARCH OUTPUT:
  Context7:
    - [library]: [key patterns tóm tắt ~100 tokens]
  Brave: [findings nếu có, hoặc "N/A"]
  Sequential: [reasoning summary nếu có, hoặc "N/A"]
  Key Decision: [1-2 câu: approach sẽ dùng và lý do]
```

---

## Nguyên Tắc Bất Biến

| ❌ KHÔNG | ✅ PHẢI |
|----------|---------|
| Assume API signatures | Gọi Context7 trước |
| Paste toàn bộ Context7 output | Tóm tắt ~100 tokens/lib |
| Viết code trước, research sau | Research output PHẢI xuất hiện TRƯỚC code |
| Dùng Brave thay Context7 | Context7 là nguồn chính cho API/library |
