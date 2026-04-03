
## The Secure Architecture

Instead of giving a script your password, we are going to use a three-step relay:
1. **The Trigger:** IKEA sends the code to your Gmail.
2. **The Fetcher (Google Apps Script):** A script triggered by you searches your Gmail for the latest IKEA email, extracts the code, and returns it.
3. **The Paster (A simple bookmarklet or Tampermonkey script):** A tiny bit of JavaScript sitting in your browser calls your Google Script, gets the code, and pastes it into the IKEA box.


---

## Step 1: Create the Google Apps Script
This script will act as a secure, private API that only returns the login code when asked.

1. Go to [script.google.com](https://script.google.com/) and click **New Project**.
2. Replace the default code with the content of script.gs
3. Click **Deploy** > **New deployment**.
4. Click the gear icon next to "Select type" and choose **Web app**.
5. Set "Execute as" to **Me** and "Who has access" to **Anyone** (Don't worry, the URL is a long, unguessable string acting as a password, but you can also set it to "Only myself" if you are using advanced authentication).
6. Click **Deploy**, authorize the permissions, and **copy the Web App URL** it gives you.

---

### Option 1: The "Self-Distribution" Way (Best for standard Firefox)
You can have Mozilla "sign" your custom extension for free without actually making it public to the world.

1. Take your extension folder and compress the files inside it (the manifest, popup.html, popup.js, and icon if you have one) into a **`.zip`** file.
2. Go to the [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/).
3. Create a free account and click **Submit a New Add-on**.
4. When it asks how you want to distribute it, choose **"On my own"** (This keeps it private so it doesn't show up on their store).
5. Upload your `.zip` file.
6. Mozilla's automated system will scan it for malicious code. Since yours is just a basic JavaScript relay, it will usually be approved automatically in about 5 to 10 minutes.
7. Once approved, they will give you a download link for a **`.xpi`** file.
8. Download that file, drag and drop it directly into your regular Firefox browser, and click **Add**. 

This will stay installed forever, just like any other extension!

---

### Option 2: Use Firefox Developer Edition (The Hacker's Way)
If you don't want to make a Mozilla account and just want to run it locally like you do in Chrome, you have to switch your browser to **Firefox Developer Edition** or **Firefox Nightly**. 

These specific browser versions are made for coders and allow you to bypass signature checks:
1. Download and install [Firefox Developer Edition](https://www.mozilla.org/firefox/channel/desktop/).
2. Type `about:config` in the address bar and press enter. Accept the warning.
3. Search for the setting: **`xpinstall.signatures.required`**
4. Double-click it to change the value from `true` to **`false`**.
5. Zip up your extension files, change the file extension from `.zip` to `.xpi` (e.g., `my-addon.xpi`).
6. Go to your add-ons page (`about:addons`), click the gear icon, and select **Install Add-on From File**.

Because you turned off the signature requirement, Developer Edition will let you keep it permanently!

