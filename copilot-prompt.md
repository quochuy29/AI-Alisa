
## **Use prompt files in VS Code** 

### **Tổng quan**

*Prompt files* là các tệp Markdown dùng để định nghĩa những lời lệnh (prompt) có thể tái sử dụng cho các tác vụ phát triển phổ biến như tạo mã, thực hiện review mã, hay tạo cấu trúc project. Các tệp này có thể chạy trực tiếp trong phần chat của Copilot và lưu lại các quy trình tiêu chuẩn để sử dụng lại sau này. ([Visual Studio Code][1])

Prompt files:

* Là các file Markdown với phần mở rộng `.prompt.md`. ([Visual Studio Code][1])
* Được dùng như các prompt độc lập mà bạn có thể chạy trong chat Copilot. ([Visual Studio Code][1])
* Có thể bao gồm hướng dẫn cụ thể về nhiệm vụ hoặc tham chiếu tới *custom instructions* để đảm bảo thực thi nhất quán. ([Visual Studio Code][1])
* Khác với *custom instructions* vì prompt files được kích hoạt theo yêu cầu cho từng nhiệm vụ cụ thể. ([Visual Studio Code][1])

---

## **1. Prompt file structure — Cấu trúc file**

Prompt files là các file Markdown `.prompt.md`, với hai phần chính:

### **• YAML Frontmatter (Phần đầu — Header, tùy chọn):**

Được bao bao trong dấu `---` và có các trường sau:

| Trường          | Mô tả                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| `description`   | Mô tả ngắn về prompt                                                           |
| `name`          | Tên prompt, dùng sau khi gõ `/` trong chat                                     |
| `argument-hint` | Gợi ý text hiển thị trong ô nhập của chat                                      |
| `agent`         | Agent Copilot để chạy prompt (`ask`, `edit`, `agent` hoặc tên agent tùy chỉnh) |
| `model`         | Tên model ngôn ngữ để sử dụng                                                  |
| `tools`         | Danh sách tool hay nhóm tool được dùng cho prompt                              |

*Nếu không có trường agent hoặc tools, prompt dùng cấu hình hiện tại.* ([Visual Studio Code][1])

---

### **• Body — Nội dung prompt:**

* Bao gồm text prompt gửi tới LLM (Large Language Model). ([Visual Studio Code][1])
* Có thể chứa bất kỳ hướng dẫn, context, ví dụ hoặc thông tin nào cần để Copilot thực hiện nhiệm vụ. ([Visual Studio Code][1])
* Có thể liên kết tới các file khác trong workspace bằng Markdown link. ([Visual Studio Code][1])
* Có thể sử dụng biến trong prompt bằng cú pháp `${variableName}`, ví dụ:

  * `${workspaceFolder}`, `${selectedText}`, `${fileBasename}`… ([Visual Studio Code][1])

---

## **2. Ví dụ prompt files**

### **Ví dụ tạo form React**

```markdown
---
agent: 'agent'
model: GPT-4o
tools: ['githubRepo', 'search/codebase']
description: 'Generate a new React form component'
---
Your goal is to generate a new React form component…
```

– Prompt này dùng agent kiểu `agent`, model `GPT-4o`, và tools chỉ định để sinh một component React mới dựa trên templates trong một repo. ([Visual Studio Code][1])

### **Ví dụ review bảo mật API**

```markdown
---
agent: 'ask'
model: Claude Sonnet 4
description: 'Perform a REST API security review'
---
Perform a REST API security review…
```

– Đây là prompt để yêu cầu review bảo mật REST API, trả về danh sách TODO các vấn đề bảo mật. ([Visual Studio Code][1])

---

## **3. Tạo prompt file**

Bạn có thể tạo prompt file theo các bước sau:

1. Mở **Chat view** trong VS Code. ([Visual Studio Code][1])
2. Chọn **Configure Chat → Prompt Files → New prompt file**. ([Visual Studio Code][1])
3. Chọn nơi lưu:

   * **Workspace**: .github/prompts — chỉ có trong workspace đó. ([Visual Studio Code][1])
   * **User profile**: dùng được cho nhiều workspace. ([Visual Studio Code][1])
4. Đặt tên `.prompt.md` và viết nội dung trong file. ([Visual Studio Code][1])

Bạn cũng có thể tạo file bằng lệnh Command Palette:
`Chat: New Prompt File` hoặc `Chat: New Untitled Prompt File`. ([Visual Studio Code][1])

---

## **4. Sử dụng prompt file trong chat**

Có nhiều cách để chạy prompt file:

* Gõ `/prompt-name` trực tiếp trong ô chat và Enter. ([Visual Studio Code][1])
* Chọn lệnh **Chat: Run Prompt** từ Command Palette rồi chọn prompt cần chạy. ([Visual Studio Code][1])
* Mở file prompt trong editor và nhấn nút **Play** trên tiêu đề để chạy trong chat hiện tại hoặc mở chat mới. ([Visual Studio Code][1])

Ngoài ra có thể cấu hình đề xuất prompt tự động khi bắt đầu chat (setting `chat.promptFilesRecommendations`). ([Visual Studio Code][1])

---

## **5. Priority tools & agents**

Prompt files định nghĩa danh sách tools trong metadata:

1. Tools chỉ định trực tiếp trong prompt file. ([Visual Studio Code][1])
2. Tools từ custom agent nếu prompt file tham chiếu tới agent. ([Visual Studio Code][1])
3. Tools mặc định của agent được chọn. ([Visual Studio Code][1])

*Có nghĩa là cấu hình trong file prompt có độ ưu tiên cao nhất.* ([Visual Studio Code][1])

---

## **6. Đồng bộ prompt files**

Prompt files có thể được đồng bộ giữa thiết bị khi **Settings Sync** được bật và bao gồm phần sync cho prompt & instructions files. ([Visual Studio Code][1])

---

## **7. Tips định nghĩa prompt files**

Một số hướng dẫn khi viết prompt file:

* Mô tả rõ mục tiêu prompt và định dạng đầu ra mong đợi. ([Visual Studio Code][1])
* Cung cấp ví dụ input/output nếu cần. ([Visual Studio Code][1])
* Sử dụng Markdown links để tái dùng custom instructions thay vì lặp nội dung trong mỗi file. ([Visual Studio Code][1])
* Dùng biến để linh hoạt hơn (ví dụ `${selectedText}`, `${file}`…). ([Visual Studio Code][1])

---

[1]: https://code.visualstudio.com/docs/copilot/customization/prompt-files "Use prompt files in VS Code"
