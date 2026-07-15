import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { CompanyStats } from "./StatusCards";
import { FilterCardItem, statusEnum, StatusType } from "../../../../types/common-types";
import {
  getPolicyById,
  getPolicyCount,
  getPolicies,
  updatePolicyStatus,
} from "../../../../apis/organization/policy.api";
import { pathNames } from "../../../../constants/constants";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import YearPicker from "../../../common/date-picker/YearPicker";
import PolicyTable from "./PolicyTable";
import Pagination from "../../../common/pagination/Pagination";
import { useNavigate } from "react-router-dom";

export interface IPolicy {
  _id: string;
  companyId: string;
  name: string;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

export const initialPolicy: IPolicy = {
  _id: "",
  companyId: "",
  name: "",
  status: "ACTIVE",
  createdAt: "",
  updatedAt: "",
};

const Policy = () => {
  const navigate = useNavigate();
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

  const [policyList, setPolicyList] = useState<IPolicy[]>([]);

  const [holiday, setPolicy] = useState<IPolicy>(initialPolicy);

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
      },
      {
        id: "DELETED",
        title: "Deleted",
        count: 0,
        activeColor: "bg-danger",
        textColor: "text-danger",
        icon: <i className="fa-solid fa-trash-can"></i>,
      },
    ]);
  
    useEffect(() => {
      getPolicyCounts();
    }, []);
  
    const getPolicyCounts = async () => {
      const response = await getPolicyCount();
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
  
            case statusEnum.ACTIVE:
              return { ...card, count: stats.active };
  
            case statusEnum.INACTIVE:
              return { ...card, count: stats.inactive };
  
            case statusEnum.DELETED:
              return { ...card, count: stats.deleted };
  
            default:
              return card;
          }
        }),
      );
    };

  // useEffect for get holiday
  useEffect(() => {
    fetchPolicyList(page, limit, search, activeCard);
  }, [page, limit, search, activeCard]);

  // get holiday list
  const fetchPolicyList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = ""
  ) => {
    setLoading(true);
    const response = await getPolicies({ page, limit, search, status });
    if (response.success && response.data?.policies?.length > 0) {
      setPolicyList(response.data?.policies);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setPolicyList([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    navigate(pathNames.ADD_POLICY)
    setPolicy(initialPolicy);
  };

  // handle edit holiday details
  const handleEditPolicyDetails = async (holiday: IPolicy) => {
    setLoading(true);
    const response = await getPolicyById(holiday._id);
    if (response?.success) {
      handleOnAddOpenClose();
      setPolicy(response?.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setPolicy(initialPolicy);
  };

  // handle update status
  const handleUpdateStatus = (holiday: IPolicy) => {
    handleStatusOpenClose();
    setPolicy(holiday);
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

    const response = await updatePolicyStatus(payload, holiday._id);
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle refresh data 
  const handleRefreshData = () => {
    fetchPolicyList(page, limit, search, activeCard);
  }

  // handle search holiday
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <TopBar
        title="All Policy"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search policies..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards cards={cards} activeCard={activeCard} setActiveCard={setActiveCard} />
        <PolicyTable
          policyList={policyList}
          handleEditPolicyDetails={handleEditPolicyDetails}
          handleUpdateStatus={handleUpdateStatus}
        />
        <Pagination totalRecords={total} currentPage={page} pageSize={limit} onPageChange={setPage} onPageSizeChange={setLimit} />
      </div>
      <StatusUpdateModal
        title={`holiday ${holiday.name}`}
        isOpen={statusOpen}
        status={holiday.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default Policy;
