import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import {
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import {
  getEmployees,
} from "../../../../apis/workforce/all-employee.api";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import AllEmployeeTable from "../../workforce/all-employees/AllEmployeeTable";

export interface IEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;

  branchId: {
    _id: string;
    name: string;
  } | null;

  designationId: {
    _id: string;
    name: string;
  } | null;

  departmentId: {
    _id: string;
    name: string;
  } | null;

  shiftId: {
    _id: string;
    name: string;
    startTime: string;
    endTime: string;
  } | null;
  status: statusEnum;
}
const AllEmployeePayslips = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [allEmployees, setAllEmployees] = useState<IEmployee[]>([]);

  // useEffect for get employeeDetails
  useEffect(() => {
    fetchAllEmployeeList(page, limit, search);
    // eslint-disable-next-line
  }, [page, limit, search]);

  // get employeeDetails list
  const fetchAllEmployeeList = async (
    page: number,
    limit: number,
    search: string = ""
  ) => {
    setLoading(true);
    const response = await getEmployees({ page, limit, search, status: "" });
    if (response.success && response.data?.employee?.length > 0) {
      setAllEmployees(response.data?.employee);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setAllEmployees([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle search employeeDetails
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <TopBar
        title="All Employee Payslips"
        isSearch
        searchPlaceholder="Search employees..."
        onSearch={handleOnSearch}
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <AllEmployeeTable allEmployees={allEmployees} />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>
    </>
  );
};

export default AllEmployeePayslips;
