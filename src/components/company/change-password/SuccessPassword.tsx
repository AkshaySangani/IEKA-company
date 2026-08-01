import React from "react";
import Button from "../../common/button/Button";

interface ISuccessPasswordProps {
  setUpdated: (value: boolean) => void;
}

const SuccessPassword: React.FC<ISuccessPasswordProps> = ({
  setUpdated,
}: ISuccessPasswordProps) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <i className="fa-solid fa-check text-4xl text-green-600"></i>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-3xl font-medium text-gray-900">
          Password Updated!
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-500">
          Your password has been changed successfully.
        </p>
        <div className="mx-auto mt-6 flex items-center justify-center">
          <Button name="Back to Settings" onClick={() => setUpdated(false)} />
        </div>
      </div>
    </div>
  );
};

export default SuccessPassword;
