// Web Speech - SpeechSynthesisUtterance
const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect');

// Array of supported languages with their ISO codes
const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' }, // corrected from zh-CH
    { code: 'ko', name: 'Korean' }, // corrected from kr (which is not valid ISO)
];

// Populate language select box
languages.forEach(({ code, name }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    languageSelect.appendChild(option);
});

// Load available voices
function loadVoices() {
    voices = speechSynthesis.getVoices();
  
    // Group Voices (Google, Microsoft, Other)
    const groupedVoices = {
      Google: [],
      Microsoft: [],
      Other: []
    };
  
    voices.forEach((voice, index) => {
      const provider = voice.name.toLowerCase().includes('google') ? 'Google' :
                       voice.name.toLowerCase().includes('microsoft') ? 'Microsoft' :
                       'Other';
      groupedVoices[provider].push({ voice, index });
    });
  
    // Sort Voices asc
    Object.keys(groupedVoices).forEach(provider => {
      groupedVoices[provider].sort((a, b) => a.voice.name.localeCompare(b.voice.name)); // Alphabetische Sortierung
    });
  
    // Voices Dropdown
    voiceSelect.innerHTML = Object.keys(groupedVoices).map(provider => {
      if (groupedVoices[provider].length === 0) return ''; // Wenn keine Stimmen für eine Gruppe vorhanden sind, überspringen
  
      return `
        <optgroup label="${provider}">
          ${groupedVoices[provider].map(({ voice, index }) => {
            const isDefault = voice.name === 'Google UK English Female'; // Stimme prüfen
            const displayName = voice.name.replace(/^Google |^Microsoft /, ''); // Anbieter entfernen
            return `<option value="${index}" ${isDefault ? 'selected' : ''}>
                      ${displayName} (${voice.lang})
                    </option>`;
          }).join('')}
        </optgroup>
      `;
    }).join('');
  }
  

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Translate text with serverless function
async function translateText(text, targetLang) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, target: targetLang })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`); // fixed template literal
        }

        const data = await response.json();
        return data.data.translations[0].translatedText; // fixed typo: 'translateText' -> 'translatedText'
    } catch (error) {
        console.error('Translation Error: ', error);
        alert('Failed to translate text');
        return text;
    }
}

// TTS
function playText(text, voiceIndex) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
    }
    speechSynthesis.speak(utterance);
}

// Play TTS
playButton.addEventListener('click', async () => {
    const text = textInput.value.trim();
    const targetLang = languageSelect.value;
    const selectedVoiceIndex = voiceSelect.value;

    if (!text) {
        alert('Please enter some text!');
        return;
    }

    try {
        const translatedText = await translateText(text, targetLang);
        playText(translatedText, selectedVoiceIndex); // fixed: was 'translateText'
    } catch (error) {
        console.error('Error during processing: ', error);
        alert('An error occurred');
    }
});
