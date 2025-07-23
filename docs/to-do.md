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

🚀 Milestone 2: Core User & Auth Flow (MVP Part 1) - IN PROGRESS
Goal: Implement the complete user registration, login, and profile management using Firebase client SDK. This allows users to get into the system, which is the first critical step of the user journey.
Estimated Completion: August 22, 2025 (4 Weeks)

Week 1 (July 21 - July 27): Foundational UI & Auth Logic

[ ] PRIORITY 1: Install all necessary shadcn/ui components (button, input, label, card, form, select, toast).

[ ] PRIORITY 2: Build the LoginPage.tsx and SignupPage.tsx UI using shadcn/ui Form components.

[ ] PRIORITY 3: Connect the UI to Firebase Auth SDK functions using our existing AuthContext.

[ ] PRIORITY 4: Enhance the AuthContext to manage loading states and display errors via toasts.

[ ] Set up React Router for navigation between auth pages.

Week 2 (July 28 - Aug 3): Onboarding Form & Firebase Integration

[ ] HIGH RISK: Build the OnboardingPage.tsx with the multi-step questionnaire. Use React Hook Form for state management.

[ ] ✅ Create the Zod schema in packages/shared to validate all onboarding data. (COMPLETED)

[ ] Save onboarding data directly to Firestore using our Firebase hooks and AuthContext.

[ ] ✅ Implement strict Firestore security rules for the /users/{userId} path. (COMPLETED)

Week 3 (Aug 4 - Aug 10): Profile Management

[ ] Build the ProfilePage.tsx for users to view their data.

[ ] Use our existing Firebase hooks to fetch and display user profile data.

[ ] Add functionality to the ProfilePage.tsx to allow users to update their information using Firestore hooks.

Week 4 (Aug 11 - Aug 17): Testing & Refinement

[ ] Write Vitest/RTL tests for the LoginPage, SignupPage, and OnboardingPage components.

[ ] Write integration tests for the full signup -> onboard -> view profile flow.

[ ] Conduct a manual end-to-end test of the entire Milestone 2 feature set.

[ ] Polish all UI, add missing loading states, and handle edge cases.

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
