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
      <button className="absolute top-4 right-4 px-4 py-2 cursor-pointer transition-transform hover:scale-105" onClick={handleSettings}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>

      <div>
        <h1 className="text-3xl font-bold mb-6">AI Quote Generator</h1>
        <p>
          {result && (
            <ul className="list-disc ml-6">
              {result.map((item, index) => (
                <li key={index}>{item}</li> 
              ))}
            </ul>
          )}
        </p>
        
        <button className="mt-6 px-4 py-2 [background-color:#35a6d5] text-[#232c35] rounded hover:bg-[#206eaa] cursor-pointer transition-transform hover:scale-105" 
          onClick={handleClick}>Generate Quotes
        </button>
      </div>
    </>
  )
}

export default App
