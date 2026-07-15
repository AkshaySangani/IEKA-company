import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { EarningStats } from "./StatusCards";
import { FilterCardItem, statusEnum, ValueType } from "../../../../types/common-types";
import {
  getEarningById,
  getEarningCount,
  getEarnings,
  updateEarningStatus,
} from "../../../../apis/pay-slip/earnings.api";
import { pathNames } from "../../../../constants/constants";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import EarningTable from "./EarningTable";
import Pagination from "../../../common/pagination/Pagination";
import { useNavigate } from "react-router-dom";



export interface PayslipDetail {
  _id: string;
  name: string;
  value: number;
  valueType: ValueType;
}

export interface IEarning {
  _id: string;
  companyId: string;
  name: string;
  status: statusEnum;
  details: PayslipDetail[];
  createdAt: string;
  updatedAt: string;
}

export const initialEarning: IEarning = {
  _id: "",
  companyId: "",
  name: "",
  status: statusEnum.ACTIVE,
  details: [
    {
      _id: "",
      name: "",
      value: 0,
      valueType: ValueType.PERCENTAGE,
    },
  ],
  createdAt: "",
  updatedAt: "",
};

const Earnings = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [earnings, setEarnings] = useState<IEarning[]>([]);
  const [earning, setEarning] = useState<IEarning>(initialEarning);

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
    getEarningCounts();
  }, []);

  const getEarningCounts = async () => {
    const response = await getEarningCount();
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  // update cards
  const updateCards = (stats: EarningStats) => {
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

  // useEffect for get earning
  useEffect(() => {
    fetchEarningList(page, limit, search, activeCard);
  }, [page, limit, search, activeCard]);

  // get earning list
  const fetchEarningList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getEarnings({ page, limit, search, status });
    if (response.success && response.data?.payslips?.length > 0) {
      setEarnings(response.data?.payslips);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setEarnings([]);
      setTotal(0);
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchEarningList(page, limit, search, activeCard);
    getEarningCounts();
  }

  // handle click add new
  const handleOnAddOpenClose = () => {
    navigate(pathNames.PAY_SLIP_DISCLAIMER)
  };

  // handle edit earning details
  const handleEditEarningDetails = async (earning: IEarning) => {
    setLoading(true);
    const response = await getEarningById(earning._id);
    if (response?.success) {
      navigate(pathNames.PAY_SLIP_DISCLAIMER,{state: {
        data: response?.data}});
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setEarning(initialEarning);
  };

  // handle update status
  const handleUpdateStatus = (earning: IEarning) => {
    handleStatusOpenClose();
    setEarning(earning);
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

    const response = await updateEarningStatus(payload, earning._id);
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle search earning
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  return (
    <>
      <TopBar
        title="All Payslips"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search earning..."
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
        <EarningTable
          earnings={earnings}
          handleEditEarningDetails={handleEditEarningDetails}
          handleUpdateStatus={handleUpdateStatus}
        />
        <Pagination totalRecords={total} currentPage={page} pageSize={limit} onPageChange={setPage} onPageSizeChange={setLimit} />
      </div>
      <StatusUpdateModal
        title={`earning ${earning.name}`}
        isOpen={statusOpen}
        status={earning.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
      />
    </>
  );
};

export default Earnings;
