import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import { StatusType } from "../../../../types/common-types";
import { pathNames } from "../../../../constants/constants";
import {
  getShiftList,
  updateShiftStatus,
} from "../../../../apis/organization/shift.api";
import ShiftTable from "./ShiftTable";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "../../../common/modal/StatusModal";

export interface ShiftBranch {
  _id: string;
  name: string;
}

export interface IShift {
  _id: string;
  companyId: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  branchIds: ShiftBranch[];
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

const Shift: React.FC = () => {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [shiftList, setShiftList] = useState<IShift[]>([]);
  const initialShift: IShift = {
    _id: "",
    companyId: "",
    name: "",
    startTime: "",
    endTime: "",
    breakStartTime: "",
    breakEndTime: "",
    branchIds: [],
    status: "INACTIVE",
    createdAt: "",
    updatedAt: "",
  };
  const [shift, setShift] = useState<IShift>(initialShift);
  // useEffect for get branch
  useEffect(() => {
    fetchShiftList(page, limit, search);
  }, [page, limit, search]);

  // get branch list
  const fetchShiftList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getShiftList({ page, limit, search, status });
    if (response.success && response.data?.shifts?.length > 0) {
      setShiftList(response.data?.shifts);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setShiftList([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAdd = () => {
    navigate(pathNames.ADD_SHIFT);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setShift(initialShift);
  };

  // handle update status
  const handleUpdateStatus = (shift: IShift) => {
    handleStatusOpenClose();
    setShift(shift);
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

    const response = await updateShiftStatus(payload, shift._id);
    if (response.success) {
      fetchShiftList(page, limit, search);
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
        title="All Shifts"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAdd}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search shift..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area">
        <PageLoader loading={loading} />
        <ShiftTable
          shiftList={shiftList}
          handleUpdateStatus={handleUpdateStatus}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>

      <StatusUpdateModal
        title={`shift ${shift.name}`}
        isOpen={statusOpen}
        status={shift.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default Shift;
