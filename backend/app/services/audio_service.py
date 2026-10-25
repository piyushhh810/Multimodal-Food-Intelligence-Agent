import re
from typing import Dict, Any, Optional

class AudioService:
    """Service to process voice commands and audio queries for hands-free kitchen interaction."""

    INTENT_PATTERNS = [
        ("COOKING_NEXT", r"\b(next|continue|forward|next step)\b"),
        ("COOKING_PREV", r"\b(previous|back|prior step|repeat|go back)\b"),
        ("SET_TIMER", r"\b(?:set\s+)?timer(?:\s+for)?\s+(\d+)\s*(?:min|minute|seconds|sec)?\b"),
        ("SUBSTITUTE", r"\b(?:substitute|replacement|replace|swap)\s+(?:for\s+)?([a-zA-Z\s]+)\b"),
        ("ANALYZE_FRESHNESS", r"\b(fresh|freshness|spoil|spoiled|rot|shelf life|is this good)\b"),
        ("RECOGNIZE_FOOD", r"\b(what is this|identify|recognize|what food|what dish)\b"),
        ("NUTRITION_LOOKUP", r"\b(calories|protein|carbs|macros|nutrition|healthy|nutri score)\b"),
        ("HYGIENE_CHECK", r"\b(hygiene|safety|inspection|compliance|kitchen check|gloves)\b")
    ]

    @classmethod
    def parse_voice_command(cls, transcript: str) -> Dict[str, Any]:
        """Parse natural speech transcript and map to actionable FoodVerse AI intent."""
        text = transcript.strip().lower()

        # Check timer match first
        timer_match = re.search(r"\b(?:set\s+)?timer(?:\s+for)?\s+(\d+)\s*(?:min|minute|seconds|sec)?\b", text)
        if timer_match:
            minutes = int(timer_match.group(1))
            return {
                "intent": "SET_TIMER",
                "confidence": 0.96,
                "parameters": {"minutes": minutes, "seconds": minutes * 60},
                "feedback_speech": f"Starting a {minutes} minute cooking timer now."
            }

        # Check substitution match
        sub_match = re.search(r"\b(?:substitute|replacement|replace|swap)\s+(?:for\s+)?([a-zA-Z\s]+)\b", text)
        if sub_match:
            ing = sub_match.group(1).strip()
            return {
                "intent": "SUBSTITUTE",
                "confidence": 0.93,
                "parameters": {"ingredient": ing},
                "feedback_speech": f"Looking up smart dietary substitutions for {ing}."
            }

        for intent, pattern in cls.INTENT_PATTERNS:
            if re.search(pattern, text):
                if intent == "COOKING_NEXT":
                    speech = "Moving to the next cooking step."
                elif intent == "COOKING_PREV":
                    speech = "Returning to the previous step."
                elif intent == "ANALYZE_FRESHNESS":
                    speech = "Analyzing surface discoloration and freshness degradation."
                elif intent == "RECOGNIZE_FOOD":
                    speech = "Running multimodal computer vision food recognition."
                elif intent == "NUTRITION_LOOKUP":
                    speech = "Computing calorie and macronutrient breakdown."
                elif intent == "HYGIENE_CHECK":
                    speech = "Conducting kitchen safety and hygiene compliance inspection."
                else:
                    speech = "Processing your food command."

                return {
                    "intent": intent,
                    "confidence": 0.91,
                    "parameters": {"query": text},
                    "feedback_speech": speech
                }

        # Generic AI question fallback
        return {
            "intent": "GENERAL_QUERY",
            "confidence": 0.85,
            "parameters": {"query": text},
            "feedback_speech": f"Understood: '{transcript}'. Let me assist you."
        }

audio_service = AudioService()
