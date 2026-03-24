# Product Requirements Document (PRD): Kids Tracker App (Next.js Edition)

## 1. Project Overview

This is a mobile-first web application designed for parents to track the daily habits, religious practices, and behavior of their two children. The app allows parents to log 7 specific daily tasks. Each completed task rewards the child with 1.5 Birr. The app is used strictly by the parents (synced across their devices) to log activities, view history, redeem accumulated funds, and import legacy Excel/CSV data.

## 2. Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS & Shadcn UI (for clean, quick mobile components)
- **Backend & Database:** Supabase (PostgreSQL, Real-time sync)
- **Authentication:** Basic Hardcoded Auth (Middleware + Cookies)
- **Icons:** `lucide-react`
- **File Parsing (Excel/CSV):** `papaparse` (for CSV) or `xlsx` (for Excel)
- **Date Management:** `date-fns`

## 3. Business Logic & App Rules

- **The Subjects:** 2 Children.
  - Child 1 UI Theme: **Teal** (`text-teal-600`, `bg-teal-500`, etc.)
  - Child 2 UI Theme: **Coral** (`text-rose-500`, `bg-rose-400`, etc.)
- **The Tasks (7 per day):**
  1. Fajr
  2. Dhuhr
  3. Asr
  4. Maghrib
  5. Isha
  6. Reading Quran
  7. Peaceful Day (No fighting)
- **The Economy:**
  - 1 Task = 1.5 Birr.
  - Max per day = 10.5 Birr per child.
  - Total Balance = (All-time completed tasks × 1.5) minus (Total Redeemed Funds).

## 4. Supabase Database Schema

The AI should use the following schema structure. _(Note: Because auth is hardcoded, we don't need a complex users table. We will just use an App Password)._

- **`children`**:
  - `id` (uuid, primary key)
  - `name` (string)
  - `color` (string: 'Teal' | 'Coral')
- **`daily_logs`**:
  - `id` (uuid, primary key)
  - `child_id` (uuid, FK to children)
  - `date` (date, YYYY-MM-DD)
  - `fajr` (boolean, default false)
  - `dhuhr` (boolean, default false)
  - `asr` (boolean, default false)
  - `maghrib` (boolean, default false)
  - `isha` (boolean, default false)
  - `quran` (boolean, default false)
  - `peaceful_day` (boolean, default false)
  - _(Unique constraint on child_id + date)_
- **`redemptions`** (Used when parents buy a toy/give cash):
  - `id` (uuid, primary key)
  - `child_id` (uuid, FK to children)
  - `amount` (numeric)
  - `date` (timestamp)

## 5. Implementation Phases

_AI Instructions: Execute these phases ONE AT A TIME. Do not move to the next phase until the user explicitly confirms the current phase is working. Ask for confirmation at the end of every phase._

### Phase 1: Project Setup & Initialization

1.  Initialize a new Next.js project: `npx create-next-app@latest . --typescript --tailwind --eslint --app`.
2.  Install dependencies: `@supabase/supabase-js`, `lucide-react`, `date-fns`, `papaparse`, `clsx`, `tailwind-merge`.
3.  Set up the folder structure:
    - `src/app` (Routes)
    - `src/components` (Reusable UI like Buttons, Bottom Nav)
    - `src/lib` (Supabase client, utils)
    - `src/store` (React Context for global state)
4.  Configure `src/lib/supabase.ts` with placeholder environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### Phase 2: Hardcoded Authentication & Middleware

1.  Create a simple `/login` page with a single "App Password" input field.
2.  Create a Next.js Server Action or API route that checks the password against an environment variable (`ADMIN_PASSWORD`).
3.  If correct, set a secure HTTP-only cookie (e.g., `auth_token=authenticated`).
4.  Create a Next.js `middleware.ts` file in the root. It should protect all routes (except `/login`). If the cookie is missing, redirect to `/login`.

### Phase 3: Global Layout & State

1.  Create a **Mobile-First Layout** (`app/layout.tsx`). The app should be constrained to a max-width (e.g., `max-w-md mx-auto`) so it looks like a phone screen even on desktop.
2.  Implement a Fixed Bottom Navigation Bar with 3 icons: **Dashboard**, **Log Today**, **History**.
3.  Create a `ChildContext.tsx`. The app MUST have a global toggle (fixed at the top header) to switch between Child 1 and Child 2.
4.  Ensure UI consistency: Provide helper functions or Tailwind classes so that when Child 1 is selected, buttons/charts are Teal. When Child 2 is selected, they are Coral.

### Phase 4: Database Setup & Dashboard Screen

1.  Provide the SQL script to create the `children`, `daily_logs`, and `redemptions` tables in Supabase.
2.  **Dashboard UI (`/`):**
    - Fetch all `daily_logs` and `redemptions` for the globally selected child.
    - Calculate and display the "Current Balance" prominently in a colored card.
    - Create a "Redeem" button that opens a modal to subtract Birr. Write the Server Action to insert a row into `redemptions`.
    - Show a small circular progress or text indicator for today's task completion (e.g., "5/7 Tasks Completed Today").

### Phase 5: Daily Logging Screen (`/log`)

1.  Create a UI with a Date Picker header (Left/Right arrows to change the date, defaults to today).
2.  Render 7 large toggle switches or clickable rows for the 7 tasks.
3.  **Real-time & Upsert:** When a parent clicks a toggle, immediately update the UI (optimistic update), and trigger a Supabase `upsert` matching the `child_id` and `date`.
4.  Display a dynamic text summary at the bottom: "Today's Earnings: [X] Birr" (calculated locally based on checked boxes × 1.5).
5.  _Crucial:_ Implement Supabase Realtime so if Mom checks "Fajr" on her phone, Dad's screen updates instantly if he has it open.

### Phase 6: History & Legacy Data Import (`/history`)

1.  **History View:** A simple list or calendar grid showing past days and their scores (e.g., "Oct 12: 10.5 Birr (7/7)").
2.  **Import Section:** An `<input type="file" accept=".csv" />` button hidden behind a styled "Upload Old Data (CSV)" button.
3.  **Parsing Logic:** Use `papaparse` to read the CSV on the client side. The CSV must have headers: `Date, Fajr, Dhuhr, Asr, Maghrib, Isha, Quran, PeacefulDay`.
4.  Convert the rows into an array of objects (converting 1s to true, 0s to false) and send them to a Server Action to perform a bulk `upsert` into the `daily_logs` table.

### Phase 7: PWA Setup & Reminders

1.  Add a `manifest.json` and `<meta name="theme-color">` tags to `app/layout.tsx` so the parents can use Safari/Chrome to "Add to Home Screen" and use it as a standalone app.
2.  Since Web Push Notifications can be complex on iOS, build a simple UI inside the app that uses standard browser `Notification.requestPermission()`. Schedule a local browser notification or simply rely on the parents forming the habit via the easily accessible PWA.

---

**End of PRD.**
_(AI: Please acknowledge you have read this entire document. Await the user's command to begin Phase 1)._
