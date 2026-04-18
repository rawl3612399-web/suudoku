import type { Difficulty } from '../../utils/constants';

export type CellValue = number | null;

export interface Cell {
  readonly value: CellValue;
  readonly notes: ReadonlyArray<number>;
  readonly isFixed: boolean;
}

export type Board = ReadonlyArray<ReadonlyArray<Cell>>;

export type NumericBoard = ReadonlyArray<ReadonlyArray<number>>;

export interface Position {
  readonly row: number;
  readonly col: number;
}

export interface Puzzle {
  readonly board: Board;
  readonly solution: NumericBoard;
  readonly difficulty: Difficulty;
}

export type GameStatus = 'ready' | 'playing' | 'solved' | 'revealed';
