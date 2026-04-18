import { useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import { encodeRoomCode } from '../../utils/roomCode';
import { CodeInputModal } from '../Modals/CodeInputModal';

export const RoomCodeBar = () => {
  const difficulty = useGameStore((s) => s.difficulty);
  const seed = useGameStore((s) => s.seed);
  const newGame = useGameStore((s) => s.newGame);
  const [copied, setCopied] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const code = encodeRoomCode(difficulty, seed);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="room-code">
      <button
        type="button"
        className="room-code__display"
        onClick={handleCopy}
        data-testid="room-code-display"
        aria-label={`ルームコード ${code}（タップでコピー）`}
      >
        <span className="room-code__label">コード</span>
        <span className="room-code__value">{code}</span>
        <span className="room-code__hint">{copied ? 'コピーしました' : 'タップでコピー'}</span>
      </button>
      <button
        type="button"
        className="room-code__join"
        onClick={() => setShowInput(true)}
        data-testid="room-code-join"
      >
        コード入力
      </button>

      {showInput && (
        <CodeInputModal
          onStart={(difficulty, seed) => {
            newGame(difficulty, seed);
            setShowInput(false);
          }}
          onCancel={() => setShowInput(false)}
        />
      )}
    </div>
  );
};
