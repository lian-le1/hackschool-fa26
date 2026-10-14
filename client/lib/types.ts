// Possible statuses for a letter in the game (correct, present, absent, or empty)
export type LetterStatus = "correct" | "present" | "absent" | "empty";

// Data structure representing a single tile on the game board
export interface TileData {
  letter: string;
  status: LetterStatus;
}

// A row of tiles on the game board
export type RowData = TileData[];
