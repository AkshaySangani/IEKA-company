import { useEffect, useRef, useState } from "react";
import CandidateDetails from "./CandidateDetails";
import CompanyDetails from "./CompanyDetails";
import BackgroundStyle from "./BackgroundStyle";
import LetterPreview from "./LetterPreview";
import TopBar from "../topbar/TopBar";
import { useReactToPrint } from "react-to-print";
import Button from "../button/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export interface LetterData {
  candidateName: string;
  jobTitle: string;
  terminationDate: string;
  promotionDate: string;
  promotionFrom: string;
  promotionTo: string;
  lastWorkingDate: string;
  effectiveDate: string;
  joiningDate: string;

  logo: string;

  authPerson: string;
  designation: string;
  address: string;
  contact: string;
  email: string;
  website: string;

  backgroundStyle: number;

  showCandidateName: boolean;
  showJobTitle: boolean;
  showTerminationDate: boolean;
  showLastWorkingDate: boolean;
  showJoiningDate: boolean;
  showEffectiveDate: boolean;
  showPromotionFrom: boolean;
  showPromotionTo: boolean;
  showPromotionDate: boolean;

  showLogo: boolean;
  showAuthPerson: boolean;
  showDesignation: boolean;
  showAddress: boolean;
  showContact: boolean;
  showEmail: boolean;
  showWebsite: boolean;
}

export const initialLetterData: LetterData = {
  candidateName: "",
  jobTitle: "",
  terminationDate: "",
  lastWorkingDate: "",
  promotionFrom: "",
  promotionTo: "",
  effectiveDate: "",
  promotionDate: "",

  joiningDate: "",

  logo: "",

  authPerson: "",
  designation: "",
  address:
    "",
  contact: "",
  email: "",
  website: "",

  backgroundStyle: 1,

  showCandidateName: true,
  showJobTitle: true,
  showTerminationDate: true,
  showLastWorkingDate: true,
  showEffectiveDate: true,
  showPromotionFrom: true,
  showPromotionTo: true,
  showJoiningDate: true,
  showPromotionDate: true,

  showLogo: true,
  showAuthPerson: true,
  showDesignation: true,
  showAddress: true,
  showContact: true,
  showEmail: true,
  showWebsite: true,
};

interface CertificateProps {
  title: string;
  letterData: LetterData;
}

const Certificate = ({ title, letterData }: CertificateProps) => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const [data, setData] = useState<LetterData>(initialLetterData);
  const [backGround, setBackGround] = useState<string>("1");
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    if(letterData){
      setData((prev => ({
        ...prev,
        ...letterData
      })))
    }
  }, [letterData])
  const handleClose = () => {
    const redirectPath = pathName.split("/").splice(1,2).join("/");
    navigate(`/${redirectPath}`);
  }

  return (
    <>
      <TopBar
        title={title}
        actionButtons={
          <Button
            size="sm"
            variant={"danger"}
            onClick={handleClose}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        }
        isPdf
        handleDownloadPdfClick={() => reactToPrintFn()}
      />
      <div className="content-area bg-slate-100">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <CandidateDetails title={title} data={data} setData={setData} />

            <CompanyDetails data={data} setData={setData} />

            <BackgroundStyle
              backGround={backGround}
              setBackGround={setBackGround}
            />
          </div>

          {/* Right Preview */}
          <div className="col-span-12 lg:col-span-8">
            <div className="sticky top-5" ref={contentRef}>
              <LetterPreview title={title} data={data} backGround={backGround} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
