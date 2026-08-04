import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import { IBranch } from "../../workforce/onboarding/assign-roles-responsibility";
import PageLoader from "../../../common/loader/PageLoader";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import SelectField from "../../../common/select/SelectField";
import { IOption, RoleEnum, statusEnum } from "../../../../types/common-types";
import { getCompanyHierarchy, getPeoples } from "../../../../apis/organization/people-hierarchy.api";
import DepartmentCard from "./DepartmentCard";
import { useAuthStore } from "../../../../store/auth-store";
import Image from "../../../common/image";
import NoImage from "../../../../assets/images/User-Image.png";
import PersonInfo from "../../../common/person-info";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
  status: statusEnum;
}

export interface IDepartment {
  _id: string;
  name: string;
  count: number;
  manager?: IUser;
  employee: IUser[];
  status: statusEnum;
}

export default function PeopleHierarchy() {
  const { user } = useAuthStore();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOption[]>([]);
  const [shiftOptions, setShiftOptions] = useState<IOption[]>([]);
  const [branchId, setBranchId] = useState<string>("");
  const [shiftId, setShiftId] = useState<string>("");
  const [branchLoading, setBranchLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (branchId && shiftId) {
      fetchEmployees();
    } else {
      setDepartments([]);
    }
  }, [branchId, shiftId]);

  const fetchEmployees = async () => {
    setBranchLoading(true);
    const response = await getPeoples(branchId, shiftId);
    if (response?.success) {
      setDepartments(response?.data);
      const count = response?.data?.reduce(
        (total: number, department: IDepartment) => {
          return total + department.count;
        },
        0,
      );
      setEmployeeCount(count);
    } else setDepartments([]);

    setBranchLoading(false);
  };

  const fetchBranchShiftDepartment = async () => {
    setBranchLoading(true);
    const response = await getCompanyHierarchy();
    if (response?.success) {
      setBranches(response?.data);
      const branchOption = response?.data?.map((ele: IBranch) => ({
        label: ele?.name,
        value: ele?._id,
      }));
      setBranchOptions(branchOption);
      handleSelectFilter("branchId", branchOption[0]?.value, response?.data);
    } else {
      setBranches([]);
      setBranchOptions([]);
      setShiftOptions([]);
    }
    setBranchLoading(false);
  };

  const handleSelectFilter = (
    name: "branchId" | "shiftId",
    value: string,
    branchList: IBranch[] = branches,
  ) => {
    if (name === "branchId") {
      const shiftOption =
        branchList
          .find((ele) => ele._id === value)
          ?.shifts?.map((ele) => ({ label: ele?.name, value: ele?._id })) ?? [];
      setShiftOptions(shiftOption);
      handleSelectFilter("shiftId", shiftOption[0]?.value);
      setBranchId(value);
    } else {
      setShiftId(value);
    }
  };
  return (
    <>
      <TopBar
        title="People Hierarchy"
        actionButtons={
          <div className="flex items-center gap-2">
            <SelectField
              value={
                branchId
                  ? (branchOptions?.find((ele) => ele.value === branchId) ?? "")
                  : ""
              }
              name={"branchId"}
              options={branchOptions}
              onChange={(option) =>
                handleSelectFilter("branchId", option.value)
              }
            />
            <SelectField
              value={
                shiftId
                  ? (shiftOptions?.find((ele) => ele.value === shiftId) ?? "")
                  : ""
              }
              name={"shiftId"}
              options={shiftOptions}
              onChange={(option) => handleSelectFilter("shiftId", option.value)}
            />
            <div className="flex items-center gap-3">
              <span className="font-medium">Total Employee</span>
              <div className="bg-black py-1.5 px-2.5 text-white font-medium">
                {employeeCount}
              </div>
            </div>
          </div>
        }
      />
      <div className="flex flex-col items-center gap-1 py-2 bg-white mb-2">
          <PersonInfo
            personInfo={{
              profileImage: user?.profileImage ?? "",
              firstName: user?.firstName ?? "",
              lastName: user?.lastName ?? "",
              description: "(COO)",
            }}
            imageClassName="h-[55px] w-[55px]"
            className="flex-col items-center text-center"
            personClassName="text-secondary text-xs"
          />
        </div>
      <div className="content-area bg-primaryBlur">
        <PageLoader loading={branchLoading} />
        
        {departments?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {departments?.map((ele, index) => (
              <DepartmentCard key={index} department={ele} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            title="No Departments found!"
            description="It seem there are not any departments in this branch/shift. please select another branch/shift."
          />
        )}
      </div>
    </>
  );
}
