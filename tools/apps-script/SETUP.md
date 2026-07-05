# Invitation backend — one-time setup (~10 minutes)

The invite page (`…/Wedding/invite/?g=<token>`) needs a tiny backend to look up
guests, log opens, and store RSVPs. It runs **inside your own Google account**
as a Google Sheet + Apps Script — free, private, no servers.

Only you can do this part (it's your Google account). Everything is copy-paste.

## 1. Create the spreadsheet

1. Go to **[sheets.new](https://sheets.new)** (logged in as the account that
   should own the guest list).
2. Name it, e.g. **“Wedding — Guest List”** (top-left).
3. *(Recommended)* **File → Settings → Time zone → (GMT+04:00) Yerevan** so all
   timestamps show in wedding-local time.

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**. An editor opens with an empty
   `Code.gs`.
2. Delete its contents and **paste the entire [`Code.gs`](Code.gs)** from this
   folder. **Save** (⌘S).

## 3. Initialize

1. In the editor's toolbar, select the function **`setup`** and press **Run**.
2. Google will ask for authorization (first run only): **Review permissions →
   choose your account → Advanced → Go to … (unsafe) → Allow.**
   (It says “unsafe” only because the script isn't a published add-on — it's
   your own code, in your own account, touching only this spreadsheet.)
3. Back in the sheet you'll see three tabs: **Guests**, **Opens**, **RSVPs**,
   and a new **Invitations** menu in the menu bar.

## 4. Deploy the web app

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the ⚙️ next to “Select type” → **Web app**.
3. Settings — these two matter:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. **Deploy** → copy the **Web app URL** (ends in `/exec`).
5. **Send that URL to Claude / paste it into `site/invite/invite.js`**
   (the `SCRIPT_URL` line in `CONFIG` at the top). That's the only wiring step.

> “Anyone” only exposes these two operations: *log an open + return one guest's
> info for a valid token* and *record an RSVP for a valid token*. Invalid
> tokens get nothing. The spreadsheet itself stays private.

## 5. Day-to-day: adding guests & sending links

1. In **Guests**, add a row per invitation (one per household/party):

   | column | what to put |
   |---|---|
   | `party_name` | What the page greets: “Anna & Sergey”, “The Ivanovs” |
   | `lang` | Default page language: `en`, `ru`, or `hy` |
   | `abroad` | ✅ tick if they fly in — the page will ask their arrival date |
   | `members` | Comma-separated first names, e.g. `Anna, Sergey, Misha` — each appears on the page with their own **Coming / Can't come** toggle (everyone starts as Coming) |

   The per-person answers land in `member_rsvp` (e.g. `Anna ✓ · Sergey ✕`),
   with `attending_count` holding how many are coming.

2. **Invitations → Generate links for new rows** — fills `token` + `link`.
3. Copy the `link` cell, send it to the guest (Telegram/WhatsApp/etc.).

Everything else fills itself as guests open links and respond:
`last_opened_at`, `open_count`, `last_ip`, `last_city`, `rsvp_status`
(`coming`/`declined`), `attending_count`, `restrictions`, `arrival_date`,
`message`, `responded_at` — plus full history in the **Opens** and **RSVPs**
tabs.

## Updating the script later (gotcha!)

If `Code.gs` changes after you've deployed: paste the new code, save, then
**Deploy → Manage deployments → ✏️ (edit) → Version: “New version” → Deploy.**
Saving alone does **not** update the live endpoint — but the URL never changes,
so the site needs no edits.

## Notes & limits

- **IP/city are best-effort.** Apps Script can't see the visitor's IP, so the
  page looks it up client-side (ipapi.co) and sends it along. Ad-blockers may
  blank it; the open timestamp itself always logs.
- Messenger link-preview bots don't run JavaScript, so previews do **not**
  count as opens — `open_count` means a human actually opened the page.
- A token is the only key: anyone with a guest's exact link can view their
  invitation and update their RSVP. Tokens are 10 random characters
  (unguessable); links are only as private as the chats you send them in.
