# TTS & Translation App

A simple web application that combines **Text-to-Speech (TTS)** and **translation** functionalities using the **Web Speech API** and the **Google Translation API**.

## Features

- **Text-to-Speech**: Select a voice and language, type some text, and listen to it being read aloud.
- **Translation**: Translate text into different languages using Google Translate's API.
- **Voice Selection**: Choose from a list of available voices from providers like Google and Microsoft.
- **Multi-language Support**: Includes support for several languages (English, Spanish, French, German, Italian, Japanese, Chinese, Korean, etc.).

## Technologies Used

- **Frontend**: 
  - HTML5
  - JavaScript (ES6+)
  - Tailwind CSS
- **Backend**: 
  - Node.js with serverless functions (API Routes)
  - Google Translate API for translation services
- **Web Speech API** for Text-to-Speech functionality

## Usage

1. **Select Language**: Choose the language for translation from the dropdown.
2. **Select Voice**: Choose a voice for Text-to-Speech.
3. **Type Text**: Type the text you want to translate and hear.
4. **Click 'Translate & Play Text'**: The app will translate the text and read it aloud in the selected voice.

## Files Breakdown

### 1. `index.html`

This is the main HTML file that contains the structure for the application. It includes:
- A textarea for inputting text.
- A dropdown for selecting languages.
- A dropdown for selecting voices.
- A button to trigger the translation and speech output.

### 2. `script.js`

This file contains the JavaScript that handles:
- **Language selection**: Populates the language dropdown with supported languages.
- **Voice selection**: Loads available voices from the Web Speech API, groups them by provider (Google, Microsoft, Other), and sorts them alphabetically.
- **Text-to-Speech**: Converts the input text into speech using the selected voice.
- **Translation**: Sends the text to a backend function to be translated using the Google Translate API, then speaks the translated text.

### 3. `translate.ts`

A serverless function that handles the translation request:
- Accepts the text and target language from the frontend.
- Calls the Google Translate API to perform the translation.
- Returns the translated text to the frontend.

### 4. `tailwind.css` (via CDN)

Tailwind CSS is used for styling the application. It provides utility-first classes to easily style the HTML elements.
