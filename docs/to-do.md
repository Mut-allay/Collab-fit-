### **FITSPARK: PROJECT ROADMAP & TO-DO LIST**

This document outlines the development milestones and associated tasks for building the FitSpark MVP. The timeline is structured into focused sprints, prioritizing a logical build order from the foundational setup to core feature implementation and finally, launch readiness.

---

## ✅ Milestone 1: Project Foundation & Setup (Sprint 0) - COMPLETED

**Goal:**  
Establish the complete development environment, CI/CD pipeline, and project structure. This ensures the team has a solid, automated foundation before writing feature code.  
**Completed:** July 2025

---

### ✅ Completed Tasks:

---

#### **Infrastructure & DevOps**

- Initialize PNPM monorepo with Turborepo for build orchestration.
- Set up the Firebase project (`fitspark-prod`) with Auth, Firestore, Storage, and Cloud Functions enabled.
- Configure a parallel Firebase project (`fitspark-dev`) for testing and previews.
- Set up the basic CI/CD pipeline in GitHub Actions (lint, test, build).
- Configure secret management for API keys (Firebase) in GitHub Actions and Firebase Functions config.
- ✅ **Create custom deployment script** to fix workspace protocol issues in monorepo deployment.
- ✅ **Implement unified deployment commands** (`deploy`, `deploy:functions`) for streamlined CI/CD.

---

#### **Frontend & Backend Setup**

- Scaffold the React + Vite application within the `apps/web` directory.
- Integrate Tailwind CSS and set up the `tailwind.config.js` with initial design tokens (colors, fonts).
- Initialize `shadcn/ui` for the component library.
- Set up the tRPC server within the `functions` directory and connect it to the React client.
- Implement Firebase Authentication with email/password signup and login.
- Create protected routes and authentication context.
- Build basic user profile management with Firestore integration.

---

#### **Tooling & Quality**

- Configure ESLint and Prettier for consistent code quality.
- Set up Husky pre-commit hooks to run `lint-staged`.
- Create the initial Zod schemas for core data models (`User`, `FitnessPlan`) in the `packages/shared` directory.
- Implement proper error logging with centralized logger utility.
- Clean up console logs and establish logging best practices.
- ⚠️ Configure Vitest for unit/component testing and Storybook for visual development. _(Deferred to future milestone)_

### 🚧 **Milestone 2: Core User & Auth Flow (MVP Part 1)**

**Goal:** Implement complete user onboarding, login, and profile management. Enables personalized experiences.  
**ETA:** August 15, 2025 (4 Weeks)

#### To-Do List

**Authentication:**

- [ ] Build UI for Signup/Login pages
- [ ] Implement Firebase Auth (email/password, Google, Apple)
- [ ] Create protected routes for logged-in users

**Onboarding & Profile:**

- [ ] Multi-step onboarding form using React Hook Form + Zod
- [ ] tRPC endpoint to create user document in Firestore
- [ ] "My Profile" page for goals, stats, and preferences

**Security:**

- [ ] Firestore rules: users can only access their own data

---

### 🧠 **Milestone 3: Fitness Plan Generation (MVP Part 2)**

**Goal:** AI-powered fitness plan generation — core value proposition.  
**ETA:** September 5, 2025 (3 Weeks)

#### To-Do List

**Backend (AI Logic):**

- [ ] AI plan generation logic in tRPC procedure or Cloud Function
- [ ] `plan.generate` endpoint that returns a `FitnessPlan`
- [ ] Exercise library in Firestore + seeding script

**Frontend (UI/UX):**

- [ ] UI to display weekly workout plan
- [ ] Workout detail screen: exercises, sets, reps, rest
- [ ] "Generate New Plan" feature

---

### 🏋️‍♂️ **Milestone 4: Workout Tracking & Logging (MVP Part 3)**

**Goal:** Users can follow and log workouts. Core engagement loop.  
**ETA:** September 26, 2025 (3 Weeks)

#### To-Do List

**Workout Session UI:**

- [ ] Interactive "Live Workout" screen
- [ ] Logging UI: weight + reps per set
- [ ] Automatic rest timer
- [ ] Skip or replace exercise

**Data & Logic:**

- [ ] `activity.logWorkout` tRPC endpoint
- [ ] Firestore `onSnapshot` to sync session state (stretch goal)
- [ ] Post-session "Workout Summary" screen

---

### 📈 **Milestone 5: Progress Analytics & V1 Polish**

**Goal:** Visual feedback + polish for internal alpha.  
**ETA:** October 17, 2025 (3 Weeks)

#### To-Do List

**Progress Tracking:**

- [ ] "Progress" tab for weight/measurement logs
- [ ] Charts (Recharts) to show trends
- [ ] Workout history list view

**Admin & Polish:**

- [ ] Basic admin panel (users + exercise library)
- [ ] Conduct full internal Alpha test
- [ ] Bug/feedback triage and fix critical issues

---

### 💸 **Milestone 6: Freemium Model & Launch Readiness**

**Goal:** Monetization + launch prep.  
**ETA:** November 7, 2025 (3 Weeks)

#### To-Do List

**Monetization:**

- [ ] Integrate Stripe or Lemon Squeezy
- [ ] tRPC endpoints + webhooks for subscription status
- [ ] Paywall/Upgrade UI
- [ ] Gate premium features by subscription level

**Launch Prep:**

- [ ] Track funnel events via PostHog
- [ ] Prepare marketing assets + App Store/social pages
- [ ] Final Go/No-Go
- [ ] **LAUNCH FITSPARK MVP!** 🚀
