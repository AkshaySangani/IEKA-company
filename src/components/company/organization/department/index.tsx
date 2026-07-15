import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import { statusEnum } from "../../../../types/common-types";
import { pathNames } from "../../../../constants/constants";
import DepartmentTable from "./DepartmentTable";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import {
  getDepartmentList,
  updateDepartmentStatus,
} from "../../../../apis/organization/department.api";

export interface IDepartmentAssignment {
  _id: string;
  branchId: string;
  departmentIds: string[];
}

export interface IDepartment {
  _id: string;
  companyId: string;
  name: string;
  assignments: IDepartmentAssignment[];
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

const Department: React.FC = () => {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
  const initialDepartment: IDepartment = {
    _id: "",
    companyId: "",
    name: "",
    assignments: [],
    status: statusEnum.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };
  const [department, setDepartment] = useState<IDepartment>(initialDepartment);
  // useEffect for get branch
  useEffect(() => {
    fetchDepartmentList({ page, limit, search });
  }, [page, limit, search]);

  // get branch list
  const fetchDepartmentList = async (payload: {
    page: number;
    limit: number;
    search: string;
    status?: string;
  }) => {
    setLoading(true);
    const response = await getDepartmentList(payload);
    if (response.success && response.data?.departments?.length > 0) {
      setDepartmentList(response.data?.departments);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setDepartmentList([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAdd = () => {
    navigate(pathNames.ADD_DEPARTMENT);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setDepartment(initialDepartment);
  };

  // handle update status
  const handleUpdateStatus = (department: IDepartment) => {
    handleStatusOpenClose();
    setDepartment(department);
  };

  const handleStatusSubmit = async (formData: {
    status: statusEnum;
    remarks: string;
  }) => {
    setStatusLoading(true);

    const payload = {
      status: formData.status.trim(),
      remarks: formData.remarks,
    };

    const response = await updateDepartmentStatus(payload, department._id);
    if (response.success) {
      fetchDepartmentList({ page, limit, search });
    }
    setStatusLoading(false);
  };

  // handle search branch
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <>
      <TopBar
        title="All Departments"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAdd}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search department..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area">
        <PageLoader loading={loading} />
        <DepartmentTable
          departments={departmentList}
          handleUpdateStatus={handleUpdateStatus}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <StatusUpdateModal
        title={`department`}
        isOpen={statusOpen}
        status={department.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default Department;
