// Load saved settings when the page opens
document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.storage.local.get(['email', 'scriptUrl']);
  if (data.email) document.getElementById('email').value = data.email;
  if (data.scriptUrl) document.getElementById('scriptUrl').value = data.scriptUrl;
});

// Save settings when button clicked
document.getElementById('saveBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const scriptUrl = document.getElementById('scriptUrl').value.trim();
  
  await browser.storage.local.set({ email, scriptUrl });
  
  const status = document.getElementById('status');
  status.textContent = "Settings saved successfully!";
  setTimeout(() => { status.textContent = ""; }, 2000);
});