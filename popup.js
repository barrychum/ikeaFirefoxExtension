// Open settings page
document.getElementById('openOptions').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

// Option 1: Paste Email
document.getElementById('pasteEmailBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const data = await browser.storage.local.get('email');
  
  if (!data.email) {
    statusDiv.textContent = "Error: Please set your email in settings first!";
    return;
  }
  
  statusDiv.textContent = "Pasting email...";
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: pasteEmailIntoPage,
    args: [data.email]
  });
  
  statusDiv.textContent = "Email pasted!";
});

// Option 2: Fetch and Paste OTP
document.getElementById('fetchOtpBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const data = await browser.storage.local.get('scriptUrl');
  
  if (!data.scriptUrl) {
    statusDiv.textContent = "Error: Please set your Google Script URL first!";
    return;
  }
  
  statusDiv.textContent = "Fetching code from Gmail...";

  try {
    const response = await fetch(data.scriptUrl);
    const result = await response.json();

    if (result.code) {
      statusDiv.textContent = "Code found! Pasting...";
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: pasteOtpIntoPage,
        args: [result.code]
      });

      statusDiv.textContent = "Success!";
    } else {
      statusDiv.textContent = "Error: " + (result.error || "No code found");
    }
  } catch (error) {
    statusDiv.textContent = "Failed to connect to Google.";
    console.error(error);
  }
});

// Helper Function: Paste Email
function pasteEmailIntoPage(email) {
  const emailInput = document.querySelector('input[type="email"]') || 
                     document.querySelector('input[name*="email"]') ||
                     document.querySelector('input');

  if (emailInput) {
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    alert("Couldn't find an email input box on this page!");
  }
}

// Helper Function: Paste OTP Code
function pasteOtpIntoPage(code) {
  const codeInput = document.querySelector('input[pattern="[0-9]*"]') || 
                    document.querySelector('input[type="tel"]') || 
                    document.querySelector('input[autocomplete="one-time-code"]') ||
                    document.querySelector('input[name*="code"]') ||
                    document.querySelector('input');

  if (codeInput) {
    codeInput.value = code;
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));
    codeInput.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    alert("Couldn't find an OTP input box on this page! Found code: " + code);
  }
}