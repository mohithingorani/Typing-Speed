"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const sentence = "hello you asfas asdfas asdffasf asddfasdfasdfasdf";
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [inputState, setInputState] = useState<string[] | any>([]);

  const checkKeyPress = (a: string, b: string) => a === b;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const userInput = event.key;
      const expectedInput = sentence[currentCharIndex];
      const isCorrect = checkKeyPress(userInput, expectedInput);

      setInputState((prevState: any) => {
        const newState = [...prevState];
        newState[currentCharIndex] = isCorrect;
        return newState;
      });

      if (isCorrect) {
        setCurrentCharIndex((prevIndex) => prevIndex + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentCharIndex, sentence]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="text-gray-400 ">
        {sentence.split("").map((char, index) => {
          let style = "";

          if (index < currentCharIndex) {
            style = inputState[index] ? "text-white" : "text-red-500";
          }
          if (index === currentCharIndex) {
            style = "text-blue-500";
          }
          return (
            <span key={index} className={style}>
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
