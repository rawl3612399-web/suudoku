import { useGameStore } from '../../state/gameStore';
import { findConflicts } from '../../domain/sudoku/validator';
import { BOARD_SIZE, BLOCK_SIZE } from '../../utils/constants';
import { Cell } from './Cell';

const boardToNumeric = (board: ReturnType<typeof useGameStore.getState>['board']) =>
  board.map((row) => row.map((cell) => cell.value ?? 0));

export const Board = () => {
  const board = useGameStore((s) => s.board);
  const selectedCell = useGameStore((s) => s.selectedCell);
  const selectCell = useGameStore((s) => s.selectCell);

  const numeric = boardToNumeric(board);
  const conflicts = new Set(
    findConflicts(numeric).map((p) => `${p.row},${p.col}`),
  );

  const selectedValue =
    selectedCell !== null ? board[selectedCell.row][selectedCell.col].value : null;

  const isPeer = (r: number, c: number): boolean => {
    if (!selectedCell) return false;
    if (selectedCell.row === r && selectedCell.col === c) return false;
    if (selectedCell.row === r) return true;
    if (selectedCell.col === c) return true;
    const sameBlockRow =
      Math.floor(selectedCell.row / BLOCK_SIZE) === Math.floor(r / BLOCK_SIZE);
    const sameBlockCol =
      Math.floor(selectedCell.col / BLOCK_SIZE) === Math.floor(c / BLOCK_SIZE);
    return sameBlockRow && sameBlockCol;
  };

  return (
    <div className="board" role="grid" aria-label="数独盤面">
      {Array.from({ length: BOARD_SIZE }, (_, r) =>
        Array.from({ length: BOARD_SIZE }, (_, c) => {
          const cell = board[r][c];
          const isSelected =
            selectedCell?.row === r && selectedCell?.col === c;
          const isSameValue =
            selectedValue !== null &&
            cell.value === selectedValue &&
            !isSelected;
          const isConflict = conflicts.has(`${r},${c}`);
          return (
            <Cell
              key={`${r}-${c}`}
              cell={cell}
              row={r}
              col={c}
              isSelected={isSelected}
              isPeer={isPeer(r, c)}
              isSameValue={isSameValue}
              isConflict={isConflict}
              onSelect={(rr, cc) => selectCell({ row: rr, col: cc })}
            />
          );
        }),
      )}
    </div>
  );
};
