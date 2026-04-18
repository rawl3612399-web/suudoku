import { useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  type Difficulty,
} from '../../utils/constants';
import { puzzleNumberToSeed } from '../../utils/puzzleId';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { PuzzleSelectModal } from '../Modals/PuzzleSelectModal';

export const ActionBar = () => {
  const newGame = useGameStore((s) => s.newGame);
  const revealSolution = useGameStore((s) => s.revealSolution);
  const difficulty = useGameStore((s) => s.difficulty);
  const seed = useGameStore((s) => s.seed);
  const status = useGameStore((s) => s.status);
  const [showReveal, setShowReveal] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="action-bar">
      <select
        className="action-bar__difficulty"
        value={difficulty}
        onChange={(e) => newGame(e.target.value as Difficulty)}
        data-testid="difficulty-select"
        aria-label="難易度"
      >
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>
            {DIFFICULTY_LABELS[d]}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="action-bar__btn"
        onClick={() => setShowPicker(true)}
        data-testid="puzzle-select-btn"
      >
        問題選択
      </button>

      <button
        type="button"
        className="action-bar__btn"
        onClick={() => setShowNew(true)}
        data-testid="new-game-btn"
      >
        ランダム
      </button>

      <button
        type="button"
        className="action-bar__btn action-bar__btn--reveal"
        onClick={() => setShowReveal(true)}
        disabled={status !== 'playing' && status !== 'ready'}
        data-testid="reveal-btn"
      >
        答え
      </button>

      {showReveal && (
        <ConfirmModal
          title="答えを表示しますか？"
          message="このゲームは終了し、解答が表示されます。"
          confirmLabel="表示する"
          onConfirm={() => {
            revealSolution();
            setShowReveal(false);
          }}
          onCancel={() => setShowReveal(false)}
        />
      )}

      {showNew && (
        <ConfirmModal
          title="新しいランダム問題で開始しますか？"
          message="現在の進行状況は失われます。"
          confirmLabel="開始する"
          onConfirm={() => {
            newGame(difficulty);
            setShowNew(false);
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {showPicker && (
        <PuzzleSelectModal
          initialDifficulty={difficulty}
          currentSeed={seed}
          onSelect={(d, n) => {
            newGame(d, puzzleNumberToSeed(d, n));
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};
