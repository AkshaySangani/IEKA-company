import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import { getBranchShiftDepartment } from "../../../../apis/workforce/onboardings.api";
import { IBranch } from "../../workforce/onboarding/assign-roles-responsibility";
import PageLoader from "../../../common/loader/PageLoader";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import BranchCard from "./BranchCard";

export default function CompanyHierarchy() {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [branchLoading, setBranchLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  const fetchBranchShiftDepartment = async () => {
    setBranchLoading(true);
    const response = await getBranchShiftDepartment();
    if (response?.success) {
      setBranches(response?.data);
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
            <span className="font-semibold">Total Employee</span>
            <div className="bg-black py-1.5 px-2.5 text-white font-semibold">
              44
            </div>
          </div>
        }
      />

      <div className="content-area bg-accordionBg">
        <PageLoader loading={branchLoading} />
        {branches?.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {branches?.map((ele, index) => (
                <BranchCard
                key={index}
                    branch={ele}
                />
            ))}
        </div> : <EmptyPlaceholder title="No Branches found!" description="It seem there are not any branches."/>}
      </div>
    </>
  );
}
