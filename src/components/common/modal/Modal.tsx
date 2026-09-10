import React, { useEffect, useRef, useState } from "react";
import Button from "../button/Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
  confirmButtonName?: string;
  handleOnConfirm?: (value?: any) => void;
  loading?: boolean;
  showFooter?: boolean;
  isDownload?: boolean;
  onDownload?: () => void;
  ref?: any;
}

const ANIMATION_DURATION = 300;

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  width = "max-w-4xl",
  confirmButtonName = "Save",
  handleOnConfirm = () => {},
  loading = false,
  showFooter = true,
  isDownload = false,
  onDownload = () => {},
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [shouldRender, setShouldRender] = useState(false);

  // Controls opening animation
  const [isVisible, setIsVisible] = useState(false);

  // Controls closing animation
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Handle open / close
   */
  useEffect(() => {
    if (isOpen) {
      // First mount the dialog
      setShouldRender(true);
      setIsClosing(false);
      setIsVisible(false);
    } else if (shouldRender) {
      // Start closing animation
      setIsVisible(false);
      setIsClosing(true);

      const timer = setTimeout(() => {
        if (dialogRef.current?.open) {
          dialogRef.current.close();
        }

        setShouldRender(false);
        setIsClosing(false);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Once dialog is mounted, open it and
   * trigger the opening animation on next frame.
   */
  useEffect(() => {
    if (!shouldRender || isClosing) {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    // Important:
    // First render happens with translate-y-10
    // Then next frame moves it to translate-y-0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, [shouldRender, isClosing]);

  /**
   * Escape key
   */
  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();

    if (!isClosing) {
      onClose();
    }
  };

  /**
   * Close when clicking outside dialog
   */
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;

    if (!dialog || isClosing) {
      return;
    }

    const rect = dialog.getBoundingClientRect();

    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      onClose();
    }
  };

  /**
   * Don't render dialog when completely closed
   */
  if (!shouldRender) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleDialogClick}
      className={`
    w-full
    ${width}

    max-h-[calc(100vh-2rem)]

    p-0

    

    bg-white
    shadow-xl

    overflow-hidden

    /*
     * Mobile
     * Center vertically
     */
    my-auto

    /*
     * Desktop
     * Align near top
     */
    md:mt-8
    md:mb-auto
    md:mx-auto

    transition-all
    duration-300
    ease-out

    ${
      isVisible && !isClosing
        ? "translate-y-0 opacity-100"
        : "-translate-y-10 opacity-0"
    }

    backdrop:bg-black/45
    backdrop:transition-opacity
    backdrop:duration-300

    ${isVisible && !isClosing ? "backdrop:opacity-100" : "backdrop:opacity-0"}
  `}
    >
      {/* Header */}
      <div className="shrink-0 bg-[#212837] px-4 py-2.5 flex items-center justify-between">
        <h5 className="text-white text-lg sm:text-base font-medium">{title}</h5>

        <div className="flex items-center gap-2">
          {isDownload && (
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDownload();
              }}
              variant="secondary"
              leftIcon={<i className="fa-solid fa-download text-white" />}
            />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="
              flex
              justify-center
              items-center
              cursor-pointer
              min-h-[40px]
              sm:min-h-[35px]
              min-w-[40px]
              sm:min-w-[35px]
              bg-btn-secondary
              hover:bg-btn-secondary-hover
              text-white
            "
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-white text-[32px] sm:text-[24px]" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className="
          min-h-0
          max-h-[calc(100vh-10rem)]
          overflow-y-auto
          p-3
          sm:p-4
        "
      >
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div
          className="
            shrink-0
            border-t
            border-gray-300
            px-4
            py-3
            sm:px-6
            sm:py-4
            flex
            justify-center
            gap-3
          "
        >
          <Button
            loading={loading}
            variant="primary"
            disabled={loading}
            name={confirmButtonName}
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleOnConfirm();
            }}
          />

          <Button
            name="Close"
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
        </div>
      )}
    </dialog>
  );
};

export default Modal;
