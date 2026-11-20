# Website audit and visual refresh
Date: 2026-11-20

## Existing content
- Five destination configurations: Singapore, Malta, Hawaii, Jamaica and Ireland.
- Singapore: external Hub and three inline activities (Hawker Culture, Singlish, MRT).
- Other lesson entries are mostly planned content with empty URLs.
- Cultural passport and gates are previews; they do not award stamps yet.
- Teacher curriculum overview is present. It is a public view, not an authenticated teacher portal.

## Findings and changes
- Supabase was created unconditionally at module load. Missing/invalid environment values could stop the entire application. Cloud connection is now optional; browser progress works without it.
- Dashboard destination buttons called navigation after selection, clearing the destination. Selection now goes directly to the chosen module.
- Search input had no behavior. Search now finds destinations and level-appropriate lesson titles/descriptions.
- Progress and settings were placeholders. They now show real completion and allow nickname/level preferences.
- Malta's module status was counted as learner completion. Publication state and learner completion are now separate.
- Country detail showed other levels' lessons despite claiming to filter. It now filters lessons by the chosen level.
- Completion is saved in browser storage before optional sync; unavailable cloud sync cannot block the completion banner.
- Returning to a completed lesson retains its completion state, with a review option for inline activities.
- External activities open explicitly in a new tab from the lesson screen, with a return-and-complete action; no blank embedded iframe.
- Random placeholder photos replaced with destination-specific photographs and attribution.
- Updated dashboard, destination cards, shell, typography, colors, responsive navigation, lesson palette, metadata and favicon.
- Added keyboard focus, skip link, dialog labeling/focus containment and keyboard-operable flashcards.
- Explanations no longer imply that a nickname is a secure account or guarantees cross-device persistence.

## Verification
- TypeScript: tsc --noEmit passes.
- Standard Vite build is blocked locally by Windows subprocess permissions (spawn EPERM).
- An equivalent unminified Vite/Rollup QA build uses in-process TypeScript transforms, disables the subprocess-dependent define transform, and intentionally builds without Supabase environment variables. It passes. Production npm scripts and dependency lock remain unchanged.
- Browser checks: startup without environment variables; dashboard-to-Singapore navigation; Hawker activity render; external-lesson completion; progress counter; completion after reload; search for Hawker; all five destination photos loaded.
- Mobile review at 390px: dashboard, destinations and bottom navigation; no horizontal overflow in the tested destination page.
- Passport gates, cloud synchronization with a real database and external lesson content are not certified by this visual refresh.

## Follow-up content work
Link or build the planned lessons. Connect authenticated student accounts before relying on cloud records for individual assessment. Implement passport awards when gate tasks and assessment rules are ready.
