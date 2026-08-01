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
  showFooter = true
  
}: ModalProps) => {
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-[9999]
        flex justify-center items-start
        pt-10 pb-10
        overflow-y-auto
        bg-black/45
        transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 visible" : "opacity-0 hidden"}
      `}
    >
      <div
        className={`
          w-full
          mx-[5px]
          bg-white
          border border-[#8f8f8f]
          transition-all duration-300 ease-in-out
          ${width}
          ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }
        `}
      >
        {/* Modal */}
        <div
          className={`w-full ${width} bg-white shadow-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#212837] px-4 py-3 flex items-center justify-between">
            <h5 className="text-white text-base font-medium">{title}</h5>

            <Button
              type="button"
              size="sm"
              onClick={onClose}
              variant="secondary"
              leftIcon={<i className="fa-solid fa-xmark text-white"></i>}
            >
              
            </Button>
          </div>

          {/* Body */}
          <div className="p-3 sm:p-6">{children}</div>

          {/* Footer */}
          {showFooter && <div className="border-t border-gray-300 px-6 py-4 flex justify-center gap-3">
            <Button
              loading={loading}
              variant="primary"
              disabled={loading}
              name={confirmButtonName}
              size="sm"
              onClick={handleOnConfirm}
            />

            <Button
              name="Close"
              size="sm"
              variant="secondary"
              onClick={onClose}
            />
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;