import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import { IBranch } from "../../workforce/onboarding/assign-roles-responsibility";
import PageLoader from "../../../common/loader/PageLoader";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import BranchCard from "./BranchCard";
import { getCompanyHierarchy } from "../../../../apis/organization/people-hierarchy.api";

export default function CompanyHierarchy() {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [managerCount, setManagerCount] = useState<number>(0);
  const [branchLoading, setBranchLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  const fetchBranchShiftDepartment = async () => {
    setBranchLoading(true);
    const response = await getCompanyHierarchy();
    if (response?.success) {
      setBranches(response?.data?.list);
      setEmployeeCount(response?.data?.employeeCount);
      setManagerCount(response?.data?.managerCount);
    } else {
      setBranches([]);
    }
    setBranchLoading(false);
  };
  return (
    <>
      <TopBar
        title="Company Hierarchy"
        actionButtons={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="font-medium">Total Manager</span>
              <div className="flex px-[5px] min-h-[35px] min-w-[35px] items-center justify-center bg-black text-[20px] font-medium text-white shadow">
                {managerCount}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium">Total Employee</span>
              <div className="flex px-[5px] py-[3px] min-w-[35px] items-center justify-center bg-black text-[20px] font-medium text-white shadow">
                {employeeCount}
              </div>
            </div>
          </div>
        }
      />

      <div className="content-area bg-accordionBg">
        <PageLoader loading={branchLoading} />
        {branches?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {branches?.map((ele, index) => (
              <BranchCard key={index} branch={ele} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            title="No Branches found!"
            description="It seem there are not any branches."
          />
        )}
      </div>
    </>
  );
}
