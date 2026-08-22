import React from "react";
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
}

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
  onDownload = () => {}
}: ModalProps) => {
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-[9999]
        flex items-start justify-center
        p-2 sm:p-4
        bg-black/45
        transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    >
      {/* Modal Wrapper */}
      <div
        className={`
          w-full
          ${width}
          max-h-[calc(100vh-1rem)]
          sm:max-h-[calc(100vh-2rem)]
          bg-white
          border border-[#8f8f8f]
          shadow-xl
          flex flex-col
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 bg-[#212837] px-4 py-3 flex items-center justify-between">
          <h5 className="text-white text-base font-medium">{title}</h5>

          <div className="flex items-center gap-2">
            {isDownload && <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDownload();
              }}
              variant="secondary"
              leftIcon={<i className="fa-solid fa-download text-white"></i>}
            />}
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              variant="secondary"
              leftIcon={<i className="fa-solid fa-xmark text-white" />}
            />
          </div>
        </div>

        {/* Body */}
        <div
          className="
            flex-1
            min-h-0
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
      </div>
    </div>
  );
};

export default Modal;
