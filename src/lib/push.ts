import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

let configured = false;

export function ensureWebPushConfigured() {
  if (configured) return;
  if (!publicKey || !privateKey) {
    throw new Error("Missing VAPID keys in environment.");
  }
  webpush.setVapidDetails("mailto:admin@mindful.local", publicKey, privateKey);
  configured = true;
}

export { webpush };
