# Hướng dẫn sử dụng - Requirement Commands

> Requirement Command Flow - Bộ workflow hỗ trợ cấu hình ngữ cảnh (context engineering) và 
lập trình thay đổi có kiểm soát (Spec and Retro working)
---
## Bối cảnh ra đời

Khi **ALISA** được xây dựng và hoàn thiện, tuy có nhiều ưu điểm cho quá trình phát triển như có `memory-bank` tập trung, 
chia sẻ dữ liệu, kiểm soát phiên bản tập trung và các chiến lược quản lý rules, docs linh hoạt vẫn đòi hỏi một lượng
effort lớn và hiểu biết nhất định của trưởng nhóm (Leader) trong việc xây dựng và bảo trì `memory-bank` tâp trung tốn quá
nhiều nguồn lực, tốn kém và không hiệu quả, đôi khi khó áp dụng nếu dự án có quy mô quá lớn hoặc spec (yêu cầu, định nghĩa)
hệ thống quá lớn mà một `memory-bank` không thể làm việc hiệu qủa được.

**Từ đó** bộ `workflow` `requirement` ra đời với mục đích **Coporative** hay **Đồng Hành** cho mọi Developer của **VNEXT**, team **AI4W** cho ra đời
bộ công cụ đơn giản, trực quan và quản lý **bối cảnh cục bộ** hay **condensed context** như một giải pháp tiếp cận dành 
cho mọi Developer trong **VNEXT**, thay vì một bộ cấu hình quá phức tạp như **ALISA** phiên bản đầu tiên.

Mục đích của bộ `workflow` này là cho phép từng Developer có thể làm chủ được bối cảnh của công việc và làm việc với AI của mình
lưu trữ cục bộ và hoàn thành công việc từng bước với sự đồng hành của AI agents, thay vì sự phụ thuộc vào `memory-bank` tập 
trung trước kia, nơi mà các dự án LABO, MVP nhỏ khó mà phù hợp cho việc setup quá rườm rà ban đầu.

**Chú Thích:**
- **Condensed Context**: bối cảnh cục bộ được sinh ra và liên tục cải thiện trong 1 phiên làm việc, không phải bối cảnh toàn hệ thống như `memory-bank`

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Cài đặt](#cài-đặt)
3. [13 Lệnh và chi tiết](#13-lệnh-và-chi-tiết)
4. [Hệ thống Sub-agents chuyên biệt](#hệ-thống-sub-agents-chuyên-biệt)
5. [Knowledge Library — Thư viện tri thức dự án](#knowledge-library--thư-viện-tri-thức-dự-án)
6. [Cấu trúc thư mục và các file hệ thống](#cấu-trúc-thư-mục-và-các-file-hệ-thống)
7. [Câu hỏi](#câu-hỏi)

---

## Giới thiệu

**Requirement Commands** là bộ công cụ giúp developer tương tác với AI coding agent (Claude Code, Cursor, VSCode + Copilot) một cách có hệ thống.
Thay bắt tay và GenCode ngay lập tức, bộ công cụ này cho phép Developer và AI coding agent đi từng bước, trao đổi, thu thập
quản lý thông tin, làm rõ yêu cầu thông qua các lựa chọn trực quan, từ đó hoàn thành công việc một cách hiệu quả, có kiểm soát
và tránh hiện tượng mất kiểm soát do không biết AI sửa gì.

> Một workflow đơn giản bao gồm 4 giai doan chinh:
> 
> Yêu cầu -> Làm rõ -> Thiết Kế -> Đánh giá -> Lập Trình -> Kiểm tra -> Lưu trữ


**Mục đích**

- Tránh việc Developer và AI không hiểu nhau, dẫn đến lãng phí tài nguyên
- Kiểm soát bối cảnh chủ động, tránh hiện tượng làm mà không rõ làm gì
- Step by Step, làm từng việc rõ ràng, liền mạch, có theo dõi tiến độ
- Quản lý thay đổi có tổ chức

**Khi nào nên áp dụng**

- Áp dụng cho dòng dự án LABO, hoặc nhỏ lẻ, nơi mà các dev tập trung hoàn thành công việc cục bộ, theo tickets hoặc yêu cầu
từng phần, không yêu cầu quy trình phát triển phức tạp hay các project base longterm
- Tùy chỉnh linh hoạt (thông qua các file .MD) prompt-engineering cho từng dòng dự án
- Áp dụng nhanh, không cần cài đặt quá phức tạp hay bảo trì memory-bank truyền thống.

---

## Cài đặt

### Nhanh (npx)

```bash
npx requirement-commands
```

### Chọn editor

```bash
# Claude Code (mac dinh)
npx requirement-commands init

# Cursor (v2 - có agents + skills)
npx requirement-commands init --editor=cursor

# VSCode + GitHub Copilot (v2 - có agents)
npx requirement-commands init --editor=vscode-copilot

# Cả 3 editor cùng lúc
npx requirement-commands init --editor=all
```

### Ghi đè

```bash
npx requirement-commands init --force
```

### Sau khi cài đặt

| Editor | Files tạo ra |
|--------|--------------|
| Claude Code | `~/.claude/commands/` (13 slash commands) |
| Cursor | `.cursor/commands/` (13 files) + `.cursor/agents/` (9 agents) + `.cursor/rules/` (4 skills) |
| VSCode Copilot | `.github/prompts/` (13 files) + `.github/agents/` (9 agents) |

Và thư mục `requirements/` với file `.current-requirement`

---

## Quy trình làm việc

Requirement Commands chia thành **4 giai đoạn chính**:

```
┌─────────────────────────────────────────────────────────┐
│  GIAI ĐOẠN 1: THU THẬP VÀ LÀM RÕ YÊU CẦU                │
│  /requirements-start -> Hỏi 5 câu -> Phân tích code     │
│  -> Hỏi 5 câu chuyên sâu -> Tạo tài liệu yêu cầu        │
│                                                         │
│  GIAI ĐOẠN 2: THIẾT KẾ VÀ BẢN KẾ HOẠCH                  │
│  /requirements-specs-generate -> Tạo thiết kế           │
│  -> Duyệt thiết kế -> Tạo danh sách task                │
│                                                         │
│  GIAI ĐOẠN 3: LẬP TRÌNH                                 │
│  /requirements-specs-execute -> Thực hiện từng task     │
│  -> /requirements-bug-fix (nếu có lỗi)                  │
│  -> /requirements-spec-enhance (nếu có thay đổi)        │
│                                                         │
│  GIAI ĐOẠN 4: KIỂM TRA CHẤT LƯỢNG VÀ LƯU TRỮ            │
│  /requirements-code-review -> Review code               │
│  /requirements-revise -> Đối chiếu với yêu cầu          │
│  /requirements-end -> Hoàn thành và lưu trữ             │
└─────────────────────────────────────────────────────────┘
```

## 13 Lệnh và chi tiết

### Giai đoạn 1: Thu thập yêu cầu

#### Gõ `/requirements-start` - Bắt đầu một phiên làm việc với yêu cầu

**Quy trình bán tự động (v2):**
1. Người dùng mô tả tính năng muốn làm
2. **Code Seeker** tự động phân tích codebase từ 3 góc nhìn (Architect / Developer / Product)
3. AI sẽ hỏi **5 câu hỏi khám phá** dựa trên phân tích và đưa ra các lựa chọn cụ thể
4. AI hỏi bạn **5 câu hỏi chuyên sâu** (dựa trên code thực tế)
5. **Librarian** tự động truy vấn knowledge library để bổ sung bối cảnh liên quan
6. AI tạo **tài liệu yêu cầu chi tiết** (files `00`–`06`)

**Ví dụ:**
```
User: /requirements-start
AI: Hãy mô tả tính năng hoặc cung cấp tài liệu yêu cầu
User: Tôi muốn thêm chức năng đăng nhập sử dụng Google Auth
```
---
#### `/requirements-status` - Kiểm tra tiến độ

**Khi nào sử dụng:** bất cứ khi nào cần, hoặc quay trở lại sau thời gian nghỉ ngơi.

```
Ban: /requirements-status
AI: Phiên: 2026-02-01-1430-google-oauth
    Trạng thái: executing
    Task đã hoàn thành: 5/8
    Task tiếp theo: Implement callback handler
```

---

#### `/requirements-list` - Xem tất cả các phiên làm việc

**Ký hiệu trạng thái:**
- 🟢 Đang thực hiện (active)
- 🟡 Đã hoàn thành
- 🟠 Đang thực hiện
- 🟣 Đã lưu trữ

---

#### `/requirements-current` - Xem chi tiết phiên hiện tại

**Để:** Hiển thị toàn bộ nội dung phiên hiện tại

---

#### `/requirements-remind` - Nhắc nhở quy tắc

**Để:** Nhắc nhở AI về rules, flow của dự án.

---

#### `/requirements-end` - Kết thúc phiên làm việc

**v2 — Tích hợp Library Harvest:**
1. Kiểm tra không còn bug hay thay đổi đang mở
2. **Curator** agent tự động trích xuất tri thức từ phiên vừa xong và lưu vào library (`requirements/.library/`)
3. Đánh dấu hoàn thành, lưu trữ phiên vào `requirements/archived/`
4. Xóa `.current-requirement`

---

#### `/requirements-library` - Quản lý thư viện tri thức dự án (MỚI)

**Khi nào sử dụng:**
- Khởi tạo library lần đầu
- Xem toàn bộ nội dung library
- Truy vấn tri thức về một chủ đề cụ thể
- Thu hoạch tri thức từ phiên vừa xong (nếu không muốn đợi `requirements-end`)
- Reset library

**Cú pháp:**
```
/requirements-library
/requirements-library init
/requirements-library view
/requirements-library query authentication
/requirements-library harvest
/requirements-library reset
```

**Cấu trúc library:**
```
requirements/.library/
├── _catalog.json          ← Mục lục tự động (AI quản lý)
└── [shelf]/[book].md      ← Từng entry tri thức
```

---

### Giai đoạn 2: thiết kế và lên kế hoạch

#### `/requirements-specs-generate` - Tạo thiết kế và file kế hoạch

**v2 — Ủy quyền cho Task Orchestrator:**
- **Task Orchestrator** (agent Senior) đọc files `00`–`06` và tạo:
  1. **Tài liệu thiết kế** (`07-design.md`) — Kiến trúc, kỹ thuật, cách tích hợp thay đổi
  2. **Danh sách task** (`08-tasks.md`) — Các đầu việc phân rã, **có gắn tier** (Junior/Mid/Senior) cho mỗi task

**Lưu ý:** AI sẽ yêu cầu người dùng đánh giá, chấp thuận thiết kế trước khi phân rã công việc

---

### Giai đoạn 3: lập trình

#### `/requirements-specs-execute` - Thực hiện task theo tier

**v2 — Tier-based delegation:**
- Mỗi task trong `08-tasks.md` được gắn tier phù hợp và **tự động chuyển đến đúng agent**:

| Tier | Agent | Loại task |
|------|-------|----------|
| Junior | `junior-engineer` | CRUD, config, types, CSS, scaffolding |
| Mid (mặc định) | `mid-engineer` | API, UI, features, tests |
| Senior | `senior-engineer` | Security, auth, payment, thuật toán phức tạp |

- **Spec Reviewer** kiểm tra độc lập sau mỗi task: đọc code thực tế, đối chiếu với spec, không tin vào báo cáo của chính agent thực thi
- Cập nhật `metadata.json`, `10-change-log.md`, `09-bug-tracker.md` sau mỗi task

---

#### `/requirements-bug-fix` - Sửa lỗi

Quy trình sửa lỗi gồm 4 bước
1. **Phân tích nguyên nhân gốc** - Tim hiểu tại sao lỗi xảy ra
2. **Đề xuất giải pháp** - Trình bày phương án giải quyết
3. **Thực hiện sửa** - Sửa code lỗi
4. **Xác nhận** - Kiểm tra xem lỗi đã được sửa chưa 

---

#### `/requirements-spec-enhance` - Cải thiện, xử lý thay đổi

**Sử dụng khi:** muốn thay đổi yêu cầu,cải tiến (thêm, sửa hay loại bỏ tính năng):
1. Phân tích các động của thay đổi lên toàn bộ bối cảnh đang thực hiện
2. Cập nhật, gợi ý, điều chỉnh thiết kế
3. Điều chỉnh danh sách task

---

### Giai doan 4: Kiểm tra chất lượng (review code, self-review)

#### `/requirements-code-review`

Kiểm tra code theo các tiêu chí cơ bản

| Tiêu chí        | Nội dung kiểm tra |
|-----------------|-------------------|
| Correctness     | Tính logic        |
| Performance     | Hiệu suất         |
| Security        | Bảo mật           |
| Maintainability | Khả năng bảo trì  |
| Scalability     | Tính mở rộng      |
| Testing         | Kiểm thử cục bộ   |
| Documentation   | Tài liệu          |
| Architecture    | Kiến trúc          |

Môi mục sẽ có đánh giá: **pass** / **fail** / **needs-work**

---

#### `/requirements-revise` - Đối chiếu lại yêu cầu

**Dùng khi:** muốn kiểm tra lại thay đổi xem còn đúng như kế hoạch ban đầu không:
- Task nào đã hoàn thành, làm đúng yêu cầu không?
- Có sót task nào không
- Có phát sinh thay đổi ngoài kế hoạch không?
- Tài liệu ban đầu có khớp với thay đổi không?

---

## Hệ thống Sub-agents chuyên biệt

> Áp dụng cho **Cursor v2** và **VSCode Copilot v2**.

Thay vì một AI duy nhất làm mọi việc, v2 chia công việc cho các **specialist agents** phù hợp theo vai trò:

| Agent | Vai trò | Được gọi bởi |
|-------|---------|-------------|
| `task-orchestrator` | Chuyển `07-design.md` thành `08-tasks.md` có tier annotation | `requirements-specs-generate` |
| `code-seeker` | Phân tích codebase từ 3 góc nhìn (Architect/Developer/Product) | `requirements-start` |
| `junior-engineer` | Thực thi task đơn giản: CRUD, config, types, CSS | `requirements-specs-execute` |
| `mid-engineer` | Thực thi task trung bình: API, UI, features (mặc định) | `requirements-specs-execute` |
| `senior-engineer` | Thực thi task phức tạp: security, auth, payment | `requirements-specs-execute` |
| `spec-reviewer` | Kiểm tra độc lập compliance của code với spec | `requirements-specs-execute` (sau mỗi task) |
| `librarian` | Truy vấn library, bổ sung bối cảnh vào session | `requirements-start`, `requirements-library query` |
| `curator` | Trích xuất tri thức từ session hoàn thành vào library | `requirements-end`, `requirements-library harvest` |

**Lưu ý:** Claude Code hiện tại chưa có agent tier system (đang phát triển). Các agents trên chỉ hoạt động với Cursor và VSCode Copilot.

---

## Knowledge Library — Thư viện tri thức dự án

Mỗi khi kết thúc một phiên làm việc, **Curator** agent tự động trích xuất các bài học, pattern, quyết định kỹ thuật và lưu vào library. Những phiên sau, **Librarian** agent sẽ tự động tra cứu và inject bối cảnh liên quan vào ngay từ đầu.

**Lợi ích:**
- Không phải giải thích lại context của dự án mỗi phiên
- Pattern và quyết định kỹ thuật được tái sử dụng
- Tránh lặp lại lỗi đã từng gặp

**Vòng đời Library:**
```
[requirements-start]
      ↓
  Librarian tra cứu library
  → inject relevant context
      ↓
[requirements-specs-execute]
      ↓
  Thực thi với bối cảnh library
      ↓
[requirements-end]
      ↓
  Curator trích xuất tri thức mới
  → lưu vào library
```

---

## Cấu trúc thư mục và các file hệ thống

### Tổng quan

```
folder-dự-án/
├── requirements/
│   ├── .current-requirement              # Chứa tên phiên hoạt động hiện tại
│   ├── .library/                         # Knowledge Library (MỚI)
│   │   ├── _catalog.json                  # Mục lục tự động
│   │   └── [shelf]/[book].md              # Entries tri thức
│   ├── archived/                         # Phiên đã lưu trữ
│   └── 2026-02-01-1430-google-oauth/     # Tên phiên hoạt động (unique)
│       ├── 00-initial-request.md          # Yêu cầu đầu vào
│       ├── 01-discovery-questions.md      # 5 câu hỏi khai phá
│       ├── 02-discovery-answers.md        # Câu trả lời khai phá của user
│       ├── 03-context-findings.md         # Kết quả phân tích codebase (Code Seeker)
│       ├── 04-detail-questions.md         # 5 câu hỏi chuyên sâu
│       ├── 05-detail-answers.md           # Câu trả lời chuyên sâu của user
│       ├── 06-requirements-spec.md        # Tài liệu yêu cầu chi tiết
│       ├── 07-design.md                   # Tài liệu thiết kế (Task Orchestrator)
│       ├── 08-tasks.md                    # Danh sách task có tier annotation
│       ├── 09-bug-tracker.md              # Theo dõi lỗi
│       ├── 10-change-log.md               # Lịch sử thay đổi
│       ├── 11-change-backlog.md           # Lưu trữ thay đổi (Chang Request)
│       └── metadata.json                  # Metadata của phiên (phục vụ AI agents)
└── .cursor/            (nếu dùng Cursor)
│   ├── commands/          # 13 prompt files
│   ├── agents/            # 9 agent files (orchestrator + 8 specialists)
│   └── rules/             # 4 skill files
└── .github/            (nếu dùng VSCode Copilot)
    ├── prompts/           # 13 prompt files
    └── agents/            # 9 agent files
```

### File metadata.json

File JSON chứa các metadata của phiên làm việc, user không cần quan tâm, file này chỉ để AI Agents đọc và nắm bắt nhanh thông
tin về phiên làm việc

```json
{
  "id": "google-oauth",
  "started": "2026-02-01T14:30:00Z",
  "lastUpdated": "2026-02-01T16:45:00Z",
  "status": "active",
  "phase": "executing",
  "progress": {
    "discovery": { "answered": 5, "total": 5 },
    "detail": { "answered": 5, "total": 5 }
  },
  "specs": {
    "designApproved": true,
    "totalTasks": 8,
    "completedTasks": 5
  }
}
```

---

## Câu hỏi

### Có thể có nhiều phiên làm việc cùng lúc không?

Chỉ **một phiên một thời điểm**. Tuy nhiên có thể đổi sang phiên khác bằng cách trao đổi với AI hoặc sửa thủ công file `.current-requirement`.

### Thay đổi yêu cầu giữa phiên

Dùng `/requirements-spec-enhance`.

### AI bị quên, làm sai rules

Dùng `/requirements-remind`

### Bộ workflow này hỗ trợ những editor nào?

| Editor | Trạng thái | Ghi chú |
|--------|------------|--------|
| **Claude Code** | ✅ Hỗ trợ đầy đủ | `~/.claude/commands/` |
| **Cursor** | ✅ Hỗ trợ đầy đủ (v2) | Có agents + skills |
| **VSCode + GitHub Copilot** | ✅ Hỗ trợ đầy đủ (v2) | Có agents |

### File requirements/ có nên commit vào git không?

**Tùy bối cảnh dự án** về lý thuyết thì toàn bộ `requirements/` nên được commit, tuy nhiên nếu bối cảnh dự án không cho 
phép, có thể không cần hoặc chia sẻ thủ công cũng được

---

## Mẹo sử dụng

1. **Cập nhật `CLAUDE.md` / `CURSOR.md`** - giúp AI nắm tổng quan dự án tốt hơn
2. **Trả lời câu hỏi chính xác** - 5 câu hỏi khai phá định hướng phiên làm việc, cần thật sự đọc hiểu thay vì chỉ chọn theo gợi ý của AI
3. **Review kỹ thiết kế** - Khó thay đổi và tốn kém nếu phải refactor lại kiến trúc, khi đó nên stash code và làm phiên làm việc mới
4. **Dùng `/requirements-status` thường xuyên** - Để cập nhật chính xác phiên đang làm việc
5. **Dùng `/requirements-revise` trước khi kết thúc hoặc giữa phiên** - Đảm bảo không bị trôi, lệch khi implement với bối cảnh cục bộ
6. **Khởi tạo library sớm** - Chạy `/requirements-library init` sau lần `init` đầu tiên để tích lũy tri thức từ phiên đầu tiên
7. **Tin tưởng vào tier routing** - Để AI tự chọn đúng agent cho từng task, không cần can thiệp thủ công trừ khi có lý do cụ thể

---

## Lời Kết
Bộ command của team **AI4W** chỉ là một workflow trung tính, không phục vụ cụ thể một kiểu dự án hay stack công nghệ cụ thể nào.
Nó chỉ là một workflow làm việc ưu tiên việc làm rõ yêu cầu, lưu trữ và kiểm soát thay đổi có mục đích. Mục tiêu là hỗ trợ việc lập trình
có kiểm soát, tránh việc sử dụng AI trong lập trình nhưng không kiểm soát được thay đổi hay làm xong quên AI đã làm gì.

Sự hiệu quả hay chất lượng vẫn phụ thuộc vào các Developer làm việc với AI, bộ công cụ này chỉ giúp khai phá, hỗ trợ Developer
làm rõ hơn, cẩn thận hơn, chi tiết hơn khi thực hiện công việc của mình.

Mỗi Developer luôn phải cập nhật, quản lý và trao dồi các kỹ năng xây dựng bối cảnh (Context Engineering) để đảm bảo những dòng code sinh ra
bởi AI đảm bảo chất lượng, độ chính xác, tính bảo mật phù hợp với bối cảnh dự án của mình.
