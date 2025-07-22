# FitSpark

**Product Design Document & Business Model Canvas**

---

## Business Model Canvas

### Key Partnerships

- Gyms & Fitness Centers (for co-marketing)
- Certified Personal Trainers & Nutritionists (for content validation, premium plans)
- Fitness Equipment & Apparel Brands (for affiliate marketing, challenges)
- Health & Wellness Influencers (for user acquisition)
- Corporate Wellness Programs (for B2B offerings)

### Key Activities

- User Acquisition (Marketing, Social Media)
- AI-Powered Plan Generation & Refinement
- Content Management (Exercise Library, Nutrition Info)
- User Engagement & Support
- Data Analytics & Progress Tracking
- App Maintenance & Feature Development

### Value Propositions

**For Users:**

- **Personalization:** Get AI-driven workout and nutrition plans tailored to your specific goals, body type, and preferences.
- **Simplicity:** Easily track workouts, meals, and progress in one intuitive app.
- **Motivation:** Stay consistent with guided workouts, progress visualization, and community features.
- **Affordability:** Access structured fitness guidance at a fraction of the cost of a personal trainer.

### Customer Relationships

- Automated & Self-Service (via the app)
- Community Building (challenges, social sharing)
- Personalized Push Notifications & In-App Messages
- Customer Support (helpdesk, FAQ)
- Long-term engagement through progress and habit formation

### Key Resources

- **The FitSpark App:**
  - User-facing Mobile/Web App
  - Admin Dashboard
- Proprietary AI Algorithm for plan generation
- Comprehensive Exercise & Nutrition Database
- Technical Team (Devs, Product, Design)
- Cloud Infrastructure (Firebase)
- Brand & Marketing Assets

### Customer Segments

- **Individuals:** Beginners to intermediates seeking structured fitness guidance without the high cost of a personal trainer (Ages 18–45)
- **Organizations:** Companies looking to offer a digital wellness solution to their employees

### Channels

- App Stores (Apple App Store, Google Play Store)
- Social Media Marketing (Instagram, TikTok, Facebook)
- Content Marketing (Blog, SEO)
- Paid Advertising (PPC, Social Ads)
- Influencer Marketing
- Word of Mouth / Referrals

### Cost Structure

- IT Hosting & Infrastructure (Firebase, Cloud Functions)
- Labor (Development, Design, Marketing, Support)
- Third-Party Services (Analytics, Error Monitoring)
- Marketing & Advertising Spend
- Content Creation & Licensing (e.g., exercise videos)
- Standard Overhead

### Revenue Streams

- **Freemium Model:**
  - Free Tier: Access to basic workout logging and a limited number of plan generations
  - Premium Subscription (FitSpark Pro): Monthly/Annual fee for unlimited AI plan generations, advanced analytics, full exercise library access, and specialized programs
- **B2B:** Corporate wellness subscriptions

---

## App Features & User Flow

### 1. Onboarding & Profile Setup

**Goal:** To gather the necessary information to create a personalized user profile.

**User Flow:**

- User signs up (Email/Password, Google/Apple Sign-in)
- Guided multi-step questionnaire:
  - Primary Goal (e.g., Lose Weight, Build Muscle, Improve Fitness)
  - Personal Stats (Gender, Age, Height, Weight)
  - Activity Level (e.g., Sedentary, Lightly Active, Very Active)
  - Workout Experience (Beginner, Intermediate)
  - Equipment Access (e.g., Full Gym, Home Gym, No Equipment)
  - Dietary Preferences/Restrictions (Optional)
- App creates the user profile in Firestore

---

### 2. Fitness Plan Generation

**Goal:** To provide the user with their first personalized workout and nutrition plan.

**User Flow:**

- After onboarding, user is prompted to generate their first plan
- User confirms their goals
- A Cloud Function is triggered using their profile data for AI plan generation
- App displays a loading/processing state
- Generated Fitness Plan is presented:
  - Weekly overview of workouts
  - Daily breakdown with exercises, sets, reps, and rest times

---

### 3. Daily Tracking & Logging

**Goal:** Make it simple and motivating to log daily activities.

#### Workout Logging:

- User opens the "Today" screen and begins their workout
- Each exercise shown with sets, reps, and target weight
- User logs set completion; a rest timer auto-starts
- After completing all sets, user proceeds to next exercise
- Completion screen shown; activity logged to Firestore

#### Nutrition Logging (Post-MVP):

- User navigates to meal logging
- Search food items or scan barcodes
- Add items by meal type (Breakfast, Lunch, etc.)
- App updates calorie and macro counts in real-time

---

### 4. Progress Review

**Goal:** Visually show progress to keep users motivated.

**User Flow:**

- User navigates to "Progress" or "Profile" tab
- Logs weight and measurements
- App shows progress graphs (weight trends, etc.)
- History of completed workouts and personal bests (e.g., max bench press)

---
