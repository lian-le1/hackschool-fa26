import Tile from "./Tile";
import type { RowData } from "@/lib/types";

interface RowProps {
  tiles: RowData;
}

// Row component to render a single row of tiles on the game board
export default function Row({ tiles }: RowProps) {
  return (
    <div className="flex gap-2 justify-center">
      {tiles.map((tile, i) => (
        <Tile key={i} tile={tile} />
      ))}
    </div>
  );
}
