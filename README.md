# 🌱 GG – Gamify Goodness Skill Trees

*A modular, fullscreen skill tree engine that gamifies real-life goals (like kindness, degen onboarding, or anything else you can dream up). Built with Vite, vanilla JavaScript, and designed for maximum reusability.*

> "You can't max out kindness. You can only practice it."

---

## ✨ Features

### 🎮 Core Functionality
- **Fullscreen Skill Tree View**: Interactive SVG-based tree visualization with nodes representing quests/deeds
- **List View**: Mobile-friendly collapsible list with expandable quest details
- **Points System**: Track progress across 4 customizable stats (Goodness, Thoughtfulness, Kindness, Empathy)
- **Progress Tracking**: Persistent localStorage-based progress tracking with reflections
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎯 Key Features

#### Tree View
- **Scroll-to-Zoom**: Mouse wheel scrolling zooms in/out (50% - 300%)
- **Pan & Drag**: Right-click or middle-mouse drag to pan around the tree
- **Node Interaction**: Click nodes to open detailed modal, hover to see tooltips
- **Visual Feedback**: Completed nodes glow green, hover effects on active nodes
- **Auto-Resize**: Tree automatically adjusts when window is resized

#### List View (Mobile-Optimized)
- **Collapsible Tiers**: Expand/collapse tier sections for easy navigation
- **Expandable Nodes**: Click nodes to see details and actions
- **Filter System**: Toggle between All, Active, and Completed quests
- **Smart Sorting**: Active quests appear first, completed quests at bottom
- **Progress Stepper**: Visual progress indicator showing completion milestones
- **Scroll Preservation**: Maintains scroll position when marking quests complete

#### Character Stats
- **Top Center Display**: Compact horizontal stats bar showing:
  - Nodes completed count
  - Individual stat breakdowns (+Goodness, +Thoughtfulness, etc.)
  - Total points across all stats
- **View Toggle**: Switch between Tree and List views
- **Settings Menu**: Hamburger menu with Export and Clear options

#### Node Details Modal
- **Lightbox Display**: Full quest information in a beautiful modal
- **Points Breakdown**: Shows which stats are awarded and how many points
- **Completion Toggle**: Mark quests as complete/incomplete
- **Reflection Notes**: Optional reflection textarea for completed quests
- **Keyboard Support**: Press Escape to close

---

## 🏗️ Architecture & Modularity

### JSON-Based Configuration
The entire system is now **fully modular** and loads from a **single JSON file**:

- **`public/config.json`**: Contains everything - stat types, quests, defaults, storage keys, and app name

This means you can:
- Create entirely new skill trees by editing one file
- Change stat types, quests, and configuration all in one place
- Reuse the entire system in other projects with different data
- Perfect for AI-generated skill trees - just provide the config file!
- No code changes needed to customize the skill tree!

### Component Structure
```
src/
├── main.js                    # Entry point - loads config & quests from JSON
├── data/
│   └── loadData.js           # JSON loader with caching and error handling
├── state/
│   └── progressStore.js      # Modular state management (initialized from config)
├── components/
│   ├── SkillTree.js          # Main orchestrator component
│   ├── SkillMap.js           # SVG tree renderer (accepts quests as param)
│   ├── ListView.js           # Mobile list view (accepts quests as param)
│   ├── CharacterStats.js     # Stats display (uses dynamic stat types)
│   ├── NodeModal.js          # Quest detail modal
│   ├── ProgressStepper.js    # Progress visualization component
│   └── SettingsMenu.js       # Hamburger menu with actions
└── styles/
    └── main.css              # Comprehensive styling with responsive breakpoints
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gg
   ```

2. **Install dependencies**
   ```bash
   cd skill-tree-app
   npm install
   ```

3. **Start development server**
   ```bash
   # From root directory
   npm run dev
   
   # Or from skill-tree-app directory
   cd skill-tree-app
   npm run dev
   ```

4. **Open in browser**
   - The app will be available at `http://localhost:5173` (or the port Vite assigns)

### Building for Production

```bash
npm run build
```

The built files will be in the repo root `docs/` folder (configured for GitHub Pages).

---

## 📝 Customization Guide

### Creating a Custom Skill Tree

Everything is configured in a **single JSON file**: `skill-tree-app/public/config.json`

```json
{
  "appName": "Your Skill Tree Name",
  "statTypes": {
    "strength": "Strength",
    "wisdom": "Wisdom",
    "charisma": "Charisma",
    "intelligence": "Intelligence"
  },
  "defaultStats": {
    "strength": 0,
    "wisdom": 0,
    "charisma": 0,
    "intelligence": 0
  },
  "storageKey": "your_skill_tree_progress",
  "quests": [
    {
      "id": "unique_quest_id",
      "tier": 1,
      "category": "Category Name",
      "title": "Quest Title",
      "description": "Quest description text",
      "emoji": "🎯",
      "points": {
        "strength": 2,
        "wisdom": 1,
        "charisma": 1,
        "intelligence": 0
      }
    }
  ]
}
```

**That's it!** Just edit one file and the entire skill tree adapts. Perfect for AI-generated skill trees or quick customization.

**Key Points:**
- All quests go in the `quests` array
- Stat types in `points` must match keys in `statTypes`
- `defaultStats` should have all stat types initialized to 0
- `tier` can be any number (typically 1-3, but flexible)
- `category` is for organization (used in list view)

### Loading Custom Configs at Runtime

You can test entirely new skill trees **without rebuilding**:

- Open the app, click the **Settings (☰)** menu → **“Load config JSON”**
- Select any JSON file that follows the config shape shown above
- The app saves this as a custom config and reloads using your new tree

This makes it easy to:
- Ask an LLM (like ChatGPT / Cursor) to **generate a full config JSON** for a new theme  
  (e.g. *“Create a `config_fitness.json` for 50 fitness quests with stats Strength / Stamina / Mobility / Mindfulness in the same format as my existing config.json.”*)
- Drop that file into `skill-tree-app/public/` or your local machine
- Use **“Load config JSON”** to instantly switch the app to that new tree

As long as the JSON matches the `config.json` structure, the UI will adapt automatically (stats, quests, tiers, labels, and scoring).

### Using in Other Projects

1. Copy the `skill-tree-app` folder
2. Update `public/config.json` with your stat types **and** quests
3. Customize styling in `src/styles/main.css` if needed
4. The system will work with any stat types and quest structure, entirely driven by that one config file!

You can also keep multiple configs (e.g. `config_degen.json`, `config_fitness.json`) and load them at runtime via **Settings → “Load config JSON”**. The active tree name (from `appName`) is shown in the top stats bar so users always know which profile they’re viewing.

---

## 🎮 Usage

### Tree View (Desktop)
- **Zoom**: Scroll mouse wheel to zoom in/out
- **Pan**: Right-click and drag, or middle-mouse button drag
- **View Node**: Click any node to open detailed modal
- **Hover**: Hover over nodes to see tooltips
- **Complete**: Click node → modal opens → check the completion box

### List View (Mobile/Tablet)
- **Filter**: Use filter buttons (All/Active/Completed) at top
- **Expand Tier**: Click tier header to collapse/expand
- **View Details**: Click a quest item to expand details
- **Complete**: Use checkbox or click "View Details" → complete in modal
- **Scroll**: Automatically preserves position when completing quests

### Settings Menu
- Click the hamburger menu (☰) next to the view toggle
- **Export JSON**: Download your progress as JSON file
- **Clear All**: Reset all progress (with confirmation)

---

## 🛠️ Technical Details

### State Management
- Modular progress store that initializes from config
- Supports any number of stat types (defined in config)
- Persistent localStorage with automatic save/load (via a small persistence adapter that can be swapped for a DB/API)
- Reactive updates via subscription system
- Optional evidence & review metadata per quest (see `REVIEW_FEATURE_README.md` for the current stub and integration plan)

### Responsive Breakpoints
- **Desktop**: Tree view default, fullscreen layout
- **Tablet/Mobile** (< 768px): List view default, optimized for touch
- **Vertical orientation**: Automatically switches to list view

### Browser Support
- Modern browsers with ES6+ support
- localStorage required for progress persistence
- SVG support required for tree visualization

---

## 📦 Project Structure

```
gg/
├── package.json              # Root package.json for running from root
├── README.md                 # This file
├── docs/                     # Production build output (for GitHub Pages)
├── skill-tree-app/
│   ├── package.json         # App dependencies
│   ├── index.html           # Entry HTML
│   ├── vite.config.js       # Vite configuration (builds to ../docs)
│   ├── public/
│   │   ├── config.json      # Complete configuration (stat types, quests, etc.)
│   │   └── vite.svg         # Favicon
│   └── src/
│       ├── main.js          # App entry point
│       ├── data/
│       │   └── loadData.js  # JSON data loader
│       ├── state/
│       │   └── progressStore.js  # State management
│       ├── components/      # All UI components
│       └── styles/
│           └── main.css     # Global styles
```

---

## 🎨 Design Philosophy

- **Minimal UI**: Clean, transparent overlays that don't obstruct the tree
- **Dark Theme**: Calming dark background with teal-green accents
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: Keyboard navigation, ARIA labels, semantic HTML
- **Mobile-First**: List view optimized for touch interactions

---

## 🔧 Development

### Key Technologies
- **Vite**: Fast build tool and dev server
- **Vanilla JavaScript**: No framework dependencies
- **SVG**: For tree visualization
- **CSS3**: Modern styling with backdrop-filter, animations

### Code Style
- Modular, reusable components
- Clear separation of concerns
- Helpful comments throughout
- ES6+ JavaScript features

---

## 📄 License

See LICENSE file for details.

---

## 🚧 Future Enhancements

Potential additions (not yet implemented):
- Import/load different skill tree configurations
- Multiple skill tree profiles
- Export/import progress between devices
- Custom themes
- Quest dependencies/prerequisites
- Achievement badges

---

## 📖 Documentation

For detailed specification, see `humanity_skill_tree_vite_tracker_spec.md`

---

**Built with ❤️ for practicing kindness**
