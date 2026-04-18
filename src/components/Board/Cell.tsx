import type { Cell as CellModel } from '../../domain/sudoku/types';
import { NotesGrid } from './NotesGrid';

interface CellProps {
  cell: CellModel;
  row: number;
  col: number;
  isSelected: boolean;
  isPeer: boolean;
  isSameValue: boolean;
  isConflict: boolean;
  onSelect: (row: number, col: number) => void;
}

export const Cell = ({
  cell,
  row,
  col,
  isSelected,
  isPeer,
  isSameValue,
  isConflict,
  onSelect,
}: CellProps) => {
  const classes = ['cell'];
  if (cell.isFixed) classes.push('cell--fixed');
  if (isSelected) classes.push('cell--selected');
  if (isPeer) classes.push('cell--peer');
  if (isSameValue) classes.push('cell--same');
  if (isConflict) classes.push('cell--conflict');
  if (col % 3 === 2 && col !== 8) classes.push('cell--block-right');
  if (row % 3 === 2 && row !== 8) classes.push('cell--block-bottom');

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => onSelect(row, col)}
      data-testid={`cell-${row}-${col}`}
      aria-label={`セル ${row + 1}行 ${col + 1}列`}
    >
      {cell.value !== null ? (
        <span className="cell__value">{cell.value}</span>
      ) : cell.notes.length > 0 ? (
        <NotesGrid notes={cell.notes} />
      ) : null}
    </button>
  );
};
