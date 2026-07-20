import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { CompanyStats } from "./StatusCards";
import { FilterCardItem, statusEnum } from "../../../../types/common-types";
import {
  getHolidayById,
  getHolidayCount,
  getHolidays,
  updateHolidayStatus,
} from "../../../../apis/organization/holidays.api";
import HolidaysTable from "./HolidaysTable";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import AddHoliday from "./AddHoliday";
import YearPicker from "../../../common/date-picker/YearPicker";

export interface IHoliday {
  _id: string;
  companyId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  effectiveYear: number;
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

const Holiday = () => {
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

  const [holidaysList, setHolidays] = useState<IHoliday[]>([]);
  const initialHoliday: IHoliday = {
    _id: "",
    companyId: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    effectiveYear: new Date().getFullYear(),
    status: statusEnum.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };
  const [holiday, setHoliday] = useState<IHoliday>(initialHoliday);

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
      getHolidayCounts();
    }, [year]);
  
    const getHolidayCounts = async () => {
      const response = await getHolidayCount(year);
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
    fetchHolidayList(page, limit, search, activeCard, year);
  }, [page, limit, search, activeCard,year]);

  // get holiday list
  const fetchHolidayList = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
    effectiveYear: number = new Date().getFullYear()
  ) => {
    setLoading(true);
    const response = await getHolidays({ page, limit, search, status, effectiveYear });
    if (response.success && response.data?.holidays?.length > 0) {
      setHolidays(response.data?.holidays);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setHolidays([]);
      setTotal(0);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setHoliday(initialHoliday);
  };

  // handle edit holiday details
  const handleEditHolidayDetails = async (holiday: IHoliday) => {
    setLoading(true);
    const response = await getHolidayById(holiday._id);
    if (response?.success) {
      handleOnAddOpenClose();
      setHoliday(response?.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setHoliday(initialHoliday);
  };

  // handle update status
  const handleUpdateStatus = (holiday: IHoliday) => {
    handleStatusOpenClose();
    setHoliday(holiday);
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

    const response = await updateHolidayStatus(payload, holiday._id);
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle refresh data 
  const handleRefreshData = () => {
    fetchHolidayList(page, limit, search, activeCard, year);
    getHolidayCounts();
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
  }
  return (
    <>
      <TopBar
        title="All Holidays"
        actionButtons={
          <div className="flex gap-2">
            <div className="flex items-center gap-2 w-[150px]">
              <label className="font-semibold">Year</label>
              <YearPicker
                placeholder="Select Year"
                value={year}
                onChange={handleYearChange}
              />
            </div>
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAddOpenClose}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
          </div>
        }
        isSearch
        searchPlaceholder="Search holidays..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards cards={cards} activeCard={activeCard} setActiveCard={setActiveCard} />
        <HolidaysTable
          holidaysList={holidaysList}
          handleEditHolidayDetails={handleEditHolidayDetails}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
      <AddHoliday
        isOpen={isOpen}
        handleOpenClose={handleOnAddOpenClose}
        fetchHolidayList={handleRefreshData}
        holiday={holiday}
      />
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

export default Holiday;
