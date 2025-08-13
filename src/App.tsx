import { useState } from 'react'

function App() {
  const [result, setResult] = useState<string[]>([]); 

  // Function to call Gemini API 
  const getGeminiResponse= async (rawText: string, apiKey: string) => {
    const max = 20000; 
    const text = rawText.length > max ? rawText.slice(0, max) : rawText; // Truncate text if it exceeds the maximum length
    const prompt = `Generate quotes from the following text separated by bullets:\n\n${text}`;

    // Make a POST request to the Gemini API
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      })
    });

    // Throw an error if the response is not ok
    if (!res.ok) {
      const { error } = await res.json(); 
      throw new Error(error?.message || "Request failed");
    }

    // Retrieve the response data
    const dataObj = await res.json();
    if (dataObj.candidates?.[0]?.content?.parts?.[0]?.text)  {
      const generated_text = dataObj.candidates[0].content.parts[0].text;
      // Split the generated text by asterisks 
      const split_text = generated_text.split('*').filter((line: string) => line.trim() !== '');
      return split_text
    }
    else {
      return ['No response found.']; 
    }
  };

  // Function to handle button click
  const handleClick = async () => {
    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // Get the active tab in the current window
      const text = await chrome.tabs.sendMessage(tab.id!, { type: 'extractText' }); // Send a message to the content script to extract text
      
      // Check if text is not empty
      if (text) {
        // Get the API key from storage
        const apiKeyObj = await chrome.storage.sync.get(['geminiApiKey']);
        const apiKey = apiKeyObj.geminiApiKey;
        
        // Check if the API key is valid
        if (apiKey && typeof apiKey === 'string') {
          try {
            const response = await getGeminiResponse(text, apiKey); // Call the Gemini API with the extracted text and API key
            setResult(response);
          }
          catch (error) {
            console.error("Error getting response from Gemini API:", error);
            setResult(['Error: Could not generate response.']);
          }
        }
        else {
          console.log("API key not found in storage.");
          setResult(['Error: Gemini API key not found or invalid. Please set it in the extension settings.']);
        }
      }
      else {
        setResult(['Error: No text found.']);
      }
    } 
    catch (error) {
      console.error("Error extracting text from content script:", error);
      setResult(['Error: Could not extract text.']);
    }
  };

  // Function to handle settings button click
  const handleSettings = () => {
    chrome.runtime.openOptionsPage(); 
  };

  return (
    <>
      <button onClick={handleSettings}>Settings</button>
      <div>
        <button className="px-4 py-2 [background-color:#35a6d5] text-[#232c35] rounded hover:bg-[#206eaa] cursor-pointer transition-transform hover:scale-105" 
          onClick={handleClick}>Generate Quotes
        </button>
        <p>
          {result && (
            <ul className="list-disc ml-6">
              {result.map((item, index) => (
                <li key={index}>{item}</li> 
              ))}
            </ul>
          )}
        </p>
      </div>
    </>
  )
}

export default App
