import { useLocation, useNavigate } from "react-router-dom";
import { pathNames } from "../../../../../constants/constants";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import { useEffect, useState } from "react";
import { getEmployeeDetails, updateOnboardingStatus } from "../../../../../apis/workforce/onboardings.api";
import {
  BloodGroupEnum,
  GenderEnum,
  RoleEnum,
  statusEnum,
} from "../../../../../types/common-types";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import EmployeeDetailCard from "./EmployeeDetailsCard";
import PageLoader from "../../../../common/loader/PageLoader";
import EmployeeOtherDetailCard from "./EmployeeOtherDetails";

export interface IEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  gender: GenderEnum;
  profileImage: string;
  address: string;
  status: statusEnum;
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  role: RoleEnum;
  companyId: string;
  dob: string;
  isMarried: boolean;
  alternatePhone: number;
  bloodGroup: BloodGroupEnum;
  isPhysicallyDisabled: boolean;
  permanentAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeDetails {
  _id: string;
  userId: string;
  parents: IParents;
  bank: IBank;
  educations: IEducation[];
  experiences: IExperience[];
  documents: IDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface IParents {
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: number;
  motherName: string;
  motherOccupation: string;
  motherPhone: number;
}

export interface IBank {
  accountNo: number;
  ifscCode: string;
  bankName: string;
  uanNo: string;
  esicNo: string;
  pfJoiningDate: string | null;
  esicJoiningDate: string | null;
}

export interface IEducation {
  _id: string;
  organization: string;
  passingYear: number;
  marks: number;
  document: string;
}

export interface IExperience {
  _id: string;
  organization: string;
  designation: string;
  startDate: string;
  endDate: string;
  document: string;
}

export interface IDocument {
  _id: string;
  card: string;
  cardNumber: number;
  front: string;
  back: string;
}

const initialEmployee: IEmployee = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: 0,
  gender: GenderEnum.MALE,
  profileImage: "",
  address: "",
  status: statusEnum.PENDING,
  lastLoginAt: null,
  passwordChangedAt: null,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  role: RoleEnum.EMPLOYEE,
  companyId: "",
  dob: "",
  isMarried: true,
  alternatePhone: 0,
  bloodGroup: BloodGroupEnum.AB_NEGATIVE,
  isPhysicallyDisabled: false,
  permanentAddress: "",
  createdAt: "",
  updatedAt: "",
};

const initialEmployeeDetails: IEmployeeDetails = {
    _id: "",
    userId: "",
    parents: {
        fatherName: "",
        fatherOccupation: "",
        fatherPhone: 0,
        motherName: "",
        motherOccupation: "",
        motherPhone: 0
    },
    bank: {
        accountNo: 0,
        ifscCode: "",
        bankName: "",
        uanNo: "",
        esicNo: "",
        pfJoiningDate: "",
        esicJoiningDate: ""
    },
    educations: [],
    experiences: [],
    documents: [],
    createdAt: "",
    updatedAt: ""
}


const EmployeeDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = location?.state?.id;

  const [loading, setLoading] = useState<boolean>(false);

  const [employee, setEmployee] = useState<IEmployee>(initialEmployee);
  const [employeeDetails, setEmployeeDetails] = useState<IEmployeeDetails>(initialEmployeeDetails);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
    // eslint-disable-next-line
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    const response = await getEmployeeDetails(employeeId);
    if (response.success) {
      const data = response?.data;
      setEmployee(data?.user);
      setEmployeeDetails(data?.userDetails);
    } else {
        setEmployee(initialEmployee);
        setEmployeeDetails(initialEmployeeDetails);
    }
    setLoading(false);
  };

  const handleClickOnApprove = () => {
    navigate(pathNames.ASSIGN_ROLES_RESPONSIBILITY, {
      state: {...location?.state,employee},
    });
  };

  const handleConfirmReject = async () => {
    setLoading(true);
    const response = await updateOnboardingStatus({
      status: statusEnum.REJECTED,
      remarks: ""
    }, employeeId);

    if(response.success){
      navigate(pathNames.ONBOARDING);
    }
  }

  const handleClose = () => {
    navigate(pathNames.ONBOARDING);
  };
  return (
    <>
      <TopBar
        title="Employee Details"
        actionButtons={
          <div className="flex gap-2">
            {employee.status !== statusEnum.REJECTED && <><Button name="Approve" size="sm" onClick={handleClickOnApprove} />
            <Button
              name="Reject"
              size="sm"
              variant="secondary"
              onClick={handleConfirmReject}
            /></>}
            <Button
              size="sm"
              variant={"danger"}
              onClick={handleClose}
              leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
            />
          </div>
        }
      />
      <div className="content-area flex flex-col gap-4">
        <PageLoader loading={loading} />
        {(!loading && employeeId) ? <div className="grid grid-cols-1 sm:grid-cols-[3fr_4fr] gap-4">
          <EmployeeDetailCard
            data={employee}
            employeeDetails={employeeDetails}
          />
          <EmployeeOtherDetailCard
            data={employee}
            employeeDetails={employeeDetails}
          />
        </div> : !loading && <EmptyPlaceholder title="Employee Not Found."/>}
      </div>
    </>
  );
};

export default EmployeeDetails;
