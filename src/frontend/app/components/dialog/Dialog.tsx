import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import "./Dialog.scss";

export interface DialogProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => any;
  closeOnBackdropClick?: boolean;
}

const Dialog = ({
  isOpen,
  setIsOpen,
  children,
  closeOnBackdropClick = true,
}: PropsWithChildren<DialogProps>) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }

    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const checkDialogBackdropClick = useCallback(
    (evt: MouseEvent) => {
      if (!dialogRef.current || !closeOnBackdropClick) {
        return;
      }

      if (dialogRef.current.contains(evt.target as HTMLElement)) {
        return;
      }

      const dialogRect = dialogRef.current.getBoundingClientRect();
      const isInDialog =
        dialogRect.top <= evt.clientY &&
        evt.clientY <= dialogRect.top + dialogRect.height &&
        dialogRect.left <= evt.clientX &&
        evt.clientX <= dialogRect.left + dialogRect.width;

      if (!isInDialog) {
        setIsOpen(false);
      }
    },
    [closeOnBackdropClick],
  );

  return (
    <dialog
      className="dialog"
      ref={dialogRef}
      onClick={checkDialogBackdropClick}
      onClose={() => setIsOpen(false)}
    >
      {isOpen && children}
    </dialog>
  );
};

export default Dialog;
