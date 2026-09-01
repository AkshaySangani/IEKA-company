import { useRef, useState } from "react";
import XLSX from "../../../assets/images/xls.png";
import PDF from "../../../assets/images/pdf_icon.png";
import TextField from "../text-field/TextField";
import DownloadModal from "../download-modal/DownloadModal";
import useDevice from "../../../hooks/useDevice";

interface TopBarProps {
  title?: string;
  actionButtons?: React.ReactNode;
  handleDownloadExcel?: (password: string) => void;
  handleDownloadPdfClick?: () => void;
  isSearch?: boolean;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  isExcel?: boolean;
  isPdf?: boolean;
}

const TopBar = ({
  title = "",
  actionButtons = <></>,
  isSearch = false,
  isExcel = false,
  isPdf = false,
  onSearch = () => {},
  searchPlaceholder = "Search...",
  handleDownloadExcel = () => {},
  handleDownloadPdfClick = () => {},
}: TopBarProps) => {
  const { isMobile } = useDevice();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [downloadOpen, setDownloadOpen] = useState<boolean>(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  // download confirmation popup
  const handleDownLoadOpenClose = () => {
    setDownloadOpen(prev => !prev);
  }

  return (
    <>
    <div className="sticky border-b border-borderPrimary px-[25px]">
      <div className="flex min-h-[50px] items-center justify-between">
        <div>
          {!isMobile && <h1 className="text-[18px] leading-7 font-medium ">{title}</h1>}
        </div>

        <div>
          <div className="flex items-center gap-[10px]">
            {/* Search */}
            {isSearch && (
              <div className="flex items-center">
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showSearch ? "mr-3 w-64 opacity-100" : "mr-0 w-0 opacity-0"
                  }`}
                >
                  <TextField
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                  />
                </div>

                <button
                  onClick={() => {
                    if (showSearch && search) {
                      setSearch("");
                      onSearch?.("");
                    }
                    setShowSearch((prev) => !prev);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                >
                  <i
                    className={`fa-solid ${
                      showSearch ? "fa-xmark" : "fa-magnifying-glass"
                    } text-lg text-primary`}
                  />
                </button>
              </div>
            )}

            {isPdf && (
              <button
                type="button"
                onClick={handleDownloadPdfClick}
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center"
              >
                <img
                  src={PDF}
                  alt="Pdf"
                  className="h-full w-full object-contain"
                />
              </button>
            )}

            {isExcel && (
              <button
                type="button"
                onClick={handleDownLoadOpenClose}
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center"
              >
                <img
                  src={XLSX}
                  alt="Excel"
                  className="h-full w-full object-contain"
                />
              </button>
            )}
            {actionButtons}
          </div>
        </div>
      </div>
    </div>
    <DownloadModal isOpen={downloadOpen} onClose={handleDownLoadOpenClose} handleDownLoad={handleDownloadExcel} />
    </>
  );
};

export default TopBar;
