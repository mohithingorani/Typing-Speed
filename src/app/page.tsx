"use client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const sentence = "Lorem ipsum dolor sit amet consectetur.";
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [inputState, setInputState] = useState<boolean[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [startTimer, setStartTimer] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const availableTimes = [15, 30, 60, 120];
  const [accuracy,setAccuracy] = useState<number | null>(null)

  const router = useRouter();

  const setNewTimer = (time: number, index: number) => {
    setSelectedTime(time);
    setTimer(0); // Reset the timer to 0
    setHasStartedTyping(false); // Reset typing status
    setCurrentCharIndex(0); // Reset character index
    setInputState([]); // Reset input state
    setStartTimer(false); // Ensure the timer is not running
    

    // Remove focus from the button after setting the timer
    if (buttonRefs.current[index]) {
      buttonRefs.current[index]?.blur();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (startTimer && timer < (selectedTime || 0)) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer + 1 >= (selectedTime || 0)) {
            setStartTimer(false); // Stop the timer once it reaches the set time
            clearInterval(interval!);
          }
          return prevTimer + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval); // Clear interval on unmount or when timer stops
    };
  }, [startTimer, timer, selectedTime]);

  const checkKeyPress = (a: string, b: string) => a === b;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hasStartedTyping && selectedTime !== null) {
        setStartTimer(true); // Start the timer when the user starts typing
        setHasStartedTyping(true);
      }

      const userInput = event.key;
      if (userInput === "Shift") {
        return;
      }
      if (userInput === "Backspace" || userInput === "Delete") {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(currentCharIndex - 1);
          setInputState((prevState) => prevState.slice(0, -1)); // Remove last input state
        }
        return;
      }
      const expectedInput = sentence[currentCharIndex];
      const isCorrect = checkKeyPress(userInput, expectedInput);

      setInputState((prevState) => {
        const newState = [...prevState];
        newState[currentCharIndex] = isCorrect;
        return newState;
      });

      setCurrentCharIndex((prevIndex) => prevIndex + 1);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentCharIndex, sentence, hasStartedTyping, selectedTime]);

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (event.getModifierState && event.getModifierState("CapsLock")) {
        setCapsLock(true);
      } else {
        setCapsLock(false);
      }
    });
  });

  const handleRetry = () => {
    setCurrentCharIndex(0); // Reset character index
    setInputState([]); // Reset input state
    setTimer(0); // Reset timer
    setHasStartedTyping(false); // Reset typing status
    setStartTimer(false); // Ensure the timer is not running
    handleAccuracy();
    

  };

  const handleAccuracy = ()=>{
    const accuracy = Math.trunc((inputState.filter((input) => input).length / sentence.length)*100);
    setAccuracy(accuracy);
  }
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {JSON.stringify(accuracy)}
      {capsLock && (
        <button className="flex items-center justify-between gap-1 bg-[#e2b714] text-[#323437] px-3 py-1.5 rounded-md select-none mb-2">
          <div>
            <Image alt="img" width="10" height="30" src="/lock.svg" />
          </div>
          <div className="text-xs">Caps Lock</div>
        </button>
      )}
      <div className="flex justify-center gap-2 text-xs text-gray-400">
        {availableTimes.map((time, index) => (
          <button
            key={time}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            className={`hover:text-white ${
              selectedTime === time ? "text-yellow-500" : ""
            }`}
            onClick={() => setNewTimer(time, index)}
          >
            {time}s
          </button>
        ))}
      </div>
      <div className="mb-4 text-xl text-gray-300">Time: {timer} seconds</div>

      <div className="text-gray-400 text-sm px-32">
        {sentence.split("").map((char, index) => {
          let style = "";

          if (index < currentCharIndex) {
            style = inputState[index] ? "text-white" : "text-red-500";
          }
          if (index === currentCharIndex) {
            style = "blinking-cursor";
          }
          return (
            <span
              key={index}
              className={style}
              style={{ paddingRight: "0.1rem" }}
            >
              {char}
            </span>
          );
        })}
      </div>
      <div>
        <Image
          src="/sync.png"
          alt="retry"
          width="20"
          height="20"
          className="pt-2 cursor-pointer"
          onClick={handleRetry}
        />
      </div>
    </div>
  );
}
