# IKEA UK Gmail OTP Autofiller — Firefox Extension

A Firefox extension paired with a Google Apps Script that automatically fetches your IKEA one-time login code from Gmail and pastes it (along with your email address) directly into the IKEA login page.

---

## How It Works

1. You visit the IKEA login page and click **"1. Paste Email"** — your saved email is injected into the field automatically.
2. IKEA sends a 6-digit OTP to your Gmail inbox.
3. You click **"2. Fetch & Paste OTP"** — the extension calls your Google Apps Script, which searches your Gmail for the latest unread IKEA code email, extracts the code, marks it as read, and returns it.
4. The extension pastes the code into the OTP field on the page.

---

## Prerequisites

- A Google account (Gmail) that receives IKEA login codes
- A Firefox browser (desktop)
- A Google account to host the Apps Script (can be the same account)

---

## Part 1: Setting Up the Google Apps Script

The script runs in your Google account and acts as a private API endpoint that reads your Gmail on demand.

### Step 1 — Create the Script

1. Go to [https://script.google.com](https://script.google.com) and sign in with the Gmail account that receives IKEA emails.
2. Click **New Project** (top left).
3. Delete any placeholder code in the editor.
4. Copy and paste the entire contents of `script.gs` from this repository into the editor.
5. Click the floppy disk icon or press **Ctrl+S** to save. Give the project a name (e.g. `IKEA OTP Fetcher`).

### Step 2 — Deploy as a Web App

1. Click **Deploy** (top right) → **New deployment**.
2. Click the gear icon ⚙ next to **Select type** and choose **Web app**.
3. Fill in the fields:
   - **Description:** anything you like (e.g. `v1`)
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` *(this makes it callable from the extension without OAuth — see [Security Notes](#security-notes) below)*
4. Click **Deploy**.
5. When prompted, click **Authorise access** and follow the Google sign-in flow to grant the script permission to read your Gmail.
6. After authorisation, Google will show you a **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   **Copy this URL and keep it somewhere safe.** You will paste it into the extension settings.

> **Note:** If you ever edit `script.gs`, you must create a **new deployment** (Deploy → New deployment) for the changes to take effect. Editing the script does not automatically update an existing deployment.

---

## Part 2: Installing the Firefox Extension

You have two options: install it as a **temporary local extension** (for personal use / testing, no signing required) or **sign and package it** as a proper `.xpi` file via Mozilla's submission process.

---

### Option A — Temporary Local Installation (Easiest)

This loads the extension directly from the source folder. It works immediately but **does not persist across browser restarts** — you'll need to reload it each time.

1. Open Firefox and navigate to `about:debugging`.
2. Click **This Firefox** in the left sidebar.
3. Click **Load Temporary Add-on…**
4. Browse to the folder containing the extension files and select the `manifest.json` file.
5. The extension will appear in the list and its icon will appear in the Firefox toolbar.

To reload after a browser restart, repeat from step 3.

---

### Option B — Signed `.xpi` Package (Permanent Install)

Mozilla requires Firefox extensions to be signed before they can be installed permanently. You can sign an extension for **personal use only** (unlisted) without a full public review.

#### Step 1 — Create a Mozilla Developer Account

1. Go to [https://addons.mozilla.org](https://addons.mozilla.org) and click **Register** (top right).
2. Create a free account and verify your email address.

#### Step 2 — Package the Extension Files

Zip all the extension files into a single `.zip` archive. The files must be at the **root level** of the zip — not inside a subfolder.

On Linux/macOS (terminal):
```bash
cd /path/to/extension-folder
zip -r ikea-otp-autofiller.zip manifest.json popup.html popup.js options.html options.js icon.png
```

On Windows (PowerShell):
```powershell
Compress-Archive -Path manifest.json, popup.html, popup.js, options.html, options.js, icon.png -DestinationPath ikea-otp-autofiller.zip
```

#### Step 3 — Submit for Signing (Unlisted)

1. Go to [https://addons.mozilla.org/developers/](https://addons.mozilla.org/developers/) and sign in.
2. Click **Submit a New Add-on**.
3. Select **On your own** (this means unlisted — it won't be published publicly).
4. Click **Continue**.
5. Upload the `.zip` file you created.
6. Follow the prompts. You may be asked to provide:
   - A description of what the extension does
   - Answers to questions about permissions used (explain that `scripting` and `activeTab` are used to inject the email/OTP into the active tab, and `storage` is used to save your settings)
7. Mozilla will automatically sign the extension. This usually takes a few minutes.
8. Download the resulting `.xpi` file.

#### Step 4 — Install the Signed `.xpi`

1. Open Firefox.
2. Drag and drop the `.xpi` file into a Firefox window, **or** go to `about:addons` → click the gear icon ⚙ → **Install Add-on From File…** and select the `.xpi`.
3. Click **Add** when prompted.
4. The extension is now permanently installed and will survive browser restarts.

---

## Part 3: Configuring the Extension

1. Click the extension icon in the Firefox toolbar.
2. Click **Extension Settings** at the bottom of the popup.
3. Enter:
   - **Your Email Address** — the email address you use to log into IKEA
   - **Google Script URL** — the Web app URL you copied at the end of Part 1
4. Click **Save Settings**.

You're ready to use the extension.

---

## Usage

1. Navigate to the [IKEA UK login page](https://www.ikea.com/gb/en/profile/login/).
2. Click the extension icon in the toolbar.
3. Click **1. Paste Email** — your email will be filled in automatically.
4. Submit the form on the IKEA page. IKEA will send you a one-time code by email.
5. Click **2. Fetch & Paste OTP** — the extension fetches the code from Gmail and pastes it into the OTP field.
6. Submit the form and you're logged in.

---

## Security Notes

- The Google Apps Script URL acts as an unguarded API endpoint. Anyone who obtains the URL can use it to read the latest IKEA OTP from your Gmail. **Do not share the URL.**
- The URL is stored in Firefox's `browser.storage.local`, which is local to your browser profile and not synced.
- The script only searches for emails from `no.reply@ikea.com` with a specific subject line — it does not have access to your broader inbox beyond what the Gmail API permit scope allows.
- If you believe your script URL has been compromised, delete the deployment in Google Apps Script (Deploy → Manage deployments → delete) and create a new one. Update the URL in the extension settings.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "No code found" | The Gmail search found no unread IKEA OTP emails. Check your Gmail inbox to confirm the email has arrived and is still marked unread. |
| "Failed to connect to Google" | Your Script URL may be incorrect or the deployment may have been deleted. Check your settings and verify the URL works by pasting it directly into a browser tab. |
| Email input not found | The IKEA page layout may have changed. Try clicking into the email field manually before pressing Paste Email. |
| OTP input not found | Same as above — try clicking into the OTP field first. The extension will show the code in an alert if it can't find the input automatically. |
| Extension disappears after restart | You installed it as a temporary add-on (Option A). Follow Option B to install a signed permanent version. |

---

## Repository Structure

```
├── manifest.json       # Firefox extension manifest (MV3)
├── popup.html          # Toolbar popup UI
├── popup.js            # Popup logic — email paste and OTP fetch
├── options.html        # Settings page UI
├── options.js          # Settings page logic — saves to browser.storage.local
├── script.gs           # Google Apps Script — Gmail search and OTP extraction
├── icon.png            # Extension icon (512×512)
└── README.md           # This file
```

---

## Licence

MIT — do whatever you like with it.
