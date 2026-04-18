import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from './Timer';
import { useGameStore } from '../state/gameStore';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    useGameStore.getState().newGame('easy', 100001);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows 00:00 when in ready state (timer not started)', () => {
    render(<Timer />);
    expect(screen.getByTestId('timer').textContent).toContain('00:00');
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByTestId('timer').textContent).toContain('00:00');
  });

  it('starts ticking after startGame', () => {
    useGameStore.getState().startGame();
    render(<Timer />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('timer').textContent).toContain('00:05');
  });

  it('freezes when status is no longer playing', () => {
    useGameStore.getState().startGame();
    render(<Timer />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    act(() => {
      useGameStore.getState().revealSolution();
    });
    const frozen = screen.getByTestId('timer').textContent;
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByTestId('timer').textContent).toBe(frozen);
  });
});
