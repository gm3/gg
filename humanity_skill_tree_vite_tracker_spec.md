# 🌱 Humanity Skill Tree – Gamified Good Deeds Tracker

*A Vite-powered, modular, client-side web app that turns real-life kindness and humanitarian actions into a personal skill tree.*

---

## 1. Concept Overview

This project is a **personal, non-competitive, non-monetized tracker** that gamifies real-world humanitarian and pro-social actions.

Key principles:
- No leaderboards
- No social clout
- No verification system
- No punishment for inactivity

This is **self-honesty-driven**. Users track progress for reflection and motivation, not external reward.

---

## 2. Tech Stack & Architecture

### Core Stack
- **Vite** – fast dev server + build
- **Vanilla JS or minimal framework (Vue/React optional)**
- **CSS Modules or simple global CSS**
- **Local persistence via cookies or localStorage** (recommended: `localStorage`)

> No backend required for v1

---

## 3. App Structure (Vite)

```
/skill-tree-app
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js
    ├── state/
    │   └── progressStore.js
    ├── data/
    │   └── quests.js
    ├── components/
    │   ├── SkillTree.js
    │   ├── Tier.js
    │   ├── QuestCard.js
    │   └── ProgressSummary.js
    └── styles/
        └── main.css
```

---

## 4. State & Persistence

### Data Model

```js
{
  completedQuests: ["smile_stranger", "hold_door"],
  lastUpdated: "2026-01-01"
}
```

### Persistence Strategy
- Use `localStorage`
- Key: `humanity_skill_tree_progress`
- Load on app init
- Save on quest toggle

> Cookies are possible, but `localStorage` is simpler and more reliable for this use case.

---

## 5. UX Philosophy

- Gentle
- Calm
- Encouraging
- Never guilt-inducing

UI language should say:
> "This is here when you’re ready."

No streaks. No red warnings. No timers.

---

## 6. Skill Tiers

### Tier 1 — 🌱 Seeds (Everyday Kindness)
*Low effort, low pressure, habit-forming actions.*

**Social Kindness**
- Smile at a stranger
- Say thank you and mean it
- Hold a door open
- Let someone merge in traffic
- Give a genuine compliment
- Remember someone’s name
- Ask someone how they’re doing (and listen)

**Personal Conduct**
- Pick up litter you didn’t create
- Return a shopping cart
- Be on time today
- Put your phone away during a conversation
- Apologize when you’re wrong

**Digital Kindness**
- Leave a kind comment online
- Don’t engage in an argument you could escalate
- Share helpful information without dunking
- Credit an original creator

---

### Tier 2 — 🌿 Growth (Community & Care)
*Requires intention, planning, or vulnerability.*

**Relationships**
- Check in on a friend unprompted
- Write a thank-you message
- Forgive someone (internally)
- Offer help without being asked
- Reconnect with someone you lost touch with

**Community**
- Help a neighbor with something practical
- Donate unused items
- Support a local business intentionally
- Attend a community meeting or event
- Help someone learn a skill

**Environment**
- Reduce single-use plastic for a week
- Plant something
- Learn about local environmental issues
- Participate in a cleanup

**Self-Development**
- Learn about an issue you don’t fully understand
- Read a perspective you disagree with
- Practice patience in a stressful moment

---

### Tier 3 — 🌳 Stewardship (High Impact)
*Requires commitment, leadership, or sustained effort.*

**Volunteering**
- Volunteer with a local organization
- Volunteer for disaster relief (e.g., Red Cross)
- Commit to recurring volunteer work

**Leadership & Initiative**
- Organize a community event
- Start a local fundraiser
- Coordinate a donation drive
- Mentor someone long-term

**Civic Engagement**
- Register to vote (if applicable)
- Help someone else register
- Contact a representative about an issue
- Attend a town hall

**Environmental Stewardship**
- Start or help maintain a community garden
- Advocate for a local environmental cause
- Reduce personal waste long-term

---

## 7. Quest Data Format (`quests.js`)

```js
export const quests = [
  {
    id: "smile_stranger",
    tier: 1,
    category: "Social Kindness",
    title: "Smile at a stranger",
    description: "A simple moment of human recognition."
  }
]
```

Each quest:
- `id` (unique string)
- `tier` (1–3)
- `category`
- `title`
- `description`

---

## 8. Components

### SkillTree
- Renders tiers in order
- Displays progress summary

### Tier
- Title + short description
- List of QuestCards

### QuestCard
- Checkbox or toggle
- Title + description
- Soft animation on completion

### ProgressSummary
- % of quests completed
- Friendly copy like:
  > "You’ve completed 14 acts of kindness."

---

## 9. Visual Style

- Earth tones
- Soft greens and browns
- Rounded cards
- No aggressive gamification

Optional:
- Subtle leaf growth animation when a tier progresses

---

## 10. Future Extensions (Optional)

- Daily random quest suggestion
- Reflection journal per quest
- Export progress as JSON
- Accessibility mode (text-only)

---

## 11. Non-Goals (Important)

This app should **NOT**:
- Rank users
- Encourage comparison
- Track location
- Require accounts
- Push notifications

---

## 12. Closing Philosophy

> "You can’t max out kindness.
> You can only practice it."

This app exists to make doing good feel **possible, visible, and human**.

---

*End of HackMD Spec*

