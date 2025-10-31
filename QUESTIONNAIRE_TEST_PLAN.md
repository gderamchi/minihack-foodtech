# 🧪 Questionnaire Enhancement - Test Plan

## 📋 Test Checklist

### **Test 1: Vegan Journey Step (Step 4)**

**URL:** https://minihack-foodtech.vercel.app

**Steps:**
1. Register/Login to the app
2. Start onboarding questionnaire
3. Navigate to Step 4 "Your Vegan Journey"

**Test Cases:**

✅ **TC1.1: Duration Selection**
- [ ] Click each duration option (Just Starting, <6 months, 6-12 months, 1-2 years, 2+ years)
- [ ] Verify selected option highlights in green
- [ ] Verify only one duration can be selected at a time
- [ ] Verify icon and description display correctly

✅ **TC1.2: Motivations Multi-Select**
- [ ] Click multiple motivation options (Health, Environment, Animal Welfare, etc.)
- [ ] Verify multiple selections highlight in green
- [ ] Verify clicking again deselects
- [ ] Verify all 6 options are clickable

✅ **TC1.3: Validation**
- [ ] Try clicking "Continue" without selecting duration
- [ ] Verify button is disabled
- [ ] Try clicking "Continue" without selecting motivations
- [ ] Verify button is disabled
- [ ] Select both duration AND at least one motivation
- [ ] Verify "Continue" button becomes enabled
- [ ] Click "Continue" and verify it moves to next step

**Expected Result:** Step works perfectly, validation prevents proceeding without both fields

---

### **Test 2: Health Profile Step (Step 6)**

**Steps:**
1. Continue through questionnaire to Step 6 "Health Profile"

**Test Cases:**

✅ **TC2.1: Optional Step Notice**
- [ ] Verify blue banner displays: "Optional: This helps us provide better recommendations. You can skip this step."
- [ ] Verify "Continue" button is enabled even without selections

✅ **TC2.2: Health Conditions Multi-Select**
- [ ] Click multiple health condition options
- [ ] Verify selections highlight in green
- [ ] Verify clicking again deselects
- [ ] Verify all 8 options are clickable (Diabetes, High BP, High Cholesterol, Heart Disease, Digestive Issues, Thyroid, PCOS, None)

✅ **TC2.3: Pregnancy Checkbox**
- [ ] Click "I am currently pregnant 🤰" checkbox
- [ ] Verify checkbox becomes checked
- [ ] Click again to uncheck
- [ ] Verify checkbox becomes unchecked

✅ **TC2.4: Breastfeeding Checkbox**
- [ ] Click "I am currently breastfeeding 🤱" checkbox
- [ ] Verify checkbox becomes checked
- [ ] Click again to uncheck
- [ ] Verify checkbox becomes unchecked

✅ **TC2.5: Skip Functionality**
- [ ] Without selecting anything, click "Continue"
- [ ] Verify it proceeds to next step (Step 7 "Dietary Restrictions")

**Expected Result:** Optional step works, can skip or fill, checkboxes work correctly

---

### **Test 3: Complete Questionnaire Flow**

**Test Cases:**

✅ **TC3.1: Step Count**
- [ ] Verify questionnaire shows "Step X of 19" (not 18 or 17)
- [ ] Verify progress bar updates correctly
- [ ] Complete all 19 steps

✅ **TC3.2: Data Persistence**
- [ ] Complete entire questionnaire including new fields
- [ ] Click "Get Started! 🚀" on final step
- [ ] Verify redirect to dashboard (not back to onboarding)
- [ ] Check browser console for errors

✅ **TC3.3: Profile Data**
- [ ] Navigate to Profile page
- [ ] Verify new data is saved:
  - Vegan duration
  - Motivations
  - Health conditions
  - Pregnancy status
  - Breastfeeding status

**Expected Result:** All 19 steps work, data saves correctly, redirects to dashboard

---

### **Test 4: Edge Cases**

✅ **TC4.1: Back Navigation**
- [ ] On Step 4 (Vegan Journey), make selections
- [ ] Click "Back" to Step 3
- [ ] Click "Continue" to return to Step 4
- [ ] Verify selections are preserved

✅ **TC4.2: Multiple Selections**
- [ ] On Step 4, select all 6 motivations
- [ ] Verify all highlight correctly
- [ ] Deselect one
- [ ] Verify only 5 remain selected

✅ **TC4.3: Pregnancy + Breastfeeding**
- [ ] On Step 6, check both pregnancy AND breastfeeding
- [ ] Verify both can be checked simultaneously
- [ ] Continue to next step
- [ ] Go back and verify both remain checked

**Expected Result:** No bugs, selections persist, edge cases handled

---

### **Test 5: Removed "Current Diet" Step**

✅ **TC5.1: Step Removed**
- [ ] Go through entire questionnaire
- [ ] Verify there is NO step asking "What is your current diet?"
- [ ] Verify step numbers are sequential (no gaps)

**Expected Result:** Old "Current Diet" step is completely removed

---

## 🐛 Bug Report Template

If you find any issues, please report using this format:

```
**Bug:** [Brief description]
**Step:** [Which step/test case]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Screenshot:** [If possible]
**Console Errors:** [Any errors in browser console]
```

---

## ✅ Test Results Summary

After testing, please provide:

**Passed:** X/5 test sections  
**Failed:** X/5 test sections  
**Bugs Found:** [List any bugs]  
**Overall Status:** ✅ Ready / ❌ Needs Fixes  

---

## 📝 Notes

- Test in Chrome/Firefox/Safari if possible
- Clear browser cache before testing
- Check browser console (F12) for errors
- Test on both desktop and mobile if possible

---

**Testing URL:** https://minihack-foodtech.vercel.app

**Estimated Testing Time:** 10-15 minutes

**Priority:** HIGH - New features need validation before continuing
