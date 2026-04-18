import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Board,
  GameStatus,
  NumericBoard,
  Position,
} from '../domain/sudoku/types';
import { generatePuzzle } from '../domain/sudoku/generator';
import { isBoardComplete } from '../domain/sudoku/validator';
import {
  createBoardFromNumeric,
  toggleNote,
  updateCell,
} from '../utils/immutable';
import { BOARD_SIZE, type Difficulty } from '../utils/constants';
import { generateSeed } from '../utils/roomCode';
import { useBestTimesStore } from './bestTimesStore';

const boardToNumeric = (board: Board): NumericBoard =>
  board.map((row) => row.map((cell) => cell.value ?? 0));

const checkSolved = (board: Board, solution: NumericBoard): boolean => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c].value !== solution[r][c]) return false;
    }
  }
  return isBoardComplete(boardToNumeric(board));
};

export interface GameState {
  board: Board;
  solution: NumericBoard;
  difficulty: Difficulty;
  seed: number;
  selectedCell: Position | null;
  noteMode: boolean;
  status: GameStatus;
  startedAt: number | null;
  completedAt: number | null;
  newGame: (difficulty: Difficulty, seed?: number) => void;
  startGame: () => void;
  selectCell: (pos: Position | null) => void;
  inputNumber: (value: number) => void;
  clearCell: () => void;
  toggleNoteMode: () => void;
  revealSolution: () => void;
}

const initialSeed = generateSeed();
const initial = generatePuzzle('easy', initialSeed);

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const storage = isBrowser
  ? createJSONStorage(() => window.localStorage)
  : createJSONStorage(() => ({
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }));

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      board: createBoardFromNumeric(initial.puzzle),
      solution: initial.solution,
      difficulty: 'easy',
      seed: initialSeed,
      selectedCell: null,
      noteMode: false,
      status: 'ready',
      startedAt: null,
      completedAt: null,

      newGame: (difficulty, seed) => {
        const actualSeed = seed ?? generateSeed();
        const { puzzle, solution } = generatePuzzle(difficulty, actualSeed);
        set({
          board: createBoardFromNumeric(puzzle),
          solution,
          difficulty,
          seed: actualSeed,
          selectedCell: null,
          noteMode: false,
          status: 'ready',
          startedAt: null,
          completedAt: null,
        });
      },

      startGame: () => {
        if (get().status !== 'ready') return;
        set({ status: 'playing', startedAt: Date.now(), completedAt: null });
      },

      selectCell: (pos) => set({ selectedCell: pos }),

      inputNumber: (value) => {
        const {
          selectedCell,
          board,
          noteMode,
          solution,
          status,
          startedAt,
          difficulty,
          seed,
        } = get();
        if (status !== 'playing') return;
        if (!selectedCell) return;
        const { row, col } = selectedCell;
        if (board[row][col].isFixed) return;

        let nextBoard: Board;
        if (noteMode) {
          nextBoard = toggleNote(board, row, col, value);
        } else {
          nextBoard = updateCell(board, row, col, { value, notes: [] });
        }
        const solved = checkSolved(nextBoard, solution);
        const completedAt = solved ? Date.now() : null;
        set({
          board: nextBoard,
          status: solved ? 'solved' : 'playing',
          completedAt,
        });
        if (solved && startedAt !== null) {
          const elapsed = Math.max(0, Math.floor((completedAt! - startedAt) / 1000));
          useBestTimesStore.getState().recordTime(difficulty, seed, elapsed);
        }
      },

      clearCell: () => {
        const { selectedCell, board, status } = get();
        if (status !== 'playing') return;
        if (!selectedCell) return;
        const { row, col } = selectedCell;
        if (board[row][col].isFixed) return;
        const nextBoard = updateCell(board, row, col, { value: null, notes: [] });
        set({ board: nextBoard });
      },

      toggleNoteMode: () => set({ noteMode: !get().noteMode }),

      revealSolution: () => {
        const { solution } = get();
        const revealedBoard: Board = solution.map((row, r) =>
          row.map((value, c) => ({
            value,
            notes: [],
            isFixed: get().board[r][c].isFixed,
          })),
        );
        set({
          board: revealedBoard,
          status: 'revealed',
          selectedCell: null,
          completedAt: Date.now(),
        });
      },
    }),
    {
      name: 'suudoku-game-v1',
      storage,
      partialize: (state) => ({
        board: state.board,
        solution: state.solution,
        difficulty: state.difficulty,
        seed: state.seed,
        status: state.status,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
      }),
    },
  ),
);
