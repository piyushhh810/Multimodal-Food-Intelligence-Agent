import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
import { sendVoiceCommand } from '../services/api';

export default function AudioController({ onIntentTrigger, isListening, setIsListening }) {
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);

        try {
          const res = await sendVoiceCommand(text);
          setFeedback(res.feedback_speech || 'Understood.');

          // Speak reply if speech enabled
          if (speechEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(res.feedback_speech);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
          }

          if (onIntentTrigger) {
            onIntentTrigger(res);
          }
        } catch (err) {
          console.error('Voice processing error:', err);
          setFeedback('Could not process voice query.');
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error/cancelled:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
    }
  }, [speechEnabled, onIntentTrigger, setIsListening]);

  const toggleListening = () => {
    if (!recognitionInstance) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setFeedback('Listening for voice commands (e.g. "Next step", "Set timer for 5 minutes", "Substitute for egg")...');
      try {
        recognitionInstance.start();
        setIsListening(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Hands-Free AI Voice Assistant</h4>
            <p className="text-[10px] text-slate-400">Speak cooking commands, freshness queries, or timer triggers</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={speechEnabled ? "Voice Speech Output Active" : "Voice Speech Muted"}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={toggleListening}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Tap to Speak</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Status & Animated Soundwave */}
      {(isListening || transcript || feedback) && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 overflow-hidden">
            {transcript && (
              <p className="text-slate-300 font-medium truncate">
                <span className="text-emerald-400 font-semibold">You said:</span> "{transcript}"
              </p>
            )}
            {feedback && <p className="text-slate-400 text-[11px] truncate">{feedback}</p>}
          </div>

          {isListening && (
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-1 bg-emerald-400 rounded-full sound-bar-1"></div>
              <div className="w-1 bg-emerald-400 rounded-full sound-bar-2"></div>
              <div className="w-1 bg-emerald-400 rounded-full sound-bar-3"></div>
              <div className="w-1 bg-emerald-400 rounded-full sound-bar-4"></div>
              <div className="w-1 bg-emerald-400 rounded-full sound-bar-5"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
