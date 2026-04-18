import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NumberPad } from './NumberPad';
import { useGameStore } from '../../state/gameStore';

describe('NumberPad', () => {
  beforeEach(() => {
    useGameStore.getState().newGame('easy', 12345);
    useGameStore.getState().startGame();
  });

  it('renders 1..9 + clear', () => {
    render(<NumberPad />);
    for (let n = 1; n <= 9; n++) {
      expect(screen.getByTestId(`pad-${n}`)).toBeInTheDocument();
    }
    expect(screen.getByTestId('pad-clear')).toBeInTheDocument();
  });

  it('shows remaining count per digit', () => {
    render(<NumberPad />);
    expect(screen.getByTestId('pad-1').textContent).toMatch(/\/9/);
  });

  it('disables digit when fully placed (count >= 9)', () => {
    useGameStore.getState().newGame('easy', 12345);
    useGameStore.getState().startGame();
    const { solution, board } = useGameStore.getState();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isFixed && solution[r][c] === 7) {
          useGameStore.getState().selectCell({ row: r, col: c });
          useGameStore.getState().inputNumber(7);
        }
      }
    }
    render(<NumberPad />);
    expect(screen.getByTestId('pad-7')).toBeDisabled();
  });

  it('marks fully-placed digit with --complete class and ✓ indicator', () => {
    useGameStore.getState().newGame('easy', 12345);
    useGameStore.getState().startGame();
    const { solution, board } = useGameStore.getState();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isFixed && solution[r][c] === 4) {
          useGameStore.getState().selectCell({ row: r, col: c });
          useGameStore.getState().inputNumber(4);
        }
      }
    }
    render(<NumberPad />);
    const btn = screen.getByTestId('pad-4');
    expect(btn).toHaveAttribute('data-complete', 'true');
    expect(btn.className).toContain('number-pad__btn--complete');
    expect(btn.textContent).toContain('✓');
    expect(btn.getAttribute('aria-label')).toContain('使い切り');
  });

  it('does not mark unused digits with --complete', () => {
    render(<NumberPad />);
    const btn = screen.getByTestId('pad-1');
    expect(btn).not.toHaveAttribute('data-complete');
    expect(btn.className).not.toContain('number-pad__btn--complete');
  });

  it('disables all digit pads when not playing (ready state)', () => {
    useGameStore.getState().newGame('easy', 12345);
    render(<NumberPad />);
    for (let n = 1; n <= 9; n++) {
      expect(screen.getByTestId(`pad-${n}`)).toBeDisabled();
    }
  });
});
