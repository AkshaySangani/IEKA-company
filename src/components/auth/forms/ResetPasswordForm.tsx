import { useState } from "react";
import Button from "../../common/button/Button";
import TextField from "../../common/text-field/TextField";
import { resetPasswordApi } from "../../../apis/auth/auth.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toastMessage } from "../../../utils/toast-message";

// import { resetPassword } from "../../../services/apis/auth";

const ResetPasswordForm = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] =
    useState({
      password: "",
      confirmPassword: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      password: "",
      confirmPassword: "",
    };

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (
      !formData.confirmPassword.trim()
    ) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(Boolean);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) return;
    if(!token){
      toastMessage.error("Password reset token is missing.");
      return;
    }

    setLoading(true);

    const response =
      await resetPasswordApi({
        token: token??"",
        password: formData.password,
      });

    setLoading(false);

    if (response?.success) {
      navigate("/login");
    }
  };

  return (
    <div
      id="new-password"
      className="w-full flex flex-col"
    >
      <h2 className="mb-2.5 text-center text-xl sm:text-2xl leading-[30px] font-medium text-secondary">Create New Password</h2>

      <p className="mb-5 border-b border-[#ccc] pb-1.5 text-center text-sm text-gray-500">
        Please enter new password
      </p>

      <form
      className="flex flex-col gap-5"
        id="new-password-form"
        onSubmit={handleSubmit}
      >
        <TextField
          label="New Password"
          id="password"
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Enter New Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={
            <span
              className="fieldicon"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
            >
              <i
                className={`fa-solid ${
                  showPassword
                    ? "fa-eye"
                    : "fa-eye-slash"
                }`}
              ></i>
            </span>
          }
        />

        <TextField
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={
            errors.confirmPassword
          }
          icon={
            <span
              className="fieldicon"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev
                )
              }
            >
              <i
                className={`fa-solid ${
                  showConfirmPassword
                    ? "fa-eye"
                    : "fa-eye-slash"
                }`}
              ></i>
            </span>
          }
        />

        <Button
          type="submit"
          variant="primaryGradient"
          name={
            loading
              ? "Submitting..."
              : "Submit"
          }
          loading={loading}
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default ResetPasswordForm;