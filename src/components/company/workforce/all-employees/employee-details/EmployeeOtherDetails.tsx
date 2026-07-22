import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmployeeDetails } from "../../../../../apis/workforce/onboardings.api";
import {
  BloodGroupEnum,
  GenderEnum,
  IOption,
  RoleEnum,
  statusEnum,
} from "../../../../../types/common-types";
import PersonDetails from "./components/PersonalDetails";
import ParentsDetails from "./components/ParentsDetails";
import AddressDetails from "./components/AddressDetails";
import EductionDetails from "./components/EductionDetails";
import ExperienceDetails from "./components/ExperienceDetails";
import BankDetails from "./components/BankDetails";
import DocumentDetails from "./components/DocumentDetails";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import { IEmployee, IEmployeeDetails } from "../../onboarding/employee-details";
import { updateEmployee } from "../../../../../apis/workforce/all-employee.api";
import { getPolicies } from "../../../../../apis/organization/policy.api";
import { IPolicy } from "../../../organization/policy-configuration";

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

const initialEmployeeOtherDetails = {
  _id: "",
  userId: "",
  parents: {
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: 0,
    motherName: "",
    motherOccupation: "",
    motherPhone: 0,
  },
  bank: {
    accountNo: 0,
    ifscCode: "",
    bankName: "",
    uanNo: "",
    esicNo: "",
    pfJoiningDate: "",
    esicJoiningDate: "",
  },
  educations: [],
  experiences: [],
  documents: [],
  createdAt: "",
  updatedAt: "",
};

const EmployeeOtherDetails = () => {
  const location = useLocation();
  const employeeId = location?.state?.employeeId;

  const [employee, setEmployee] = useState<IEmployee>(initialEmployee);
  const [loading, setLoading] = useState<boolean>(false);
  const [employeeDetails, setEmployeeOtherDetails] = useState<IEmployeeDetails>(
    initialEmployeeOtherDetails,
  );

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeOtherDetails();
    }
    // eslint-disable-next-line
  }, [employeeId]);

  const fetchEmployeeOtherDetails = async () => {
    const response = await getEmployeeDetails(employeeId);
    if (response.success) {
      const data = response?.data;
      setEmployee(data?.user);
      setEmployeeOtherDetails(data?.userDetails);
    } else {
      setEmployee(initialEmployee);
      setEmployeeOtherDetails(initialEmployeeOtherDetails);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const response = await updateEmployee(formData, employee._id);
    if (response?.success) {
      fetchEmployeeOtherDetails();
    }
    setLoading(false);
  };
  return (
    <>
      {employeeId ? (
        <div className="content-card bg-white border border-gray-200 p-4 space-y-2">
          <PersonDetails
            employee={employee}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <ParentsDetails
            parents={employeeDetails.parents}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <AddressDetails
            employee={employee}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <EductionDetails eductions={employeeDetails.educations} />
          <ExperienceDetails experiences={employeeDetails.experiences} />
          <BankDetails
            bank={employeeDetails.bank}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <DocumentDetails documents={employeeDetails.documents} />
        </div>
      ) : (
        <EmptyPlaceholder title="Employee Not Found." />
      )}
    </>
  );
};

export default EmployeeOtherDetails;
