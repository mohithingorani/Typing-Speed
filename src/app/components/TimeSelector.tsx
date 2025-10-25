export const TimeSelector = ({ 
  availableTimes, 
  selectedTime, 
  timeButtonRefs, 
  onTimeSelect 
}: {
  availableTimes: number[];
  selectedTime: number | null;
  timeButtonRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  onTimeSelect: (time: number, index: number) => void;
}) => (
  <div className="flex justify-center gap-4 mb-8">
    {availableTimes.map((time, index) => (
      <button
        key={time}
        ref={el => { timeButtonRefs.current[index] = el; }}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          selectedTime === time
            ? "bg-accent text-background shadow-lg"
            : "bg-card text-muted hover:bg-card-hover hover:text-foreground"
        }`}
        onClick={() => onTimeSelect(time, index)}
      >
        {time}s
      </button>
    ))}
  </div>
);
