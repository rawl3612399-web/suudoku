import { useState } from 'react';
import { decodeRoomCode } from '../../utils/roomCode';
import type { Difficulty } from '../../utils/constants';

interface CodeInputModalProps {
  onStart: (difficulty: Difficulty, seed: number) => void;
  onCancel: () => void;
}

export const CodeInputModal = ({ onStart, onCancel }: CodeInputModalProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const decoded = decodeRoomCode(code);
    if (!decoded) {
      setError('コードの形式が正しくありません（例: E-123456）');
      return;
    }
    onStart(decoded.difficulty, decoded.seed);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
      role="presentation"
      data-testid="modal-backdrop"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="code-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="code-modal-title" className="modal__title">
          ルームコードで開始
        </h2>
        <p className="modal__message">
          友達と同じコードを入力すると、同じ問題が出題されます。
        </p>
        <input
          type="text"
          className="modal__input"
          placeholder="例: E-123456"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          data-testid="code-input"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
        />
        {error && <p className="modal__error" data-testid="code-error">{error}</p>}
        <div className="modal__actions">
          <button
            type="button"
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
            data-testid="modal-cancel"
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--confirm"
            onClick={handleSubmit}
            data-testid="modal-confirm"
          >
            開始する
          </button>
        </div>
      </div>
    </div>
  );
};
