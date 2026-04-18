import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotesGrid } from './NotesGrid';

describe('NotesGrid', () => {
  it('renders 9 cells', () => {
    const { container } = render(<NotesGrid notes={[]} />);
    expect(container.querySelectorAll('.notes-grid__item')).toHaveLength(9);
  });

  it('shows only the notes that are set', () => {
    render(<NotesGrid notes={[1, 5, 9]} />);
    const grid = screen.getByTestId('notes-grid');
    expect(grid.textContent).toBe('159');
  });
});
