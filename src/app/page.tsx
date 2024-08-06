"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const sentence = "hello you asfas asdfas asdffasf asddfasdfasdfasdf";
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [inputState, setInputState] = useState<boolean[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const checkKeyPress = (a: string, b: string) => a === b;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer=>(prevTimer+1));
    }, 1000); // Increment every second

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const userInput = event.key;
      if (userInput === "Backspace" || userInput === "Delete") {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(currentCharIndex - 1);
          inputState.pop();
          return;
        }
      }
      const expectedInput = sentence[currentCharIndex];
      const isCorrect = checkKeyPress(userInput, expectedInput);

      setInputState((prevState: any) => {
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
  }, [currentCharIndex, sentence]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {/* {JSON.stringify(inputState)} */}
      {JSON.stringify(timer)}
      {/* {JSON.stringify(currentCharIndex)} */}
      <div className="text-gray-400">
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
    </div>
  );
}
