import { ColumnDef, CustomTable } from "../../../common/table";
import { roleNames } from "../../../../constants/constants";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import { IPunchManualRequest } from "../../../../types/company/performance/manual-punch-request.types";
import { useAuthStore } from "../../../../store/auth-store";
import { RoleEnum } from "../../../../types/common-types";

interface IPunchManualRequestListProps {
  manualPunchRequests: IPunchManualRequest[];
}

export default function ManualPunchRequestTable({
  manualPunchRequests,
}: IPunchManualRequestListProps) {
  const { user } = useAuthStore();
  const isEmployee = user.role === RoleEnum.EMPLOYEE;

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IPunchManualRequest>[] = [
    {
      header: "#",
      className: "",
      render: (_, index) => index + 1,
    },
    ...(!isEmployee
      ? [
          {
            header: "Employee Name",
            className: "",
            // isSticky: true,
            render: (row: IPunchManualRequest) => (
              <PersonInfo
                personInfo={{
                  profileImage: row.userId.profileImage,
                  firstName: row.userId.firstName,
                  lastName: row.userId.lastName,
                  description: `${row.userId.userId} | ${roleNames[row.userId.role]}`,
                }}
                personClassName="text-secondary"
              />
            ),
          },
        ]
      : []),
    {
      header: "Punch For Date",
      className: "",
      render: (row) => (
        <span className={isEmployee ? "text-primary font-medium" : ""}>
          {formatDate(row.attendanceDate)}
        </span>
      ),
    },
    {
      header: "Punch Time",
      className: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.inTime && (
            <span>{formatDate(row.inTime, DateFormat.TIME_24)}</span>
          )}
          {row.inTime && row.outTime ? "-" : ""}
          {row.outTime && (
            <span>{formatDate(row.outTime, DateFormat.TIME_24)}</span>
          )}
        </div>
      ),
    },
    {
      header: "Punch Type",
      className: "",
      render: (row) => (
        <span>
          {row.isManualPunchIn && row.isManualPunchOut
            ? "Both"
            : row.isManualPunchIn
              ? "In"
              : "Out"}
        </span>
      ),
    },
    {
      header: "	Request Date",
      className: "w-[15%]",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {formatDate(row.updatedAt)}
          <span className="text-grayText text-xs">
            {formatDate(row.updatedAt, DateFormat.TIME_24)}
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomTable columns={columns} data={manualPunchRequests} />
    </>
  );
}
