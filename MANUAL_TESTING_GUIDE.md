# 🧪 Complete Manual Testing Guide

## 📋 Testing Checklist

Use this guide to thoroughly test all new features implemented in the UI/UX enhancement.

---

## 🎯 Test Environment Setup

**URL:** https://minihack-foodtech.vercel.app

**Prerequisites:**
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Open browser console (F12)
- [ ] Have a test email ready
- [ ] Have mobile device or browser responsive mode ready

---

## 1️⃣ Enhanced Onboarding (20 Steps)

### Test 1.1: Complete Onboarding Flow
**Steps:**
1. Register new account or login
2. Start onboarding
3. Complete all 20 steps:
   - Step 1: Welcome
   - Step 2: Name & Age
   - Step 3: Vegan Journey (NEW)
   - Step 4: Motivations
   - Step 5: Health Conditions (NEW)
   - Step 6: Dietary Goals
   - Step 7: Allergies
   - Step 8: Restrictions
   - Step 9: Favorite Cuisines
   - Step 10: Disliked Ingredients
   - Step 11: Fitness & Activity (NEW)
   - Step 12: Cooking Skills
   - Step 13: Meal Timing (NEW)
   - Step 14: Budget
   - Step 15: Social & Lifestyle (NEW)
   - Step 16: Kitchen Equipment
   - Step 17: Shopping Frequency
   - Step 18: Meal Planning Style
   - Step 19: Location
   - Step 20: Additional Notes
4. Click "Get Started! 🚀"

**Expected Results:**
- [ ] All 20 steps display correctly
- [ ] Progress bar updates (0% → 100%)
- [ ] "Next" button works on each step
- [ ] "Back" button works (except step 1)
- [ ] Data saves after each step
- [ ] Redirects to dashboard after completion
- [ ] No console errors

**Actual Results:**
```
[Record your findings here]
```

---

### Test 1.2: Skip Functionality
**Steps:**
1. Start onboarding
2. On step 10 (Disliked Ingredients), click "Skip"
3. Verify skip confirmation modal appears
4. Click "Skip" in modal
5. Verify moves to next step
6. Go back and try "Go Back" in skip modal

**Expected Results:**
- [ ] Skip button appears on optional steps
- [ ] Skip modal shows with warning message
- [ ] "Skip" button in modal advances to next step
- [ ] "Go Back" button closes modal
- [ ] Skipped data is not required

**Actual Results:**
```
[Record your findings here]
```

---

### Test 1.3: Resume Functionality
**Steps:**
1. Start onboarding
2. Complete 5 steps
3. Refresh the page (F5)
4. Verify resume modal appears
5. Click "Resume" button
6. Verify returns to step 6
7. Refresh again and click "Start Fresh"
8. Verify returns to step 1

**Expected Results:**
- [ ] Resume modal appears after refresh
- [ ] Shows correct step number
- [ ] "Resume" button loads saved step
- [ ] "Start Fresh" clears localStorage
- [ ] "Start Fresh" returns to step 1
- [ ] Previous data is preserved when resuming

**Actual Results:**
```
[Record your findings here]
```

---

### Test 1.4: Auto-Save
**Steps:**
1. Start onboarding
2. Complete step 1
3. Open browser DevTools → Application → Local Storage
4. Check for `onboarding_step` and `onboarding_data` keys
5. Verify data is saved

**Expected Results:**
- [ ] `onboarding_step` key exists with current step number
- [ ] `onboarding_data` key exists with form data
- [ ] Data updates after each step
- [ ] Data is valid JSON

**Actual Results:**
```
[Record your findings here]
```

---

## 2️⃣ ProfileDashboard Page

### Test 2.1: Page Load
**Steps:**
1. Complete onboarding
2. Navigate to `/profile-dashboard` or click "Update Preferences" from dashboard
3. Verify page loads

**Expected Results:**
- [ ] Page loads without errors
- [ ] Header displays user name
- [ ] 3 stat cards show (Achievements, Streak, Completion %)
- [ ] Achievement badges preview displays
- [ ] 3 quick action cards display
- [ ] 3 gamification widgets display
- [ ] Profile sections display
- [ ] No console errors

**Actual Results:**
```
[Record your findings here]
```

---

### Test 2.2: Header & Stats
**Steps:**
1. On ProfileDashboard, check header section
2. Verify stats display correctly

**Expected Results:**
- [ ] Welcome message shows user name
- [ ] Achievements count is correct
- [ ] Login streak shows (0 if first login)
- [ ] Profile completion % shows (should be 100% after onboarding)
- [ ] Recent achievement badges display (6 badges)
- [ ] Badges show earned/locked states correctly

**Actual Results:**
```
[Record your findings here]
```

---

### Test 2.3: Quick Actions
**Steps:**
1. Click "Find Vegan Alternative" card
2. Verify navigates to `/dish-input`
3. Go back, click "Find Stores" card
4. Verify navigates to `/stores`
5. Go back, click "Weekly Menu" card
6. Verify navigates to `/weekly-menu`

**Expected Results:**
- [ ] All 3 cards are clickable
- [ ] Hover effects work
- [ ] Navigation works correctly
- [ ] Cards have proper gradients (green, blue, purple)

**Actual Results:**
```
[Record your findings here]
```

---

### Test 2.4: Gamification Widgets

#### Profile Completion Bar
**Steps:**
1. Check profile completion widget
2. Verify percentage matches header stat
3. Check color coding

**Expected Results:**
- [ ] Progress bar displays
- [ ] Percentage is correct
- [ ] Color is green (67-100%), yellow (34-66%), or red (0-33%)
- [ ] Animation works smoothly
- [ ] Motivational message displays

**Actual Results:**
```
[Record your findings here]
```

#### Streak Tracker
**Steps:**
1. Check streak tracker widget
2. Verify current streak displays
3. Check max streak record

**Expected Results:**
- [ ] Current streak shows (0 for new users)
- [ ] Max streak shows
- [ ] Fire emoji displays
- [ ] Milestone indicators show (7, 30, 100 days)

**Actual Results:**
```
[Record your findings here]
```

#### Achievements Grid
**Steps:**
1. Check achievements widget
2. Count total badges (should be 10)
3. Check earned vs locked states
4. Hover over badges for tooltips

**Expected Results:**
- [ ] 10 achievement badges display (4x3 grid)
- [ ] Earned badges are colored
- [ ] Locked badges are grayed out
- [ ] Tooltips show on hover with name & description
- [ ] "View All Achievements" button displays

**Actual Results:**
```
[Record your findings here]
```

---

### Test 2.5: Profile Sections (10 Total)

#### Section 1: Personal Information
**Steps:**
1. Verify section is open by default
2. Click "Edit" button
3. Change name
4. Change age
5. Click "Save"
6. Verify "Saving..." indicator appears
7. Verify success toast appears
8. Verify changes are saved
9. Click "Edit" again, then "Cancel"
10. Verify changes are reverted

**Expected Results:**
- [ ] Section opens by default
- [ ] Edit button shows
- [ ] Input fields become editable
- [ ] Save and Cancel buttons appear
- [ ] Saving indicator shows
- [ ] Success toast appears
- [ ] Changes persist after save
- [ ] Cancel reverts changes
- [ ] Email is read-only

**Actual Results:**
```
[Record your findings here]
```

#### Section 2: Vegan Journey
**Steps:**
1. Click section header to expand
2. Verify duration displays
3. Verify motivations display as badges
4. Click header again to collapse

**Expected Results:**
- [ ] Section expands/collapses on click
- [ ] Duration shows correctly
- [ ] Motivations show as green badges
- [ ] Smooth animation
- [ ] No edit button (display only)

**Actual Results:**
```
[Record your findings here]
```

#### Section 3: Dietary Goals
**Steps:**
1. Expand section
2. Verify goals display as badges

**Expected Results:**
- [ ] Goals show as blue badges
- [ ] Multiple goals display correctly
- [ ] "Not set" shows if empty

**Actual Results:**
```
[Record your findings here]
```

#### Section 4: Health Profile
**Steps:**
1. Expand section
2. Check health conditions
3. Check pregnancy checkbox
4. Check breastfeeding checkbox

**Expected Results:**
- [ ] Health conditions show as red badges
- [ ] Checkboxes display correctly
- [ ] Checkboxes are disabled (display only)
- [ ] "None" shows if no conditions

**Actual Results:**
```
[Record your findings here]
```

#### Section 5: Fitness & Activity
**Steps:**
1. Expand section
2. Check activity level
3. Check exercise types
4. Check fitness goals

**Expected Results:**
- [ ] Activity level displays
- [ ] Exercise types show as purple badges
- [ ] Fitness goals show as orange badges
- [ ] "Not set" shows if empty

**Actual Results:**
```
[Record your findings here]
```

#### Section 6: Dietary Restrictions & Allergies
**Steps:**
1. Expand section
2. Check restrictions (left column)
3. Check allergies (right column)

**Expected Results:**
- [ ] Two-column grid layout
- [ ] Restrictions show as yellow badges
- [ ] Allergies show as red badges
- [ ] "None" shows if empty

**Actual Results:**
```
[Record your findings here]
```

#### Section 7: Food Preferences
**Steps:**
1. Expand section
2. Check favorite cuisines
3. Check texture preferences
4. Check flavor profiles

**Expected Results:**
- [ ] Three sections display
- [ ] Cuisines show as indigo badges
- [ ] Textures show as pink badges
- [ ] Flavors show as teal badges
- [ ] "Not set" shows if empty

**Actual Results:**
```
[Record your findings here]
```

#### Section 8: Cooking & Equipment
**Steps:**
1. Expand section
2. Check cooking skills
3. Check kitchen equipment
4. Check time available

**Expected Results:**
- [ ] Cooking skills display
- [ ] Equipment shows as gray badges
- [ ] Time available displays
- [ ] "Not set" shows if empty

**Actual Results:**
```
[Record your findings here]
```

#### Section 9: Meal Planning & Budget
**Steps:**
1. Expand section
2. Check weekly budget
3. Check shopping frequency
4. Check planning style

**Expected Results:**
- [ ] Three-column grid layout
- [ ] Budget shows with $ symbol
- [ ] Frequency displays
- [ ] Planning style displays
- [ ] "Not set" shows if empty

**Actual Results:**
```
[Record your findings here]
```

#### Section 10: Location & Additional Notes
**Steps:**
1. Expand section
2. Check location
3. Check additional notes

**Expected Results:**
- [ ] Location displays
- [ ] Notes display
- [ ] "Not set" / "No additional notes" shows if empty

**Actual Results:**
```
[Record your findings here]
```

---

### Test 2.6: Account Settings
**Steps:**
1. Scroll to Account Settings section
2. Click "Delete Account" button
3. Verify confirmation dialog appears
4. Click "Cancel" in dialog
5. Click "Export Data" button
6. Verify data export initiates (console log)

**Expected Results:**
- [ ] Account Settings section displays
- [ ] Delete Account button is red
- [ ] Confirmation dialog appears
- [ ] Cancel works
- [ ] Export Data button is blue
- [ ] Export initiates (check console)

**Actual Results:**
```
[Record your findings here]
```

---

## 3️⃣ Loading States

### Test 3.1: Loading Skeletons
**Steps:**
1. Clear cache and reload ProfileDashboard
2. Observe loading state before data loads
3. Verify skeletons display

**Expected Results:**
- [ ] Header skeleton shows
- [ ] Stats skeleton shows (3 cards)
- [ ] Quick actions skeleton shows (3 cards)
- [ ] Gamification widgets skeleton shows (3 cards)
- [ ] Profile sections skeleton shows (5 sections)
- [ ] Skeletons have pulse animation
- [ ] Smooth transition to actual content

**Actual Results:**
```
[Record your findings here]
```

### Test 3.2: Saving Indicator
**Steps:**
1. Edit Personal Information section
2. Click Save
3. Observe top-right corner

**Expected Results:**
- [ ] "Saving..." indicator appears
- [ ] Green background with spinner
- [ ] Positioned at top-right
- [ ] Disappears after save completes
- [ ] Success toast appears after

**Actual Results:**
```
[Record your findings here]
```

---

## 4️⃣ Debouncing

### Test 4.1: Debounced Saves
**Steps:**
1. Edit Personal Information
2. Type in name field rapidly
3. Click Save
4. Observe network tab (F12 → Network)
5. Count API calls

**Expected Results:**
- [ ] Only ONE API call is made
- [ ] Call is delayed by 1 second
- [ ] No multiple rapid calls
- [ ] Debouncing works correctly

**Actual Results:**
```
[Record your findings here]
```

---

## 5️⃣ Mobile Responsiveness

### Test 5.1: Mobile View (< 640px)
**Steps:**
1. Resize browser to 375px width (iPhone size)
2. Navigate through ProfileDashboard
3. Check all sections

**Expected Results:**
- [ ] Header stacks vertically
- [ ] Stats display in row (3 columns)
- [ ] Quick actions stack (1 column)
- [ ] Gamification widgets stack (1 column)
- [ ] Profile sections are full width
- [ ] Text is readable
- [ ] Buttons are at least 44px tall
- [ ] No horizontal scroll
- [ ] Touch targets are adequate

**Actual Results:**
```
[Record your findings here]
```

### Test 5.2: Tablet View (640px - 1024px)
**Steps:**
1. Resize browser to 768px width (iPad size)
2. Navigate through ProfileDashboard

**Expected Results:**
- [ ] Header displays properly
- [ ] Quick actions show 2 columns
- [ ] Gamification widgets show properly
- [ ] Profile sections are readable
- [ ] Layout is balanced

**Actual Results:**
```
[Record your findings here]
```

---

## 6️⃣ Accessibility

### Test 6.1: Keyboard Navigation
**Steps:**
1. Use only keyboard (Tab, Enter, Escape)
2. Navigate through ProfileDashboard
3. Try to interact with all elements

**Expected Results:**
- [ ] Tab key moves focus through elements
- [ ] Focus indicators are visible (green outline)
- [ ] Enter key activates buttons
- [ ] Escape key closes modals
- [ ] Tab order is logical
- [ ] All interactive elements are reachable

**Actual Results:**
```
[Record your findings here]
```

### Test 6.2: Screen Reader (Optional)
**Steps:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through ProfileDashboard
3. Listen to announcements

**Expected Results:**
- [ ] ARIA labels are announced
- [ ] Buttons have descriptive labels
- [ ] Stats have proper labels
- [ ] Sections are announced correctly
- [ ] Interactive elements are identified

**Actual Results:**
```
[Record your findings here]
```

### Test 6.3: Color Contrast
**Steps:**
1. Use browser extension (WAVE, axe DevTools)
2. Check color contrast ratios
3. Verify WCAG AA compliance

**Expected Results:**
- [ ] Text on backgrounds meets WCAG AA (4.5:1)
- [ ] Button colors have good contrast
- [ ] Disabled states are distinguishable
- [ ] No contrast errors

**Actual Results:**
```
[Record your findings here]
```

---

## 7️⃣ Error Handling

### Test 7.1: Network Errors
**Steps:**
1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Try to save profile changes
4. Observe error handling

**Expected Results:**
- [ ] Error toast appears
- [ ] User-friendly error message
- [ ] No app crash
- [ ] Can retry after going online

**Actual Results:**
```
[Record your findings here]
```

### Test 7.2: Invalid Data
**Steps:**
1. Edit Personal Information
2. Enter invalid age (e.g., 999)
3. Try to save
4. Observe validation

**Expected Results:**
- [ ] Validation prevents save OR
- [ ] Server returns error
- [ ] Error message displays
- [ ] User can correct and retry

**Actual Results:**
```
[Record your findings here]
```

---

## 8️⃣ Performance

### Test 8.1: Page Load Time
**Steps:**
1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Check load time

**Expected Results:**
- [ ] Page loads in < 3 seconds
- [ ] No blocking resources
- [ ] Images load progressively
- [ ] Smooth animations

**Actual Results:**
```
[Record your findings here]
```

### Test 8.2: Smooth Animations
**Steps:**
1. Expand/collapse profile sections rapidly
2. Observe animation smoothness
3. Check for jank or stuttering

**Expected Results:**
- [ ] Animations are smooth (60fps)
- [ ] No stuttering
- [ ] No layout shifts
- [ ] Transitions are fluid

**Actual Results:**
```
[Record your findings here]
```

---

## 9️⃣ Cross-Browser Testing

### Test 9.1: Chrome
**Steps:**
1. Test all features in Chrome
2. Record any issues

**Results:**
```
[Record your findings here]
```

### Test 9.2: Firefox
**Steps:**
1. Test all features in Firefox
2. Record any issues

**Results:**
```
[Record your findings here]
```

### Test 9.3: Safari
**Steps:**
1. Test all features in Safari
2. Record any issues

**Results:**
```
[Record your findings here]
```

### Test 9.4: Edge
**Steps:**
1. Test all features in Edge
2. Record any issues

**Results:**
```
[Record your findings here]
```

---

## 🔟 Integration Testing

### Test 10.1: Full User Journey
**Steps:**
1. Register new account
2. Complete full onboarding (20 steps)
3. Navigate to ProfileDashboard
4. Edit profile information
5. Navigate to other pages (Dish Input, Stores, etc.)
6. Return to ProfileDashboard
7. Verify data persists

**Expected Results:**
- [ ] Entire flow works end-to-end
- [ ] Data persists across navigation
- [ ] No errors in console
- [ ] User experience is smooth

**Actual Results:**
```
[Record your findings here]
```

---

## 📊 Test Summary

**Total Tests:** 50+  
**Tests Passed:** ___  
**Tests Failed:** ___  
**Pass Rate:** ___%  

**Critical Issues Found:**
```
[List critical issues here]
```

**Minor Issues Found:**
```
[List minor issues here]
```

**Recommendations:**
```
[List recommendations here]
```

---

## ✅ Sign-Off

**Tester Name:** _______________  
**Date:** _______________  
**Status:** [ ] PASS [ ] FAIL [ ] PASS WITH ISSUES  

**Notes:**
```
[Additional notes here]
