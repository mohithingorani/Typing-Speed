import Image from "next/image";

export const CapsLockWarning = ({ isVisible }: { isVisible: boolean }) => 
  isVisible ? (
    <div className="mb-6 flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg">
      <Image alt="caps lock" width="16" height="16" src="/lock.svg" />
      <span className="text-sm font-medium">Caps Lock is ON</span>
    </div>
  ) : null;

