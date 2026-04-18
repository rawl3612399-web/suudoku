import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StartButton } from './StartButton';
import { useGameStore } from '../../state/gameStore';

describe('StartButton', () => {
  beforeEach(() => {
    useGameStore.getState().newGame('easy', 100_001);
  });

  it('renders in ready state', () => {
    render(<StartButton />);
    expect(screen.getByTestId('start-btn')).toBeInTheDocument();
  });

  it('hides after startGame is called', () => {
    useGameStore.getState().startGame();
    render(<StartButton />);
    expect(screen.queryByTestId('start-btn')).not.toBeInTheDocument();
  });

  it('starts game when clicked', () => {
    render(<StartButton />);
    fireEvent.click(screen.getByTestId('start-btn'));
    expect(useGameStore.getState().status).toBe('playing');
  });

  it('shows the puzzle id for stock puzzle', () => {
    render(<StartButton />);
    expect(screen.getByTestId('start-overlay').textContent).toContain('初級 #001');
  });

  it('shows roomCode for non-stock puzzle', () => {
    useGameStore.getState().newGame('easy', 555);
    render(<StartButton />);
    expect(screen.getByTestId('start-overlay').textContent).toContain('E-000555');
  });
});
