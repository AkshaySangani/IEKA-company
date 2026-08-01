import { useEffect, useState } from "react";
import Button from "../../common/button/Button";
import OTPInputField from "../../common/otp-field/OtpField";
import { forgotPasswordApi, verifyOtp } from "../../../apis/auth/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { maskEmail } from "../../../utils/helper";

const OTP_LENGTH = 4;

const OTPForm = () => {
    const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const validateForm = () => {
    const otpValue = otp.join("");

    if (
      !otpValue ||
      otpValue.length !== OTP_LENGTH
    ) {
      setError(
        `Please enter ${OTP_LENGTH} digit OTP`
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const response = await verifyOtp({
      otp: otp.join(""),
    });

    setLoading(false);

    if (response?.success) {
      navigate("/reset-password", {
        state: {
          email: "formData.emailId",
        },
      });
    }
  };

  const handleResendOTP = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    if (seconds > 0) return;

    const response = await forgotPasswordApi({
      email: "formData.emailId",
    });

    if (response?.success) {
      setOtp(
        Array(OTP_LENGTH).fill("")
      );
      setError("");
      setSeconds(60);
    }
  };

  return (
  <div className="flex w-full flex-col">
    <h2 className="mb-2.5 text-center text-xl font-medium leading-[30px] text-secondary sm:text-2xl">
      OTP Verification
    </h2>

    <p className="mb-5 border-b border-[#ccc] pb-1.5 text-center text-sm text-gray-500">
      Please enter received OTP here for login
    </p>

    <div className="mb-5 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700">
      <i className="fas fa-mobile-alt text-lg text-blue-600"></i>

      <span>
        OTP has been sent to the registered email id.
        <span className="ml-1 font-medium">
          {maskEmail("hirenbhuva@gmail.com")}
        </span>
      </span>
    </div>

    <form
      id="otp-form"
      onSubmit={handleSubmit}
      className="flex flex-col"
    >
      <OTPInputField
        length={OTP_LENGTH}
        value={otp}
        onChange={(value) => {
          setOtp(value);

          if (error) {
            setError("");
          }
        }}
      />

      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="mt-4 mb-5 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-500">
          {seconds > 0
            ? `${seconds} Seconds`
            : "Expired"}
        </span>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={seconds > 0}
          className={`transition-colors ${
            seconds > 0
              ? "cursor-not-allowed text-gray-400"
              : "text-primary hover:text-primary/80"
          }`}
        >
          Resend OTP
        </button>
      </div>

      <Button
        type="submit"
        variant="primaryGradient"
        name={
          loading
            ? "Verifying..."
            : "Verify OTP"
        }
        disabled={loading}
      />
    </form>

    <div className="mt-5 text-center">
      <Link
        to="/login"
        state={{ email: "" }}
        className="inline-flex items-center gap-1.5 text-sm text-secondary transition-all duration-200 hover:gap-2.5 hover:text-primary"
      >
        <i className="fas fa-arrow-left"></i>
        Back
      </Link>
    </div>
  </div>
);
};

export default OTPForm;