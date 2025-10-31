# 🧪 Questionnaire Enhancement - Testing Guide

## ⏱️ Estimated Time: 10 minutes

---

## 🎯 Test 1: New Questions (3 min)

### **Step 4: Vegan Journey**
1. ✅ Go to https://minihack-foodtech.vercel.app
2. ✅ Register/Login
3. ✅ Navigate to Step 4 "Your Vegan Journey"
4. ✅ **Test Duration Selection:**
   - Click each option (Just Starting, <6 months, 6-12 months, 1-2 years, 2+ years)
   - Verify selection highlights in green
   - Verify only one can be selected at a time
5. ✅ **Test Motivations:**
   - Click multiple motivations (Health, Environment, Animal Welfare, etc.)
   - Verify multiple selections work
   - Verify selections highlight in green
6. ✅ **Test Validation:**
   - Try clicking "Continue" without selecting duration → Should be disabled
   - Try clicking "Continue" without selecting motivations → Should be disabled
   - Select both → "Continue" button should enable
7. ✅ Click "Continue" → Should go to Step 5

**Expected Result:** ✅ All selections work, validation works, proceeds to next step

---

### **Step 6: Health Profile**
1. ✅ Navigate to Step 6 "Health Profile"
2. ✅ **Verify Optional Banner:**
   - Blue banner at top says "Optional: This helps us provide better recommendations"
3. ✅ **Test Health Conditions:**
   - Click multiple conditions (Diabetes, High BP, etc.)
   - Verify multiple selections work
   - Click "None" → Should work
4. ✅ **Test Pregnancy Checkbox:**
   - Click "I am currently pregnant 🤰"
   - Verify checkbox toggles
5. ✅ **Test Breastfeeding Checkbox:**
   - Click "I am currently breastfeeding 🤱"
   - Verify checkbox toggles
6. ✅ **Test Skip Button:**
   - Verify "Skip" button appears next to "Continue"
   - Click "Skip" → Modal should appear (Test 2)
7. ✅ **Test Continue Without Selection:**
   - Don't select anything
   - Click "Continue" → Should work (optional step)

**Expected Result:** ✅ Optional step works, can skip or continue without selection

---

### **Step 7: Fitness & Activity**
1. ✅ Navigate to Step 7 "Fitness & Activity"
2. ✅ **Verify Optional Banner:**
   - Blue banner says "Optional: Help us tailor nutrition for your activity level"
3. ✅ **Test Activity Level:**
   - Click each level (Sedentary, Lightly Active, Moderately Active, Very Active, Athlete)
   - Verify selection highlights
   - Verify description shows
4. ✅ **Test Exercise Types:**
   - Click multiple types (Cardio, Strength, Yoga, Sports, etc.)
   - Verify multiple selections work
   - Click "None" → Should work
5. ✅ **Test Fitness Goals:**
   - Click multiple goals (Maintain, Lose, Gain, Endurance, etc.)
   - Verify multiple selections work
6. ✅ **Test Skip Button:**
   - Verify "Skip" button appears
   - Click "Skip" → Modal should appear (Test 2)
7. ✅ **Test Continue Without Selection:**
   - Don't select anything
   - Click "Continue" → Should work (optional step)

**Expected Result:** ✅ All fitness options work, can skip or continue

---

## 🚫 Test 2: Skip Confirmation Modal (2 min)

### **On Health Profile (Step 6):**
1. ✅ Click "Skip" button
2. ✅ **Verify Modal Appears:**
   - Modal has dark overlay
   - Warning icon ⚠️ at top
   - Title: "Skip This Step?"
   - Message: "This information helps us provide better personalized recommendations..."
   - Two buttons visible
3. ✅ **Test "Go Back & Fill It Out" Button:**
   - Click button
   - Modal should close
   - Should stay on Step 6
4. ✅ **Test "Skip Anyway" Button:**
   - Click "Skip" again
   - Click "Skip Anyway"
   - Modal should close
   - Should proceed to Step 7

### **On Fitness (Step 7):**
1. ✅ Click "Skip" button
2. ✅ Verify same modal appears
3. ✅ Click "Skip Anyway"
4. ✅ Should proceed to Step 8

**Expected Result:** ✅ Modal works, both buttons function correctly

---

## 💾 Test 3: Auto-Save to localStorage (3 min)

### **Test Save Functionality:**
1. ✅ Start fresh onboarding (clear localStorage first)
2. ✅ Complete Steps 1-5
3. ✅ On Step 6, select some health conditions
4. ✅ **Open Browser DevTools:**
   - Press F12 or Cmd+Option+I
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Click "Local Storage" → Your domain
5. ✅ **Verify Data Saved:**
   - Should see `onboarding_step` = "5" (or current step)
   - Should see `onboarding_data` = JSON object with your selections
6. ✅ **Close Browser Tab** (don't complete onboarding)

### **Test Resume Functionality:**
1. ✅ Reopen https://minihack-foodtech.vercel.app
2. ✅ Login with same account
3. ✅ Go to onboarding
4. ✅ **Verify Resume:**
   - Should start at Step 6 (where you left off)
   - Should have your previous selections filled in
   - Progress bar should show correct step

### **Test Clear on Completion:**
1. ✅ Complete all remaining steps
2. ✅ Click "Get Started! 🚀" on final step
3. ✅ Should redirect to Dashboard
4. ✅ **Check localStorage:**
   - `onboarding_step` should be deleted
   - `onboarding_data` should be deleted

**Expected Result:** ✅ Progress saves, resumes correctly, clears on completion

---

## 🔄 Test 4: No Questionnaire Loop (1 min)

### **Test Completed User:**
1. ✅ Complete onboarding fully
2. ✅ Should redirect to Dashboard
3. ✅ **Try to access onboarding again:**
   - Manually go to `/onboarding` URL
   - Should immediately redirect back to Dashboard
   - Should NOT see onboarding questions

### **Test New User:**
1. ✅ Register new account
2. ✅ Should see onboarding
3. ✅ Complete onboarding
4. ✅ Should redirect to Dashboard
5. ✅ Should NOT loop back to onboarding

**Expected Result:** ✅ No loop, completed users can't access onboarding

---

## ✨ Test 5: Update Profile Banner (1 min)

### **On Dashboard:**
1. ✅ After completing onboarding, check Dashboard
2. ✅ **Verify Banner Appears:**
   - Green gradient banner at top
   - Sparkle icon ✨
   - Title: "Your Profile is Set Up!"
   - Message: "Want to update your preferences? You can edit your profile anytime."
   - "Update Profile" button (white with green text)
3. ✅ **Test Button:**
   - Click "Update Profile"
   - Should navigate to `/profile` page
   - Should see profile edit form

**Expected Result:** ✅ Banner shows, button works

---

## 📊 Test 6: Complete Flow (Bonus - 5 min)

### **Full End-to-End Test:**
1. ✅ Register new user
2. ✅ Complete all 20 steps:
   - Step 1: Welcome
   - Step 2: Personal Info (age)
   - Step 3: Household (type + size)
   - Step 4: Vegan Journey (duration + motivations) ← NEW
   - Step 5: Dietary Goals
   - Step 6: Health Profile (optional, test skip) ← NEW
   - Step 7: Fitness & Activity (optional, test skip) ← NEW
   - Step 8: Dietary Restrictions
   - Step 9: Food Allergies
   - Step 10: Favorite Cuisines
   - Step 11: Ingredient Preferences
   - Step 12: Texture & Flavor
   - Step 13: Cooking Skills
   - Step 14: Kitchen Equipment
   - Step 15: Meal Planning
   - Step 16: Health Goals
   - Step 17: Budget & Shopping
   - Step 18: Your Location
   - Step 19: Additional Notes
   - Step 20: All Set! 🎉
3. ✅ **Verify Progress Bar:**
   - Shows "Step X of 20" throughout
   - Progress percentage increases
4. ✅ Click "Get Started! 🚀"
5. ✅ Should redirect to Dashboard
6. ✅ Should see "Update Profile" banner
7. ✅ **Check Profile Page:**
   - Go to Profile
   - Verify Vegan Journey data saved
   - Verify Health Profile data saved
   - Verify Fitness data saved

**Expected Result:** ✅ All 20 steps work, data saves, no errors

---

## ✅ Success Criteria:

- [ ] All 3 new questions render correctly
- [ ] Skip button appears on optional steps only
- [ ] Skip modal works (both buttons)
- [ ] Auto-save saves progress
- [ ] Auto-save resumes from last step
- [ ] localStorage clears on completion
- [ ] No questionnaire loop for completed users
- [ ] Update Profile banner shows on Dashboard
- [ ] All 20 steps complete successfully
- [ ] Data saves to database correctly

---

## 🐛 If You Find Bugs:

**Report Format:**
```
Bug: [Description]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
Expected: [What should happen]
Actual: [What actually happened]
Screenshot: [If applicable]
```

---

## 📝 Testing Notes:

**Browser:** Chrome/Firefox/Safari  
**Device:** Desktop/Mobile  
**URL:** https://minihack-foodtech.vercel.app  
**Test Date:** [Today's date]  
**Tester:** [Your name]  

---

## 🎉 After Testing:

If all tests pass:
- ✅ Mark task as complete
- ✅ Celebrate! 🎊

If bugs found:
- ❌ Report bugs
- ⚠️ I'll fix them
- 🔄 Re-test after fixes
