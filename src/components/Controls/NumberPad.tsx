import { useGameStore } from '../../state/gameStore';
import { useDigitCounts } from '../../hooks/useDigitCounts';
import { isDigitFullyPlaced } from '../../utils/digitCounts';

export const NumberPad = () => {
  const inputNumber = useGameStore((s) => s.inputNumber);
  const clearCell = useGameStore((s) => s.clearCell);
  const status = useGameStore((s) => s.status);
  const counts = useDigitCounts();
  const interactive = status === 'playing';

  return (
    <div className="number-pad" role="group" aria-label="数字入力">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
        const fullyPlaced = isDigitFullyPlaced(counts, n);
        const disabled = !interactive || fullyPlaced;
        return (
          <button
            key={n}
            type="button"
            className={`number-pad__btn${
              fullyPlaced ? ' number-pad__btn--complete' : ''
            }`}
            onClick={() => inputNumber(n)}
            disabled={disabled}
            data-testid={`pad-${n}`}
            data-complete={fullyPlaced ? 'true' : undefined}
            aria-label={fullyPlaced ? `${n} (使い切り)` : `${n}`}
          >
            <span className="number-pad__digit">{n}</span>
          </button>
        );
      })}
      <button
        type="button"
        className="number-pad__btn number-pad__btn--clear"
        onClick={clearCell}
        disabled={!interactive}
        data-testid="pad-clear"
        aria-label="消去"
      >
        <span className="number-pad__digit">✕</span>
      </button>
    </div>
  );
};
