import KeyButton from "./KeyButton";
import type { LetterStatus } from "@/lib/types";

interface KeyboardRowProps {
  letters: string[];
  onKey: (key: string) => void;
  letterStatuses: Record<string, LetterStatus>;
}

// KeyboardRow component to render a single row of keys on the on-screen keyboard
export default function KeyboardRow({ letters, onKey, letterStatuses }: KeyboardRowProps) {
  return (
    // Map each letter to a KeyButton component
    <div className="flex gap-1 justify-center">
      {letters.map(letter => (
        <KeyButton
          key={letter}
          label={letter}
          status={letterStatuses[letter] ?? "empty"}
          onClick={() => onKey(letter)}
        />
      ))}
    </div>
  );
}
