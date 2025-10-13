# FitSpark Project Overview

## A Complete Guide for Junior Developers

Welcome to **FitSpark** - an AI-powered fitness tracking and coaching platform! This document will help you understand the entire project structure, technologies used, and how everything works together.

---

## 🚀 What is FitSpark?

FitSpark is a modern web application that helps users:

- **Track workouts** and fitness progress
- **Follow structured workout plans** (beginner to advanced)
- **Monitor performance metrics** with interactive charts
- **Log exercise sessions** with detailed tracking
- **View progress over time** with comprehensive analytics

---

## 🏗️ Project Architecture Overview

### **Monorepo Structure**

This project uses a **monorepo** architecture, meaning multiple related packages live in one repository:

```
fit-app/
├── apps/                    # Applications
│   └── web/                # React web application
├── packages/               # Shared packages
│   ├── shared/            # Shared TypeScript types/schemas
│   └── seeding/           # Database seeding scripts
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
└── firebase configs       # Firebase setup files
```

### **Why Monorepo?**

- **Code sharing**: Common types and utilities shared across apps
- **Consistent dependencies**: Same versions across all packages
- **Atomic changes**: Update multiple packages in single commit
- **Simplified builds**: Build system handles dependencies automatically

---

## 🛠️ Technology Stack

### **Frontend (Web App)**

- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management with validation
- **Recharts** - Interactive charts and data visualization
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful SVG icons

### **Backend & Database**

- **Firebase Authentication** - User authentication
- **Firestore** - NoSQL document database
- **Firebase Hosting** - Static web hosting
- **Firebase Storage** - File storage (future use)

### **Build & Development Tools**

- **Turborepo** - Monorepo build system
- **pnpm** - Fast, efficient package manager
- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking across all packages

### **Data Validation**

- **Zod** - Runtime type validation and schemas

---

## 📁 Detailed Project Structure

### **Apps Directory (`/apps/`)**

Contains the main applications:

```
apps/web/                   # Main React web application
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   └── ui/           # Basic UI components (Button, Card, etc.)
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (routing destinations)
│   ├── lib/              # Utility functions and configs
│   └── assets/           # Static assets
├── public/               # Static files served by web server
└── package.json          # Dependencies and scripts
```

### **Packages Directory (`/packages/`)**

#### **Shared Package (`/packages/shared/`)**

- **Purpose**: Common TypeScript types and schemas
- **Exports**: User types, workout schemas, validation functions
- **Used by**: Web app and seeding scripts

```typescript
// Example from packages/shared/src/schemas/user.ts
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  // ... more fields
});

export type User = z.infer<typeof userSchema>;
```

#### **Seeding Package (`/packages/seeding/`)**

- **Purpose**: Database population scripts
- **Contains**: Exercise data, workout plans, seeding utilities
- **Scripts**:
  - `seed-exercises.js` - Populates exercise library
  - `seed-plans.js` - Creates workout programs
  - `seed-firestore.js` - Main seeding orchestrator

---

## 🔥 Firebase Integration

### **Authentication Flow**

1. **User registration/login** through Firebase Auth
2. **User profile** stored in Firestore `users` collection
3. **Protected routes** require authentication
4. **Context provider** manages auth state globally

### **Database Collections**

#### **Users Collection**

```javascript
users/{userId} = {
  uid: "firebase-user-id",
  email: "user@example.com",
  displayName: "John Doe",
  goal: "strength", // fitness goal
  activityLevel: "intermediate",
  selectedPlanId: "plan-id", // current workout plan
  onboardingCompleted: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **Exercises Collection**

```javascript
exercises/{exerciseId} = {
  id: "push-up",
  name: "Push-up",
  description: "Classic bodyweight chest exercise",
  category: "strength",
  muscleGroups: ["chest", "triceps", "shoulders"],
  equipment: ["bodyweight"],
  instructions: ["Step 1...", "Step 2..."],
  videoUrl: "", // future enhancement
  imageUrl: "" // future enhancement
}
```

#### **Workout Programs Collection**

```javascript
workoutPrograms/{programId} = {
  id: "beginner-bodyweight",
  title: "Beginner Bodyweight",
  description: "Perfect for starting your fitness journey",
  difficulty: "beginner",
  goal: "general_fitness",
  durationWeeks: 4,
  sessionsPerWeek: 3,
  visibility: "public",
  phases: [
    {
      id: "day-1",
      name: "Full Body Strength",
      exercises: [
        {
          exerciseId: "push-up",
          sets: 3,
          reps: 8,
          restTime: 60
        }
      ]
    }
  ]
}
```

#### **Workout Logs Collection**

```javascript
workoutLogs/{logId} = {
  userId: "user-id",
  workoutPlanId: "plan-id",
  phaseId: "day-1",
  phaseName: "Full Body Strength",
  startTime: timestamp,
  endTime: timestamp,
  sets: [
    {
      exerciseId: "push-up",
      exerciseName: "Push-up",
      setNumber: 1,
      reps: 8,
      weight: 0, // bodyweight
      restTime: 60
    }
  ],
  totalVolume: 0, // total weight lifted
  duration: 1800 // seconds
}
```

### **Security Rules**

```javascript
// firestore.rules - Users can only access their own data
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Workout logs - users can only access their own
    match /workoutLogs/{logId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Exercise library - read-only for authenticated users
    match /exercises/{exerciseId} {
      allow read: if request.auth != null;
      allow write: if false; // Only seeding scripts can write
    }
  }
}
```

---

## 🚦 Application Flow

### **User Journey**

1. **Landing Page** - Marketing page with feature overview
2. **Authentication** - Sign up/login with email/password
3. **Onboarding** - Collect user profile and fitness goals
4. **Plan Selection** - Choose from available workout programs
5. **Dashboard** - View current plan and weekly progress
6. **Workout Session** - Follow guided workout with timer
7. **Progress Tracking** - View historical data and analytics

### **Key Pages & Components**

#### **Landing Page (`/`)**

- **Purpose**: Marketing and user acquisition
- **Features**: Feature showcase, testimonials, call-to-action
- **Components**: Hero section, feature cards, footer

#### **Authentication (`/login`, `/signup`)**

- **Purpose**: User account management
- **Features**: Email/password auth, form validation
- **Integration**: Firebase Authentication

#### **Dashboard (`/dashboard`)**

- **Purpose**: Main user interface after login
- **Features**:
  - Current workout plan overview
  - Weekly progress tracker
  - Quick actions (start workout, view progress)
  - Upcoming sessions

#### **Workout Session (`/workout/:planId/:phaseId`)**

- **Purpose**: Guided workout execution
- **Features**:
  - Exercise instructions and form tips
  - Set/rep tracking with weight logging
  - Rest timer between sets
  - Progress tracking throughout session

#### **Progress Page (`/progress`)**

- **Purpose**: Analytics and historical data
- **Features**:
  - Interactive charts (strength, endurance, volume)
  - Time range filtering (weekly, monthly)
  - Achievement levels and consistency scores
  - Exercise distribution analytics

#### **Workout History (`/history`)**

- **Purpose**: Historical workout review
- **Features**:
  - Calendar view of past workouts
  - Detailed workout summaries
  - Volume and performance trends
  - Individual workout details in modal

---

## 🎨 Design System

### **Color Palette**

```css
/* Primary Brand Colors */
--spark-50: #f0fdf9; /* Light background */
--spark-500: #10b981; /* Primary brand color */
--spark-600: #059669; /* Primary hover/active */
--spark-900: #064e3b; /* Dark text */
```

### **Component Library**

Built with **Radix UI** primitives and **Tailwind CSS**:

- **Button** - Multiple variants (primary, secondary, outline)
- **Card** - Content containers with consistent styling
- **Dialog/Modal** - Overlay components for forms/details
- **Form** - Input, Label, validation with React Hook Form
- **Select** - Dropdown selections with keyboard navigation
- **Toast** - Notification system for user feedback

### **Responsive Design**

Mobile-first approach using Tailwind breakpoints:

```css
/* Mobile first */
.class-name

/* Tablet and up */
sm:class-name  /* 640px+ */

/* Desktop and up */
md:class-name  /* 768px+ */
lg:class-name  /* 1024px+ */
```

---

## ⚙️ Build System (Turborepo)

### **What is Turborepo?**

Turborepo is a high-performance build system for JavaScript/TypeScript monorepos.

### **Key Features**

- **Caching**: Never rebuild the same code twice
- **Parallelization**: Run tasks across packages simultaneously
- **Dependencies**: Automatic dependency graph resolution
- **Remote caching**: Share cache across team members

### **Configuration (`turbo.json`)**

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // Build dependencies first
      "outputs": ["dist/**"] // Cache these directories
    },
    "dev": {
      "cache": false, // Don't cache development mode
      "persistent": true // Keep running
    }
  }
}
```

### **Common Commands**

```bash
# Run development servers for all apps
pnpm dev

# Build all packages and apps
pnpm build

# Build for specific environment
pnpm build:staging
pnpm build:production

# Run linting across all packages
pnpm lint

# Type check all TypeScript code
pnpm typecheck
```

---

## 📦 Package Manager (pnpm)

### **Why pnpm?**

- **Faster installs**: Symlinks instead of copying files
- **Disk space efficient**: Shared packages across projects
- **Strict dependencies**: Prevents phantom dependencies
- **Monorepo optimized**: Excellent workspace support

### **Workspace Configuration (`pnpm-workspace.yaml`)**

```yaml
packages:
  - "apps/*" # All apps in apps directory
  - "packages/*" # All packages in packages directory
```

### **Common Commands**

```bash
# Install all dependencies
pnpm install

# Add dependency to specific package
pnpm add react --filter @fitspark/web

# Run script in specific package
pnpm --filter @fitspark/web dev

# Add dependency to workspace root
pnpm add -w typescript
```

---

## 🔐 Environment Configuration

### **Environment Files**

```bash
# Apps have environment-specific configs
apps/web/.env.staging      # Staging Firebase config
apps/web/.env.production    # Production Firebase config
```

### **Firebase Projects**

- **Staging**: `fitspark-staging` - For testing and development
- **Production**: `fitspark-production` - Live user-facing app

### **Build Modes**

```bash
# Development (uses staging config)
pnpm dev

# Staging build
pnpm build:staging

# Production build
pnpm build:production
```

---

## 🚀 Deployment Process

### **Automated Deployment**

```bash
# Deploy to staging
pnpm deploy:staging

# Deploy to production (requires approval)
pnpm deploy:production
```

### **Manual Deployment Steps**

1. **Build the application**

   ```bash
   pnpm build:production
   ```

2. **Switch to target Firebase project**

   ```bash
   firebase use fitspark-production
   ```

3. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```

### **Deployment Targets**

- **Staging URL**: https://fitspark-staging.web.app
- **Production URL**: https://fitspark-production.web.app

---

## 🧪 Data Seeding

### **Purpose**

Populate the database with initial data (exercises, workout plans) required for the app to function.

### **Seeding Scripts**

```bash
# Seed staging database
cd packages/seeding
node scripts/seed-client.js

# Seed production database (requires auth)
node scripts/seed-firestore-production.js
```

### **What Gets Seeded**

- **Exercises**: 11 foundational exercises (push-ups, squats, etc.)
- **Workout Plans**: 4 progressive programs (beginner to advanced)
- **Categories**: Strength, cardio, flexibility exercises

---

## 🔍 Development Workflow

### **Getting Started**

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd fit-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development servers**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   - Web app: http://localhost:5173
   - Firebase emulator: http://localhost:4000

### **Code Organization**

- **Components**: Small, reusable UI pieces
- **Pages**: Route-level components
- **Hooks**: Custom React hooks for state logic
- **Contexts**: Global state management
- **Utils**: Helper functions and utilities

### **Type Safety**

```typescript
// All data structures are typed
interface WorkoutLog {
  userId: string;
  exercises: Exercise[];
  duration: number;
  // TypeScript ensures type safety
}

// Zod schemas provide runtime validation
const workoutLogSchema = z.object({
  userId: z.string(),
  exercises: z.array(exerciseSchema),
  duration: z.number(),
});
```

---

## 🤝 Contributing Guidelines

### **Branch Strategy**

- **main**: Production-ready code
- **dev**: Integration branch for features
- **feature/\***: Individual feature development

### **Code Standards**

- **TypeScript**: All code must be typed
- **ESLint**: Consistent code formatting
- **Component structure**: Consistent file organization
- **Naming conventions**: Clear, descriptive names

### **Testing Strategy**

- **Type checking**: `pnpm typecheck`
- **Linting**: `pnpm lint`
- **Manual testing**: Comprehensive user flows
- **Firebase emulators**: Local testing environment

---

## 📚 Additional Resources

### **Documentation**

- **Technical specs**: `/docs/technical-doc.md`
- **User stories**: `/docs/user-stories&epics.md`
- **Product design**: `/docs/product-design.md`
- **Firebase setup**: `/docs/firebase-auth-setup.md`

### **External Documentation**

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Turborepo](https://turbo.build/repo/docs)
- [pnpm](https://pnpm.io/)

---

## 🎯 Next Steps for New Developers

1. **Explore the codebase**: Start with simple components in `apps/web/src/components/ui/`
2. **Run the development server**: Get familiar with the local development environment
3. **Study the data flow**: Follow how data moves from Firestore to UI components
4. **Read existing documentation**: Review `/docs/` folder for detailed specifications
5. **Make small changes**: Start with styling or text changes to understand the build process
6. **Ask questions**: Don't hesitate to ask senior developers for clarification

Welcome to the team! 🚀
