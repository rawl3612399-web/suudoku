interface NotesGridProps {
  notes: ReadonlyArray<number>;
}

export const NotesGrid = ({ notes }: NotesGridProps) => {
  const set = new Set(notes);
  return (
    <div className="notes-grid" data-testid="notes-grid">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
        <span key={n} className="notes-grid__item">
          {set.has(n) ? n : ''}
        </span>
      ))}
    </div>
  );
};
