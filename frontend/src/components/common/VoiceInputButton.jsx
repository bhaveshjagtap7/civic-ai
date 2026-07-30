import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from './Toast';

const VoiceInputButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const { showInfo, showError } = useToast();

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showError("Voice recognition is not supported in your browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      showInfo("Listening... Please speak your complaint clearly.");
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      onTranscript(speechToText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      showError("Could not recognize voice. Please try speaking again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      className={`relative p-2.5 rounded-xl border font-medium text-sm flex items-center gap-2 transition-all ${
        isListening
          ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-glow'
          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
      }`}
      title="Dictate description using voice"
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 text-white" />
          <span>Stop Listening</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Voice Dictation</span>
        </>
      )}
    </button>
  );
};

export default VoiceInputButton;
