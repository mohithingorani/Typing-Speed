import { Stat } from "./StatComp";

export const TestHeader = ({ timer, wordsPerMinute, accuracy }: { 
  timer: number; 
  wordsPerMinute: number; 
  accuracy: number | null; 
}) => (
  <div className="w-full max-w-4xl mb-12">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-accent">Typing Test</h1>
      <div className="flex gap-6 text-muted">
        <Stat label="Time" value={`${timer}s`} />
        <Stat label="WPM" value={wordsPerMinute} />
        {accuracy !== null && <Stat label="Accuracy" value={`${accuracy}%`} />}
      </div>
    </div>
  </div>
);
