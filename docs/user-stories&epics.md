# FitSpark: Product Definition, Epics & Stories

This document outlines the core product definition, features, pages, user stories, and data model for the FitSpark MVP. This structure will guide our development sprints.

---

## Part 1: Core Product Definition

### MVP Scope & Strategy

The goal of the MVP is to validate the core user journey:  
**Onboarding → Plan Selection → Workout Logging → Progress Tracking**

To ensure a focused and achievable launch, the "AI Plan Generation" feature will be **deferred**. Instead, the MVP will feature a curated list of **Pre-defined Workout Plans** that users can select based on their goals and experience level.

### Core MVP Features

- **User Authentication:** Secure sign-up and login (Email & Google)
- **Onboarding Questionnaire:** Gather user goals, stats, and experience
- **Pre-defined Plan Selection:** Choose from expert-crafted workout plans
- **Interactive Workout Logging:** Follow and log daily workouts
- **Visual Progress Tracking:** Simple charts and history to show progress

---

## Part 2: Application Pages & Visuals

### Page Structure & Access Levels

**Public (Anyone):**

- **Login Page:** For existing users to sign in
- **Sign Up Page:** For new users to create an account

**User (Logged-in Users Only):**

- **Dashboard:** Main hub; answers "What should I do now?"
- **Onboarding Page:** Initial questionnaire for new users
- **Plan Selection Page:** Choose a workout program
- **Workout Page:** Live session logging screen
- **Progress Page:** Analytical view; answers "How am I doing?"
- **Profile Page:** Manage personal settings

### Dashboard vs. Progress Page Visuals

**Dashboard (Action-Oriented):**

- **Today's Workout Card:** Prominent "Start Workout" CTA
- **Weekly Consistency Tracker:** Visual showing workout days this week

**Progress Page (Analysis-Oriented):**

- **Bodyweight Trend Chart:** Line chart for weight over time
- **Workout Volume Chart:** Bar chart for weekly total volume
- **Workout History List:** Scrollable list of completed workouts

---

## Part 3: Epics & User Stories

### **Epic 1: User Account & Onboarding**

**Goal:**  
Allow a new user to create an account, log in, and provide their initial fitness information.

- **Story 1.1 (Sign Up):**  
  As a new user, I want to create an account using my email and password so that I can access the application.

- **Story 1.2 (Log In):**  
  As a returning user, I want to log in with my email and password so that I can access my personalized dashboard and plans.

- **Story 1.3 (Google Sign-In):**  
  As a new or returning user, I want to sign up or log in using my Google account for a faster, more convenient authentication process.

- #### **Story 1.4: Onboarding Questionnaire**
  **As** a first-time user,  
  **I want** to be guided through a simple questionnaire after signing up,  
  **So that** the app can capture my profile data.

---

#### **Story 1.5: Profile Data Entry**

**As** part of the onboarding questionnaire,  
**I want** to enter my:

- Fitness goal (e.g., lose weight)
- Experience level
- Gender
- Age
- Height
- Current weight

**So that** the app can recommend suitable workout plans.

---

### **Epic 2: Fitness Plan Management**

**Goal:**  
Allow users to select, view, and manage their workout plans.

- **Story 2.1 (Plan Selection):**  
  As a new user, I want to choose a workout plan from a pre-defined list (e.g., "Beginner Strength," "Home Bodyweight") so that I can start a structured fitness routine.

- **Story 2.2 (View Plan):**  
  As a user, I want to view the details of my selected plan, including the schedule of workouts for the week, so I know what to expect each day.

- **Story 2.3 (Dashboard View):**  
  As a user, I want to see my "Workout for Today" clearly displayed on my dashboard so I can quickly start my session.

---

### **Epic 3: Workout Execution & Logging**

**Goal:**  
Provide an interactive and seamless experience for users to follow and log their workouts.

- **Story 3.1 (Start Workout):**  
  As a user, I want to start my scheduled workout from the dashboard to enter the live workout session.

- **Story 3.2 (Log Exercise):**  
  As a user, I want to log the reps and weight for each set of an exercise so I can accurately track my performance.

- **Story 3.3 (Rest Timer):**  
  As a user, I want an automatic rest timer to start after I complete a set so I can maintain a consistent pace during my workout.

- **Story 3.4 (Workout Summary):**  
  As a user, I want to see a summary of my workout after I finish so I can get a sense of accomplishment.

---

### **Epic 4: Progress Monitoring**

**Goal:**  
Enable users to track their physical progress and see their workout history to stay motivated.

- **Story 4.1 (Log Weight):**  
  As a user, I want to log my body weight periodically so I can track my progress towards my weight goals.

- **Story 4.2 (View Progress Chart):**  
  As a user, I want to see a simple chart of my weight over time to visually confirm my progress.

- **Story 4.3 (View History):**  
  As a user, I want to view a list of my past completed workouts so I can see my consistency and look back at previous sessions.

---

## Part 4: Data Model & Usage

### **users Collection**

- **Data Stored:**  
  User profile (uid, email, displayName), onboarding data (goal, activityLevel, etc.), and selected workout plan ID

- **Used For:**  
  Personalizing the user experience and showing relevant information

---

### **plans Collection**

- **Data Stored:**  
  Library of pre-defined workout plans (name, description, structure)

- **Used For:**  
  Populating the Plan Selection screen

---

### **exercises Collection**

- **Data Stored:**  
  Individual exercises (name, description, muscle group, optional video URL)

- **Used For:**  
  Displaying exercise info during workouts

---

### **activityLogs Collection**

- **Data Stored:**  
  Logs of completed workouts:
  ```json
  {
    "userId": "...",
    "date": "...",
    "workoutName": "...",
    "performance": [
      { "exercise": "Squat", "sets": [{ "reps": 8, "weight": 60 }] }
    ]
  }
  ```
