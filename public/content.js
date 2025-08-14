// function to extract text from the current web page
function extractText() {
    const article = document.querySelector("article"); // Try to find an <article> element first
    if (article) {
        return article.innerText;
    }

    // If no <article> element, fallback to all <p> elements
    const paragraphs = Array.from(document.querySelectorAll("p"));
    return paragraphs.map(p => p.innerText).join("\n");
}

// Listener to run extractText function when user clicks the button in the extension popup
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "extractText") {
        console.log("extract text ran")
        const text = extractText();
        sendResponse(text);
    }
    else if (req.type === "scrollToQuote") {
        const query = req.query
        const found = window.find(query, false, false, true, false, false, false); // Scrolls to text found on the web page
        if (!found) {
            sendResponse('Error');
        }
        else {
            sendResponse('Success');
        }
    }
});