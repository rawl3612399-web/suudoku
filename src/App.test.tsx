import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { App } from './App';
import { useGameStore } from './state/gameStore';
import { useBestTimesStore } from './state/bestTimesStore';

const findFirstEditableCell = () => {
  const { board } = useGameStore.getState();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!board[r][c].isFixed) return { row: r, col: c };
    }
  }
  throw new Error('no editable cell');
};

describe('App integration', () => {
  beforeEach(() => {
    useBestTimesStore.getState().resetAll();
    useGameStore.getState().newGame('easy', 7);
    useGameStore.getState().startGame();
  });

  it('renders core UI parts', () => {
    render(<App />);
    expect(screen.getByText('数独')).toBeInTheDocument();
    expect(screen.getByTestId('reveal-btn')).toBeInTheDocument();
    expect(screen.getByTestId('note-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('pad-1')).toBeInTheDocument();
    expect(screen.getByTestId('pad-clear')).toBeInTheDocument();
    expect(screen.getByTestId('timer')).toBeInTheDocument();
    expect(screen.getByTestId('room-code-display')).toBeInTheDocument();
    expect(screen.getByTestId('puzzle-select-btn')).toBeInTheDocument();
  });

  it('shows StartButton overlay in ready state and hides after start', () => {
    useGameStore.getState().newGame('easy', 7);
    render(<App />);
    expect(screen.getByTestId('start-btn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('start-btn'));
    expect(screen.queryByTestId('start-btn')).not.toBeInTheDocument();
    expect(useGameStore.getState().status).toBe('playing');
  });

  it('shows a room code that matches difficulty + seed', () => {
    render(<App />);
    expect(screen.getByTestId('room-code-display').textContent).toContain('E-');
    expect(screen.getByTestId('room-code-display').textContent).toContain('000007');
  });

  it('joining via code starts a new game in ready state', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('room-code-join'));
    fireEvent.change(screen.getByTestId('code-input'), {
      target: { value: 'M-555555' },
    });
    fireEvent.click(screen.getByTestId('modal-confirm'));
    expect(useGameStore.getState().difficulty).toBe('medium');
    expect(useGameStore.getState().seed).toBe(555555);
    expect(useGameStore.getState().status).toBe('ready');
  });

  it('selecting a cell and pressing a number fills the cell', () => {
    render(<App />);
    const target = findFirstEditableCell();
    fireEvent.click(screen.getByTestId(`cell-${target.row}-${target.col}`));
    fireEvent.click(screen.getByTestId('pad-7'));
    const cell = screen.getByTestId(`cell-${target.row}-${target.col}`);
    expect(within(cell).getByText('7')).toBeInTheDocument();
  });

  it('note mode adds notes instead of value', () => {
    render(<App />);
    const target = findFirstEditableCell();
    fireEvent.click(screen.getByTestId('note-toggle'));
    fireEvent.click(screen.getByTestId(`cell-${target.row}-${target.col}`));
    fireEvent.click(screen.getByTestId('pad-3'));
    fireEvent.click(screen.getByTestId('pad-5'));
    const cell = screen.getByTestId(`cell-${target.row}-${target.col}`);
    const notes = within(cell).getByTestId('notes-grid');
    expect(notes.textContent).toBe('35');
  });

  it('reveal button opens confirm and reveals on confirm', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('reveal-btn'));
    fireEvent.click(screen.getByTestId('modal-confirm'));
    expect(screen.getByTestId('status-banner')).toBeInTheDocument();
  });

  it('changing difficulty starts a new game', () => {
    render(<App />);
    const select = screen.getByTestId('difficulty-select') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'medium' } });
    expect(useGameStore.getState().difficulty).toBe('medium');
    expect(useGameStore.getState().status).toBe('ready');
  });

  it('opens puzzle picker and selects a stock puzzle', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('puzzle-select-btn'));
    fireEvent.click(screen.getByTestId('puzzle-cell-easy-42'));
    expect(useGameStore.getState().difficulty).toBe('easy');
    expect(useGameStore.getState().seed).toBe(100_042);
    expect(useGameStore.getState().status).toBe('ready');
  });

  it('shows BEST badge after a previous solve', () => {
    useBestTimesStore.getState().recordTime('easy', 7, 99);
    render(<App />);
    expect(screen.getByTestId('best-time')).toBeInTheDocument();
    expect(screen.getByTestId('best-time').textContent).toContain('01:39');
  });
});
