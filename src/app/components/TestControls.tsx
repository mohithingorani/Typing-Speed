import Image from "next/image";

export const TestControls = ({
  progressPercentage,
  selectedTime,
  hasStartedTyping,
  onRetry,
  isTestComplete
}: {
  progressPercentage: number;
  selectedTime: number | null;
  hasStartedTyping: boolean;
  onRetry: () => void;
  isTestComplete: boolean;
}) => (
  <div className="w-full max-w-4xl">
    {/* Progress Bar */}
    <div className="w-full bg-card rounded-full h-2 mb-8">
      <div 
        className="bg-accent h-2 rounded-full transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>

    {/* Control Buttons */}
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-card text-muted hover:text-accent hover:bg-card-hover px-6 py-3 rounded-lg transition-all duration-200"
      >
        <Image src="/sync.png" alt="retry" width="20" height="20" />
        <span>Retry</span>
      </button>
      
      {selectedTime && (
        <div className="text-muted text-sm">
          {!hasStartedTyping 
            ? "Start typing to begin..." 
            : isTestComplete 
              ? "Test complete!" 
              : "Typing in progress..."}
        </div>
      )}
    </div>
  </div>
);
