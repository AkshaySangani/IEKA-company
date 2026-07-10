import { Ref, useEffect, useRef, useState } from "react";
import Image from "../image";

interface ImageUploadProps {
  label: string;
  name?: string;
  required?: boolean;
  value?: string | File | null;
  onChange?: (file: File | null) => void;
  error?: string;
  ref?: Ref<HTMLDivElement>;
}

const ImageUpload = ({
  label,
  name = "image-upload",
  required,
  value = "",
  onChange,
  error,
  ref
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string>("");

  const [imageError, setError] = useState("");

  useEffect(() => {
  if (!value) {
    setPreview("");
    return;
  }

  if (typeof value === "string") {
    setPreview(value);
  } else if (value instanceof File) {
    setPreview(URL.createObjectURL(value));
  }
}, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const maxSize = 1 * 1024 * 1024; // 50 MB

    // File Type Validation
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG and PNG files are allowed.");

      e.target.value = "";
      return;
    }

    // File Size Validation
    if (file.size > maxSize) {
      setError("File size must be less than 50 MB.");

      e.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));

    onChange?.(file);
  };

  const handleRemove = () => {
    setPreview("");

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

      <div className="flex flex-col gap-3">
        {!preview && (
          <div className="flex items-start gap-10 bg-white border border-inputBorder p-1">
            {/* File Input */}
                <input
                  ref={fileInputRef}
                  name={name}
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={handleFileChange}
                />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="relative w-[100px] h-[100px]">
            <Image src={preview} alt="preview" className="w-[100px] h-[100px] border border-gray-300 object-contain"/>

            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {(error || imageError) && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
