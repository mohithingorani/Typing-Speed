"use client";
export const dynamic = "force-dynamic"; 
import { useSearchParams } from "next/navigation";

export default function Accuracy() {
  
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  if (!score) return <div>No score provided.</div>;
  return (
    <div className="max-w-lg flex justify-center items-center">
      <div className="flex flex-col pt-8">
        <div className="text-gray-400">acc</div>
        <div className="text-[#e2b714] text-6xl">{score}</div>
      </div>
    </div>
  );
}
