import "./ConfirmDialog.scss";

export interface ConfirmDialogProps {
  onAccept: () => any;
  onReject: () => any;
  confirmText: string;
  acceptAction?: string;
  rejectAction?: string;
}

const ConfirmDialog = ({
  confirmText,
  onAccept,
  onReject,
  acceptAction = "OK",
  rejectAction = "Cancel",
}: ConfirmDialogProps) => {
  return (
    <div className="confirm-dialog-wrapper">
      <h2>Confirmation</h2>
      <span>{confirmText}</span>
      <div className="buttons">
        <button className="app-btn color-primary" onClick={onAccept}>
          {acceptAction}
        </button>
        <button className="app-btn color-accent" onClick={onReject}>
          {rejectAction}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
