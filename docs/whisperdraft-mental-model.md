# 🧠 Mental Model: Whisperdraft

## 1. Application Purpose

Whisperdraft is a hybrid writing tool where users write freely and receive gentle AI feedback based on their evolving edits. It is:
- **Local-first**
- **Distraction-free**
- **Diff-aware**
- **Tuned for thoughtful flow, not rapid iteration**

---

## 🧩 Core Interaction Model

### ✍️ User writes in the left panel
- Primary interface: rich text or markdown note editor
- Every 30 seconds or on manual save:
  - Compute a diff between the current note and a saved baseline
  - Trigger an AI request based on that diff

### 👻 AI whispers back in the right panel
- The AI doesn't take initiative — it listens and reflects
- Responses show up in a chat-style stream
- Each response is linked to a specific diff or moment in writing

### 🔄 Diff-based prompting
- Instead of full prompt regeneration, only recent diffs (last 3–5) are sent to the LLM
- Every few diffs: squash into a summary for context accumulation

---

## 🛠️ Data Flow

