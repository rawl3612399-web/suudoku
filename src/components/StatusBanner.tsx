import { useGameStore } from '../state/gameStore';

export const StatusBanner = () => {
  const status = useGameStore((s) => s.status);
  if (status === 'playing') return null;

  const text = status === 'solved' ? '🎉 クリア！おめでとうございます' : '解答表示モード';
  const cls = status === 'solved' ? 'status status--solved' : 'status status--revealed';

  return (
    <div className={cls} data-testid="status-banner">
      {text}
    </div>
  );
};
