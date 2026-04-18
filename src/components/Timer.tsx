import { useElapsedSeconds } from '../hooks/useElapsedSeconds';
import { formatElapsed } from '../utils/format';

export const Timer = () => {
  const seconds = useElapsedSeconds();
  return (
    <div className="timer" data-testid="timer" aria-label="経過時間">
      <span className="timer__icon" aria-hidden="true">⏱</span>
      <span className="timer__value">{formatElapsed(seconds)}</span>
    </div>
  );
};
