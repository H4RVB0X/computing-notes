# Setting up the site

Three optional jobs, all done in a web browser. The site works without any of them.

| Job | Time | What it gives you |
|---|---|---|
| [1. Publish on GitHub Pages](#1-publish-on-github-pages) | 2 min | The live site at `https://h4rvb0x.github.io/computing-notes/` |
| [2. A Google Form for mistake reports](#2-a-google-form-for-mistake-reports) | 5 min | Classmates can report mistakes without a GitHub account |
| [3. Accounts and sync (Firebase)](#3-accounts-and-sync-firebase) | 15 min | Google sign-in; progress follows you between devices |

Settings you fill in all live in one file: [`site/js/config.js`](../site/js/config.js).

---

## 1. Publish on GitHub Pages

1. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` (or re-run the "Deploy to GitHub Pages" workflow from the **Actions** tab).

The workflow runs every content check first and only publishes if they all pass.

**Installing it as an app:** once it's live, open it on a phone. iPhone: Safari → Share → **Add to Home Screen**. Android/Chrome: menu → **Install app**. The Progress page has the same instructions. Offline mode and installing only work on the live site, not when `index.html` is opened as a file.

---

## 2. A Google Form for mistake reports

Every question and page has a **⚑ Report** link. Until you set this up it opens a pre-filled GitHub issue, which needs a GitHub account. A Google Form doesn't.

1. Go to [forms.google.com](https://forms.google.com) and create a blank form called "Report a mistake".
2. Add three questions:
   - **Where** (Short answer)
   - **Question** (Paragraph)
   - **What's wrong?** (Paragraph, Required)
3. **Settings → Responses:** turn **off** "Restrict to users in *your organisation*" if classmates might use personal accounts. Leave "Collect email addresses" off unless you want to reply.
4. Click **⋮ → Get pre-filled link**, type `x` in **Where** and `y` in **Question**, then **Get link → Copy link**. It looks like this:
   `https://docs.google.com/forms/d/e/1FAIpQLSc…/viewform?usp=pp_url&entry.1111111111=x&entry.2222222222=y`
5. In `site/js/config.js` fill in:
   ```js
   form: {
     url: "https://docs.google.com/forms/d/e/1FAIpQLSc…/viewform",
     fields: { where: "entry.1111111111", question: "entry.2222222222" },
   },
   ```
6. Commit and push. Reports arrive in the form's **Responses** tab, which you can link to a Google Sheet.

Once accounts are switched on (below), people who are signed in send reports straight to the database instead (Firestore → `reports`). Everyone else still uses the form.

---

## 3. Accounts and sync (Firebase)

The sign-in and sync code is already in the site (`site/js/sync.js`). It stays switched off until `apiKey` in `config.js` is filled in.

**What it does**
- A **Sign in with Google** button on the Progress page, plus a status chip in the sidebar.
- Progress stays in the browser, so the site still works offline and signed out. When signed in, a copy is kept in Firestore (one document per person) and merged with every device you use. Merging takes the best score, the furthest reading, all checklist ticks, the flashcard state with the most reviews, and the newest change for My mistakes.
- Text (exam answers, code drafts) from the device you're on wins unless it's empty.
- **Delete my cloud data** button. Settings such as theme and text size stay per device.

**Cost:** free on the Spark plan (50,000 reads and 20,000 writes a day; a class uses a tiny fraction).

### Steps

1. **Create the project.** Go to [console.firebase.google.com](https://console.firebase.google.com) → **Create a project** → name it, e.g. `cs-revision`. Google Analytics isn't needed.
2. **Turn on Google sign-in.** **Build → Authentication → Get started → Sign-in method → Google → Enable**, choose your support email, **Save**.
3. **Allow your site's domain.** **Authentication → Settings → Authorised domains → Add domain:** `h4rvb0x.github.io`.
4. **Create the database.** **Build → Firestore Database → Create database** → location **europe-west2 (London)** → **Start in production mode**.
5. **Set the security rules.** Firestore → **Rules** tab → replace everything with the contents of [`firebase/firestore.rules`](../firebase/firestore.rules) → **Publish**. These rules let each person read and write only their own progress, and let signed-in people send reports that nobody can read from the site.
6. **Register the web app.** **Project settings (⚙) → General → Your apps → Web (`</>`)**, give it a nickname, skip Hosting, **Register app**. Copy these four values from the `firebaseConfig` it shows into `site/js/config.js`:
   ```js
   firebase: {
     apiKey: "AIza…",
     authDomain: "cs-revision.firebaseapp.com",
     projectId: "cs-revision",
     appId: "1:…:web:…",
     allowedDomain: "",
   },
   ```
   These values are **not secret**: they only identify the project, and the security rules protect the data.
7. Commit and push. Open the live site → **Progress & settings → Sign in with Google**.

### Optional: only your school's accounts
- Set `allowedDomain: "yourschool.org.uk"` in `config.js`. The sign-in screen then offers school accounts first, and anyone else is signed straight back out.
- For real enforcement, also change `signedIn()` in the rules to the commented-out version with your domain, then **Publish**.
- **Check first** that your college's Google Workspace lets students sign in to outside apps. Some colleges block it. Test with one classmate's account before telling everyone.

### Optional: lock the key to your site
In [Google Cloud console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials), open the "Browser key", choose **Website restrictions** and add `https://h4rvb0x.github.io/*`. This stops other websites using your project's key.

### Things to know
- Sign-in needs internet. The rest of the site works offline, and changes sync next time you're online.
- **Privacy:** Firebase stores each person's Google email in your project's Authentication list, and you can see it. Firestore holds only an account id and progress. Don't add names to anything other students can see.
- **Resets:** "Reset all progress" while signed in resets the cloud copy and every device. "Reset my progress on this page" only resets this device, and another device may sync the old scores back.
- Reports sent by signed-in users are in **Firestore → Data → reports**.

### Alternatives considered

| Option | Why not |
|---|---|
| Sync codes / export file | Already there (Progress → Export/Import), but manual |
| Supabase | Free projects pause after about a week without use |
| GitHub Gist sync | Every classmate would need a GitHub account and a token |
| Own server | Costs money and doesn't fit GitHub Pages |
