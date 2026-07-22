import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { ResignedEmployeeStats } from "./StatusCards";
import { FilterCardItem, RoleEnum, statusEnum } from "../../../../types/common-types";
import {
  getEmployeeById,
  getEmployeeCount,
  getEmployees,
  updateEmployeeStatus,
} from "../../../../apis/workforce/all-employee.api";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import ResignedEmployeeTable from "./ResignedEmployeeTable";
import { getResignedEmployeeCount, getResignedEmployees } from "../../../../apis/workforce/resigned.api";
import Pagination from "../../../common/pagination/Pagination";

export interface ResignationRequest {
  _id: string;
  companyId: string;
  userId: ResignationUser;
  lastWorkingDate: string;
  reason: string;
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface ResignationUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
  departmentId: Department;
}

export interface Department {
  _id: string;
  name: string;
}

const ResignedEmployees = () => {
  const [activeCard, setActiveCard] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [resignedEmployees, setResignedEmployees] = useState<ResignationRequest[]>([]);
  const initialEmployee: any = {};
  const [employeeDetails, setEmployeeDetails] = useState<ResignationRequest>(initialEmployee);

  const [cards, setCards] = useState<FilterCardItem[]>([
      {
        id: "",
        title: "Total",
        count: 0,
        activeColor: "bg-info",
        textColor: "text-info",
        icon: <i className="fa-solid fa-align-justify"></i>,
      },
      {
        id: statusEnum.PENDING,
        title: "Pending",
        count: 0,
        activeColor: "bg-pending",
        textColor: "text-pending",
        icon: <i className="fa-solid fa-hourglass-end"></i>,
      },
      {
        id: statusEnum.ACCEPTED,
        title: "Accepted",
        count: 0,
        activeColor: "bg-success",
        textColor: "text-success",
        icon: <i className="fa-solid fa-user-check"></i>,
      },
      {
        id: statusEnum.REJECTED,
        title: "Rejected",
        count: 0,
        activeColor: "bg-danger",
        textColor: "text-danger",
        icon: <i className="fa-solid fa-user-times"></i>,
      },
    ]);

  useEffect(() => {
    getEmployeeCounts();
  }, []);

  const getEmployeeCounts = async () => {
    const response = await getResignedEmployeeCount();
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  // update cards
      const updateCards = (stats: ResignedEmployeeStats) => {
        setCards((prev) =>
          prev.map((card) => {
            switch (card.id) {
              case "":
                return { ...card, count: stats.total };
    
              case statusEnum.ACCEPTED:
                return { ...card, count: stats.accept };
    
              case statusEnum.REJECTED:
                return { ...card, count: stats.reject };
    
              case statusEnum.PENDING:
                return { ...card, count: stats.pending };
    
              default:
                return card;
            }
          }),
        );
      };

  // useEffect for get employeeDetails
  useEffect(() => {
    fetchResignedEmployeeList(page, limit, search, activeCard);
  }, [page, limit, search, activeCard]);

  // get employeeDetails list
  const fetchResignedEmployeeList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getResignedEmployees({ page, limit, search, status });
    if (response.success && response.data?.resignations?.length > 0) {
      setResignedEmployees(response.data?.resignations);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setResignedEmployees([]);
      setTotal(0);
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchResignedEmployeeList(page, limit, search, activeCard);
    getEmployeeCounts();
  }

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setEmployeeDetails(initialEmployee);
  };

  // handle edit employeeDetails details
  const handleEditResignedEmployeeDetails = async (employeeDetails: ResignationRequest) => {
    setLoading(true);
    const response = await getEmployeeById(employeeDetails._id);
    if (response?.success) {
      handleOnAddOpenClose();
      setEmployeeDetails(response?.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setEmployeeDetails(initialEmployee);
  };

  // handle update status
  const handleUpdateStatus = (employeeDetails: ResignationRequest) => {
    handleStatusOpenClose();
    setEmployeeDetails(employeeDetails);
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

    const response = await updateEmployeeStatus(payload, employeeDetails._id);
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle search employeeDetails
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  return (
    <>
      <TopBar
        title="All Resigned Employee"
        isSearch
        searchPlaceholder="Search employees..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards
          cards={cards}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
        <ResignedEmployeeTable
          resignedEmployees={resignedEmployees}
          handleEditResignedEmployeeDetails={handleEditResignedEmployeeDetails}
          handleUpdateStatus={handleUpdateStatus}
        />
        <Pagination totalRecords={total} currentPage={page} pageSize={limit} onPageChange={setPage} onPageSizeChange={setLimit}/>
      </div>
      {/* <StatusUpdateModal
        title={`employee ${employeeDetails.firstName} ${employeeDetails.lastName}`}
        isOpen={statusOpen}
        status={employeeDetails.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      /> */}
    </>
  );
};

export default ResignedEmployees;
