### **PROJECT TITLE: Fitspark**

**One‑sentence pitch:** A real-time fitness tracking and coaching platform delivering data-driven workouts, goal-based routines, and social accountability for consistent progress.

---

### **1. OVERVIEW**

- **Goal:**
  - Help users consistently achieve fitness goals with adaptive, personalized training routines.
  - Provide trainers/coaches with live data from users to improve support and accountability.
  - Deliver an all-in-one platform combining workouts, biometrics, wearable data, and social motivation.
- **Key features:**
  - User & Trainer Role Management with real-time sync.
  - Workout Program Creation, Assignment, and Logging.
  - Wearable Integration (Apple Health, Google Fit, Whoop, etc.).
  - Live biometric tracking and adaptive workout feedback.
  - Trainer Dashboard with client progress and alerts.
- **Target users & success criteria:**
  - **Users:** Everyday fitness enthusiasts, athletes, personal trainers/coaches.
  - **Success Criteria:**
    - 5,000+ monthly active users within 6 months.
    - 75% weekly workout logging compliance.
    - 90% retention of onboarded trainers over 3 months.
    - Meaningful third-party integration with at least 3 major wearable providers.

---

### **2. TECH STACK (GOLDEN PATH)**

**Runtime:** Node (Firebase Cloud Functions)\
**Language:** TypeScript (strict)\
**Front‑end:** React + Vite\
**UI kit:** shadcn/ui\
**Styling:** Tailwind CSS\
**State / data fetching:** TanStack Query\
**Forms & validation:** React Hook Form + Zod resolver\
**Shared validation:** Zod\
**API layer:** tRPC\
**Backend services:** Firebase Auth · Firestore · Functions · Storage\
**Package manager / mono:** PNPM workspaces\
**Build orchestration:** Turborepo\
**Component workshop:** Storybook\
**Unit / component tests:** Vitest + Testing Library\
**Visual / interaction:** Storybook + @storybook/testing-library\
**End‑to‑end tests:** Playwright\
**Linting:** ESLint + eslint‑plugin‑perfectionist\
**Formatting:** Prettier\
**Type‑safe env vars:** T3 Env\
**Versioning / publishing:** Changesets\
**CI / CD:** GitHub Actions

---

### **3. MONOREPO LAYOUT (PNPM)**

```
.
├── apps/
│   └── web/              ← React front‑end (Users, Trainers, Admin)
├── functions/            ← Cloud Functions / tRPC routers
├── packages/
│   ├── shared/           ← Zod schemas, utilities, common types (e.g., WorkoutType)
│   └── seeding/          ← Emulator and testing data utils
├── docs/                 ← Project documentation
└── .github/              ← CI workflows
```

---

### **4. ARCHITECTURE**

**Client (React + TanStack Query)** ⇄ **tRPC (Cloud Functions)**\
**tRPC handlers** ⇄ **Firebase (Firestore, Auth, Storage)**

End-to-end type safety for fitness app workflows. Structured around routines, logs, users, and trainer dashboards.

---

### **5. DEPLOYMENT ARCHITECTURE**

Custom deployment script due to PNPM monorepo:

```javascript
// scripts/prepare-deploy.js
// Copy functions and shared to functions-deploy, modify workspace imports, build dist
```

**Directory Structure:**

```
functions-deploy/
├── dist/
├── shared/
├── src/
├── node_modules/
└── package.json
```

**firebase.json**

```json
{
  "functions": {
    "source": "functions-deploy",
    "runtime": "nodejs22"
  },
  "hosting": {
    "public": "apps/web/dist"
  }
}
```

---

### **6. DATA MODEL (FIRESTORE)**

| Entity             | Key fields                                                                      | Notes                                   |
| ------------------ | ------------------------------------------------------------------------------- | --------------------------------------- |
| **User**           | `uid`, `email`, `displayName`, `role` (`user`, `trainer`, `admin`), `avatarUrl` | Maps to Firebase Auth.                  |
| **TrainerProfile** | `userId`, `bio`, `certs`, `clientCount`, `status`                               | Trainer-specific data.                  |
| **WorkoutProgram** | `trainerId`, `title`, `phases[]`, `visibility`                                  | A structured plan with sessions/phases. |
| **WorkoutLog**     | `userId`, `programId`, `sessionId`, `timestamp`, `data`                         | Captures a logged workout session.      |
| **MetricSnapshot** | `userId`, `timestamp`, `heartRate`, `HRV`, `sleep`, `calories`, `steps`         | Aggregated wearable metrics.            |

**Security rules:**

- Users can access their own data.
- Trainers access client logs and programs they authored.
- Admins access everything.

**Index strategy:**

- Composite: (`userId`, `timestamp`) for logs & metrics.
- Composite: (`trainerId`, `createdAt`) for program filtering.

---

### **7. API DESIGN (tRPC)**

| Router      | Procedure       | Input                             | Output                  |
| ----------- | --------------- | --------------------------------- | ----------------------- |
| **user**    | `getProfile`    | `z.void()`                        | `User & TrainerProfile` |
|             | `updateProfile` | `userProfileSchema`               | `User`                  |
| **program** | `create`        | `createProgramSchema`             | `WorkoutProgram`        |
|             | `list`          | `z.void()`                        | `WorkoutProgram[]`      |
| **log**     | `create`        | `createWorkoutLogSchema`          | `WorkoutLog`            |
|             | `listForUser`   | `z.void()`                        | `WorkoutLog[]`          |
| **metrics** | `record`        | `metricSnapshotSchema`            | `MetricSnapshot`        |
|             | `getRecent`     | `z.object({ limit: z.number() })` | `MetricSnapshot[]`      |

**Error-handling:**

- `UNAUTHORIZED`, `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`

---

### **8. TESTING STRATEGY**

| Level / focus        | Toolset                                | Scope                                        |
| -------------------- | -------------------------------------- | -------------------------------------------- |
| Unit                 | Vitest                                 | Utils, Zod schemas, derived state            |
| Component            | Vitest + Testing Library               | React components (e.g., `ProgramCard`)       |
| Visual / interaction | Storybook + @storybook/testing‑library | UI states, user flows                        |
| End‑to‑end           | Playwright                             | Log workout, record metrics, trainer actions |

- **Seeding:** via `pnpm seed` into emulator.
- **Coverage goal:** 85%

---

### **9. CI / CD PIPELINE (GITHUB ACTIONS)**

1. On push/PR → set up PNPM, Turbo cache
2. `pnpm exec turbo run lint typecheck`
3. `pnpm exec turbo run test`
4. `pnpm exec turbo run build-storybook`
5. `pnpm exec turbo run e2e`
6. Deploy preview on PR
7. On merge to `main`: run Changesets → deploy production

```bash
# Deploy full app
pnpm run deploy --token ${{ secrets.FIREBASE_TOKEN }}
# Deploy only functions
pnpm run deploy:functions --token ${{ secrets.FIREBASE_TOKEN }}
```

---

### **10. ENVIRONMENTS & SECRETS**

| Env     | URL / Target                 | Notes                   |
| ------- | ---------------------------- | ----------------------- |
| local   | localhost:5173               | Emulator + T3 Env       |
| preview | fitspark--pr123-hash.web.app | Per PR, preview hosting |
| prod    | app.fitspark.io              | Main deployment         |

Secrets managed in GitHub + Firebase config (`firebase functions:config:set`)

---

### **11. PERFORMANCE & SCALABILITY**

- Denormalize user/trainer names into workout logs.
- Cache low-churn data like programs.
- Paginate logs/metrics.
- Tune cold start performance for metric ingestion Cloud Functions.

---

### **12. MONITORING & LOGGING**

| Concern   | Tool                 | Notes                                        |
| --------- | -------------------- | -------------------------------------------- |
| Errors    | Sentry               | Frontend/backend visibility                  |
| Logs      | Google Cloud Logging | Structured logs                              |
| Analytics | PostHog              | Funnels like `log_started` → `log_submitted` |

---

### **13. ACCESSIBILITY & I18N**

- WCAG 2.1 AA via shadcn/ui (Radix primitives)
- English-only MVP
- `react-i18next` for string management

---

### **14. CODE QUALITY & FORMATTING**

- ESLint + perfectionist + Prettier
- Husky pre-commit with lint-staged

---

### **15. OPEN QUESTIONS / RISKS**

| Item                                                       | Owner       | Resolution date |
| ---------------------------------------------------------- | ----------- | --------------- |
| Confirm wearable API data sync reliability and permissions | Tech Lead   | 2025-08-15      |
| Finalize trainer verification workflow & vetting           | Ops Lead    | 2025-08-01      |
| Evaluate cost of real-time biometric ingestion for scale   | Eng Manager | 2025-08-30      |

---

### **16. APPENDICES**

- **Setup:** `pnpm install` → `pnpm exec turbo run setup`
- **Branch model:** GitHub Flow
- **Links:**
  - Product Doc: `docs/product-doc.md`
  - Figma: [Link to Figma Project]
  - Storybook: [Deployed Link]
  - ADR Index: `docs/adr/`

---

### **🎉 MILESTONE 1 COMPLETION STATUS**

✅ **Milestone 1: Project Foundation & Setup** — **COMPLETED** (July 2025)

- ✅ Monorepo with PNPM + Turbo
- ✅ Firebase + React + Tailwind + shadcn
- ✅ tRPC API + Auth + Firestore
- ✅ CI/CD via GitHub Actions
- ✅ Logging & monitoring
- ✅ Testing infra
- ✅ Deployment pipeline

**Next:** Milestone 2 – Core User/Trainer onboarding and workout tracking flows.

---
