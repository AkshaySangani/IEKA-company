import { Ref, useEffect, useRef, useState } from "react";

interface DocumentUploadProps {
  label: string;
  name?: string;
  required?: boolean;
  value?: string | File | null;
  onChange?: (file: File | null) => void;
  error?: string;
  ref?: Ref<HTMLDivElement>;
}

const DocumentUpload = ({
  label,
  name = "document-upload",
  required,
  value = "",
  onChange,
  error,
  ref,
}: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");

  const [documentError, setDocumentError] = useState("");

  useEffect(() => {
    if (!value) {
      setFileName("");
      return;
    }

    if (typeof value === "string") {
      setFileName(value.split("/").pop() || value);
    } else if (value instanceof File) {
      setFileName(value.name);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setDocumentError("");

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      setDocumentError(
        "Only PDF, DOC, DOCX, JPG, JPEG and PNG files are allowed.",
      );

      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setDocumentError("File size must be less than 5 MB.");

      e.target.value = "";
      return;
    }

    setFileName(file.name);

    onChange?.(file);
  };

  const handleRemove = () => {
    setFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onChange?.(null);
  };

  return (
    <div ref={ref}>
      {label && (
        <label className="mb-2 block text-sm font-medium leading-4 text-inputLabel">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      {!fileName ? (
        <div className="flex items-start gap-5 bg-white border border-inputBorder p-1">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            name={name}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className=" cursor-pointer"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between border border-inputBorder bg-white px-4 py-1.5">
          <span className="truncate text-sm text-gray-700">{fileName}</span>

          <button
            type="button"
            onClick={handleRemove}
            className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {(error || documentError) && (
        <p className="mt-1 text-xs text-error">{error || documentError}</p>
      )}
    </div>
  );
};

export default DocumentUpload;
