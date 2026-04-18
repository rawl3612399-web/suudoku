import { useState } from 'react';
import { DIFFICULTIES, DIFFICULTY_LABELS, type Difficulty } from '../../utils/constants';
import { getStockPuzzleList } from '../../data/stockPuzzles';
import { useBestTimesStore } from '../../state/bestTimesStore';
import { formatElapsed } from '../../utils/format';

interface PuzzleSelectModalProps {
  initialDifficulty: Difficulty;
  currentSeed: number;
  onSelect: (difficulty: Difficulty, number: number) => void;
  onCancel: () => void;
}

export const PuzzleSelectModal = ({
  initialDifficulty,
  currentSeed,
  onSelect,
  onCancel,
}: PuzzleSelectModalProps) => {
  const [tab, setTab] = useState<Difficulty>(initialDifficulty);
  const records = useBestTimesStore((s) => s.records);
  const list = getStockPuzzleList(tab);

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
      role="presentation"
      data-testid="modal-backdrop"
    >
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="puzzle-select-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="puzzle-select-title" className="modal__title">
          問題を選ぶ
        </h2>
        <div className="puzzle-select__tabs" role="tablist">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={tab === d}
              className={`puzzle-select__tab${tab === d ? ' puzzle-select__tab--active' : ''}`}
              onClick={() => setTab(d)}
              data-testid={`puzzle-tab-${d}`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
        <div className="puzzle-select__grid">
          {list.map((p) => {
            const record = records[`${p.difficulty}:${p.seed}`];
            const isCurrent = p.seed === currentSeed;
            const cls = [
              'puzzle-select__cell',
              record ? 'puzzle-select__cell--cleared' : '',
              isCurrent ? 'puzzle-select__cell--current' : '',
            ].filter(Boolean).join(' ');
            return (
              <button
                key={p.seed}
                type="button"
                className={cls}
                onClick={() => onSelect(p.difficulty, p.number)}
                data-testid={`puzzle-cell-${p.difficulty}-${p.number}`}
                aria-label={
                  record
                    ? `${p.number}番 ベスト${formatElapsed(record.bestSeconds)}`
                    : `${p.number}番 未挑戦`
                }
              >
                <span className="puzzle-select__num">{p.number}</span>
                {record && (
                  <span className="puzzle-select__best">
                    {formatElapsed(record.bestSeconds)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="modal__actions">
          <button
            type="button"
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
            data-testid="modal-cancel"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
