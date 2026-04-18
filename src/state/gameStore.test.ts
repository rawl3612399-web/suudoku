import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import { useBestTimesStore } from './bestTimesStore';

const startFresh = () => {
  useBestTimesStore.getState().resetAll();
  useGameStore.getState().newGame('easy', 12345);
  useGameStore.getState().startGame();
};

const findEditableCell = () => {
  const { board } = useGameStore.getState();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c].isFixed) return { row: r, col: c };
    }
  }
  throw new Error('no editable cell');
};

describe('gameStore', () => {
  beforeEach(() => {
    startFresh();
  });

  it('newGame initializes with ready status (timer not started)', () => {
    useGameStore.getState().newGame('easy', 12345);
    const state = useGameStore.getState();
    expect(state.status).toBe('ready');
    expect(state.startedAt).toBeNull();
  });

  it('startGame transitions ready -> playing and sets startedAt', () => {
    useGameStore.getState().newGame('easy', 12345);
    expect(useGameStore.getState().status).toBe('ready');
    useGameStore.getState().startGame();
    expect(useGameStore.getState().status).toBe('playing');
    expect(useGameStore.getState().startedAt).toBeTypeOf('number');
  });

  it('startGame is a no-op when not in ready state', () => {
    expect(useGameStore.getState().status).toBe('playing');
    const before = useGameStore.getState().startedAt;
    useGameStore.getState().startGame();
    expect(useGameStore.getState().startedAt).toBe(before);
  });

  it('inputNumber is a no-op in ready state', () => {
    useGameStore.getState().newGame('easy', 12345);
    const target = findEditableCell();
    useGameStore.getState().selectCell(target);
    useGameStore.getState().inputNumber(7);
    expect(useGameStore.getState().board[target.row][target.col].value).toBeNull();
  });

  it('selectCell sets selectedCell', () => {
    useGameStore.getState().selectCell({ row: 2, col: 3 });
    expect(useGameStore.getState().selectedCell).toEqual({ row: 2, col: 3 });
  });

  it('inputNumber sets value on selected non-fixed cell', () => {
    const target = findEditableCell();
    useGameStore.getState().selectCell(target);
    useGameStore.getState().inputNumber(7);
    expect(useGameStore.getState().board[target.row][target.col].value).toBe(7);
  });

  it('inputNumber on fixed cell does nothing', () => {
    const { board } = useGameStore.getState();
    let fixed: { row: number; col: number } | null = null;
    for (let r = 0; r < 9 && !fixed; r++) {
      for (let c = 0; c < 9 && !fixed; c++) {
        if (board[r][c].isFixed) fixed = { row: r, col: c };
      }
    }
    expect(fixed).not.toBeNull();
    const before = board[fixed!.row][fixed!.col].value;
    useGameStore.getState().selectCell(fixed!);
    useGameStore.getState().inputNumber(7);
    expect(useGameStore.getState().board[fixed!.row][fixed!.col].value).toBe(before);
  });

  it('toggleNoteMode flips noteMode flag', () => {
    expect(useGameStore.getState().noteMode).toBe(false);
    useGameStore.getState().toggleNoteMode();
    expect(useGameStore.getState().noteMode).toBe(true);
  });

  it('inputNumber in note mode toggles a note instead of value', () => {
    const target = findEditableCell();
    useGameStore.getState().selectCell(target);
    useGameStore.getState().toggleNoteMode();
    useGameStore.getState().inputNumber(3);
    expect(useGameStore.getState().board[target.row][target.col].notes).toContain(3);
    expect(useGameStore.getState().board[target.row][target.col].value).toBeNull();
  });

  it('clearCell removes value and notes', () => {
    const target = findEditableCell();
    useGameStore.getState().selectCell(target);
    useGameStore.getState().inputNumber(5);
    useGameStore.getState().clearCell();
    const cell = useGameStore.getState().board[target.row][target.col];
    expect(cell.value).toBeNull();
    expect(cell.notes).toEqual([]);
  });

  it('revealSolution fills board with solution and sets status revealed', () => {
    useGameStore.getState().revealSolution();
    const { board, solution, status } = useGameStore.getState();
    expect(status).toBe('revealed');
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(board[r][c].value).toBe(solution[r][c]);
      }
    }
  });

  it('newGame resets state with chosen difficulty (now ready not playing)', () => {
    useGameStore.getState().newGame('hard', 999);
    expect(useGameStore.getState().difficulty).toBe('hard');
    expect(useGameStore.getState().status).toBe('ready');
    expect(useGameStore.getState().selectedCell).toBeNull();
  });

  it('detects solved status when board matches solution via inputs', () => {
    const { solution } = useGameStore.getState();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = useGameStore.getState().board[r][c];
        if (!cell.isFixed) {
          useGameStore.getState().selectCell({ row: r, col: c });
          useGameStore.getState().inputNumber(solution[r][c]);
        }
      }
    }
    expect(useGameStore.getState().status).toBe('solved');
  });

  it('records best time on solve', () => {
    const { solution, difficulty, seed } = useGameStore.getState();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = useGameStore.getState().board[r][c];
        if (!cell.isFixed) {
          useGameStore.getState().selectCell({ row: r, col: c });
          useGameStore.getState().inputNumber(solution[r][c]);
        }
      }
    }
    expect(
      useBestTimesStore.getState().getRecord(difficulty, seed),
    ).not.toBeNull();
  });

  it('does not record best time on revealSolution', () => {
    const { difficulty, seed } = useGameStore.getState();
    useGameStore.getState().revealSolution();
    expect(
      useBestTimesStore.getState().getRecord(difficulty, seed),
    ).toBeNull();
  });
});
