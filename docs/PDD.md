# FitSpark: Product Design & Technical Documentation

**Version:** 1.0  
**Last Updated:** January 2025  
**Status:** Production Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Product Design](#product-design)
4. [Technical Architecture](#technical-architecture)
5. [Technology Stack](#technology-stack)
6. [Data Models](#data-models)
7. [API Design](#api-design)
8. [Deployment Architecture](#deployment-architecture)
9. [Development Workflow](#development-workflow)
10. [Security & Compliance](#security--compliance)
11. [Future Roadmap](#future-roadmap)

---

## Executive Summary

**FitSpark** is a comprehensive fitness tracking and coaching platform that helps users achieve their fitness goals through structured workout plans, real-time activity tracking, social competition, and progress analytics. The platform combines personalized workout programs, Google Fit integration, team-based challenges, and detailed progress tracking to create an engaging fitness experience.

### Key Value Propositions

- **Personalized Fitness Plans**: Pre-defined workout programs tailored to user goals and experience levels
- **Real-Time Activity Tracking**: Integration with Google Fit for automatic step and calorie tracking
- **Social Engagement**: Team-based competitions with monthly leaderboards
- **Progress Analytics**: Comprehensive charts and metrics to track fitness improvements
- **Guided Workout Sessions**: Interactive workout logging with rest timers and exercise instructions

### Target Users

- **Primary**: Fitness enthusiasts (ages 18-45) seeking structured guidance without personal trainer costs
- **Secondary**: Corporate wellness programs and organizations
- **Tertiary**: Personal trainers and coaches (future expansion)

---

## Product Overview

### Vision Statement

To empower individuals to achieve their fitness goals through accessible, data-driven workout programs and social accountability.

### Core Features

1. **User Authentication & Profile Management**
   - Email/password and Google OAuth authentication
   - Comprehensive user profiles with fitness goals and metrics
   - Onboarding questionnaire for personalized recommendations

2. **Workout Plan Management**
   - Curated library of pre-defined workout programs
   - Plan selection based on goals (strength, weight loss, general fitness)
   - Difficulty levels: Beginner, Intermediate, Advanced
   - Multi-phase workout structures with progressive difficulty

3. **Interactive Workout Sessions**
   - Guided workout execution with exercise instructions
   - Set/rep/weight logging with rest timers
   - Real-time progress tracking during sessions
   - Workout completion summaries

4. **Progress Tracking & Analytics**
   - Weight tracking over time
   - Workout volume and strength progression charts
   - Workout history with detailed session logs
   - Consistency metrics and streaks

5. **Google Fit Integration**
   - Automatic step and calorie syncing
   - Daily activity logs from wearable devices
   - Background data synchronization

6. **Team Competition & Social Features**
   - Create and join fitness teams
   - Monthly leaderboards based on steps and calories
   - Team invitations and member management
   - Competitive rankings and achievements

7. **Dashboard & Quick Actions**
   - Today's workout overview
   - Weekly progress summary
   - Quick access to key features
   - Upcoming workout reminders

---

## Product Design

### User Journey



┌─────────────────────────────────────────────────────────────┐
│ Frontend (React) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Web App │ │ Routing │ │ State Mgmt │ │
│ │ (Vite) │ │ (React Router)│ │ (TanStack Q) │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
│ HTTP/REST
│
┌─────────────────────────────────────────────────────────────┐
│ Backend API (Express/Render) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Google Fit │ │ Leaderboard │ │ Scheduled │ │
│ │ Sync │ │ Updates │ │ Tasks │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
│ Firebase SDK
│
┌─────────────────────────────────────────────────────────────┐
│ Firebase Services │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Auth │ │ Firestore │ │ Storage │ │
│ │ │ │ (NoSQL) │ │ (Future) │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
### Monorepo Structure
fitspark/
├── apps/
│ └── web/ # React frontend application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Route-level page components
│ │ ├── contexts/ # React Context providers
│ │ ├── hooks/ # Custom React hooks
│ │ ├── lib/ # Utilities and services
│ │ └── assets/ # Static assets
│ └── package.json
│
├── api/ # Express backend server
│ ├── server.js # Main Express server
│ ├── sync-google-fit.js # Google Fit sync logic
│ ├── update-leaderboards.js # Leaderboard calculation
│ └── package.json
│
├── functions/ # Firebase Cloud Functions
│ ├── src/
│ │ └── .ts # TypeScript function handlers
│ └── package.json
│
├── packages/
│ ├── shared/ # Shared TypeScript types/schemas
│ │ └── src/
│ │ ├── schemas/ # Zod validation schemas
│ │ └── types/ # TypeScript type definitions
│ │
│ └── seeding/ # Database seeding scripts
│ └── scripts/
│ ├── seed-exercises.js
│ ├── seed-plans.js
│ └── seed-firestore.js
│
├── docs/ # Project documentation
├── firebase.json # Firebase configuration
├── turbo.json # Turborepo configuration
├── pnpm-workspace.yaml # PNPM workspace config
└── package.json # Root package.json
### Data Flow1. **User Authentication**   - User signs up/logs in via Firebase Auth   - Auth state managed by React Context   - Protected routes check authentication status2. **Workout Plan Selection**   - User browses plans from Firestore `workoutPrograms` collection   - Plan selection updates user profile   - Dashboard displays selected plan3. **Workout Execution**   - User starts workout session   - Exercises loaded from Firestore   - Sets/reps logged in real-time   - Workout log saved to `workoutLogs` collection4. **Google Fit Sync**   - User connects Google Fit account   - Backend API syncs data daily (cron job)   - Steps and calories stored in `dailyActivityLogs`   - Frontend displays synced data5. **Leaderboard Updates**   - Daily cron job calculates team stats   - Aggregates steps/calories from `dailyActivityLogs`   - Updates `monthlyLeaderboards` collection   - Frontend displays rankings---## Technology Stack### Frontend| Technology | Version | Purpose ||------------|---------|---------|| React | 19.1.0 | UI framework || TypeScript | ~5.8.3 | Type safety || Vite | ^7.0.4 | Build tool and dev server || Tailwind CSS | ^3.4.17 | Utility-first CSS framework || Framer Motion | ^12.0.3 | Animations and transitions || React Router DOM | ^6.30.0 | Client-side routing || TanStack Query | ^5.61.5 | Server state management || React Hook Form | ^7.60.0 | Form management || Zod | ^3.25.76 | Schema validation || Recharts | ^2.15.4 | Data visualization || Radix UI | Latest | Accessible UI primitives || Lucide React | ^0.460.0 | Icon library || Sonner | ^2.0.7 | Toast notifications |### Backend| Technology | Version | Purpose ||------------|---------|---------|| Express | ^4.18.2 | Web server framework || Node.js | >=18 | Runtime environment || Firebase Admin SDK | ^10.7.1 | Backend Firebase access || Google APIs | ^128.0.0 | Google Fit integration || node-cron | ^3.0.3 | Scheduled tasks || CORS | ^2.8.5 | Cross-origin resource sharing |### Infrastructure| Service | Purpose ||---------|---------|| Firebase Authentication | User authentication || Firestore | NoSQL database || Firebase Hosting | Static site hosting || Firebase Storage | File storage (future) || Render | Backend API hosting || Google Fit API | Activity data integration |### Development Tools| Tool | Purpose ||------|---------|| Turborepo | Monorepo build system || PNPM | Package manager || ESLint | Code linting || Prettier | Code formatting || Vitest | Unit testing || React Testing Library | Component testing || TypeScript | Type checking |---## Data Models### Firestore Collections#### `users` Collection{  uid: string;                    // Firebase Auth UID  email: string;  displayName?: string;  photoURL?: string;    // Onboarding data  goal?: "lose_weight" | "gain_muscle" | "improve_fitness";  activityLevel?: "beginner" | "intermediate" | "advanced";  gender?: "male" | "female" | "prefer_not_to_say";  age?: number;  height?: number;                 // in cm  weight?: number;                 // in kg    // Plan selection  selectedPlanId?: string;  onboardingCompleted: boolean;    // Google Fit integration  googleFitConnected: boolean;  googleFitRefreshToken?: string;  googleFitAccessToken?: string;  googleFitTokenExpiry?: Timestamp;  googleFitLastSync?: Timestamp;    // Timestamps  createdAt: Timestamp;  updatedAt: Timestamp;}
workoutPrograms Collection
{
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: "strength" | "weight_loss" | "general_fitness";
  durationWeeks: number;
  sessionsPerWeek: number;
  visibility: "public" | "private";
  
  phases: Array<{
    id: string;
    name: string;
    dayOfWeek?: number;            // 0-6 (Sunday-Saturday)
    exercises: Array<{
      exerciseId: string;
      exerciseName: string;
      sets: number;
      reps: number | string;        // e.g., "8-10" or 12
      weight?: number;              // Optional target weight
      restTime: number;              // seconds
      notes?: string;
    }>;
  }>;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

exercises Collection
{
  id: string;
  name: string;
  description: string;
  category: "strength" | "cardio" | "flexibility";
  muscleGroups: string[];           // e.g., ["chest", "triceps"]
  equipment: string[];              // e.g., ["bodyweight", "dumbbells"]
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
}


workoutLogs Collection
{
  id: string;
  userId: string;
  workoutPlanId: string;
  phaseId: string;
  phaseName: string;
  
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number;                 // seconds
  
  sets: Array<{
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    reps: number;
    weight: number;                 // 0 for bodyweight
    restTime: number;               // actual rest taken
  }>;
  
  totalVolume: number;              // total weight lifted
  notes?: string;
  
  createdAt: Timestamp;
}

dailyActivityLogs Collection
{
  id: string;                       // Format: "{userId}_{date}"
  userId: string;
  date: string;                     // ISO date string (YYYY-MM-DD)
  steps: number;
  calories: number;                 // kcal
  source: "google_fit" | "manual";
  syncedAt: Timestamp;
  lastUpdated: Timestamp;
}

teams Collection
{
  id: string;
  name: string;
  description?: string;
  createdBy: string;                // User ID
  memberIds: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

teamInvitations Collection
{
  id: string;
  teamId: string;
  teamName: string;
  invitedBy: string;                // User ID
  invitedUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Timestamp;
  respondedAt?: Timestamp;
}



monthlyLeaderboards Collection
{
  id: string;                       // Format: "{year}-{month}"
  month: string;                    // e.g., "January"
  year: number;
  
  teams: Array<{
    teamId: string;
    teamName: string;
    totalSteps: number;
    totalCalories: number;
    memberCount: number;
    members: Array<{
      userId: string;
      displayName: string;
      steps: number;
      calories: number;
    }>;
  }>;
  
  lastUpdated: Timestamp;
}


Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workout logs - users can only access their own
    match /workoutLogs/{logId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
    
    // Daily activity logs - users can only access their own
    match /dailyActivityLogs/{logId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
    
    // Exercise library - read-only for authenticated users
    match /exercises/{exerciseId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    // Workout programs - read-only for authenticated users
    match /workoutPrograms/{programId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    // Teams - members can read, creators can write
    match /teams/{teamId} {
      allow read: if request.auth != null &&
        request.auth.uid in resource.data.memberIds;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }
    
    // Team invitations - users can read their own invitations
    match /teamInvitations/{invitationId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.invitedUserId ||
         request.auth.uid == resource.data.invitedBy);
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        request.auth.uid == resource.data.invitedUserId;
    }
    
    // Leaderboards - read-only for authenticated users
    match /monthlyLeaderboards/{leaderboardId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }
  }
}


API Design
Backend API Endpoints (Express Server)
Health Check
GET /health
Response: { status: "ok", timestamp: "ISO string" }




Google Fit Sync
POST /api/sync-google-fit
Headers: Authorization: Bearer {API_SECRET_KEY}
Response: {
  message: "Sync completed",
  results: Array<{ userId: string, status: "success" | "error" }>,
  syncedUsers: number
}

Leaderboard Update
POST /api/update-leaderboards
Headers: 
  Authorization: Bearer {API_SECRET_KEY}
  Content-Type: application/json
Body: { month: "January", year: 2025 }
Response: {
  message: "Leaderboard updated successfully",
  teamsCount: number,
  month: string,
  year: number
}


Scheduled Tasks (Cron Jobs)
Google Fit Sync
Schedule: Daily at 12:00 PM UTC
Function: performGoogleFitSync()
Purpose: Sync steps and calories for all connected users
Leaderboard Update
Schedule: Daily at midnight UTC
Function: performLeaderboardUpdate(month, year)
Purpose: Calculate and update monthly team rankings
Frontend API Integration
The frontend uses Firebase SDK directly for most operations:
Authentication: Firebase Auth SDK
Database Operations: Firestore SDK
Real-time Updates: Firestore listeners
Backend API Calls: Fetch API for scheduled tasks
Deployment Architecture
Infrastructure Overview
┌─────────────────────────────────────────────────┐│         Firebase Hosting (Frontend)            ││         fitspark-staging.web.app               ││         fitspark-production.web.app            │└─────────────────────────────────────────────────┘                    │                    │ HTTPS                    │┌─────────────────────────────────────────────────┐│         Render (Backend API)                    ││         fitspark-api.onrender.com               ││         - Express Server                        ││         - Cron Jobs (node-cron)                 │└─────────────────────────────────────────────────┘                    │                    │ Firebase SDK                    │┌─────────────────────────────────────────────────┐│         Firebase Services                       ││         - Authentication                        ││         - Firestore Database                    ││         - Cloud Functions (optional)            │└─────────────────────────────────────────────────┘
Deployment Environments
Staging Environment
Frontend URL: https://fitspark-staging.web.app
Firebase Project: fitspark-staging
Backend: Same Render service (can be separated)
Purpose: Testing and QA
Production Environment
Frontend URL: https://fitspark-production.web.app
Firebase Project: fitspark-production
Backend: Same Render service
Purpose: Live user-facing application
Deployment Process
Frontend Deployment
   # Build for staging   pnpm run build:staging --filter=@fitspark/web   firebase use fitspark-staging   firebase deploy --only hosting      # Build for production   pnpm run build:production --filter=@fitspark/web   firebase use fitspark-production   firebase deploy --only hosting
Backend Deployment
Automatic via Render (connected to GitHub)
Manual: Push to main branch triggers deployment
Environment variables configured in Render dashboard
Database Seeding
   cd packages/seeding   node scripts/seed-firestore.js
Environment Variables
Frontend (.env.staging / .env.production)
VITE_FIREBASE_API_KEY=VITE_FIREBASE_AUTH_DOMAIN=VITE_FIREBASE_PROJECT_ID=VITE_FIREBASE_STORAGE_BUCKET=VITE_FIREBASE_MESSAGING_SENDER_ID=VITE_FIREBASE_APP_ID=VITE_FIREBASE_MEASUREMENT_ID=VITE_API_BASE_URL=https://fitspark-api.onrender.comVITE_API_SECRET_KEY=
Backend (Render Environment Variables)
FIREBASE_API_KEY=FIREBASE_AUTH_DOMAIN=FIREBASE_PROJECT_ID=FIREBASE_STORAGE_BUCKET=FIREBASE_MESSAGING_SENDER_ID=FIREBASE_APP_ID=FIREBASE_MEASUREMENT_ID=GOOGLE_CLIENT_ID=GOOGLE_CLIENT_SECRET=API_SECRET_KEY=PORT=3000
Development Workflow
Getting Started
Prerequisites
Node.js >= 18
PNPM >= 8
Firebase CLI
Git
Installation
   git clone <repository-url>   cd Fitness-application   pnpm install
Environment Setup
Copy .env.example to .env.staging and .env.production
Configure Firebase credentials
Set up Google OAuth credentials
Development
   # Start development server   pnpm dev      # Run in specific package   pnpm --filter @fitspark/web dev
Building
   # Build all packages   pnpm build      # Build for specific environment   pnpm build:staging   pnpm build:production
Code Organization
Components: Reusable UI components in apps/web/src/components/
Pages: Route-level components in apps/web/src/pages/
Hooks: Custom React hooks in apps/web/src/hooks/
Contexts: Global state management in apps/web/src/contexts/
Lib: Utilities and services in apps/web/src/lib/
Shared Types: Common schemas in packages/shared/src/
Testing
# Run all testspnpm test# Run tests with coveragepnpm test:coverage# Run tests in watch modepnpm test:watch# Type checkingpnpm typecheck# Lintingpnpm lint
Git Workflow
Main Branch: Production-ready code
Dev Branch: Integration branch for features
Feature Branches: feature/feature-name
Hotfix Branches: hotfix/issue-name
Security & Compliance
Authentication Security
Firebase Authentication handles password hashing
OAuth 2.0 for Google sign-in
JWT tokens for session management
Protected routes require authentication
Data Security
Firestore security rules enforce data access
Users can only access their own data
API endpoints protected with secret keys
Environment variables for sensitive data
API Security
Bearer token authentication for backend API
CORS configured for allowed origins
Rate limiting (future enhancement)
Input validation with Zod schemas
Privacy
User data stored securely in Firestore
Google Fit data synced with user consent
No third-party data sharing
GDPR compliance considerations (future)
Future Roadmap
Phase 2 Features
AI-Powered Plan Generation
Machine learning-based workout recommendations
Adaptive plans based on user progress
Personalized exercise suggestions
Nutrition Tracking
Meal logging and calorie tracking
Macro nutrient tracking
Food database integration
Social Features
User profiles and following
Workout sharing and comments
Community challenges
Mobile Applications
React Native iOS app
React Native Android app
Offline workout logging
Advanced Analytics
Predictive analytics for progress
Injury prevention recommendations
Performance optimization insights
Trainer/Coach Features
Trainer dashboard
Client management
Custom plan creation
Progress monitoring tools
Technical Improvements
Performance Optimization
Code splitting and lazy loading
Image optimization
Caching strategies
Scalability
Database indexing optimization
CDN integration
Load balancing
Monitoring
Error tracking (Sentry)
Performance monitoring
User analytics
Testing
E2E testing with Playwright
Visual regression testing
Performance testing
Appendix
Key Metrics & KPIs
User Engagement: Daily/Monthly Active Users
Retention: Week-over-week retention rate
Workout Completion: Percentage of started workouts completed
Google Fit Integration: Percentage of users connected
Team Participation: Active teams and members
Performance: Page load times, API response times
Support & Resources
Documentation: /docs directory
Deployment Guide: docs/DEPLOYMENT_GUIDE.md
User Stories: docs/user-stories&epics.md
Technical Specs: docs/technical-doc.md
Project Overview: docs/PROJECT_OVERVIEW.md
Contact
For questions or support, refer to the project repository or contact the development team.
Document Version: 1.0
Last Updated: January 2025
Maintained By: FitSpark Development Team
This document covers:1. **Product Overview**: Vision, features, target users2. **Product Design**: User journeys, page structure, design system3. **Technical Architecture**: System architecture, monorepo structure, data flow4. **Technology Stack**: Frontend, backend, infrastructure, dev tools5. **Data Models**: Firestore collections with TypeScript types6. **API Design**: Backend endpoints and scheduled tasks7. **Deployment**: Infrastructure, environments, deployment process8. **Development Workflow**: Setup, code organization, testing, Git workflow9. **Security**: Authentication, data security, API security, privacy10. **Future Roadmap**: Planned features and technical improvementsSave this as `docs/PRODUCT_DESIGN_AND_TECHNICAL_DOC.md` in your project. Should I create this file or make any adjustments?
prepare this in a .md file format 

Markdown content for the product design and technical document:
# FitSpark: Product Design & Technical Documentation**Version:** 1.0  **Last Updated:** January 2025  **Status:** Production Ready---## Table of Contents1. [Executive Summary](#executive-summary)2. [Product Overview](#product-overview)3. [Product Design](#product-design)4. [Technical Architecture](#technical-architecture)5. [Technology Stack](#technology-stack)6. [Data Models](#data-models)7. [API Design](#api-design)8. [Deployment Architecture](#deployment-architecture)9. [Development Workflow](#development-workflow)10. [Security & Compliance](#security--compliance)11. [Future Roadmap](#future-roadmap)---## Executive Summary**FitSpark** is a comprehensive fitness tracking and coaching platform that helps users achieve their fitness goals through structured workout plans, real-time activity tracking, social competition, and progress analytics. The platform combines personalized workout programs, Google Fit integration, team-based challenges, and detailed progress tracking to create an engaging fitness experience.### Key Value Propositions- **Personalized Fitness Plans**: Pre-defined workout programs tailored to user goals and experience levels- **Real-Time Activity Tracking**: Integration with Google Fit for automatic step and calorie tracking- **Social Engagement**: Team-based competitions with monthly leaderboards- **Progress Analytics**: Comprehensive charts and metrics to track fitness improvements- **Guided Workout Sessions**: Interactive workout logging with rest timers and exercise instructions### Target Users- **Primary**: Fitness enthusiasts (ages 18-45) seeking structured guidance without personal trainer costs- **Secondary**: Corporate wellness programs and organizations- **Tertiary**: Personal trainers and coaches (future expansion)---## Product Overview### Vision StatementTo empower individuals to achieve their fitness goals through accessible, data-driven workout programs and social accountability.### Core Features1. **User Authentication & Profile Management**   - Email/password and Google OAuth authentication   - Comprehensive user profiles with fitness goals and metrics   - Onboarding questionnaire for personalized recommendations2. **Workout Plan Management**   - Curated library of pre-defined workout programs   - Plan selection based on goals (strength, weight loss, general fitness)   - Difficulty levels: Beginner, Intermediate, Advanced   - Multi-phase workout structures with progressive difficulty3. **Interactive Workout Sessions**   - Guided workout execution with exercise instructions   - Set/rep/weight logging with rest timers   - Real-time progress tracking during sessions   - Workout completion summaries4. **Progress Tracking & Analytics**   - Weight tracking over time   - Workout volume and strength progression charts   - Workout history with detailed session logs   - Consistency metrics and streaks5. **Google Fit Integration**   - Automatic step and calorie syncing   - Daily activity logs from wearable devices   - Background data synchronization6. **Team Competition & Social Features**   - Create and join fitness teams   - Monthly leaderboards based on steps and calories   - Team invitations and member management   - Competitive rankings and achievements7. **Dashboard & Quick Actions**   - Today's workout overview   - Weekly progress summary   - Quick access to key features   - Upcoming workout reminders---## Product Design### User Journey
Landing Page → Sign Up/Login → Onboarding → Plan Selection → Dashboard → Workout Session → Progress Tracking
### Page Structure#### Public Pages**Landing Page (`/`)**- Marketing-focused homepage- Feature showcase- Testimonials and social proof- Call-to-action for sign-up**Login Page (`/login`)**- Email/password authentication- Google OAuth option- Password recovery (future)**Sign Up Page (`/signup`)**- User registration form- Email verification flow- Terms and conditions acceptance**Data Verification Page (`/verify`)**- Email verification confirmation- Account activation#### Authenticated Pages**Dashboard (`/dashboard`)**- Today's workout card with "Start Workout" CTA- Weekly consistency tracker- Quick stats overview- Navigation to key features**Plan Selection (`/plans`)**- Grid/list view of available workout programs- Filter by goal, difficulty, duration- Plan preview and selection**View Plan (`/plans/:planId`)**- Detailed plan overview- Weekly schedule breakdown- Exercise list and descriptions- "Start Workout" functionality**Workout Session (`/workout/:planId/:phaseId`)**- Exercise-by-exercise guidance- Set/rep/weight logging interface- Rest timer between sets- Progress indicator- Complete workout button**Workout Summary (`/workout-summary/:planId/:phaseId`)**- Session completion summary- Total volume lifted- Duration and performance metrics- Return to dashboard option**Progress Page (`/progress`)**- Weight trend chart (line graph)- Workout volume chart (bar graph)- Strength progression metrics- Time range filters (weekly, monthly, all-time)**Workout History (`/workout-history`)**- Calendar view of completed workouts- Detailed workout logs- Filter and search functionality- Individual workout details modal**Profile Page (`/profile`)**- User information form- Calculated stats (BMI, streaks)- Motivational stats (total workouts, time spent)- App settings and preferences- Account management (logout, delete account)**Teams Page (`/teams`)**- List of user's teams- Create new team option- Team member management- Team statistics**Create Team (`/teams/create`)**- Team creation form- Team name and description- Privacy settings**Leaderboard (`/leaderboard`)**- Monthly team rankings- Individual team member stats- Filter by month/year- Achievement badges**Invitations (`/invitations`)**- Pending team invitations- Accept/decline functionality- Notification management### Design System#### Color Palette- **Primary Brand Color**: Spark Green (`#10b981`, `#059669`)- **Background**: Dark theme with gradient overlays- **Accent Colors**: Cyan (`#06b6d4`) for highlights- **Text**: White/light gray on dark backgrounds#### Typography- **Primary Font**: Manrope (sans-serif)- **Display Font**: Pacifico (for headings and branding)- **Font Sizes**: Responsive scale from 12px to 48px#### Component LibraryBuilt on **Radix UI** primitives with **Tailwind CSS**:- Buttons (primary, secondary, outline, ghost)- Cards and containers- Forms (inputs, selects, checkboxes)- Dialogs and modals- Dropdown menus- Tabs and navigation- Toast notifications- Charts (Recharts)#### Responsive Design- **Mobile-first** approach- Breakpoints:  - Mobile: < 640px  - Tablet: 640px - 1024px  - Desktop: > 1024px---## Technical Architecture### System Architecture
┌─────────────────────────────────────────────────────────────┐
│ Frontend (React) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Web App │ │ Routing │ │ State Mgmt │ │
│ │ (Vite) │ │ (React Router)│ │ (TanStack Q) │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
│ HTTP/REST
│
┌─────────────────────────────────────────────────────────────┐
│ Backend API (Express/Render) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Google Fit │ │ Leaderboard │ │ Scheduled │ │
│ │ Sync │ │ Updates │ │ Tasks │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
│ Firebase SDK
│
┌─────────────────────────────────────────────────────────────┐
│ Firebase Services │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Auth │ │ Firestore │ │ Storage │ │
│ │ │ │ (NoSQL) │ │ (Future) │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
### Monorepo Structure
fitspark/
├── apps/
│ └── web/ # React frontend application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Route-level page components
│ │ ├── contexts/ # React Context providers
│ │ ├── hooks/ # Custom React hooks
│ │ ├── lib/ # Utilities and services
│ │ └── assets/ # Static assets
│ └── package.json
│
├── api/ # Express backend server
│ ├── server.js # Main Express server
│ ├── sync-google-fit.js # Google Fit sync logic
│ ├── update-leaderboards.js # Leaderboard calculation
│ └── package.json
│
├── functions/ # Firebase Cloud Functions
│ ├── src/
│ │ └── .ts # TypeScript function handlers
│ └── package.json
│
├── packages/
│ ├── shared/ # Shared TypeScript types/schemas
│ │ └── src/
│ │ ├── schemas/ # Zod validation schemas
│ │ └── types/ # TypeScript type definitions
│ │
│ └── seeding/ # Database seeding scripts
│ └── scripts/
│ ├── seed-exercises.js
│ ├── seed-plans.js
│ └── seed-firestore.js
│
├── docs/ # Project documentation
├── firebase.json # Firebase configuration
├── turbo.json # Turborepo configuration
├── pnpm-workspace.yaml # PNPM workspace config
└── package.json # Root package.json
### Data Flow1. **User Authentication**   - User signs up/logs in via Firebase Auth   - Auth state managed by React Context   - Protected routes check authentication status2. **Workout Plan Selection**   - User browses plans from Firestore `workoutPrograms` collection   - Plan selection updates user profile   - Dashboard displays selected plan3. **Workout Execution**   - User starts workout session   - Exercises loaded from Firestore   - Sets/reps logged in real-time   - Workout log saved to `workoutLogs` collection4. **Google Fit Sync**   - User connects Google Fit account   - Backend API syncs data daily (cron job)   - Steps and calories stored in `dailyActivityLogs`   - Frontend displays synced data5. **Leaderboard Updates**   - Daily cron job calculates team stats   - Aggregates steps/calories from `dailyActivityLogs`   - Updates `monthlyLeaderboards` collection   - Frontend displays rankings---## Technology Stack### Frontend| Technology | Version | Purpose ||------------|---------|---------|| React | 19.1.0 | UI framework || TypeScript | ~5.8.3 | Type safety || Vite | ^7.0.4 | Build tool and dev server || Tailwind CSS | ^3.4.17 | Utility-first CSS framework || Framer Motion | ^12.0.3 | Animations and transitions || React Router DOM | ^6.30.0 | Client-side routing || TanStack Query | ^5.61.5 | Server state management || React Hook Form | ^7.60.0 | Form management || Zod | ^3.25.76 | Schema validation || Recharts | ^2.15.4 | Data visualization || Radix UI | Latest | Accessible UI primitives || Lucide React | ^0.460.0 | Icon library || Sonner | ^2.0.7 | Toast notifications |### Backend| Technology | Version | Purpose ||------------|---------|---------|| Express | ^4.18.2 | Web server framework || Node.js | >=18 | Runtime environment || Firebase Admin SDK | ^10.7.1 | Backend Firebase access || Google APIs | ^128.0.0 | Google Fit integration || node-cron | ^3.0.3 | Scheduled tasks || CORS | ^2.8.5 | Cross-origin resource sharing |### Infrastructure| Service | Purpose ||---------|---------|| Firebase Authentication | User authentication || Firestore | NoSQL database || Firebase Hosting | Static site hosting || Firebase Storage | File storage (future) || Render | Backend API hosting || Google Fit API | Activity data integration |### Development Tools| Tool | Purpose ||------|---------|| Turborepo | Monorepo build system || PNPM | Package manager || ESLint | Code linting || Prettier | Code formatting || Vitest | Unit testing || React Testing Library | Component testing || TypeScript | Type checking |---## Data Models### Firestore Collections#### `users` Collection{  uid: string;                    // Firebase Auth UID  email: string;  displayName?: string;  photoURL?: string;    // Onboarding data  goal?: "lose_weight" | "gain_muscle" | "improve_fitness";  activityLevel?: "beginner" | "intermediate" | "advanced";  gender?: "male" | "female" | "prefer_not_to_say";  age?: number;  height?: number;                 // in cm  weight?: number;                 // in kg    // Plan selection  selectedPlanId?: string;  onboardingCompleted: boolean;    // Google Fit integration  googleFitConnected: boolean;  googleFitRefreshToken?: string;  googleFitAccessToken?: string;  googleFitTokenExpiry?: Timestamp;  googleFitLastSync?: Timestamp;    // Timestamps  createdAt: Timestamp;  updatedAt: Timestamp;}
workoutPrograms Collection
{  id: string;  title: string;  description: string;  difficulty: "beginner" | "intermediate" | "advanced";  goal: "strength" | "weight_loss" | "general_fitness";  durationWeeks: number;  sessionsPerWeek: number;  visibility: "public" | "private";    phases: Array<{    id: string;    name: string;    dayOfWeek?: number;            // 0-6 (Sunday-Saturday)    exercises: Array<{      exerciseId: string;      exerciseName: string;      sets: number;      reps: number | string;        // e.g., "8-10" or 12      weight?: number;              // Optional target weight      restTime: number;              // seconds      notes?: string;    }>;  }>;    createdAt: Timestamp;  updatedAt: Timestamp;}
exercises Collection
{  id: string;  name: string;  description: string;  category: "strength" | "cardio" | "flexibility";  muscleGroups: string[];           // e.g., ["chest", "triceps"]  equipment: string[];              // e.g., ["bodyweight", "dumbbells"]  instructions: string[];  videoUrl?: string;  imageUrl?: string;}
workoutLogs Collection
{  id: string;  userId: string;  workoutPlanId: string;  phaseId: string;  phaseName: string;    startTime: Timestamp;  endTime: Timestamp;  duration: number;                 // seconds    sets: Array<{    exerciseId: string;    exerciseName: string;    setNumber: number;    reps: number;    weight: number;                 // 0 for bodyweight    restTime: number;               // actual rest taken  }>;    totalVolume: number;              // total weight lifted  notes?: string;    createdAt: Timestamp;}
dailyActivityLogs Collection
{  id: string;                       // Format: "{userId}_{date}"  userId: string;  date: string;                     // ISO date string (YYYY-MM-DD)  steps: number;  calories: number;                 // kcal  source: "google_fit" | "manual";  syncedAt: Timestamp;  lastUpdated: Timestamp;}
teams Collection
{  id: string;  name: string;  description?: string;  createdBy: string;                // User ID  memberIds: string[];  isActive: boolean;  createdAt: Timestamp;  updatedAt: Timestamp;}
teamInvitations Collection
{  id: string;  teamId: string;  teamName: string;  invitedBy: string;                // User ID  invitedUserId: string;  status: "pending" | "accepted" | "declined";  createdAt: Timestamp;  respondedAt?: Timestamp;}
monthlyLeaderboards Collection
{  id: string;                       // Format: "{year}-{month}"  month: string;                    // e.g., "January"  year: number;    teams: Array<{    teamId: string;    teamName: string;    totalSteps: number;    totalCalories: number;    memberCount: number;    members: Array<{      userId: string;      displayName: string;      steps: number;      calories: number;    }>;  }>;    lastUpdated: Timestamp;}
Security Rules
rules_version = '2';service cloud.firestore {  match /databases/{database}/documents {    // Users can read/write their own profile    match /users/{userId} {      allow read, write: if request.auth != null && request.auth.uid == userId;    }        // Workout logs - users can only access their own    match /workoutLogs/{logId} {      allow read, write: if request.auth != null &&        resource.data.userId == request.auth.uid;    }        // Daily activity logs - users can only access their own    match /dailyActivityLogs/{logId} {      allow read, write: if request.auth != null &&        resource.data.userId == request.auth.uid;    }        // Exercise library - read-only for authenticated users    match /exercises/{exerciseId} {      allow read: if request.auth != null;      allow write: if false;    }        // Workout programs - read-only for authenticated users    match /workoutPrograms/{programId} {      allow read: if request.auth != null;      allow write: if false;    }        // Teams - members can read, creators can write    match /teams/{teamId} {      allow read: if request.auth != null &&        request.auth.uid in resource.data.memberIds;      allow create: if request.auth != null;      allow update, delete: if request.auth != null &&        request.auth.uid == resource.data.createdBy;    }        // Team invitations - users can read their own invitations    match /teamInvitations/{invitationId} {      allow read: if request.auth != null &&        (request.auth.uid == resource.data.invitedUserId ||         request.auth.uid == resource.data.invitedBy);      allow create: if request.auth != null;      allow update: if request.auth != null &&        request.auth.uid == resource.data.invitedUserId;    }        // Leaderboards - read-only for authenticated users    match /monthlyLeaderboards/{leaderboardId} {      allow read: if request.auth != null;      allow write: if false; // Only backend can write    }  }}
API Design
Backend API Endpoints (Express Server)
Health Check
GET /healthResponse: { status: "ok", timestamp: "ISO string" }
Google Fit Sync
POST /api/sync-google-fitHeaders: Authorization: Bearer {API_SECRET_KEY}Response: {  message: "Sync completed",  results: Array<{ userId: string, status: "success" | "error" }>,  syncedUsers: number}
Leaderboard Update
POST /api/update-leaderboardsHeaders:   Authorization: Bearer {API_SECRET_KEY}  Content-Type: application/jsonBody: { month: "January", year: 2025 }Response: {  message: "Leaderboard updated successfully",  teamsCount: number,  month: string,  year: number}
Scheduled Tasks (Cron Jobs)
Google Fit Sync
Schedule: Daily at 12:00 PM UTC
Function: performGoogleFitSync()
Purpose: Sync steps and calories for all connected users
Leaderboard Update
Schedule: Daily at midnight UTC
Function: performLeaderboardUpdate(month, year)
Purpose: Calculate and update monthly team rankings
Frontend API Integration
The frontend uses Firebase SDK directly for most operations:
Authentication: Firebase Auth SDK
Database Operations: Firestore SDK
Real-time Updates: Firestore listeners
Backend API Calls: Fetch API for scheduled tasks
Deployment Architecture
Infrastructure Overview
┌─────────────────────────────────────────────────┐│         Firebase Hosting (Frontend)            ││         fitspark-staging.web.app               ││         fitspark-production.web.app            │└─────────────────────────────────────────────────┘                    │                    │ HTTPS                    │┌─────────────────────────────────────────────────┐│         Render (Backend API)                    ││         fitspark-api.onrender.com               ││         - Express Server                        ││         - Cron Jobs (node-cron)                 │└─────────────────────────────────────────────────┘                    │                    │ Firebase SDK                    │┌─────────────────────────────────────────────────┐│         Firebase Services                       ││         - Authentication                        ││         - Firestore Database                    ││         - Cloud Functions (optional)            │└─────────────────────────────────────────────────┘
Deployment Environments
Staging Environment
Frontend URL: https://fitspark-staging.web.app
Firebase Project: fitspark-staging
Backend: Same Render service (can be separated)
Purpose: Testing and QA
Production Environment
Frontend URL: https://fitspark-production.web.app
Firebase Project: fitspark-production
Backend: Same Render service
Purpose: Live user-facing application
Deployment Process
Frontend Deployment
   # Build for staging   pnpm run build:staging --filter=@fitspark/web   firebase use fitspark-staging   firebase deploy --only hosting      # Build for production   pnpm run build:production --filter=@fitspark/web   firebase use fitspark-production   firebase deploy --only hosting
Backend Deployment
Automatic via Render (connected to GitHub)
Manual: Push to main branch triggers deployment
Environment variables configured in Render dashboard
Database Seeding
   cd packages/seeding   node scripts/seed-firestore.js
Environment Variables
Frontend (.env.staging / .env.production)
VITE_FIREBASE_API_KEY=VITE_FIREBASE_AUTH_DOMAIN=VITE_FIREBASE_PROJECT_ID=VITE_FIREBASE_STORAGE_BUCKET=VITE_FIREBASE_MESSAGING_SENDER_ID=VITE_FIREBASE_APP_ID=VITE_FIREBASE_MEASUREMENT_ID=VITE_API_BASE_URL=https://fitspark-api.onrender.comVITE_API_SECRET_KEY=
Backend (Render Environment Variables)
FIREBASE_API_KEY=FIREBASE_AUTH_DOMAIN=FIREBASE_PROJECT_ID=FIREBASE_STORAGE_BUCKET=FIREBASE_MESSAGING_SENDER_ID=FIREBASE_APP_ID=FIREBASE_MEASUREMENT_ID=GOOGLE_CLIENT_ID=GOOGLE_CLIENT_SECRET=API_SECRET_KEY=PORT=3000
Development Workflow
Getting Started
Prerequisites
Node.js >= 18
PNPM >= 8
Firebase CLI
Git
Installation
   git clone <repository-url>   cd Fitness-application   pnpm install
Environment Setup
Copy .env.example to .env.staging and .env.production
Configure Firebase credentials
Set up Google OAuth credentials
Development
   # Start development server   pnpm dev      # Run in specific package   pnpm --filter @fitspark/web dev
Building
   # Build all packages   pnpm build      # Build for specific environment   pnpm build:staging   pnpm build:production
Code Organization
Components: Reusable UI components in apps/web/src/components/
Pages: Route-level components in apps/web/src/pages/
Hooks: Custom React hooks in apps/web/src/hooks/
Contexts: Global state management in apps/web/src/contexts/
Lib: Utilities and services in apps/web/src/lib/
Shared Types: Common schemas in packages/shared/src/
Testing
# Run all testspnpm test# Run tests with coveragepnpm test:coverage# Run tests in watch modepnpm test:watch# Type checkingpnpm typecheck# Lintingpnpm lint
Git Workflow
Main Branch: Production-ready code
Dev Branch: Integration branch for features
Feature Branches: feature/feature-name
Hotfix Branches: hotfix/issue-name
Security & Compliance
Authentication Security
Firebase Authentication handles password hashing
OAuth 2.0 for Google sign-in
JWT tokens for session management
Protected routes require authentication
Data Security
Firestore security rules enforce data access
Users can only access their own data
API endpoints protected with secret keys
Environment variables for sensitive data
API Security
Bearer token authentication for backend API
CORS configured for allowed origins
Rate limiting (future enhancement)
Input validation with Zod schemas
Privacy
User data stored securely in Firestore
Google Fit data synced with user consent
No third-party data sharing
GDPR compliance considerations (future)
Future Roadmap
Phase 2 Features
AI-Powered Plan Generation
Machine learning-based workout recommendations
Adaptive plans based on user progress
Personalized exercise suggestions
Nutrition Tracking
Meal logging and calorie tracking
Macro nutrient tracking
Food database integration
Social Features
User profiles and following
Workout sharing and comments
Community challenges
Mobile Applications
React Native iOS app
React Native Android app
Offline workout logging
Advanced Analytics
Predictive analytics for progress
Injury prevention recommendations
Performance optimization insights
Trainer/Coach Features
Trainer dashboard
Client management
Custom plan creation
Progress monitoring tools
Technical Improvements
Performance Optimization
Code splitting and lazy loading
Image optimization
Caching strategies
Scalability
Database indexing optimization
CDN integration
Load balancing
Monitoring
Error tracking (Sentry)
Performance monitoring
User analytics
Testing
E2E testing with Playwright
Visual regression testing
Performance testing
Appendix
Key Metrics & KPIs
User Engagement: Daily/Monthly Active Users
Retention: Week-over-week retention rate
Workout Completion: Percentage of started workouts completed
Google Fit Integration: Percentage of users connected
Team Participation: Active teams and members
Performance: Page load times, API response times
Support & Resources
Documentation: /docs directory
Deployment Guide: docs/DEPLOYMENT_GUIDE.md
User Stories: docs/user-stories&epics.md
Technical Specs: docs/technical-doc.md
Project Overview: docs/PROJECT_OVERVIEW.md
Contact
For questions or support, refer to the project repository or contact the development team.
Document Version: 1.0
Last Updated: January 2025
Maintained By: FitSpark Development Team
Save this as `docs/PRODUCT_DESIGN_AND_TECHNICAL_DOC.md`. The file is ready to use and includes:- Table of contents with anchor links- Product overview and features- Technical architecture diagrams- Data models with TypeScript types- API documentation- Deployment instructions- Development workflow- Security considerations- Future roadmapCopy the content above and save it as a `.md` file in your `docs` folder.
