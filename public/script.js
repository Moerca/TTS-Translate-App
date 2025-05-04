// Web Speach - SpeechSynthesisUtterance
const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect');


// Array of supported languages with their ISO codes
const languages = [
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Spanish'},
    {code: 'fr', name: 'French'},
    {code: 'de', name: 'German'},
    {code: 'it', name: 'Italian'},
    {code: 'ja', name: 'Japanese'},
    {code: 'zh-CH', name: 'Chinese (Simplified)'},
    {code: 'kr', name: 'Korean'},
];

// Populate language select box
languages.forEach(({ code, name }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    languageSelect.appendChild(option);
})


// Load available voices
let voices = [];
function loadVoices(){
    voices = speechSynthesis.getVoices();
    //Voice Options
    voiceSelect.innerHTML = voices
    .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
    .join('');
}

// Trigger loading voices when they become available
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
            body: JSON.stringify({
                text,
                target: targetLang 
            })
        });

        if(!response.ok){
            throw new Error('Error ${response.status}: ${await response.text()}');
        }

        // if everything ok
        const data = await response.json();
        return data.data.translations[0].translateText;
    } catch (error) {
        console.error('Translation Error: ', error);
        alert('Failed to translate text');
        return text;
    }
}




// Play TTS
playButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    if(selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
});
