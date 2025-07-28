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

## ✅ Milestone 2: Core User & Auth Flow (MVP Part 1) - COMPLETED

**Goal:** Implement user registration, login, and profile management.
**Completed:** August 2025

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

## ✅ Milestone 3: Pre-defined Plan Selection (MVP Part 2) - PARTIALLY COMPLETED

**Goal:** Fitness plan selection and dashboard integration.
**Completed Tasks:** Firestore setup, PlanSelectionPage, ViewPlanPage, Dashboard updates.

## 🔄 Milestone 4: Workout Execution & Logging (MVP Part 3) - IN PROGRESS

**Goal:** Interactive workout sessions with real-time logging. Core engagement loop.  
**ETA:** September 26, 2025 (3 Weeks)

#### Epic 3: Workout Execution & Logging

**Week 1 (Aug 25 - Aug 31): Live Workout Interface**

- [ ] Create WorkoutPage.tsx for live workout sessions
- [ ] Build ExerciseCard component with set logging
- [ ] Implement automatic rest timer with countdown
- [ ] Add skip/replace exercise functionality
- [ ] Install Framer Motion for smooth transitions

**Week 2 (Sep 1 - Sep 7): Workout Logging & Data**

- [ ] Implement workout logging with Firestore hooks
- [ ] Create WorkoutSummaryPage.tsx for post-session review
- [ ] Add workout progress tracking (sets completed, total volume)
- [ ] Save activity logs to Firestore activityLogs collection

**Week 3 (Sep 8 - Sep 14): UX Polish & Animations**

- [ ] Add Framer Motion animations for exercise transitions
- [ ] Implement workout pause/resume functionality
- [ ] Add workout completion celebrations
- [ ] Polish loading states and error handling

---

### 📈 **Milestone 5: Progress Analytics & V1 Polish**

**Goal:** Visual progress tracking with charts and history. Internal alpha readiness.  
**ETA:** October 17, 2025 (3 Weeks)

#### Epic 4: Progress Monitoring

**Week 1 (Sep 15 - Sep 21): Progress Data & Charts**

- [ ] Install Recharts for data visualization
- [ ] Create ProgressPage.tsx with weight tracking
- [ ] Build WeightChart component using Recharts LineChart
- [ ] Implement weight logging functionality
- [ ] Add measurement tracking (optional: chest, waist, arms)

**Week 2 (Sep 22 - Sep 28): Workout Analytics**

- [ ] Create WorkoutVolumeChart using Recharts BarChart
- [ ] Build WorkoutHistoryList component
- [ ] Add weekly consistency tracker visualization
- [ ] Implement workout streak calculations

**Week 3 (Sep 29 - Oct 5): Dashboard vs Progress Page**

- [ ] Update Dashboard with action-oriented cards ("Today's Workout")
- [ ] Enhance ProgressPage with analysis-oriented charts
- [ ] Add weekly workout consistency tracker to Dashboard
- [ ] Polish chart animations and responsive design

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

## 🆕 Milestone 7: Testing & Code Quality Improvements

**Goal:** Achieve 70%+ test coverage, remove unused code, add comments for readability.
**ETA:** Current
**Tasks:**

- Add tests for dashboard, hooks, pages.
- Scan and remove unused dependencies/files.
- Add code comments to key files.
