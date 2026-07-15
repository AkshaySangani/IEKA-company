import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import DesignationTable from "./DesignationTable";
import AddDesignation from "./AddDesignation";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import { statusEnum } from "../../../../types/common-types";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import { getDesignation, updateDesignationStatus } from "../../../../apis/organization/designation.api";

export interface IDesignation {
  _id: string;
  companyId: string;
  name: string;
  description: string;
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

const Designation: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [designationList, setDesignations] = useState<IDesignation[]>([]);
  const initialDesignation: IDesignation = {
    _id: "",
    companyId: "",
    name: "",
    description: "",
    status: statusEnum.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };
  const [designation, setDesignation] = useState<IDesignation>(initialDesignation);
  // useEffect for get designation
  useEffect(() => {
    fetchDesignationList(page, limit, search);
  }, [page, limit, search]);

  // get designation list
  const fetchDesignationList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getDesignation({ page, limit, search, status });
    if (response.success && response.data?.designations?.length > 0) {
      setDesignations(response.data?.designations);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setDesignations([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setDesignation(initialDesignation);
  };

  // handle edit designation details
  const handleEditDesignationDetails = async (designation: IDesignation) => {
    setLoading(true);
    
    if (designation._id) {
      handleOnAddOpenClose();
      setDesignation(designation);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setDesignation(initialDesignation);
  };

  // handle update status
  const handleUpdateStatus = (designation: IDesignation) => {
    handleStatusOpenClose();
    setDesignation(designation);
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

    const response = await updateDesignationStatus(payload, designation._id);
    if (response.success) {
      fetchDesignationList(page, limit, search);
    }
    setStatusLoading(false);
  };

  // handle search designation
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  }
  return (
    <>
      <TopBar
        title="All Designation"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search designation..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area">
        <PageLoader loading={loading} />
        <DesignationTable
          designationList={designationList}
          handleUpdateStatus={handleUpdateStatus}
          handleEditDesignationDetails={handleEditDesignationDetails}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>
      <AddDesignation
        isOpen={isOpen}
        designation={designation}
        handleOpenClose={handleOnAddOpenClose}
        fetchDesignationList={() => fetchDesignationList(page, limit, search)}
      />

      <StatusUpdateModal
        title={`designation ${designation.name}`}
        isOpen={statusOpen}
        status={designation.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default Designation;
