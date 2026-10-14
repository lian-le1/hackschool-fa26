"use client";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Toast from "./Toast";
import Board from "./Board/Board";
import Keyboard from "./Keyboard/Keyboard";
import type { LetterStatus, RowData } from "@/lib/types";
import { getWordOfTheDay } from "@/lib/wordOfTheDay";
import { getTodayFormatted } from "@/lib/date";

const ROWS = 6;
const COLS = 5;

/*
  Game component for the Wordle game.
  Handles game state, user input, and rendering of the board and keyboard.
*/
export default function Game() {

  // State for the solution word of the day
  const [solution, setSolution] = useState<string>("");
  useEffect(() => { setSolution(getWordOfTheDay()); }, []);

  // State for the rows of the game board
  const [rows, setRows] = useState<RowData[]>(
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ letter: "", status: "empty" }))
    )
  );
  
  // State for the current row and column
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentCol, setCurrentCol] = useState<number>(0);

  // State for the status of each letter
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({});

  // State for toast messages
  const [toast, setToast] = useState<string | null>(null);

  // State for game over status
  const [gameOver, setGameOver] = useState<boolean>(false);


  // Handler for key presses (both physical and virtual keyboard)
  const handleKey = (key: string): void => {
    if (gameOver) return;

    // Clear existing toast messages when a key is pressed
    setToast(null);

    // Define behavior for special keys (ENTER, BACKSPACE) and letter input

    if (key === "ENTER") {
      if (currentCol !== COLS) { setToast("Not enough letters"); return; }
      else { submitRow(); return; }
    }

    if (key === "BACKSPACE") {
      if (currentCol === 0) return;
      const newRows = [...rows];
      newRows[currentRow][currentCol - 1] = { letter: "", status: "empty" };
      setRows(newRows);
      setCurrentCol(currentCol - 1);
      return;
    }

    if (!/^[A-Z]$/.test(key)) return;
    if (currentCol >= COLS) return;

    // Add the pressed letter to the current tile on the board

    const newRows = [...rows];
    newRows[currentRow][currentCol] = { letter: key, status: "empty" };
    setRows(newRows);
    setCurrentCol(currentCol + 1);
  };


  // Effect to handle physical keyboard input
  useEffect(() => {
    const handlePhysicalKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();
      if (key === "ENTER") { handleKey("ENTER"); return; }
      if (key === "BACKSPACE") { handleKey("BACKSPACE"); return; }
      if (/^[A-Z]$/.test(key)) { handleKey(key); }
    };
    window.addEventListener("keydown", handlePhysicalKey);
    return () => { window.removeEventListener("keydown", handlePhysicalKey); };
  }, [gameOver, handleKey]);


  // Function to submit the current row and update game state
  const submitRow = (): void => {
    const guess = rows[currentRow].map(t => t.letter);
    const solutionChars = solution.split("");

    // Count occurrences of each letter in the solution
    const letterCount: Record<string, number> = {};
    solutionChars.forEach(ch => {
      letterCount[ch] = (letterCount[ch] || 0) + 1;
    });

    // First pass: mark correct letters
    const newRow: RowData = guess.map((letter, i) => {
      if (letter === solutionChars[i]) {
        letterCount[letter]--; // consume one occurrence
        return { letter, status: "correct" };
      }
      return { letter, status: "empty" }; // temporary
    });

    // Second pass: mark present/absent
    newRow.forEach((tile, i) => {
      if (tile.status === "correct") return;

      const letter = tile.letter;

      if (letterCount[letter] > 0) {
        tile.status = "present";
        letterCount[letter]--; // consume one occurrence
      } else {
        tile.status = "absent";
      }
    });

    // Update rows
    const newRows = [...rows];
    newRows[currentRow] = newRow;
    setRows(newRows);

    // Win condition
    if (guess.join("") === solution) {
      setGameOver(true);
      setToast("Correct!");
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.3 } });
      return;
    }

    // Lose condition
    if (currentRow === ROWS - 1) {
      setGameOver(true);
      setToast(`Game over. Word was ${solution}`);
      return;
    }

    // Advance row
    setCurrentRow(currentRow + 1);
    setCurrentCol(0);

    // Update keyboard letter statuses
    const updatedStatuses = { ...letterStatuses };
    newRow.forEach(tile => {
      const current = updatedStatuses[tile.letter];
      if (tile.status === "correct") updatedStatuses[tile.letter] = "correct";
      else if (tile.status === "present" && current !== "correct")
        updatedStatuses[tile.letter] = "present";
      else if (!current) updatedStatuses[tile.letter] = "absent";
    });

    setLetterStatuses(updatedStatuses);
  };



  // Functions to handle saving, loading, and resetting the game state

  const handleSave = (): void => {
    console.log("SAVE (stub)", { rows, currentRow, solution });
    setToast("Save game (stub)");
  };

  const handleLoad = (): void => {
    console.log("LOAD (stub)");
    setToast("Load game (stub)");
  };

  const handleReset = (): void => {
    setRows(
      Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => ({ letter: "", status: "empty" }))
      )
    );
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setLetterStatuses({});
  };


  /*
    Render the game UI, including the board, keyboard, and toast messages.
    Constructs TSX elements for the game interface.
  */
  return (
    <div className="flex flex-col items-center gap-4">

      {/* Game Header */}
      <div className="flex flex-row items-center">
        
        <img src="/Wordle.png" width={50} alt="Wordle Logo" className="mr-4" />

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold tracking-widest">WORDLE</h1>
          <div className="opacity-60 text-xs tracking-wide">{getTodayFormatted()}</div>
        </div>

      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 rounded">Save</button>
        <button onClick={handleLoad} className="px-4 py-2 bg-amber-500 rounded">Load</button>
        <button onClick={handleReset} className="px-4 py-2 bg-slate-700 rounded">Reset</button>
      </div>

      {/* Toast Message */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Game Board */}
      <Board rows={rows} />

      {/* On-Screen Keyboard */}
      <Keyboard onKey={handleKey} letterStatuses={letterStatuses} />
    </div>
  );
}
