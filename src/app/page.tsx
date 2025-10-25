"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { TestHeader } from "./components/TestHeader";
import { TimeSelector } from "./components/TimeSelector";
import { CapsLockWarning } from "./components/Warning";
import { TestControls } from "./components/TestControls";
import { TestInstructions } from "./components/Instructions";
import { TypingArea } from "./components/TypingArea";

export default function Home() {
  const SENTENCE = "AFTER CREATING SEPERATE BOOLEAN INPUT STATE";
  const AVAILABLE_TIMES = [15, 30, 60, 120];
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [inputState, setInputState] = useState<boolean[]>([]);
  const [timer, setTimer] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const timeButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const wordsPerMinute = calculateWordsPerMinute();
  const progressPercentage = selectedTime ? (timer / selectedTime) * 100 : 0;
  const isTestComplete = selectedTime && timer >= selectedTime;

  // Timer management
  useEffect(() => {
    if (!isTimerRunning || !selectedTime || timer >= selectedTime) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;
        if (newTime >= selectedTime) {
          setIsTimerRunning(false);
          calculateAndSetAccuracy();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, selectedTime]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleCapsLockDetection(event);

      if (shouldIgnoreKey(event.key)) return;

      if (!hasStartedTyping && selectedTime) {
        startTypingTest();
      }

      if (event.key === "Backspace") {
        handleBackspace();
        return;
      }

      if (isSingleCharacterKey(event.key)) {
        handleCharacterInput(event.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentCharIndex, hasStartedTyping, selectedTime]);

  // Caps lock detection
  useEffect(() => {
    const handleCapsLockChange = (event: KeyboardEvent) => {
      setIsCapsLockOn(event.getModifierState?.("CapsLock") ?? false);
    };

    document.addEventListener("keydown", handleCapsLockChange);
    return () => document.removeEventListener("keydown", handleCapsLockChange);
  }, []);

  // Core functions
  const startTypingTest = () => {
    setIsTimerRunning(true);
    setHasStartedTyping(true);
  };

  const handleCharacterInput = (pressedKey: string) => {
    const expectedChar = SENTENCE[currentCharIndex];
    const isCorrect = pressedKey === expectedChar;

    setInputState((prev) => {
      const newState = [...prev];
      newState[currentCharIndex] = isCorrect;
      return newState;
    });

    setCurrentCharIndex((prev) => prev + 1);
  };

  const handleBackspace = () => {
    if (currentCharIndex > 0) {
      setCurrentCharIndex((prev) => prev - 1);
      setInputState((prev) => prev.slice(0, -1));
    }
  };

  const calculateAndSetAccuracy = () => {
    const correctChars = inputState.filter(Boolean).length;
    const accuracy = Math.round((correctChars / SENTENCE.length) * 100);
    setAccuracy(accuracy);
  };

  function calculateWordsPerMinute() {
    if (timer === 0) return 0;
    const wordCount = SENTENCE.split(" ").length;
    const minutes = timer / 60;
    return Math.round(wordCount / minutes);
  }

  // UI actions
  const selectTimeLimit = (time: number, index: number) => {
    setSelectedTime(time);
    resetTest();
    setAccuracy(null);
    blurTimeButton(index);
  };

  const resetTest = () => {
    setCurrentCharIndex(0);
    setInputState([]);
    setTimer(0);
    setHasStartedTyping(false);
    setIsTimerRunning(false);
  };

  const retryTest = () => {
    resetTest();
    setAccuracy(null);
  };

  // Helper functions
  const shouldIgnoreKey = (key: string) => key === "Shift";

  const isSingleCharacterKey = (key: string) => key.length === 1;

  const handleCapsLockDetection = (event: KeyboardEvent) => {
    setIsCapsLockOn(event.getModifierState?.("CapsLock") ?? false);
  };

  const blurTimeButton = (index: number) => {
    timeButtonRefs.current[index]?.blur();
  };

  const getCharacterClassName = (index: number): string => {
    if (index < currentCharIndex) {
      return inputState[index] ? "text-correct" : "text-incorrect";
    }
    if (index === currentCharIndex) {
      return "text-current blinking-cursor";
    }
    return "text-upcoming";
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-background px-6">
      <TestHeader
        timer={timer}
        wordsPerMinute={wordsPerMinute}
        accuracy={accuracy}
      />

      <TimeSelector
        availableTimes={AVAILABLE_TIMES}
        selectedTime={selectedTime}
        timeButtonRefs={timeButtonRefs}
        onTimeSelect={selectTimeLimit}
      />

      <CapsLockWarning isVisible={isCapsLockOn} />

      <TypingArea
        sentence={SENTENCE}
        currentCharIndex={currentCharIndex}
        inputState={inputState}
        getCharacterClassName={getCharacterClassName}
      />

      <TestControls
        progressPercentage={progressPercentage}
        selectedTime={selectedTime}
        hasStartedTyping={hasStartedTyping}
        onRetry={retryTest}
        isTestComplete={isTestComplete}
      />

      {/* Footer */}
      <TestInstructions />
      <div className="text-white">Accuracy : {JSON.stringify(accuracy)}</div>

      <div className="text-white">Words Per Minute : {JSON.stringify(wordsPerMinute)}</div>
    </div>
  );
}
