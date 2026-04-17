# Instruction — Hướng dẫn chi tiết về hệ thống `requirement-commands`

## 1. Tổng quan

`requirement-commands` là một **CLI scaffolding tool** giúp cài đặt bộ slash commands (lệnh) cho các AI coding agents. Mục tiêu chính là chuẩn hóa quy trình phát triển phần mềm — từ ý tưởng ban đầu đến khi code hoàn thành — thông qua một hệ thống quản lý yêu cầu (requirements) có cấu trúc.

**Hỗ trợ 3 editors:**
- **Claude Code** — cài slash commands vào `~/.claude/commands/`
- **Cursor** — cài vào `.cursor/commands/`
- **VS Code + Copilot** — cài prompt files vào `.github/prompts/` và agent vào `.github/agents/`

---

## 2. Kiến trúc hệ thống

### 2.1 Thành phần chính

```
requirement-commands/
├── bin/requirement-commands.js    # CLI entry point (Commander.js)
├── src/
│   ├── commands/                  # 12 lệnh TypeScript (logic CLI)
│   ├── core/
│   │   ├── templates/             # Template Manager — sinh & cài file cho từng editor
│   │   └── utils/                 # File system, display, interactive, validation
│   └── templates/                 # 12 markdown templates gốc (Claude Code format)
│       ├── copilot/               # 14 file — phiên bản cho VS Code Copilot
│       ├── cursor/                # Phiên bản cho Cursor
│       └── memory-bank/           # Templates cho Memory Bank (persistent context)
├── alisa-v1/                      # ALISA agent — agent AI riêng với Memory Bank & MCP
└── requirements/                  # Thư mục output — chứa các requirement sessions
```

### 2.2 Hai "lớp" hoạt động

| Lớp | Mô tả | Cách hoạt động |
|-----|--------|---------------|
| **CLI Layer** (`bin/` + `src/commands/`) | Chạy trên terminal bằng `npx requirement-commands` | Chỉ command `init` hoạt động (Phase 1). Các commands khác hiển thị stub message |
| **Agent Layer** (`src/templates/`) | Markdown templates được cài vào editor, AI agent đọc & thực thi | Đây là nơi logic thực sự xảy ra — AI agent đọc template và hướng dẫn user qua từng bước |

> **Quan trọng:** CLI chủ yếu dùng để **scaffold** (tạo cấu trúc file). Luồng làm việc thực tế diễn ra trong editor thông qua slash commands (`/requirements-start`, `#prompt:requirements-start`, v.v.).

---

## 3. Agent — Vai trò và cấu trúc

### 3.1 Requirements Manager (Orchestrator Agent — chỉ Copilot)

**File:** `src/templates/copilot/requirements-agent.md`

Đây là agent trung tâm, đóng vai trò **điều phối viên** (orchestrator):
- **KHÔNG BAO GIỜ** tự xử lý yêu cầu của user
- Đọc trạng thái project (`metadata.json`, `.current-requirement`)
- Phân tích ý định user (intent matching)
- Định tuyến (route) đến đúng prompt/command
- Thu thập input từ user qua `vscode/askQuestion`
- Sau mỗi prompt hoàn thành, luôn hỏi user bước tiếp theo

**Boot Sequence (chạy mỗi lần gọi):**
```
1. Đọc requirements/.current-requirement → tìm session đang active
2. Đọc metadata.json → lấy phase, progress, bugs, changes
3. Xác định context (NO_SESSION hay HAS_SESSION)
4. Match ý định user
5. Gọi đúng prompt
```

### 3.2 ALISA Agent (Phiên bản V1 — riêng biệt)

**File:** `alisa-v1/alisa-v1.md`

ALISA là agent AI chuyên sâu hơn, tích hợp với **Memory Bank** & **MCP Tools**:
- Bộ nhớ reset giữa các session → phụ thuộc hoàn toàn vào Memory Bank
- Có hệ thống mode: Architect → Plan → Act → Review → Test
- Sử dụng MCP guideline-operation để load rules động
- Quản lý project context qua cấu trúc `memory-bank/{project-name}/`

---

## 4. Bộ 12 Commands — Vai trò chi tiết

### 4.1 Luồng chính (Main Workflow)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  STAGE 1: CAPTURE (Thu thập yêu cầu)                               │
│  ┌─────────────────────────────────────────────┐                    │
│  │  /requirements-start [mô tả feature]        │                    │
│  │                                             │                    │
│  │  Phase 1: Initial Request                   │                    │
│  │  Phase 2: Discovery Questions (5 câu hỏi)  │                    │
│  │  Phase 3: Codebase Analysis (tự động)       │                    │
│  │  Phase 4: Expert Questions (5 câu hỏi)     │                    │
│  │  Phase 5: Requirements Spec (06)            │                    │
│  │                                             │                    │
│  │  Output: Files 00-06                        │                    │
│  │  Phase → requirements_complete              │                    │
│  └─────────────────────────────────────────────┘                    │
│                          │                                          │
│                          ▼                                          │
│  STAGE 2: DESIGN & PLAN (Thiết kế & lập kế hoạch)                  │
│  ┌─────────────────────────────────────────────┐                    │
│  │  /requirements-specs-generate               │                    │
│  │                                             │                    │
│  │  Phase A: Load requirements (00-06)         │                    │
│  │  Phase B: Sinh 07-design.md                 │                    │
│  │  Phase C: Design validation loop            │                    │
│  │  Phase D: Subagent sinh 08-tasks.md         │                    │
│  │           (context boundary để tránh rot)   │                    │
│  │                                             │                    │
│  │  Output: 07-design.md + 08-tasks.md         │                    │
│  │  Phase → specs_complete                     │                    │
│  └─────────────────────────────────────────────┘                    │
│                          │                                          │
│                          ▼                                          │
│  STAGE 3: IMPLEMENT (Triển khai)                                    │
│  ┌─────────────────────────────────────────────┐                    │
│  │  /requirements-specs-execute                │                    │
│  │  *** MỖI SESSION CHỈ 1 TASK ***            │                    │
│  │                                             │                    │
│  │  1. Parse task tiếp theo từ 08-tasks.md     │                    │
│  │  2. Chuẩn bị context cho agent              │                    │
│  │  3. Delegate code-engineer agent            │                    │
│  │  4. Validate kết quả                        │                    │
│  │  5. User verification (4 options)           │                    │
│  │  6. Đánh dấu [x] task → END SESSION        │                    │
│  │                                             │                    │
│  │  Phase → executing / implemented            │                    │
│  └─────────────────────────────────────────────┘                    │
│            ↻ Lặp lại cho mỗi task                                  │
│                          │                                          │
│                          ▼                                          │
│  STAGE 4: QUALITY (Đảm bảo chất lượng — tùy chọn)                  │
│  ┌─────────────────────────────────────────────┐                    │
│  │  /requirements-code-review                  │                    │
│  │  /requirements-revise                       │                    │
│  └─────────────────────────────────────────────┘                    │
│                          │                                          │
│                          ▼                                          │
│  STAGE 5: CLOSE (Kết thúc)                                         │
│  ┌─────────────────────────────────────────────┐                    │
│  │  /requirements-end                          │                    │
│  │  Archive session → requirements/archived/   │                    │
│  └─────────────────────────────────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Chi tiết từng command

#### Nhóm 1: Luồng chính (Core Workflow)

| # | Command | Vai trò | Input | Output |
|---|---------|---------|-------|--------|
| 1 | `/requirements-start` | **Bắt đầu thu thập yêu cầu.** AI đóng vai senior requirements analyst, hỏi user 10 câu hỏi (2 phase × 5 câu), phân tích codebase tự động, sinh spec. | Mô tả feature | Files `00-06`, `metadata.json` |
| 2 | `/requirements-specs-generate` | **Sinh thiết kế & task.** Đọc spec (06), sinh design doc (07), dùng subagent riêng sinh tasks (08) để tránh context rot. | Session đã hoàn thành | `07-design.md`, `08-tasks.md` |
| 3 | `/requirements-specs-execute` | **Thực thi task.** Orchestrate code-engineer agent để implement 1 task/session. Validate kết quả, cho user verify. | Design & tasks sẵn sàng | Code changes, task marked `[x]` |
| 4 | `/requirements-end` | **Kết thúc session.** Kiểm tra bugs/changes chưa resolve, archive requirement folder. | Session active | Session archived |

#### Nhóm 2: Đảm bảo chất lượng (Quality Assurance)

| # | Command | Vai trò |
|---|---------|---------|
| 5 | `/requirements-code-review` | **Review code kỹ thuật.** Phát hiện project rules tự động (dynamic discovery), đánh giá quality/security/performance. Độc lập — không cần requirement files. |
| 6 | `/requirements-revise` | **Kiểm tra alignment.** So sánh code changes hiện tại với design (07), requirements (06), patterns (03). Phát hiện scope drift và deviations. |

#### Nhóm 3: Xử lý sự cố (Side-tracks)

| # | Command | Vai trò |
|---|---------|---------|
| 7 | `/requirements-bug-fix` | **Sửa bug.** Quy trình 5 phase: Intake → Root Cause Analysis (tự động) → Strategy Validation → Fix → Verify. KHÔNG BAO GIỜ nhảy thẳng vào fix. |
| 8 | `/requirements-spec-enhance` | **Quản lý thay đổi.** Ghi nhận change request, phân tích impact, cập nhật change-log (10) và change-backlog (11). |

#### Nhóm 4: Truy vấn & nhắc nhở (Information)

| # | Command | Vai trò |
|---|---------|---------|
| 9  | `/requirements-status` | Hiển thị trạng thái hiện tại, tiếp tục từ checkpoint cuối |
| 10 | `/requirements-list` | Liệt kê tất cả requirement sessions với trạng thái |
| 11 | `/requirements-current` | Xem chi tiết requirement đang active (read-only) |
| 12 | `/requirements-remind` | Nhắc lại rules cho phase hiện tại khi AI bị lệch hướng |

---

## 5. Cấu trúc dữ liệu của một Requirement Session

Mỗi requirement tạo một folder trong `requirements/`:

```
requirements/YYYY-MM-DD-HHMM-feature-slug/
├── 00-initial-request.md          # Yêu cầu ban đầu của user
├── 01-discovery-questions.md      # 5 câu hỏi khám phá (binary/multiple-choice)
├── 02-discovery-answers.md        # Câu trả lời của user
├── 03-context-findings.md         # AI tự phân tích codebase (autonomous)
├── 04-detail-questions.md         # 5 câu hỏi chuyên sâu (dựa trên codebase)
├── 05-detail-answers.md           # Câu trả lời chi tiết
├── 06-requirements-spec.md        # Spec hoàn chỉnh (FRs với Given-When-Then)
├── 07-design.md                   # Thiết kế kỹ thuật (architecture, data models)
├── 08-tasks.md                    # Task breakdown có dependencies
├── 09-bug-tracker.md              # Theo dõi bugs (nếu có)
├── 10-change-log.md               # Log thay đổi (nếu có)
├── 11-change-backlog.md           # Backlog thay đổi chưa xử lý
└── metadata.json                  # Trạng thái session (phase, progress, bugs)
```

### Phase States (Trạng thái)

```
discovery → context → detail → requirements_complete
  → specs_generated → design_approved → specs_complete
    → executing → implemented
      → (archived)

Side states: bug_fixing, change_review
```

---

## 6. Luồng hoạt động end-to-end (Ví dụ)

```
User: "Thêm tính năng Google OAuth login"

1. User gọi: /requirements-start add Google OAuth login
   → AI hỏi 5 câu discovery (UI scope? Security? Integration? ...)
   → AI phân tích codebase tự động (tìm auth patterns, routes, ...)
   → AI hỏi 5 câu expert (OAuth provider? Token storage? ...)
   → AI sinh 06-requirements-spec.md

2. User gọi: /requirements-specs-generate
   → AI đọc spec, sinh 07-design.md (architecture)
   → User approve design
   → Subagent riêng sinh 08-tasks.md (fresh context, no rot)

3. User gọi: /requirements-specs-execute (lặp N lần)
   → Session 1: Task 1 — Setup OAuth config
   → Session 2: Task 2 — Implement login endpoint
   → Session 3: Task 3 — Frontend login button
   → ... mỗi session = 1 task

4. (Tùy chọn) User gọi: /requirements-code-review
   → AI review code quality, security, performance

5. (Tùy chọn) User gọi: /requirements-revise
   → AI kiểm tra code có đúng theo design không

6. User gọi: /requirements-end
   → Kiểm tra bugs/changes → Archive session
```

---

## 7. Nguyên tắc thiết kế quan trọng

### 7.1 Context Engineering
- **Subagent Isolation:** Task generation dùng subagent riêng để tránh context rot
- **One-Task-Per-Session:** Mỗi session chỉ execute 1 task → fresh context = chất lượng cao hơn
- **DEPTH Framework:** Define role → Establish constraints → Provide examples → Task structure → Handle edge cases

### 7.2 Human-in-the-Loop
- Mọi quyết định quan trọng đều qua `vscode/askQuestion` / `AskUserQuestion`
- Chỉ câu hỏi binary/multiple-choice, KHÔNG open-ended
- Đúng 5 câu hỏi mỗi phase (cognitive load management)
- User verify kết quả trước khi đánh dấu hoàn thành

### 7.3 Traceability
- Mọi code change đều trace ngược về requirement: `code → task → design → spec → user answer → question`
- Bug fix phải qua root cause analysis trước khi sửa
- Change management ghi nhận impact analysis

### 7.4 Dynamic Discovery
- Code review KHÔNG hardcode rules → tự phát hiện project conventions
- Template là process, không phải knowledge

---

## 8. Cách cài đặt & sử dụng

```bash
# Cài đặt (tạo cấu trúc + copy slash commands vào editor)
npx requirement-commands init --editor=all

# Với Memory Bank
npx requirement-commands init --editor=all --with-memory-bank

# Sử dụng trong editor
# Claude Code:  /requirements-start add feature X
# Cursor:       /requirements-start add feature X
# VS Code:      @Requirements Manager add feature X
#               hoặc #prompt:requirements-start add feature X
```

---

## 9. Memory Bank (Tùy chọn)

Khi bật `--with-memory-bank`, hệ thống tạo thêm:

```
memory-bank/{project-name}/
├── foundation/
│   ├── projectbrief.md       # Mục tiêu project
│   └── techContext.md        # Tech stack
├── docs-rule/
│   ├── coding-rule.md        # Quy tắc coding (load khi implement)
│   └── review-rule.md        # Checklist review (load khi code review)
└── develop/{TASK_ID}/        # Context cho từng task
    ├── activeContext.md
    └── progress.md
```

Memory Bank giúp AI agent duy trì context xuyên suốt nhiều session, đặc biệt hữu ích cho ALISA agent (v1) vì bộ nhớ reset mỗi session.
