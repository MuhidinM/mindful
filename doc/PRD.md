Product Requirements Document (PRD): Kids Tracker App

1. Project Overview

This application is a habit-building, religious practice, and financial tracking tool for parents to track the daily activities of their two children. The app allows parents to log 7 specific daily tasks. Each completed task rewards the child with 1.5 Birr. The app is used strictly by the parents (synced across two devices) to log activities, view history, redeem accumulated funds, and import legacy paper data.

2. Tech Stack

Frontend Framework: React Native with Expo (Managed Workflow)

Routing: Expo Router (File-based routing)

Backend & Database: Supabase (PostgreSQL, Auth, Real-time sync)

Styling: Standard StyleSheet

Notifications: Expo Notifications

File Parsing (for Excel/CSV upload): papaparse or xlsx library

3. Business Logic & App Rules

The Subjects: 2 Children.

Child 1 UI Color: Teal

Child 2 UI Color: Coral

The Tasks (7 per day):

Fajr

Dhuhr

Asr

Maghrib

Isha

Reading Quran

Peaceful Day (No fighting)

The Economy:

1 Task = 1.5 Birr.

Max per day = 10.5 Birr per child.

Total Balance = (All-time completed tasks × 1.5) minus (Total Redeemed Funds).

4. Supabase Database Schema

The AI should use the following schema structure when setting up the database:

profiles: Parent users.

id (uuid, matches auth.users)

email (string)

children:

id (uuid)

name (string)

color (string: 'Teal' | 'Coral')

family_id (uuid - links to parents, but for simplicity, parents share one login or share a family group)

daily_logs:

id (uuid)

child_id (uuid, FK)

date (date, YYYY-MM-DD)

fajr (boolean, default false)

dhuhr (boolean, default false)

asr (boolean, default false)

maghrib (boolean, default false)

isha (boolean, default false)

quran (boolean, default false)

peaceful_day (boolean, default false)

(Unique constraint on child_id + date)

redemptions (Used when parents buy a toy/give cash):

id (uuid)

child_id (uuid, FK)

amount (numeric)

date (timestamp)

5. Implementation Phases

AI Instructions: Execute these phases ONE AT A TIME. Do not move to the next phase until the user explicitly confirms the current phase is working. Ask for confirmation at the end of every phase.

Phase 1: Project Setup & Initialization

Initialize a new Expo project using npx create-expo-app@latest . --template blank-typescript.


Install standard dependencies: React Navigation (or setup Expo Router), Supabase client (@supabase/supabase-js), async-storage, and any UI libraries needed.

Create a strict folder structure:

/src/app (Screens / Routing)

/src/components (Reusable UI parts)

/src/lib (Supabase config, helpers)

/src/store (State management or context)

Set up src/lib/supabase.ts with placeholder environment variables for Supabase URL and Anon Key.

Phase 2: Supabase Auth & Database Config

Provide the SQL script to create the tables (profiles, children, daily_logs, redemptions) and Row Level Security (RLS) policies.

Create a simple Login/Signup screen for the parents. Since it's just two parents, standard Email/Password auth is sufficient.

Create an Auth Context (AuthContext.tsx) to protect the app screens from unauthenticated users.

Phase 3: Global State & Navigation

Implement a Bottom Tab Navigator with 3 tabs: Dashboard, Log Today, History.

Create a ChildContext or state manager. The app MUST have a global toggle (accessible in the header of almost every screen) to switch between Child 1 and Child 2.

Ensure the UI reacts to the toggle: If Child 1 is selected, primary UI elements use Teal. If Child 2 is selected, use Coral.

Phase 4: Dashboard Screen

Balance Card: Fetch all daily_logs for the selected child. Calculate total earnings (Count of all true booleans × 1.5). Fetch all redemptions for the child. Calculate current balance: Earnings - Redemptions. Display this prominently.

Redeem Button: A button that opens a modal allowing the parent to deduct Birr (e.g., inputting 50 Birr to subtract). This inserts a row into the redemptions table.

Today's Progress: Fetch today's daily_logs row. Show a progress indicator (e.g., 4/7 tasks complete).

Phase 5: Daily Logging Screen

Date Picker: Allow the user to select the date (defaults to today).

Task List: Render 7 toggle switches or large checkboxes for the tasks.

Real-time DB Sync: When a toggle is pressed, instantly update the daily_logs table in Supabase. Use Supabase upsert based on child_id and date.

Display dynamic text at the bottom: "Today's Earnings: [X] Birr" based on the currently toggled items on the screen.

Phase 6: History & Excel Import

History Tab: Implement a calendar or a scrolling list of past days, showing scores (e.g., "Oct 12: 7/7", "Oct 11: 5/7").

Legacy Import Component: Build a button that opens the device's file picker (expo-document-picker).

Parsing Logic: Accept a CSV or Excel file. The file will have columns: Date, Fajr, Dhuhr, Asr, Maghrib, Isha, Quran, PeacefulDay.

Map the rows, convert "1"s to true and "0"s to false, and batch insert/upsert them into the daily_logs table for the selected child.

Phase 7: Push Notifications (Reminders)

Set up expo-notifications.

Create a settings screen where the parent can pick a time (e.g., 8:00 PM).

Schedule a daily repeating local notification at that time.

Notification Text: "Did the kids have a peaceful day? Time to log today's activities!"

End of PRD.
(AI: Please acknowledge you have read this entire document. Await the user's command to begin Phase 1).
