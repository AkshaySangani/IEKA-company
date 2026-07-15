import { useEffect, useState } from "react";
import Button from "../../common/button/Button";
import PageLoader from "../../common/loader/PageLoader";
import TopBar from "../../common/topbar/TopBar";
import CompanyDetailCard from "./CompanyDetailCard";
import CompanyDetailEditModel from "./CompanyDetailEditModel";
import OwnerDetailCard from "./OwnerDetailCard";
import OwnerDetailEditModel from "./OwnerDetailEditModel";
import { getCompanyById } from "../../../apis/company/company.api";
import { useNavigate, useParams } from "react-router-dom";
import {
  AccountType,
  IEmployeeStats,
  statusEnum,
} from "../../../types/common-types";
import EmptyPlaceholder from "../../common/empty-paceholder";

export interface IBankAccount {
  _id: string;
  accountNo: number;
  ifscCode: string;
  accountHolderName: string;
  accountType: AccountType;
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyRepresentative {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  profileImage: string;
  status: statusEnum;
  address: string;
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyDetails {
  _id: string;
  status: statusEnum;

  companyName: string;
  gstin: string;
  companyEmail: string;
  companyPhone: number;
  companyAddress: string;
  companyLogo: string;

  modules: string[];

  employeePrice: number;
  productionPrice: number;

  assignedBankAccount: IBankAccount;
  generateInvoiceWithGST: string;

  employeeStats: IEmployeeStats;

  createdAt: string;
  updatedAt: string;

  companyRepresentative: ICompanyRepresentative;
}

const OwnerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState<boolean>(false);
  const [isOwnerOpen, setIsOwnerOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const initialCompanyDetails: ICompanyDetails = {
    _id: "",
    status: statusEnum.ACTIVE,

    companyName: "",
    gstin: "",
    companyEmail: "",
    companyPhone: 0,
    companyAddress: "",
    companyLogo: "",

    modules: [],

    employeePrice: 0,
    productionPrice: 0,

    assignedBankAccount: {
      _id: "",
      accountNo: 0,
      ifscCode: "",
      accountHolderName: "",
      accountType: "SAVING",
      status: statusEnum.ACTIVE,
      createdAt: "",
      updatedAt: "",
    },
    generateInvoiceWithGST: "",

    employeeStats: {
      active: 0,
      inactive: 0,
      deleted: 0,
    },

    createdAt: "",
    updatedAt: "",

    companyRepresentative: {
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      profileImage: "",
      address: "",
      status: statusEnum.ACTIVE,
      lastLoginAt: null,
      passwordChangedAt: null,
      companyId: "",
      createdAt: "",
      updatedAt: "",
    },
  };

  const [companyDetails, setCompanyDetails] = useState<ICompanyDetails>(
    initialCompanyDetails,
  );

  useEffect(() => {
    if (id) {
      getCompany(id, true);
    }
  }, [id]);

  // get company and owner details
  const getCompany = async (companyId: string, loading: boolean = false) => {
    setLoading(loading);
    const response = await getCompanyById(companyId);
    if(response.success){
      setCompanyDetails({...response.data, generateInvoiceWithGST: response.data.generateInvoiceWithGST ? "YES": "NO"});
      setLoading(false);
    } else {
      setCompanyDetails(initialCompanyDetails);
      setLoading(false);
    }
  };

  // handle Open Company Edit Modal
  const handleCompanyOpen = () => {
    setIsCompanyOpen((prev) => !prev);
  };

  // handle Open Owner Edit Modal
  const handleOwnerOpen = () => {
    setIsOwnerOpen((prev) => !prev);
  };

  // handle open account edit modal
  const handleAccountOpen = () => {
    setIsAccountOpen((prev) => !prev);
  };
  return (
    <>
      <TopBar
        title={companyDetails.companyName}
        actionButtons={
          <Button
            // name="Add New"
            size="sm"
            variant={"danger"}
            className="buttoncommon"
            onClick={() => navigate("/")}
            leftIcon={<i className="fa-solid fa-xmark fa-xl"></i>}
          />
        }
      />
      <div className="content-area flex flex-col gap-4">
        <PageLoader loading={loading} />
        {(!loading && companyDetails._id) ? <div className="grid grid-cols-1 sm:grid-cols-[3fr_4fr] gap-4">
          <CompanyDetailCard
            data={companyDetails}
            handleCompanyOpen={handleCompanyOpen}
            handleAccountOpen={handleAccountOpen}
          />

          <OwnerDetailCard
            data={companyDetails.companyRepresentative}
            moduleAccess={companyDetails.modules}
            handleOwnerOpen={handleOwnerOpen}
          />
        </div> : !loading && <EmptyPlaceholder title="Company Not Found."/>}
      </div>
      <CompanyDetailEditModel
        isOpen={isCompanyOpen}
        companyDetails={companyDetails}
        handleCompanyClose={handleCompanyOpen}
        fetchCompanyDetails={() => getCompany(companyDetails._id, false)}
      />
      <OwnerDetailEditModel
        isOpen={isOwnerOpen}
        companyDetails={companyDetails}
        handleOwnerClose={handleOwnerOpen}
        fetchCompanyDetails={() => getCompany(companyDetails._id, false)}
      />

    </>
  );
};

export default OwnerDetails;
