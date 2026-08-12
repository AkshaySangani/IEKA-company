import { useLocation } from "react-router-dom";
import { useState } from "react";
import PersonDetails from "./components/PersonalDetails";
import ParentsDetails from "./components/ParentsDetails";
import AddressDetails from "./components/AddressDetails";
import EductionDetails from "./components/EductionDetails";
import ExperienceDetails from "./components/ExperienceDetails";
import BankDetails from "./components/BankDetails";
import DocumentDetails from "./components/DocumentDetails";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import { IEmployeeDetails } from "../../onboarding/employee-details";
import { updateEmployee } from "../../../../../apis/workforce/all-employee.api";
import { IEmployeeResponse } from ".";



interface EmployeeOtherDetailsProps {
  employee: IEmployeeResponse;
  employeeDetails: IEmployeeDetails;
  fetchEmployeeOtherDetails: () => void;
}

const EmployeeOtherDetails = ({employee, employeeDetails, fetchEmployeeOtherDetails}: EmployeeOtherDetailsProps) => {
  const location = useLocation();
  const employeeId = location?.state?.employeeId;

  const [loading, setLoading] = useState<boolean>(false);  

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const response = await updateEmployee(formData, employee.user._id);
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
            employee={employee.user}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <ParentsDetails
            parents={employeeDetails.parents}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <AddressDetails
            employee={employee.user}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <EductionDetails eductions={employeeDetails.educations} employee={employee.user}/>
          <ExperienceDetails experiences={employeeDetails.experiences} employee={employee.user}/>
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
