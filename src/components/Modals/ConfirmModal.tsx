interface ConfirmModalProps {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
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
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        {message && <p className="modal__message">{message}</p>}
        <div className="modal__actions">
          <button
            type="button"
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
            data-testid="modal-cancel"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--confirm"
            onClick={onConfirm}
            data-testid="modal-confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
