# Accounts plan (not built yet)

The site is static and hosted on GitHub Pages, so it has no server of its own. Accounts need a hosted "backend as a service". The recommended option is **Firebase with Google sign-in**.

## Recommended: Firebase Authentication + Cloud Firestore

**How it would work**
- A **Sign in with Google** button in the sidebar. Classmates use their school Google account.
- Progress keeps living in the browser (the current system), so the site still works offline and signed out.
- When signed in, progress is copied to one Firestore document per person (`users/{uid}`) and pulled down on other devices. Sync happens a few seconds after each change, not on every keystroke.
- Merging when two devices disagree: take the **best** quiz/exam score, the **furthest** reading progress, the **union** of checklist ticks, and the **most recent** flashcard state.
- The "Don't save on this device" switch still works: signed in plus not saving means cloud only, nothing left on a shared PC.

**Keeping it to your class**
- Security rules so each person can only read and write their own document.
- Optional: only allow sign-ins from your school's email domain (for example `@yourschool.org.uk`).
- Firebase's "authorised domains" setting stops other websites using your project.

**Cost:** free. The Spark plan allows 50,000 reads and 20,000 writes a day, far more than a class needs.

**What you would do (about 15 minutes):**
1. Go to console.firebase.google.com and create a project. Google Analytics isn't needed.
2. In Authentication, enable the Google provider and add your GitHub Pages domain (`<username>.github.io`) to the authorised domains.
3. Create a Firestore database (production mode, UK/EU region).
4. Under Project settings, add a Web app and copy the small `firebaseConfig` object. This is safe to publish: it identifies the project and isn't a secret.
5. Send it to me. I'd add the sign-in button, the sync code and the security rules.

**Optional extras later**
- Class leaderboard: opt-in, with nicknames rather than real names.
- A teacher view showing which topics the class is weakest on.

**Things to know**
- The Firebase scripts load from Google's servers, so sign-in needs internet access. The rest of the site still works offline.
- Signing in stores each person's name, email and progress in your Firebase project, which makes you responsible for that data. Keep it minimal: no real names on any leaderboard, and a "delete my data" button.
- Accounts don't hide pages. Anything on GitHub Pages, including the Piles O' Tiles section, stays readable by anyone with the link unless it is encrypted separately.

## Alternatives considered

| Option | Pros | Cons |
|---|---|---|
| Sync codes / export file (no accounts) | No setup, no personal data, works offline | Manual: copy a code or file to each device |
| Supabase + email magic link | Free, proper database | Free projects pause after about a week of inactivity, which is annoying for a class site |
| GitHub Gist sync | Uses GitHub | Every classmate needs a GitHub account and a personal token, which is fiddly |
| Own server | Full control | Hosting cost and maintenance, and it doesn't fit GitHub Pages |
