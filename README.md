.

📁 Folder Structure
src/
│
├── components/          # Reusable UI components (Presentational)
│   ├── AddTask.jsx
│   ├── FilterTabs.jsx
│   ├── LoadingSpinner.jsx
│   ├── SearchBar.jsx
│   ├── SortDropdown.jsx
│   ├── ThemeToggle.jsx
│   ├── TodoItem.jsx
│   └── TodoList.jsx      # Virtualized + Drag & Drop list
│
├── context/
│   └── TodosContext.jsx  # Global state using Context + useReducer
│
├── reducers/
│   └── taskReducer.js    # Business logic for all actions
│
├── hooks/
│   ├── useTodos.js       # Contains CRUD logic + API simulation
│   └── useSearch.js      # Debouncing implementation
│
├── services/
│   └── mockApi.js        # Simulates real HTTP requests
│
├── App.jsx               # Main UI shell
└── main.jsx              # Entry point

⚙️ Tech Stack

React 18

Context API + useReducer

React Window (Virtualization)

Hello-Pangea/DnD (Drag & Drop)

TailwindCSS

LocalStorage (Persistence)

✨ Features
✅ 1. CRUD Operations

Add tasks

Edit tasks

Mark complete

Delete tasks

Undo delete (Snackbar)

✅ 2. Filtering & Sorting

All / Active / Completed

Sort by newest / oldest

Sort disabled during drag to avoid conflicts

✅ 3. Search (Optimized with Debouncing)

Search happens 300ms after typing stops.

Reduces unnecessary re-renders and improves performance.

✅ 4. Persistence

Tasks remain saved even after page refresh using LocalStorage.

✅ 5. Mock API Layer

Simulates real networking:

500ms delay

10% random failure rate

Error fallback UI

Retry-safe architecture

✅ 6. Drag & Drop (DND)

Implemented using @hello-pangea/dnd.

Reorders:

Local state

LocalStorage

Virtualized list indices

✅ 7. Dark/Light Theme

Smooth animated transitions

Saved in LocalStorage

Uses tailwind .dark mode class

✅ 8. Virtualization (10,000 Items Performance)

Critical performance feature.
Implemented using react-window (FixedSizeList).

Only ~15 items render at a time — improves:

FPS

Memory usage

Scroll performance

Mobile experience

Drag & drop stability

🚀 Performance Optimizations (Detailed)
1. Virtualization

Without virtualization, rendering 10k tasks freezes the browser.

Solution implemented:

react-window

Fixed-size rows (70px)

Integrated with drag-and-drop

2. Debouncing

Search input uses:

setTimeout(() => runSearch(), 300)


Prevents filtering on each keystroke.

3. Memoization

useMemo for derived values (visibleTasks)

useCallback for handlers

Prevents re-renders of large list

4. Component Splitting

All UI components are presentational.
All business logic lives in:

useTodos()

useSearch()

taskReducer

mockApi.js

🧠 Architectural Decisions
1. Context + useReducer (instead of Redux)

Reasons:

Built-in

No extra dependencies

Perfect for medium-level apps

Helps implement clean reducer-based logic

2. Custom Hooks

Example:

Hook	Responsibility
useTodos()	Fetch, add, edit, delete, toggle, reorder tasks (business logic)
useSearch()	Debouncing logic
3. Mock API Layer

Imitates a real backend:

Randomized failure

500ms artificial latency

Success/Failure responses

This demonstrates how the app handles:

loading states

retries

UI fallback

🪄 UI & UX Highlights
✔ Smooth dark/light transitions
✔ Virtualized scroll container only
✔ Custom styled scrollbars
✔ Snackbar animations
✔ Clean spacing, shadows & typography
✔ “No Tasks Found” empty state
▶️ How to Run the Project
1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev

3️⃣ Build for production
npm run build

📚 How Virtualized Drag & Drop Works

A specialized combination:

react-window → renders only visible rows

@hello-pangea/dnd → handles drag

Custom integration using renderClone

This ensures:

correct dragging preview

correct placement

zero scroll jank