export const TypingArea = ({ 
  sentence, 
  currentCharIndex, 
  inputState, 
  getCharacterClassName 
}: {
  sentence: string;
  currentCharIndex: number;
  inputState: boolean[];
  getCharacterClassName: (index: number) => string;
}) => (
  <div className="w-full max-w-4xl mb-12">
    <div className="bg-card rounded-2xl p-8 shadow-lg">
      <div className="text-2xl leading-relaxed text-center font-mono select-none">
        {sentence.split("").map((char, index) => (
          <span
            key={index}
            className={getCharacterClassName(index)}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  </div>
);
