import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import StatusCards, { PromotionStats } from "./StatusCards";
import {
  FilterCardItem,
  IOption,
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import {
  getPromotionById,
  getPromotionCount,
  getPromotions,
  updatePromotionStatus,
} from "../../../../apis/workforce/promotion.api";
import { promotionStatusOptions } from "../../../../constants/constants";
import Button from "../../../common/button/Button";
import { getEmployees } from "../../../../apis/workforce/all-employee.api";
import { IEmployee } from "../all-employees";
import AddPromotion from "./AddPromotion";
import PromotionTable from "./PromotionTable";
import { getDesignation } from "../../../../apis/organization/designation.api";
import { IDesignation } from "../../organization/designation";

export interface IPromotion {
  _id: string;
  companyId: string;
  userId: IPromotionUser;
  designationId: {
    _id: string;
    name: string;
  };
  effectiveDate: string;
  reason: string;
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface IPromotionUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
}

export interface Department {
  _id: string;
  name: string;
}

const Promotion = () => {
  const [activeCard, setActiveCard] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [employees, setEmployees] = useState<IOption[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const initialPromotion: IPromotion = {
    _id: "",
    companyId: "",
    userId: {
      _id: "",
      firstName: "",
      lastName: "",
      profileImage: "",
      role: RoleEnum.EMPLOYEE,
    },
    designationId: {
      _id: "",
      name: "",
    },
    effectiveDate: "",
    reason: "",
    status: statusEnum.HOLD,
    createdAt: "",
    updatedAt: "",
  };
  const [promotionDetails, setPromotionDetails] =
    useState<IPromotion>(initialPromotion);

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
      id: statusEnum.PROMOTED,
      title: "Promoted",
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
    fetchPromotionCounts();
    fetchEmployees();
    fetchDesignation();
    // eslint-disable-next-line
  }, []);

  const fetchPromotionCounts = async () => {
    const response = await getPromotionCount();
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
          designation: ele?.designationId?.name,
        })),
      );
    } else setEmployees([]);
  };

  const fetchDesignation = async () => {
    const response = await getDesignation({
      page: 1,
      limit: 200,
      search: "",
      status: statusEnum.ACTIVE,
    });
    if (response.success) {
      setDesignations(
        response?.data?.designations?.map((ele: IDesignation) => ({
          label: ele.name,
          value: ele._id,
        })),
      );
    } else setDesignations([]);
  };

  // update cards
  const updateCards = (stats: PromotionStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total };

          case statusEnum.PROMOTED:
            return { ...card, count: stats.promoted };

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

  // useEffect for get promotionDetails
  useEffect(() => {
    fetchPromotions(page, limit, search, activeCard);
  }, [page, limit, search, activeCard]);

  // get promotionDetails list
  const fetchPromotions = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    const response = await getPromotions({ page, limit, search, status });
    if (response.success && response.data?.promotions?.length > 0) {
      setPromotions(response.data?.promotions);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setPromotions([]);
      setTotal(0);
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchPromotions(page, limit, search, activeCard);
    fetchPromotionCounts();
  };

  // handle click add new
  const handleOnAddOpenClose = () => {
    setIsOpen((prev) => !prev);
    setPromotionDetails(initialPromotion);
  };

  // handle edit promotionDetails details
  const handleEditPromotionDetails = async (promotionDetails: IPromotion) => {
    setLoading(true);
    const response = await getPromotionById(promotionDetails._id);
    if (response?.success) {
      handleOnAddOpenClose();
      setPromotionDetails(response?.data);
    }
    setLoading(false);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setPromotionDetails(initialPromotion);
  };

  // handle update status
  const handleUpdateStatus = (promotionDetails: IPromotion) => {
    handleStatusOpenClose();
    setPromotionDetails(promotionDetails);
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

    const response = await updatePromotionStatus(
      payload,
      promotionDetails._id,
    );
    if (response.success) {
      handleRefreshData();
    }
    setStatusLoading(false);
  };

  // handle search promotionDetails
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  return (
    <>
      <TopBar
        title="All Promoted Employees"
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
        <PromotionTable
          promotions={promotions}
          handleEditPromotionDetails={handleEditPromotionDetails}
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
      <AddPromotion
        isOpen={isOpen}
        handleOpenClose={handleOnAddOpenClose}
        fetchPromotions={() => {
          fetchPromotions(page, limit, search, activeCard);
          fetchPromotionCounts();
        }}
        promotion={promotionDetails}
        employees={employees}
        designations={designations}
      />
      <StatusUpdateModal
        showFullTitle
        title={`Are you sure you want to do promotion of this employee ${promotionDetails.userId.firstName} ${promotionDetails.userId.lastName} ?`}
        isOpen={statusOpen}
        status={promotionDetails.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
        options={promotionStatusOptions}
      />
    </>
  );
};

export default Promotion;
