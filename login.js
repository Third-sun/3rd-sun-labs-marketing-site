// Client sign in: find which portal an email belongs to, then go there.
//
// Every client portal keeps its own roster, and this page holds none of them.
// It asks each portal "is this email on your roster?" (POST /api/auth/lookup,
// a yes/no answer, rate limited) and goes to the one that says yes. Someone
// on several portals picks one. The portal then asks for the password: this
// page never sees one.

// One entry per client portal. Add a portal here when a client launches.
const PORTALS = [
  "https://portal.3rdsunlabs.com",
  "https://maidsct.portal.3rdsunlabs.com",
];

// The admin portal sits behind Google sign-in (IAP) and has no roster to ask,
// so it's offered to 3rd Sun Labs addresses; IAP decides who actually gets in.
const ADMIN = {
  name: "3rd Sun Labs admin",
  url: "https://admin.3rdsunlabs.com",
  domain: "3rdsunlabs.com",
};

const TIMEOUT_MS = 8000;

// Local testing only: on localhost, ?portals=http://localhost:8000,... points
// the page at portals running on this machine.
function portalUrls() {
  const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const override = new URLSearchParams(window.location.search).get("portals");
  if (local && override) return override.split(",").map((u) => u.trim()).filter(Boolean);
  return PORTALS;
}

const el = (id) => document.getElementById(id);

function showMessage(text, isError) {
  const msg = el("msg");
  msg.textContent = text;
  msg.classList.toggle("is-error", Boolean(isError));
  msg.hidden = !text;
}

async function ask(base, email) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // text/plain keeps this a "simple" request, so there's no CORS preflight.
    const response = await fetch(`${base}/api/auth/lookup`, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ email }),
      credentials: "omit",
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 429) return { base, failed: true, limited: true, message: body.message };
    if (!response.ok) return { base, failed: true };
    return { base, known: body.known === true, name: body.portal_name || base };
  } catch (_) {
    return { base, failed: true };
  } finally {
    clearTimeout(timer);
  }
}

function destination(portal, email) {
  if (portal.admin) return portal.url;
  // A fragment never reaches a server; the portal fills its email box from it
  // and removes it straight away.
  return `${portal.url}/#login=${encodeURIComponent(email)}`;
}

function go(portal, email) {
  window.location.assign(destination(portal, email));
}

function showChooser(portals, email) {
  const list = el("portalList");
  list.replaceChildren(
    ...portals.map((portal) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = destination(portal, email);
      link.textContent = portal.name;
      const host = document.createElement("span");
      host.textContent = new URL(portal.url).host;
      link.append(host);
      item.append(link);
      return item;
    })
  );
  el("findForm").hidden = true;
  el("chooser").hidden = false;
  list.querySelector("a")?.focus();
}

el("findForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = el("email");
  const email = input.value.trim().toLowerCase();
  if (!input.checkValidity() || !email.includes("@")) {
    showMessage("Enter the email address you use for your portal.", true);
    input.focus();
    return;
  }

  const button = el("continueBtn");
  button.disabled = true;
  button.textContent = "Finding your portal…";
  showMessage("");

  const results = await Promise.all(portalUrls().map((base) => ask(base, email)));
  const matches = results
    .filter((r) => r.known)
    .map((r) => ({ name: r.name, url: r.base }));
  if (email.endsWith(`@${ADMIN.domain}`)) {
    matches.push({ name: ADMIN.name, url: ADMIN.url, admin: true });
  }

  button.disabled = false;
  button.textContent = "Continue";

  if (matches.length === 1) {
    showMessage(`Taking you to ${matches[0].name}…`);
    go(matches[0], email);
    return;
  }
  if (matches.length > 1) {
    showChooser(matches, email);
    return;
  }

  const limited = results.find((r) => r.limited);
  if (limited) {
    showMessage(limited.message || "That's a lot of tries at once. Give it a few minutes and try again.", true);
  } else if (results.some((r) => r.failed)) {
    showMessage("We couldn't check that just now. Please try again in a moment.", true);
  } else {
    showMessage(
      "We couldn't find a portal for that email. Check the spelling, or email support@3rdsunlabs.com and we'll help.",
      true
    );
  }
  input.focus();
});

el("backBtn").addEventListener("click", () => {
  el("chooser").hidden = true;
  el("findForm").hidden = false;
  el("email").focus();
});
