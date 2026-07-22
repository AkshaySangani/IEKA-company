import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { TerminationStats } from "./StatusCards";
import {
  FilterCardItem,
  IOption,
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import TerminationTable from "./TerminationTable";
import {
  getTerminationById,
  getTerminationCount,
  getTerminations,
  updateTerminationStatus,
} from "../../../../apis/workforce/termination.api";
import { terminationStatusOptions } from "../../../../constants/constants";
import AddTermination from "./AddTermination";
import Button from "../../../common/button/Button";
import { getEmployees } from "../../../../apis/workforce/all-employee.api";
import { IEmployee } from "../all-employees";

export interface ITermination {
  _id: string;
  companyId: string;
  userId: ITerminationUser;
  lastWorkingDate: string;
  terminationType: string;
  reason: string;
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface ITerminationUser {
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

const Termination = () => {
  const [activeCard, setActiveCard] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [terminations, setTerminations] = useState<ITermination[]>([]);
  const [employees, setEmployees] = useState<IOption[]>([]);
  const initialTermination: ITermination = {
    _id: "",
    companyId: "",
    userId: {
      _id: "",
      firstName: "",
      lastName: "",
      profileImage: "",
      role: RoleEnum.EMPLOYEE,
      departmentId: {
        _id: "",
        name: "",
      },
    },
    terminationType: "",
    lastWorkingDate: "",
    reason: "",
    status: statusEnum.REJECTED,
    createdAt: "",
    updatedAt: "",
  };
  const [terminationDetails, setTerminationDetails] =
    useState<ITermination>(initialTermination);

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
      id: statusEnum.TERMINATE,
      title: "Terminate",
      count: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: <i className="fa-solid fa-user-check"></i>,
    },
    {
      id: statusEnum.HOLD,
      title: "Hold",
      count: 0,
      activeColor: "bg-warning",
      textColor: "text-warning",
      icon: <i className="fa-solid fa-hourglass-end"></i>,
    },

    {
      id: statusEnum.CANCEL,
      title: "Cancel",
      count: 0,
      activeColor: "bg-danger",
      textColor: "text-danger",
      icon: <i className="fa-solid fa-user-times"></i>,
    },
  ]);

  useEffect(() => {
    fetchTerminationCounts();
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  const fetchTerminationCounts = async () => {
    const response = await getTerminationCount();
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  const fetchEmployees = async () => {
    const response = await getEmployees({
      page: 1,
      limit: 200,
      search: "",
      status: statusEnum.ACTIVE,
    });
    if (response.success) {
      setEmployees(
        response?.data?.employee?.map((ele: IEmployee) => ({
          label: `${ele.firstName} ${ele.lastName}`,
          value: ele._id,
        })),
      );
    } else setEmployees([]);
  };

  // update cards
  const updateCards = (stats: TerminationStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total };

          case statusEnum.TERMINATE:
            return { ...card, count: stats.terminate };

          case statusEnum.CANCEL:
            return { ...card, count: stats.cancel };

          case statusEnum.HOLD:
            return { ...card, count: stats.hold };

          default:
            return card;
        }
      }),
    );
  };

  // useEffect for get terminationDetails
  useEffect(() => {
    fetchTerminations(page, limit, search, activeCard);
  }, [page, limit, search, activeCard]);

  // get terminationDetails list
  const fetchTerminations = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getTerminations({ page, limit, search, status });
    if (response.success && response.data?.terminations?.length > 0) {
      setTerminations(response.data?.terminations);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setTerminations([]);
      setTotal(0);
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchTerminations(page, limit, search, activeCard);
    fetchTerminationCounts();
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setTerminationDetails(initialTermination);
  };

  // handle edit terminationDetails details
  const handleEditTerminationDetails = async (
    terminationDetails: ITermination,
  ) => {
    setLoading(true);
    const response = await getTerminationById(terminationDetails._id);
    if (response?.success) {
      handleOnAddOpenClose();
      setTerminationDetails(response?.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setTerminationDetails(initialTermination);
  };

  // handle update status
  const handleUpdateStatus = (terminationDetails: ITermination) => {
    handleStatusOpenClose();
    setTerminationDetails(terminationDetails);
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

    const response = await updateTerminationStatus(
      payload,
      terminationDetails._id,
    );
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle search terminationDetails
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  return (
    <>
      <TopBar
        title="All Terminated Employees"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
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
        <TerminationTable
          terminations={terminations}
          handleEditTerminationDetails={handleEditTerminationDetails}
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
      <AddTermination
        isOpen={isOpen}
        handleOpenClose={handleOnAddOpenClose}
        fetchTerminations={() => {
          fetchTerminations(page, limit, search, activeCard);
          fetchTerminationCounts();
        }}
        termination={terminationDetails}
        employees={employees}
      />
      <StatusUpdateModal
      showFullTitle
        title={`Are you sure you want to do termination of this employee ${terminationDetails.userId.firstName} ${terminationDetails.userId.lastName} ?`}
        isOpen={statusOpen}
        status={terminationDetails.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
        options={terminationStatusOptions}
      />
    </>
  );
};

export default Termination;
