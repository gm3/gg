## Quest Evidence & Review Workflow (Design Stub)

This document describes the **evidence / attachments** + **human/AI review** feature for the skill tree.
The current implementation is a *front‑end stub* that stores everything locally, but it is structured
so a future game platform can plug a database / API in without rewriting the UI.

---

### 1. Goals

- Allow users to optionally attach **evidence** when completing a quest:
  - Links to videos, images, drive folders, etc.
  - Short notes for the reviewer.
- Prepare for a **review queue** UX where:
  - A project manager or moderator can approve / reject submissions.
  - (Optional) An AI service can pre‑screen evidence and suggest a decision.
- Keep the existing demo **fully static** (no backend), using localStorage.
- Make it trivial for a platform to replace local storage with a DB/API later.

---

### 2. Data Model (Front‑End)

#### Config (per tree)

In `config.json` (or any custom config) we can **optionally** add:

```jsonc
{
  "appName": "Example Tree",
  "statTypes": { "...": "..." },
  "defaultStats": { "...": 0 },
  "storageKey": "example_progress",
  "quests": [
    {
      "id": "make_demo_video",
      "tier": 2,
      "category": "Content",
      "title": "Make a short demo video",
      "description": "...",
      "emoji": "🎥",
      "points": { "goodness": 2 },
      "evidenceRequired": true // optional flag for future gating logic
    }
  ]
}
```

The **current stub** does not enforce `evidenceRequired`, but the flag is available for a future
server‑side review system.

#### Progress Store (per user, per tree)

In `src/state/progressStore.js` the state now includes:

```js
state = {
  completedQuests: [],
  lastUpdated: null,
  reflections: { [questId]: string },
  evidence: {
    [questId]: {
      note?: string,      // user‑provided links / notes
      status?: string     // 'unsubmitted' | 'submitted' | 'approved' | 'rejected'
    }
  },
  stats: { [statKey]: number }
}
```

Helper functions:

- `getEvidence(questId)` → returns `{ note, status }` (with defaults).
- `setEvidence(questId, partial)` → merges and persists `note` / `status`.

For now this is persisted exactly like everything else: via localStorage (or the
future persistence adapter).

---

### 3. UI Stub (Node Modal)

In `src/components/NodeModal.js`, each quest modal now has an **Evidence** section:

- A textarea for links / notes:  
  “Links to videos, images, files, or notes for a future reviewer.”
- A small status chip: `UNSUBMITTED` / `SUBMITTED` (from `evidence.status`).
- A **“Submit for review”** button:
  - Calls `setEvidence(quest.id, { note, status: 'submitted' })`.
  - Updates the status chip to `SUBMITTED`.

Important:

- This does **not** change how completion works in the demo.
- The checkbox still toggles completion immediately, so the static app remains simple.
- In a real game, you could:
  - Hide/disable the checkbox until the server marks the quest as `approved`.
  - Or treat evidence as optional metadata while completion is authoritative on the backend.

---

### 4. Persistence & Backend Integration Plan

#### Current Demo (no backend)

- All progress (including `evidence`) is saved in localStorage under `storageKey`.
- The new `src/state/persistence.js` adapter still defaults to **LOCAL** mode.

#### Future: Hooking Up a Database / API

Recommended API surface (example):

- `GET /api/trees/:treeId`  
  → returns the config object (same shape as `config.json`).

- `GET /api/profiles/:profileId/progress?treeId=...`  
  → returns the progress snapshot:

  ```json
  {
    "completedQuests": [...],
    "stats": { "...": 0 },
    "reflections": { "questId": "note" },
    "evidence": {
      "questA": { "note": "...", "status": "submitted" },
      "questB": { "note": "...", "status": "approved" }
    },
    "lastUpdated": "2026‑01‑28"
  }
  ```

- `POST /api/profiles/:profileId/progress/toggle`  
  - Body: `{ treeId, questId, done }`
  - Server recalculates stats and returns updated snapshot.

- `POST /api/profiles/:profileId/progress/evidence`  
  - Body: `{ treeId, questId, note, attachments? }`
  - Server stores note + attachments, sets `status = 'submitted'`, and
    enqueues a review task.

- `POST /api/review/decide` (PM/AI side)  
  - Body: `{ profileId, treeId, questId, status: 'approved' | 'rejected', reviewNotes? }`
  - If `approved`, server may also mark the quest as completed and
    recalculate stats.

##### Wiring into the front‑end

1. Implement the API routes in your backend.
2. In `src/state/persistence.js`, change `PERSISTENCE_MODES` to `REMOTE`
   and implement real `loadSnapshot` / `saveSnapshot` using `fetch`.
3. Optionally:
   - When the page loads, inject `window.__skillTreeInitialSnapshot` from server‑rendered HTML.
   - Or call the API from `main.js` before mounting the tree.

The UI will not need structural changes; it already treats `evidence` as part of the
progress snapshot.

---

### 5. Reviewer / AI Dashboard (Future Work)

Out of scope for this repo, but easy to add later:

- A separate SPA or route that lists `submitted` evidence:
  - `GET /api/review/queue`
  - Shows quest, user, note, links, and AI suggestion (if any).
- Buttons to Approve/Reject, which call `POST /api/review/decide`.
- The current tree UI will reflect status changes on the next progress fetch.

---

### 6. Summary

- Evidence & review are **modeled and stubbed**, not enforced.
- The demo remains fully static and self‑contained.
- A game platform can:
  - Reuse the config format,
  - Swap the persistence adapter to a DB,
  - Implement review endpoints,
  - And gain a full evidence‑based quest approval workflow without changing
    the core UI components.

