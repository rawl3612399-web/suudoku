import { useGameStore } from '../../state/gameStore';

export const NoteToggle = () => {
  const noteMode = useGameStore((s) => s.noteMode);
  const toggleNoteMode = useGameStore((s) => s.toggleNoteMode);

  return (
    <button
      type="button"
      className={`note-toggle ${noteMode ? 'note-toggle--on' : ''}`}
      onClick={toggleNoteMode}
      data-testid="note-toggle"
      aria-pressed={noteMode}
    >
      メモ {noteMode ? 'ON' : 'OFF'}
    </button>
  );
};
