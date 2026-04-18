import { useGameStore } from '../../state/gameStore';
import { encodeRoomCode } from '../../utils/roomCode';
import {
  formatPuzzleId,
  seedToPuzzleNumber,
} from '../../utils/puzzleId';

export const StartButton = () => {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const difficulty = useGameStore((s) => s.difficulty);
  const seed = useGameStore((s) => s.seed);

  if (status !== 'ready') return null;

  const stockNumber = seedToPuzzleNumber(difficulty, seed);
  const label = stockNumber !== null
    ? formatPuzzleId(difficulty, stockNumber)
    : encodeRoomCode(difficulty, seed);

  return (
    <div className="start-overlay" data-testid="start-overlay">
      <div className="start-overlay__card">
        <p className="start-overlay__label">{label}</p>
        <p className="start-overlay__hint">スタートを押すとタイマーが計測を開始します</p>
        <button
          type="button"
          className="start-overlay__btn"
          onClick={startGame}
          data-testid="start-btn"
        >
          ▶ スタート
        </button>
      </div>
    </div>
  );
};
