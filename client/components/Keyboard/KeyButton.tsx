import type { LetterStatus } from "@/lib/types";

interface KeyButtonProps {
  label: string;
  onClick: () => void;
  wide?: boolean;
  status?: LetterStatus;
}

// KeyButton component to render an individual key on the on-screen keyboard
export default function KeyButton({ label, onClick, wide, status = "empty" }: KeyButtonProps) {
  let bg = "bg-slate-700 hover:bg-slate-600";
  if (status === "correct") bg = "bg-emerald-600";
  if (status === "present") bg = "bg-amber-500";
  if (status === "absent") bg = "bg-slate-800";

  return (
    <button 
      onClick={onClick} 
      className={`h-10 ${wide ? "px-4" : "w-8"} ${bg} rounded text-sm font-semibold`}
    >
      {label}
    </button>
  );
}
