import React from "react";
import {
  MapPin,
  ShieldCheck,
  Settings,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import Modal from "./Modal";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onRetry,
}) => {

  return (
    <Modal width="max-w-xl" isOpen={isOpen} title={"Location Permission"} onClose={onClose} confirmButtonName="Ok" handleOnConfirm={onClose}>
      <div className="flex flex-col gap-2">

        {/* Header */}
        <div className=" text-center flex flex-col gap-1">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primaryBlur">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
              <MapPin
                size={24}
                className="text-blue-600"
                strokeWidth={2.2}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-secondary sm:text-2xl">
            Location Permission Required
          </h2>

          <p className="mx-auto max-w-[390px] text-sm leading-6 text-grayText">
            Location permission is required for{" "}
            <span className="font-medium text-gray-700">
              punch in and punch out
            </span>
            .
          </p>
        </div>

        {/* Guidance */}
        <div className="rounded-xl border border-inputBorder bg-gray-50 p-4 sm:mx-6 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={19} className="text-green-600" />

            <h3 className="text-sm font-semibold text-gray-800">
              How to enable location
            </h3>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <StepNumber number={1} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Open browser settings
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Click the{" "}
                  <span className="font-medium text-gray-700">
                    lock / settings icon
                  </span>{" "}
                  next to the website address.
                </p>
              </div>

              <Settings
                size={18}
                className="mt-0.5 shrink-0 text-gray-400"
              />
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <StepNumber number={2} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Allow Location
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Find{" "}
                  <span className="font-medium text-gray-700">
                    Location
                  </span>{" "}
                  under site permissions and change it to{" "}
                  <span className="font-medium text-green-600">
                    Allow
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <StepNumber number={3} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Refresh and try again
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  After allowing location, click the button below and try
                  punching in/out again.
                </p>
              </div>

              <RefreshCw
                size={18}
                className="mt-0.5 shrink-0 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="flex gap-3 rounded-lg border border-inputBorder bg-primaryBlur px-4 py-3 sm:mx-6">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <p className="text-xs leading-5 text-blue-700">
            Your location is only used to verify your attendance during
            punch in and punch out.
          </p>
        </div>
      </div>
    </Modal>
  );
};

interface StepNumberProps {
  number: number;
}

const StepNumber: React.FC<StepNumberProps> = ({ number }) => {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-gray-200">
      {number}
    </div>
  );
};

export default LocationPermissionModal;