import React, { useEffect, useState } from "react";
import { IEmployeeFormData } from ".";
import { IDesignation } from "../../../organization/designation";
import { IOption, statusEnum } from "../../../../../types/common-types";
import { getPolicies } from "../../../../../apis/organization/policy.api";
import TextField from "../../../../common/text-field/TextField";
import { Building } from "lucide-react";

interface Props {
  formData: IEmployeeFormData;
  errors: any;
  handleChange: (key: keyof IEmployeeFormData, value: any) => void;
}

const PolicyDetailsCard: React.FC<Props> = ({
  formData,
  errors,
  handleChange,
}) => {
  const [policies, setPolicies] = useState<IOption[]>([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    const response = await getPolicies({
      page: 1,
      limit: 200,
      status: statusEnum.ACTIVE,
    });
    if (response.success) {
      setPolicies(
        response?.data?.policies?.map((ele: IDesignation) => ({
          label: ele?.name,
          value: ele?._id,
        })),
      );
    } else {
      setPolicies([]);
    }
  };
  return (
    <div className="content-card bg-white border border-gray-200">
      <div className="p-5">
        <div className="flex items-center gap-2 border-b pb-3 mb-4">
          <div className="fa-solid fa-building-shield px-1.5 py-1.5 text-base bg-[#212936] text-white h-7.5 w-7.5 flex items-center justify-center">
            {" "}
            <Building />
          </div>
          <h3 className="text-md text-gray-600 font-semibold">
            Policy Details
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="flex text-sm justify-between items-center gap-5 border-b border-gray-200 pb-3"
            >
              <div className="flex items-center gap-2">
                <TextField
                  className="cursor-pointer"
                  checked={formData.policyId === policy.value}
                  name={"policyId"}
                  type="radio"
                  onChange={() => handleChange("policyId", policy.value)}
                />
                <div className="text-gray-700">{policy?.label}</div>
              </div>

              <div className="font-normal text-right max-w-[300px] line-clamp-2 break-words">
                <div className="border-l pl-2">
                  <i className="fa-solid fa-eye cursor-pointer text-gray-500"></i>
                </div>
              </div>
            </div>
          ))}
          <div className="flex text-sm justify-between items-center gap-5 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <TextField
                className="cursor-pointer"
                name={"policyId"}
                checked={formData.policyId === ""}
                type="radio"
                onChange={() => handleChange("policyId", "")}
              />
              <div className="text-gray-700">{"No Policy"}</div>
            </div>

            <div className="font-normal text-right max-w-[300px] line-clamp-2 break-words">
              {"-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsCard;
