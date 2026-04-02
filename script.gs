function doGet() {
  // 1. Search for the newest unread email from IKEA
  // Adjust the search query if IKEA uses a specific subject line
  //var threads = GmailApp.search('from:no.reply@ikea.com is:unread', 0, 1);
  var threads = GmailApp.search('from:no.reply@ikea.com subject:"Your one-time code to access your IKEA account" is:unread', 0, 1);
  if (threads.length === 0) {
    return ContentService.createTextOutput(JSON.stringify({error: "No code found"})).setMimeType(ContentService.MimeType.JSON);
  }
  
  var message = threads[0].getMessages()[threads[0].getMessages().length - 1];
  var body = message.getPlainBody();
  
  // 2. Use Regex to find a 6-digit number (adjust if the code is 4 or 5 digits)
  var codeMatch = body.match(/\d{6}/); 
  
  if (codeMatch) {
    // Optional: Mark the message as read so you don't pull the same code twice
    message.markRead();
    
    return ContentService.createTextOutput(JSON.stringify({code: codeMatch[0]})).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({error: "Code not found in email"})).setMimeType(ContentService.MimeType.JSON);
}