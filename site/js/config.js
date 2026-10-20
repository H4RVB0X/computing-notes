/* =====================================================================
   config.js — site settings you may want to change
   ===================================================================== */
window.CS = window.CS || {};
CS.config = {
  /* "Report a mistake" buttons. Reports go to the first destination that is set up:
     1. the Firebase database, when accounts are switched on (see firebase below) and the person is signed in
     2. a Google Form, if `form.url` is filled in (no account needed — best for a class)
     3. otherwise a new GitHub issue (the reporter needs a GitHub account)
     To use a Google Form: make a form with questions "Where", "Question" and "What's wrong?",
     choose ⋮ → "Get pre-filled link", type anything in the first two, copy the link and read off
     their entry.123456 numbers. The person reporting types the third. See docs/SETUP.md. */
  report: {
    form: {
      url: "https://docs.google.com/forms/d/e/1FAIpQLSd2fpJeI-ORMJQ2_5yq54F5oTY3lV4ALzBwQt-CM4PKXv2FGg/viewform",
      fields: { where: "entry.729118475", question: "entry.2069445263" }, // "What's wrong?" is typed by the reporter
    },
    github: "https://github.com/H4RVB0X/computing-notes/issues/new",
  },

  /* Accounts and cross-device sync (Firebase + Google sign-in). Leave `apiKey` empty to keep accounts
     switched off. Paste the firebaseConfig object from the Firebase console here — it is not a secret.
     See docs/SETUP.md for the 15-minute setup. */
  firebase: {
    apiKey: "AIzaSyDhFPqMddvUUk2gdpquYGUWF3U-62WtoJ8",
    authDomain: "cs-revision-e2e4a.firebaseapp.com",
    projectId: "cs-revision-e2e4a",
    appId: "1:899579933016:web:e194ae5c51d63e860bb52d",
    // optional: only allow Google accounts from this email domain, e.g. "myschool.org.uk"
    allowedDomain: "",
  },
};
