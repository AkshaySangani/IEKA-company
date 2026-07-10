import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { CompanyStats } from "./StatusCards";
import { FilterCardItem, RoleEnum, statusEnum, StatusType } from "../../../../types/common-types";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import YearPicker from "../../../common/date-picker/YearPicker";
import OnboardingTable from "./OnboardingTable";
import InviteOnboarding from "./InviteOnboarding";
import { getOnboardingById, getOnboardingCount, getOnboardings, updateOnboardingStatus } from "../../../../apis/workforce/onboardings.api";
import AddEmployee from "./AddEmployee";

export interface IOnboarding {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  status: statusEnum;
  role: RoleEnum;
  createdAt: string;
}

const Onboarding = () => {
  const [activeCard, setActiveCard] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [onboardingsList, setOnboardings] = useState<IOnboarding[]>([]);
  const initialOnboarding: IOnboarding = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: 0,
  status: statusEnum.PENDING,
  role: RoleEnum.EMPLOYEE,
  createdAt: ""
};
  const [onboarding, setOnboarding] = useState<IOnboarding>(initialOnboarding);

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
      getOnboardingCounts();
    }, []);
  
    const getOnboardingCounts = async () => {
      const response = await getOnboardingCount();
      if (response?.success) {
        updateCards(response?.data);
      }
    };
  
    // update cards
    const updateCards = (stats: CompanyStats) => {
      setCards((prev) =>
        prev.map((card) => {
          switch (card.id) {
            case "":
              return { ...card, count: stats.total };
  
            case statusEnum.ACCEPTED:
              return { ...card, count: stats.accepted };
  
            case statusEnum.REJECTED:
              return { ...card, count: stats.rejected };
  
            case statusEnum.PENDING:
              return { ...card, count: stats.pending };
  
            default:
              return card;
          }
        }),
      );
    };

  // useEffect for get holiday
  useEffect(() => {
    fetchOnboardingList(page, limit, search, activeCard);
  }, [page, limit, search, activeCard,year]);

  // get holiday list
  const fetchOnboardingList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = ""
  ) => {
    setLoading(true);
    const response = await getOnboardings({ page, limit, search, status });
    if (response.success && response.data?.employees?.length > 0) {
      setOnboardings(response.data?.employees);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setOnboardings([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setOnboarding(initialOnboarding);
  };

  // handle edit onboarding details
  const handleEditOnboardingDetails = async (onboarding: IOnboarding) => {
    setLoading(true);
    const response = await getOnboardingById(onboarding._id);
    if (response?.success) {
      handleOnAddOpenClose();
      setOnboarding(response?.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setOnboarding(initialOnboarding);
  };

  // handle update status
  const handleUpdateStatus = (onboarding: IOnboarding) => {
    handleStatusOpenClose();
    setOnboarding(onboarding);
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

    const response = await updateOnboardingStatus(payload, onboarding._id);
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle refresh data 
  const handleRefreshData = () => {
    fetchOnboardingList(page, limit, search, activeCard);
    getOnboardingCounts();
  }

  // handle search holiday
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleYearChange = (year: number) => {
    setSearch("");
    setPage(1);
    setYear(Number(year));
    getOnboardingCounts();
  }
  return (
    <>
      <TopBar
        title="All Requested Employees"
        actionButtons={
          <Button
            name="Invite New"
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
        <StatusCards cards={cards} activeCard={activeCard} setActiveCard={setActiveCard} />
        <OnboardingTable
          onboardingsList={onboardingsList}
          handleEditOnboardingDetails={handleEditOnboardingDetails}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
      <AddEmployee
        isOpen={isOpen}
        handleOpenClose={handleOnAddOpenClose}
      />
      {/* <StatusUpdateModal
        title={`onboarding ${onboarding.name}`}
        isOpen={statusOpen}
        status={onboarding.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      /> */}
    </>
  );
};

export default Onboarding;
