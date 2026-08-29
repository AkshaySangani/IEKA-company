import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import {
  getManualPunchRequestList
} from "../../../../apis/performance/manual-punch-request.api";
import ManualPunchRequestTable from "./ManualPunchRequestTable";
import AddManualPunchRequest from "./AddManualPunchRequest";
import MonthPicker, { MonthPickerValue } from "../../../common/date-picker/MonthPicker";
import { IPunchManualRequest } from "../../../../types/company/performance/manual-punch-request.types";

const ManualPunchRequest: React.FC = () => {
  const [addRequestOpen, setAddRequestOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const initialMonth: MonthPickerValue = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
    const [month, setMonth] = useState<MonthPickerValue>(initialMonth);

  const [manualPunchRequestList, setManualPunchRequestList] = useState<IPunchManualRequest[]>([]);

  // useEffect for get branch
  useEffect(() => {
    fetchManualPunchRequestList({ page, limit, ...month });
    // eslint-disable-next-line
  }, [page, limit, month.month]);

  // get branch list
  const fetchManualPunchRequestList = async (payload: {
    page: number;
    limit: number;
    month: number;
    year: number;
  }) => {
    setLoading(true);
    const response = await getManualPunchRequestList(payload);
    if (response.success && response.data?.list?.length > 0) {
      setManualPunchRequestList(response.data?.list);
      setTotal(response.data?.total);
    } else {
      setManualPunchRequestList([]);
      setTotal(0);
      setPage(1);
    }
    setLoading(false);
  };

  // handle status open close
  const handleAddOpenClose = () => {
    setAddRequestOpen((prev) => !prev);
  };

  const handlePageSizeChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  // handle month change
  const handleMonthChange = (value: MonthPickerValue) => {
    setMonth(value);
  };

  return (
    <>
      <TopBar
        title="All Punch Requests"
        actionButtons={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 w-[150px]">
            <label className="font-medium">Month</label>
            <MonthPicker
              placeholder="Select Month"
              value={month}
              onChange={handleMonthChange}
              position="left"
            />
          </div>
          <Button
            name="Add New"
            size="sm"
            onClick={handleAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
          </div>
        }
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <ManualPunchRequestTable
          manualPunchRequests={manualPunchRequestList}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      <AddManualPunchRequest isOpen={addRequestOpen} onClose={handleAddOpenClose} refreshData={() => fetchManualPunchRequestList({ page, limit, ...month })}/>
    </>
  );
};

export default ManualPunchRequest;
