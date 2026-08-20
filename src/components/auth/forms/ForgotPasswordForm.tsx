import { useState } from "react";
import Button from "../../common/button/Button";
import TextField from "../../common/text-field/TextField";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../../apis/auth/auth.api";
import { regex } from "../../../constants/validation-regex";
import { maskEmail } from "../../../utils/helper";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const email = state?.email;
  const [loading, setLoading] = useState<boolean>(false);
  const [isMailSent, setIsMailSent] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    emailId: email??"",
  });

  const [errors, setErrors] = useState({
    emailId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      emailId: "",
    };

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email Id is required";
    } else if (!regex.email.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid Email Id";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const response = await forgotPasswordApi({
      email: formData.emailId,
    });

    setLoading(false);

    if (response?.success) {
      navigate(`/otp-verify?email=${formData.emailId}`)
    }
  };

  return (
    <div className="w-full flex flex-col">
      <h2 className="mb-2.5 text-center text-xl sm:text-2xl leading-[30px] font-medium text-secondary">Forgot Password</h2>
      <p className="mb-5 border-b border-[#ccc] pb-1.5 text-center text-sm text-gray-500">Enter your registered email id to receive OTP.</p>

      {isMailSent ? <div className="mb-5 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700">
            <i className="fas fa-mobile-alt text-lg text-blue-600"></i>
      
            <span>
              Password reset link has been sent to the registered email id.
              <span className="ml-1 font-medium">
                {maskEmail(formData.emailId)}{" "}
              </span>
              please check your email and reset your password.
            </span>
          </div> : <form className="flex flex-col gap-5" id="forgot-password-form" method="POST" onSubmit={handleSubmit}>
        <TextField
          label="Email Id"
          error={errors.emailId}
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          type="text"
          placeholder="Enter your registered email id"
        />
        <Button loading={loading} variant="primaryGradient" name="Submit" />
      </form>}
      <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-secondary transition-all duration-200 ease-in hover:text-primary flex justify-center items-center gap-1 hover:gap-2" id="backtologin">
            <i className="fas fa-arrow-left"></i> Back To Login
          </Link>
        </div>
    </div>
  );
};

export default ForgotPasswordForm;
