import { IOption, WeeklyOffEnum } from "../types/common-types";

export const WEEKLY_OFF_OPTIONS: {value: string,label: string, children?: {value: string,label: string, }[]}[] = [
  {
    label: "Monday",
    value: WeeklyOffEnum.MONDAY,
  },
  {
    label: "Tuesday",
    value: WeeklyOffEnum.TUESDAY,
  },
  {
    label: "Wednesday",
    value: WeeklyOffEnum.WEDNESDAY,
  },
  {
    label: "Thursday",
    value: WeeklyOffEnum.THURSDAY,
  },
  {
    label: "Friday",
    value: WeeklyOffEnum.FRIDAY,
  },
  {
    label: "Saturday",
    value: WeeklyOffEnum.SATURDAY,
    children: [
      {
        label: "1st Saturday",
        value: WeeklyOffEnum.FIRST_SATURDAY,
      },
      {
        label: "2nd Saturday",
        value: WeeklyOffEnum.SECOND_SATURDAY,
      },
      {
        label: "3rd Saturday",
        value: WeeklyOffEnum.THIRD_SATURDAY,
      },
      {
        label: "4th Saturday",
        value: WeeklyOffEnum.FOURTH_SATURDAY,
      },
      {
        label: "5th Saturday",
        value: WeeklyOffEnum.FIFTH_SATURDAY,
      },
    ],
  },
  {
    label: "Sunday",
    value: WeeklyOffEnum.SUNDAY,
  },
];

export const SERVICE_TYPE_OPTIONS: IOption[] = [
  {
    label: "In-House",
    value: "IN-House",
  },
  {
    label: "Takeaway",
    value: "Takeaway",
  }
];

export const PAYMENT_MODE_OPTIONS: IOption[] = [
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Bank Transfer",
    value: "Bank Transfer",
  },
  {
    label: "UPI",
    value: "UPI",
  },
  {
    label: "Credit Card",
    value: "Credit Card",
  },
  {
    label: "Cheque",
    value: "Cheque",
  },
];