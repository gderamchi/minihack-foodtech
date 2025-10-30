# 📋 Personalized Meal Planning Implementation TODO

## Phase 1: Foundation & Authentication ✅ IN PROGRESS

### Backend Models
- [x] Update User model with comprehensive profile fields
- [x] Create WeeklyMenu model
- [ ] Create UserPreferences helper methods
- [ ] Add profile validation methods

### Firebase Setup
- [ ] User needs to add Firebase credentials to Vercel
- [ ] Configure Firebase in frontend
- [ ] Create authentication context
- [ ] Implement Google Sign-in
- [ ] Implement Email/Password Sign-in

### API Endpoints
- [ ] POST /api/users/profile - Update user profile
- [ ] GET /api/users/profile - Get user profile
- [ ] POST /api/users/onboarding - Save onboarding step
- [ ] GET /api/users/onboarding-status - Check completion

---

## Phase 2: Onboarding Questionnaire 🚧 NEXT

### Components to Create
- [ ] `OnboardingWizard.jsx` - Main wizard container
- [ ] `ProgressBar.jsx` - Step progress indicator
- [ ] `Step1Personal.jsx` - Personal information
- [ ] `Step2Physical.jsx` - Physical profile (per person)
- [ ] `Step3Dietary.jsx` - Restrictions & allergies
- [ ] `Step4FoodPrefs.jsx` - Food preferences
- [ ] `Step5Cooking.jsx` - Cooking habits
- [ ] `Step6MealPlanning.jsx` - Meal planning preferences
- [ ] `Step7Health.jsx` - Health & nutrition goals
- [ ] `Step8Automation.jsx` - Automation preferences

### Features
- [ ] Multi-step form with smooth transitions
- [ ] Progress bar (Step X of 8)
- [ ] Auto-save on each step
- [ ] Back button to edit previous steps
- [ ] Validation per step
- [ ] Explanatory messages
- [ ] Mobile-responsive design

---

## Phase 3: Weekly Menu Generation 📅

### Services to Create
- [ ] `weeklyMenuService.js` - Menu generation logic
- [ ] `portionCalculator.js` - Portion adjustment
- [ ] `nutritionCalculator.js` - Nutrition calculations
- [ ] `shoppingListGenerator.js` - Shopping list creation

### API Endpoints
- [ ] POST /api/weekly-menu/generate - Generate new menu
- [ ] GET /api/weekly-menu/current - Get current week's menu
- [ ] PUT /api/weekly-menu/:id - Update menu
- [ ] POST /api/weekly-menu/:id/swap-meal - Swap individual meal
- [ ] POST /api/weekly-menu/:id/regenerate - Regenerate entire menu
- [ ] POST /api/weekly-menu/:id/favorite - Save as favorite

### Features
- [ ] AI-powered menu generation using Blackbox API
- [ ] Filter recipes by user preferences
- [ ] Match with nearby store ingredients
- [ ] Calculate portions for household size
- [ ] Generate nutrition summary
- [ ] Create shopping list

---

## Phase 4: Menu Management UI 🎨

### Pages to Create
- [ ] `WeeklyMenuView.jsx` - Calendar view of weekly menu
- [ ] `DayView.jsx` - Detailed view of single day
- [ ] `MealCard.jsx` - Individual meal card component
- [ ] `SwapMealModal.jsx` - Modal for swapping meals
- [ ] `MenuTemplates.jsx` - Pre-made templates

### Features
- [ ] Calendar layout (7 days)
- [ ] Drag & drop meals between days
- [ ] Swap meal with feedback
- [ ] Regenerate menu
- [ ] Edit menu manually
- [ ] Apply templates
- [ ] Save favorite menus
- [ ] View nutrition summary

---

## Phase 5: Shopping List System 🛒

### Components to Create
- [ ] `ShoppingList.jsx` - Main shopping list view
- [ ] `ShoppingListByCategory.jsx` - Grouped by category
- [ ] `ShoppingListByStore.jsx` - Grouped by store
- [ ] `ShoppingListByDay.jsx` - Grouped by day
- [ ] `ShoppingItem.jsx` - Individual item component
- [ ] `StoreMap.jsx` - Map showing stores

### Features
- [ ] Multiple view modes (category, store, day)
- [ ] Interactive checklist
- [ ] Mark items as found/not found
- [ ] Add custom items
- [ ] Notes per item
- [ ] Store integration (which stores have items)
- [ ] Price comparison
- [ ] Budget tracking
- [ ] Export to PDF
- [ ] Email shopping list
- [ ] Share with household

---

## Phase 6: Automation & Notifications 🔔

### Backend Jobs
- [ ] Create cron job for weekly menu generation
- [ ] Implement notification service
- [ ] Email notification system
- [ ] Push notification setup

### Features
- [ ] Auto-generate menu every week
- [ ] Send notifications when ready
- [ ] Recurring preferences (e.g., "pasta on Fridays")
- [ ] Customizable generation schedule

---

## Phase 7: Profile Management ⚙️

### Pages to Create
- [ ] `ProfileSettings.jsx` - Edit profile page
- [ ] `EditPersonalInfo.jsx` - Edit personal info
- [ ] `EditDietaryPrefs.jsx` - Edit dietary preferences
- [ ] `EditCookingHabits.jsx` - Edit cooking habits
- [ ] `ManagePeople.jsx` - Add/edit household members

### Features
- [ ] Edit any profile section
- [ ] Add/remove household members
- [ ] Update preferences anytime
- [ ] Prompt to regenerate menu after changes
- [ ] View profile completion status

---

## Phase 8: Advanced Features 🚀

### Meal Customization
- [ ] Swap individual meals
- [ ] Provide feedback on swaps
- [ ] AI learns from feedback
- [ ] Adjust servings per meal
- [ ] Duplicate meals across days

### Templates
- [ ] Quick & Easy Week
- [ ] Gourmet Week
- [ ] Budget-Friendly Week
- [ ] High Protein Week
- [ ] Meal Prep Week
- [ ] Family-Friendly Week
- [ ] Athletic Performance Week

### Social Features
- [ ] Share favorite menus
- [ ] Community menu library
- [ ] Rate menus
- [ ] Comment on menus

---

## Phase 9: Testing & Optimization 🧪

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for API
- [ ] E2E tests for user flows
- [ ] Mobile responsiveness testing
- [ ] Performance testing

### Optimization
- [ ] Database query optimization
- [ ] Caching strategy
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading

---

## Phase 10: Deployment & Monitoring 📊

### Deployment
- [ ] Deploy to Vercel
- [ ] Set up environment variables
- [ ] Configure Firebase
- [ ] Set up MongoDB indexes
- [ ] Configure cron jobs

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Performance monitoring
- [ ] User feedback system

---

## Current Status: Phase 1 - 30% Complete

### Completed ✅
- Enhanced User model with comprehensive profile
- WeeklyMenu model created
- Specification documents written
- Firebase setup instructions created

### In Progress 🚧
- Waiting for Firebase credentials
- Building onboarding questionnaire

### Next Steps 📍
1. User adds Firebase credentials to Vercel
2. Build onboarding questionnaire components
3. Implement profile API endpoints
4. Create weekly menu generation service
5. Build menu management UI

---

## Dependencies Needed

### Already Installed
- ✅ firebase
- ✅ framer-motion
- ✅ react-confetti
- ✅ html2canvas

### May Need to Add
- [ ] react-hook-form (for complex forms)
- [ ] yup (for validation)
- [ ] date-fns (for date handling)
- [ ] recharts (for nutrition charts)

---

## Estimated Timeline

- **Phase 1-2**: 3-4 days (Foundation + Questionnaire)
- **Phase 3-4**: 4-5 days (Menu Generation + UI)
- **Phase 5**: 2-3 days (Shopping List)
- **Phase 6**: 2 days (Automation)
- **Phase 7**: 2 days (Profile Management)
- **Phase 8**: 3-4 days (Advanced Features)
- **Phase 9**: 2-3 days (Testing)
- **Phase 10**: 1-2 days (Deployment)

**Total**: 3-4 weeks for complete implementation

---

## Notes

- All features designed with mobile-first approach
- Smooth animations using framer-motion
- Optimized for performance (lazy loading, caching)
- Accessible (WCAG 2.1 AA compliant)
- SEO-friendly
- Progressive Web App (PWA) ready
