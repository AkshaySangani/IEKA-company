import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import BranchTable from "./BranchTable";
import AddBranch from "./AddBranch";
import PageLoader from "../../../common/loader/PageLoader";
import {
  getBranchById,
  getBranches,
  updateBranchStatus,
} from "../../../../apis/organization/branch.api";
import Pagination from "../../../common/pagination/Pagination";
import { BranchType, statusEnum, StatusType } from "../../../../types/common-types";
import { branchEnum } from "../../../../constants/constants";
import StatusUpdateModal from "../../../common/modal/StatusModal";

export interface IBranch {
  _id: string;
  companyId: string;
  name: string;
  address: string;
  shiftApplicable: boolean;
  branchType: BranchType;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

const Branch: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [branches, setBranches] = useState<IBranch[]>([]);
  const initialBranch: IBranch = {
    _id: "",
    companyId: "",
    name: "",
    address: "",
    shiftApplicable: false,
    branchType: branchEnum.HEAD_OFFICE,
    status: statusEnum.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };
  const [branch, setBranch] = useState<IBranch>(initialBranch);
  // useEffect for get branch
  useEffect(() => {
    fetchBranchList(page, limit, search);
  }, [page, limit, search]);

  // get branch list
  const fetchBranchList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getBranches({ page, limit, search, status });
    if (response.success && response.data?.branches?.length > 0) {
      setBranches(response.data?.branches);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setBranches([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setBranch(initialBranch);
  };

  // handle edit branch details
  const handleEditBranchDetails = async (branchId: string) => {
    setLoading(true);
    const response = await getBranchById(branchId);
    if (response.success) {
      handleOnAddOpenClose();
      setBranch(response.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setBranch(initialBranch);
  };

  // handle update status
  const handleUpdateStatus = (branch: IBranch) => {
    handleStatusOpenClose();
    setBranch(branch);
  };

  const handleStatusSubmit = async (formData: {
    status: StatusType;
    remarks: string;
  }) => {
    setStatusLoading(true);

    const payload = {
      status: formData.status.trim(),
      remarks: formData.remarks,
    };

    const response = await updateBranchStatus(payload, branch._id);
    if (response.success) {
      fetchBranchList(page, limit, search);
    }
    setStatusLoading(false);
  };

  // handle search branch
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  }
  return (
    <>
      <TopBar
        title="All Branch"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search branch..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area">
        <PageLoader loading={loading} />
        <BranchTable
          branches={branches}
          handleUpdateStatus={handleUpdateStatus}
          handleEditBranchDetails={handleEditBranchDetails}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>
      <AddBranch
        isOpen={isOpen}
        branchDetails={branch}
        handleOpenClose={handleOnAddOpenClose}
        fetchBranchList={() => fetchBranchList(page, limit, search)}
      />

      <StatusUpdateModal
        title={`branch ${branch.name}`}
        isOpen={statusOpen}
        status={branch.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default Branch;
