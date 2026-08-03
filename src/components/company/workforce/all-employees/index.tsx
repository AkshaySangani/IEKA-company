import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { EmployeeStats } from "./StatusCards";
import { FilterCardItem, RoleEnum, statusEnum } from "../../../../types/common-types";
import {
  getEmployeeById,
  getEmployeeCount,
  getEmployees,
  updateEmployeeStatus,
} from "../../../../apis/workforce/all-employee.api";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import AllEmployeeTable from "./AllEmployeeTable";

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
const AllEmployees = () => {
  const [activeCard, setActiveCard] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [allEmployees, setAllEmployees] = useState<IEmployee[]>([]);
  const initialEmployee: IEmployee = {
  _id: "",
  firstName: "",
  lastName: "",
  profileImage: "",
  role: RoleEnum.EMPLOYEE,

  branchId: {
    _id: "",
    name: "",
  },

  designationId: null,
  departmentId: {
    name: "",
    _id: ""
  },

  shiftId: {
    _id: "",
    name: "",
    startTime: "",
    endTime: "",
  },
  status: statusEnum.ACTIVE
};
  const [employeeDetails, setEmployeeDetails] = useState<IEmployee>(initialEmployee);

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
      id: "ACTIVE",
      title: "Active",
      count: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: <i className="fa-solid fa-user-check"></i>,
    },
    {
      id: "INACTIVE",
      title: "Inactive",
      count: 0,
      activeColor: "bg-warning",
      textColor: "text-warning",
      icon: <i className="fa-solid fa-user-xmark"></i>,
    }
  ]);

  useEffect(() => {
    getEmployeeCounts();
  }, []);

  const getEmployeeCounts = async () => {
    const response = await getEmployeeCount();
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  // update cards
  const updateCards = (stats: EmployeeStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total };

          case statusEnum.ACTIVE:
            return { ...card, count: stats.active };

          case statusEnum.INACTIVE:
            return { ...card, count: stats.inactive };

          default:
            return card;
        }
      }),
    );
  };

  // useEffect for get employeeDetails
  useEffect(() => {
    fetchAllEmployeeList(page, limit, search, activeCard);
  }, [page, limit, search, activeCard]);

  // get employeeDetails list
  const fetchAllEmployeeList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getEmployees({ page, limit, search, status });
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

  const handleRefreshData = () => {
    fetchAllEmployeeList(page, limit, search, activeCard);
    getEmployeeCounts();
  }

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setEmployeeDetails(initialEmployee);
  };

  // handle edit employeeDetails details
  const handleEditAllEmployeeDetails = async (employeeDetails: IEmployee) => {
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
  const handleUpdateStatus = (employeeDetails: IEmployee) => {
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
        title="All Employees"
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
        <AllEmployeeTable
          allEmployees={allEmployees}
          handleEditAllEmployeeDetails={handleEditAllEmployeeDetails}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
      <StatusUpdateModal
        title={`employee ${employeeDetails.firstName} ${employeeDetails.lastName}`}
        isOpen={statusOpen}
        status={employeeDetails.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default AllEmployees;
