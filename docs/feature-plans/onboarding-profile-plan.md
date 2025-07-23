# Feature 2: User Onboarding & Profile Implementation Plan

## 🎯 **Goal**

To capture a new user's initial data for personalization and allow them to manage it later.

## 📋 **User Stories**

### **1.4 (Onboarding Questionnaire)**

As a first-time user, after signing up, I want to be guided through a simple questionnaire so the app can capture my profile data.

### **1.5 (Profile Data Entry)**

As part of the questionnaire, I want to enter my fitness goal, experience level, gender, age, height, and current weight so the app can recommend suitable workout plans.

### **New (Profile Editing)**

As a user, I want to visit my profile page to view and update my personal information so I can keep my data current.

---

## ✅ **Implementation Status**

### **Completed Tasks**

#### **✅ UI: Build the multi-step OnboardingPage.tsx using React Hook Form**

- **File**: `apps/web/src/pages/OnboardingPage.tsx`
- **Features**:
  - 4-step onboarding process with smooth animations
  - Step 1: Fitness goals and experience level
  - Step 2: Personal information (age, gender, height, weight)
  - Step 3: Activity level and workout preferences
  - Step 4: Equipment and optional target weight
  - Progress indicators and navigation
  - Mobile-first responsive design
  - Form validation with real-time feedback

#### **✅ Backend: Create a Zod schema in packages/shared to validate all onboarding data**

- **File**: `packages/shared/src/schemas/user.ts`
- **Features**:
  - `OnboardingStepOneSchema` - Goals and experience validation
  - `OnboardingStepTwoSchema` - Personal info validation with min/max constraints
  - `OnboardingStepThreeSchema` - Activity and workout preferences validation
  - `OnboardingStepFourSchema` - Equipment and optional fields validation
  - `OnboardingDataSchema` - Complete merged validation schema
  - Proper TypeScript types exported

#### **✅ Validation: Integrate Zod schema with React Hook Form**

- **Implementation**: Using `@hookform/resolvers/zod` package
- **Features**:
  - Real-time client-side validation
  - Step-specific validation
  - User-friendly error messages
  - Form state management across multiple steps

#### **✅ UI: Build the ProfilePage.tsx that displays user information**

- **File**: `apps/web/src/pages/ProfilePage.tsx`
- **Features**:
  - Comprehensive profile display with sections
  - Edit mode with form validation
  - Profile overview with key metrics
  - Equipment selection interface
  - Mobile-responsive design
  - Real-time form validation

#### **✅ Routes: Add onboarding and profile routes to App.tsx**

- **Routes Added**:
  - `/onboarding` - Protected route for new user onboarding
  - `/profile` - Protected route for profile management
- **Layout**: Proper navbar and footer integration

---

## 🚧 **Pending Tasks**

### **❌ Backend: Implement user.onboardNewUser tRPC procedure**

**Status**: Not implemented (placeholder exists)
**Requirements**:

- Save validated onboarding data to Firestore users collection
- Update `onboardingCompleted` flag to `true`
- Create proper error handling
- Add proper TypeScript types

### **❌ Backend: Implement user.getProfile and user.updateProfile tRPC procedures**

**Status**: Not implemented (placeholder exists)
**Requirements**:

- `user.getProfile` - Fetch user profile data from Firestore
- `user.updateProfile` - Update user profile with validation
- Proper error handling and validation
- TypeScript integration

### **❌ Security: Update Firestore rules**

**Status**: Not implemented
**Requirements**:

- Ensure users can only read/write their own user document
- Add proper authentication checks
- Validate data structure in rules

---

## 🛠️ **Technical Architecture**

### **Frontend Stack**

- **React Hook Form**: Multi-step form management
- **Zod Validation**: Client-side and shared validation schemas
- **Framer Motion**: Smooth step transitions and animations
- **Tailwind CSS**: Mobile-first responsive design
- **shadcn/ui**: Consistent UI components

### **Backend Stack (To Implement)**

- **tRPC**: Type-safe API procedures
- **Firestore**: User data storage
- **Zod**: Server-side validation
- **Firebase Security Rules**: Data access control

### **Data Flow**

1. **Onboarding**: User completes multi-step form → Validation → tRPC call → Firestore save
2. **Profile View**: Load user data → Display in organized layout
3. **Profile Edit**: Form validation → tRPC update → Firestore update → UI feedback

---

## 🗂️ **File Structure**

```
apps/web/src/
├── pages/
│   ├── OnboardingPage.tsx          ✅ Complete
│   └── ProfilePage.tsx             ✅ Complete
└── App.tsx                         ✅ Routes added

packages/shared/src/schemas/
└── user.ts                         ✅ Schemas complete

packages/api/ (To be created)
└── routers/
    └── user.ts                     ❌ tRPC procedures needed

firestore.rules                     ❌ Security rules needed
```

---

## 🎨 **Design Features**

### **Mobile-First Design**

- Touch-friendly form elements
- Responsive grid layouts
- Proper spacing for mobile interaction
- Accessible navigation

### **User Experience**

- Progressive disclosure in onboarding
- Clear progress indicators
- Smooth animations between steps
- Immediate validation feedback
- Consistent visual hierarchy

### **Accessibility**

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- High contrast design elements

---

## 🔄 **Next Steps**

### **Priority 1: Backend Implementation**

1. Set up tRPC router structure
2. Implement `user.onboardNewUser` procedure
3. Implement `user.getProfile` and `user.updateProfile` procedures
4. Add comprehensive error handling

### **Priority 2: Security**

1. Update Firestore security rules
2. Add proper authentication checks
3. Implement data validation in rules

### **Priority 3: Integration**

1. Connect frontend forms to tRPC procedures
2. Add loading states and error handling
3. Implement proper redirect logic after onboarding
4. Add success/error toast notifications

### **Priority 4: Testing**

1. Test onboarding flow end-to-end
2. Validate profile editing functionality
3. Test security rules
4. Mobile device testing

---

## 📊 **Success Criteria**

### **Onboarding Flow**

- [ ] New users complete 4-step onboarding seamlessly
- [ ] All data is properly validated and saved
- [ ] Users are redirected to plan selection after onboarding
- [ ] Mobile experience is smooth and intuitive

### **Profile Management**

- [ ] Users can view their complete profile information
- [ ] Users can edit and update their profile data
- [ ] Changes are properly validated and saved
- [ ] UI provides clear feedback on actions

### **Technical Requirements**

- [ ] All data is properly validated client and server-side
- [ ] Security rules prevent unauthorized access
- [ ] Performance is optimized for mobile devices
- [ ] Error handling provides helpful feedback

---

## 📝 **Notes**

- **Mobile-First Rule**: All design decisions prioritize mobile experience
- **Validation Strategy**: Client-side for UX, server-side for security
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: WCAG 2.1 AA compliance targeted

---

_Plan created: July 23, 2025_
_Feature: User Onboarding & Profile_
_Status: UI Complete, Backend Pending_
