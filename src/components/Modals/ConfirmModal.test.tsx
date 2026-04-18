import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  it('renders title and message', () => {
    render(
      <ConfirmModal
        title="本当に？"
        message="やります"
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />,
    );
    expect(screen.getByText('本当に？')).toBeInTheDocument();
    expect(screen.getByText('やります')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        title="t"
        onConfirm={onConfirm}
        onCancel={() => undefined}
      />,
    );
    fireEvent.click(screen.getByTestId('modal-confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal title="t" onConfirm={() => undefined} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByTestId('modal-cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onCancel when backdrop clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal title="t" onConfirm={() => undefined} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onCancel).toHaveBeenCalled();
  });
});
