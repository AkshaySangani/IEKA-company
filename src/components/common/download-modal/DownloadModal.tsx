import React, { useState } from "react";
import "./DownloadModal.css";
import TextField from "../text-field/TextField";
import Note from "../note-area/Note";
import DownloadExcelIcon from "../../../assets/images/downloadexcell.png"
import Modal from "../modal/Modal";
import { FileType } from "../../../types/common-types";

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
  handleDownLoad
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPasswordProtected(e.target.checked);
    if (!e.target.checked) {
      setPassword(""); // Reset password if unchecked
    }
  };

  const downloadExcel = async () => {
    setLoading(true);
    await handleDownLoad(password);
    setLoading(false);
  };

  const downloadPDF = () => {
    // const doc = new jsPDF();
    // // Simple data rendering for the PDF
    // doc.text("Exported Document Data", 10, 10);
    // dataToExport.forEach((item, index) => {
    //   const rowText = Object.entries(item).map(([key, val]) => `${key}: ${val}`).join(', ');
    //   doc.text(rowText, 10, 20 + (index * 10));
    // });
    // if (isPasswordProtected && password) {
    //   // jsPDF supports native document open encryption
    //   doc.encrypt(password, password, {
    //     userPermissions: ['print', 'modify', 'copy', 'annot-modify']
    //   });
    // }
    // doc.save(`${fileName}.pdf`);
  };

  const handleOnConfirm = () => {
    if(type === "pdf"){
      downloadPDF();
    } else {
      downloadExcel();
    }
  }

  return (
    <Modal
        isOpen={isOpen}
        title="Download"
        onClose={onClose}
        confirmButtonName={"Download"}
        handleOnConfirm={handleOnConfirm}
        loading={loading}
      >
    <>
      <div className="popcontent">
        <div className="downloadicon">
          <img src={DownloadExcelIcon} alt="download"/>
        </div>
        <div className="message">Are u sure want to download ?</div>
      </div>
      {/* <div className="passprotected mt_15">
        <input
          type="checkbox"
          id="passwordToggle"
          onChange={handleCheckboxChange}
        />
        <div className="message">
          Do you want the downloaded file to be password protected?
        </div>
      </div> */}

      {isPasswordProtected && <div className="field_items mt_15" id="passwordField">
        <div className="column_two">
          <TextField
            label="Create Password"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
            icon={
              <span
                className="fieldicon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                ></i>
              </span>
            }
          />
        </div>
      </div>}
      {isPasswordProtected && <Note
        variant="danger"
        message="This file is password protected and can only be accessed by entering the above-mentioned password."
      />}
    </>
    </Modal>
  );
};

export default DownloadModal;
