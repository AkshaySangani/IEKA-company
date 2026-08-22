import React, { useState } from "react";
import TextField from "../text-field/TextField";
import Note from "../note-area/Note";
import DownloadExcelIcon from "../../../assets/images/downloadexcell.png";
import Modal from "../modal/Modal";
import { FileType } from "../../../types/common-types";
import Checkbox from "../checkbox/CheckBox";
import Image from "../image";
import Button from "../button/Button";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: FileType;
  handleDownLoad: (password: string) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  type = "xlsx",
  onClose,
  handleDownLoad,
}) => {
  const [loading, setLoading] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsPasswordProtected(checked);

    if (!checked) {
      setPassword("");
      setShowPassword(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);

      await handleDownLoad(isPasswordProtected ? password : "");
    } finally {
      setLoading(false);
    }
  };

  const handleOnConfirm = () => {
    if (type === "pdf") {
      // PDF download logic
      handleDownload();
      return;
    }

    handleDownload();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Download"
      onClose={onClose}
      width="max-w-2xl"
      showFooter={false}
    >
      <div className="space-y-5">
        {/* Download Message */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Image
              src={DownloadExcelIcon}
              fallbackSrc={DownloadExcelIcon}
              alt="Download"
            />
          </div>

          <p className="text-center text-lg font-medium text-secondary">
            Are you sure you want to download?
          </p>
        </div>

        {/* Password Protection */}
        <Checkbox
          label="Do you want the downloaded file to be password protected?"
          name={"isPasswordProtected"}
          checked={isPasswordProtected}
          onChange={(checked: boolean, name: string) =>
            handleCheckboxChange(checked)
          }
        />

        {/* Password Field */}
        {isPasswordProtected && (
          <div className="space-y-3">
            <TextField
              label="Create Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    flex
                    h-full
                    cursor-pointer
                    items-center
                    justify-center
                    px-2
                    text-secondary/60
                    transition
                    hover:text-secondary
                  "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    }`}
                  />
                </button>
              }
            />

            {/* Password Note */}
            <Note
              variant="danger"
              message="This file is password protected and can only be accessed by entering the above-mentioned password."
            />
          </div>
        )}
        <div
          className="
              shrink-0
              border-t
              border-gray-300
              px-4
              pt-3
              sm:px-6
              sm:pt-4
              flex
              justify-center
              gap-3
            "
        >
          <Button
            loading={loading}
            variant="primary"
            disabled={((isPasswordProtected && password === "") || loading)}
            name={"Download"}
            size="sm"
            onClick={handleOnConfirm}
          />

          <Button
            name="Close"
            size="sm"
            variant="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DownloadModal;
