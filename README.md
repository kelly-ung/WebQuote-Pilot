# <img src="https://github.com/kelly-ung/WebQuote-Pilot/blob/main/public/icon.png" alt="Icon" width="30"/>  WebQuote Pilot

A Chrome extension to extract key information from a web page.

Click "Generate Quotes", and the extension will scan the page and determine key points using Google's Gemini API. Select any quote to jump to its location on the web page or to copy it. 

Useful for research, note-taking, or quickly skimming content.

<img width="1470" height="834" alt="Screenshot" src="https://github.com/user-attachments/assets/22194435-078d-45bd-a56d-bb83fffce174" />

## Tech Stack
-   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
-   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
-   ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
-   ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
-   ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
-   ![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)
-   ![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
    
## Setup and Installation

To run this extension locally, follow the steps below.

### Clone the Repository

```bash
git clone https://github.com/kelly-ung/WebQuote-Pilot.git
```

### Install Dependencies

```bash
npm install
```

### Build the Extension

```bash
npm run build
```
This will create a dist/ folder.

### Load the Extension in Chrome
1. Open Chrome and go to: chrome://extensions
2. Enable Developer mode (toggle switch in the top-right)
3. Click Load unpacked
4. Select the dist/ folder
5. Once the extension loads, the Settings page should open automatically
6. Enter your Gemini API Key in the designated field
   
The extension is now ready to use.

## Acknowledgements

- [Build a Chrome Extension by RoadsideCoder](https://www.youtube.com/watch?v=mcfCdFS9VBY)
- [SVG icons by the makers of Tailwind CSS](https://heroicons.com/)
