# Phase 4 UI Testing Checklist

## Test Environment
- URL: https://minihack-foodtech.vercel.app
- Browser: Chrome/Safari
- Test Date: 2024-10-30

---

## 1. Menu Templates Page (/menu-templates)

### Navigation
- [ ] Navigate to /menu-templates from dashboard
- [ ] Page loads without errors
- [ ] All 8 templates display correctly

### Template Cards
- [ ] Quick & Easy Week card displays
- [ ] Gourmet Week card displays
- [ ] Budget-Friendly Week card displays
- [ ] High Protein Week card displays
- [ ] Meal Prep Week card displays
- [ ] Family-Friendly Week card displays
- [ ] Athletic Performance Week card displays
- [ ] Custom Menu card displays

### Template Selection
- [ ] Click on a template highlights it
- [ ] Selected template shows "SELECTED" badge
- [ ] Popular templates show "POPULAR" badge
- [ ] Template features list displays correctly
- [ ] Stats (Time, Level, Cost) display correctly

### Generate Menu
- [ ] Generate button appears when template selected
- [ ] Generate button shows loading state
- [ ] Success message appears after generation
- [ ] Redirects to /weekly-menu after generation
- [ ] Error handling works if generation fails

### Responsive Design
- [ ] Mobile view (< 768px) - cards stack vertically
- [ ] Tablet view (768px - 1024px) - 2 columns
- [ ] Desktop view (> 1024px) - 3 columns
- [ ] Fixed bottom bar with generate button works on mobile

---

## 2. Weekly Menu View (/weekly-menu)

### Initial Load
- [ ] Page loads without errors
- [ ] If no menu exists, shows "Generate Menu" prompt
- [ ] If menu exists, displays calendar view
- [ ] Loading state shows spinner

### Header Section
- [ ] Title displays correctly
- [ ] Week date range shows (Start - End)
- [ ] Favorite button works
- [ ] Shopping List button navigates correctly
- [ ] Export button shows (placeholder message)
- [ ] Regenerate button works

### Nutrition Summary
- [ ] Daily nutrition averages display
- [ ] Calories shown correctly
- [ ] Protein shown correctly
- [ ] Carbs shown correctly
- [ ] Fat shown correctly
- [ ] Fiber shown correctly
- [ ] Color coding matches nutrients

### View Mode Toggle
- [ ] Week View button works
- [ ] Day View button works
- [ ] Active view is highlighted
- [ ] Smooth transition between views

### Week View
- [ ] All 7 days display in grid
- [ ] Each day card shows day name and emoji
- [ ] Breakfast, Lunch, Dinner cards show
- [ ] Compact meal cards display correctly
- [ ] "View Full Day" button works
- [ ] Hover effects work on cards

### Day View
- [ ] Day selector shows all 7 days
- [ ] Selected day is highlighted
- [ ] Clicking day switches view
- [ ] Detailed meal cards display
- [ ] All meal information shows (ingredients, instructions, nutrition)

---

## 3. Meal Card Component

### Compact View (Week View)
- [ ] Meal type icon displays (🍳 🥗 🍽️)
- [ ] Meal name displays
- [ ] Time displays correctly
- [ ] Calories display correctly
- [ ] Swap button works
- [ ] Hover effect works

### Detailed View (Day View)
- [ ] Gradient header with meal type
- [ ] Meal name and description
- [ ] Quick stats (Time, Calories, Protein, Servings)
- [ ] Ingredients list displays
- [ ] Shows first 8 ingredients
- [ ] "+X more ingredients" if > 8
- [ ] Instructions display
- [ ] Shows first 3 steps
- [ ] "+X more steps" if > 3
- [ ] Nutrition facts section
- [ ] All nutrition values display
- [ ] Swap button in header works

### Empty State
- [ ] Shows "No meal planned" message
- [ ] Dashed border displays
- [ ] Icon shows correctly

---

## 4. Swap Meal Modal

### Modal Display
- [ ] Modal opens when clicking Swap
- [ ] Backdrop blur effect works
- [ ] Modal is centered
- [ ] Close button (X) works
- [ ] Click outside closes modal

### Current Meal Section
- [ ] Current meal displays in gray box
- [ ] Meal name shows
- [ ] Description shows
- [ ] Day and meal type display in header

### Search & Generate
- [ ] Search input works
- [ ] Search filters suggestions
- [ ] Generate New button works
- [ ] Loading state shows during generation
- [ ] New suggestions load after generation

### Suggestions Grid
- [ ] 4 suggestions display (2x2 grid on desktop)
- [ ] Each suggestion card shows:
  - [ ] Meal name
  - [ ] Description
  - [ ] Time
  - [ ] Calories
  - [ ] Protein
- [ ] Clicking suggestion selects it
- [ ] Selected suggestion shows heart icon
- [ ] Selected suggestion has green border

### Feedback Section
- [ ] Feedback textarea appears when meal selected
- [ ] Placeholder text shows
- [ ] Character input works
- [ ] Helper text displays

### Footer Actions
- [ ] Cancel button works
- [ ] Swap Meal button disabled when no selection
- [ ] Swap Meal button enabled when meal selected
- [ ] Swap completes successfully
- [ ] Success message shows
- [ ] Modal closes after swap
- [ ] Menu refreshes with new meal

---

## 5. API Integration Testing

### Weekly Menu API
- [ ] GET /api/weekly-menu/current works
- [ ] POST /api/weekly-menu/generate works
- [ ] POST /api/weekly-menu/swap-meal works
- [ ] POST /api/weekly-menu/shopping-list works
- [ ] Auth tokens passed correctly
- [ ] Error responses handled gracefully

### Error Handling
- [ ] 404 (No menu) shows generate prompt
- [ ] 401 (Unauthorized) redirects to login
- [ ] 500 (Server error) shows error message
- [ ] Network errors show retry option
- [ ] Loading states show during API calls

---

## 6. Responsive Design Testing

### Mobile (< 768px)
- [ ] Templates: 1 column layout
- [ ] Weekly menu: Cards stack vertically
- [ ] Day selector: Horizontal scroll
- [ ] Modal: Full screen on mobile
- [ ] Buttons: Full width
- [ ] Text: Readable font sizes
- [ ] Touch targets: Minimum 44px

### Tablet (768px - 1024px)
- [ ] Templates: 2 column layout
- [ ] Weekly menu: 2 column grid
- [ ] Modal: Centered with padding
- [ ] Navigation: Horizontal layout

### Desktop (> 1024px)
- [ ] Templates: 3 column layout
- [ ] Weekly menu: 3 column grid
- [ ] Modal: Max width with margins
- [ ] All hover effects work

---

## 7. Animation & Performance

### Animations
- [ ] Page transitions smooth
- [ ] Card hover effects smooth
- [ ] Modal open/close animated
- [ ] Loading spinners rotate smoothly
- [ ] Progress bar animates
- [ ] Button states transition smoothly

### Performance
- [ ] Page loads < 3 seconds
- [ ] No layout shifts
- [ ] Images load progressively
- [ ] Smooth scrolling
- [ ] No janky animations
- [ ] Memory usage reasonable

---

## 8. Edge Cases

### No Menu State
- [ ] Shows generate prompt
- [ ] Generate button works
- [ ] No errors in console

### Empty Meal Slots
- [ ] Shows "No meal planned"
- [ ] Doesn't break layout
- [ ] Can still navigate

### Long Text
- [ ] Long meal names truncate
- [ ] Long descriptions wrap
- [ ] Doesn't break layout

### Network Issues
- [ ] Offline: Shows error message
- [ ] Slow connection: Shows loading
- [ ] Timeout: Shows retry option

---

## 9. Browser Compatibility

### Chrome
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### Safari
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

---

## 10. Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modal
- [ ] Focus visible on all elements

### Screen Reader
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form inputs have labels
- [ ] ARIA labels where needed

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Meets WCAG AA standards
- [ ] Color not sole indicator

---

## Test Results Summary

**Total Tests:** ~150
**Passed:** ___
**Failed:** ___
**Blocked:** ___

**Critical Issues:** ___
**Minor Issues:** ___

**Overall Status:** ⬜ PASS / ⬜ FAIL

---

## Notes & Issues Found

[Document any bugs, issues, or improvements needed]
