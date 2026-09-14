import React, { useEffect, useState } from "react";
import Modal from "../../common/modal/Modal";
import ImageUpload from "../../common/image-upload";
import TextField from "../../common/text-field/TextField";
import { IAdminProfile } from ".";
import { regex } from "../../../constants/validation-regex";
import { updateProfile } from "../../../apis/admin/my-profile";
import Image from "../../common/image";
import { statusColor, statusMessage } from "../../../constants/constants";
import DetailRow from "../../common/detail-row";
import UserImage from "../../../assets/images/User-Image.png";

interface PersonalDetailsProps {
  profile: IAdminProfile;
  getAdminProfile: () => void;
}

interface ProfileForm {
  profileImage: File | string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const PersonalDetailsCard: React.FC<PersonalDetailsProps> = ({
  profile,
  getAdminProfile,
}: PersonalDetailsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [profileDetail, setUserDetail] = useState<ProfileForm>({
    profileImage: profile?.profileImage || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileForm, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      setUserDetail({
        profileImage: profile?.profileImage || null,
        email: profile?.email || "",
        phone: profile?.phone || "",
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
      });

      setErrors({});
    }
  }, [isOpen, profile]);

  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };

  // handle from field change
  const handleChange = (value: any, name: keyof ProfileForm) => {
    setUserDetail((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // validate form field
  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProfileForm, string>> = {};

    if (!profileDetail.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!profileDetail.lastName) {
      newErrors.lastName = "Last name is required.";
    }

    if (!profileDetail.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!regex.email.test(profileDetail.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!profileDetail.profileImage) {
      newErrors.profileImage = "Profile Image is required";
    }

    if (profileDetail.phone && !regex.phone.test(profileDetail.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // handle submit for update profile
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("firstName", profileDetail.firstName);
    formData.append("lastName", profileDetail.lastName);
    formData.append("email", profileDetail.email);
    formData.append("phone", profileDetail.phone);

    if (profileDetail.profileImage) {
      formData.append("profileImage", profileDetail.profileImage);
    }

    const response = await updateProfile(formData);

    if (response?.success) {
      getAdminProfile();
      setIsOpen(false);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="content-card border p-2 sm:p-4 flex flex-col gap-2">
        <div className="flex justify-between pb-2 border-b text-secondary font-medium">
          <h2>Personal Details</h2>
          <div onClick={() => setIsOpen((prev) => !prev)}>
            <i className="fa-solid fa-pen-to-square cursor-pointer text-secondary/60"></i>
          </div>
        </div>
        <div className="flex justify-center py-[10px] bg-gray-200">
          <Image
            src={profile?.profileImage}
            fallbackSrc={UserImage}
            alt={profile.firstName}
            className="w-16 h-16 rounded-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-2">
          <DetailRow label={"User Id."} value={profile.userId} />
          <DetailRow
            label={"Name"}
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <DetailRow
            label={"Status"}
            value={
              <span
                className={`font-medium text-sm ${statusColor[profile.status] ?? "text-secondary"}`}
              >
                {statusMessage[profile.status]}
              </span>
            }
          />
          <DetailRow label={"Email"} value={profile.email} />
          <DetailRow label={"Phone No."} value={profile.phone} />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        title={"Edit Personal Details"}
        onClose={handleClose}
        handleOnConfirm={handleSubmit}
        loading={loading}
        confirmButtonName="Save"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Person Picture  */}
          <ImageUpload
            label="Person Picture "
            required
            value={profileDetail?.profileImage}
            error={errors.profileImage}
            onChange={(file) => {
              handleChange(file, "profileImage");
            }}
          />

          {/* Empty column for alignment */}
          <div></div>

          {/* First Name */}
          <TextField
            label="First Name"
            value={profileDetail.firstName}
            placeholder="Enter your first name"
            error={errors.firstName}
            onChange={(e) => handleChange(e.target.value, "firstName")}
          />

          {/* last Name */}
          <TextField
            label="Last Name"
            value={profileDetail.lastName}
            placeholder="Enter your last name"
            error={errors.lastName}
            onChange={(e) => handleChange(e.target.value, "lastName")}
          />

          {/* Email */}
          <TextField
            label="Email"
            placeholder="Enter your email"
            error={errors.email}
            value={profileDetail.email}
            onChange={(e) => handleChange(e.target.value, "email")}
          />

          {/* Phone No. */}
          <TextField
            label="Phone No."
            type="number"
            min={10}
            error={errors.phone}
            onChange={(e) => handleChange(e.target.value, "phone")}
            value={profileDetail?.phone}
            placeholder="Phone No. xxxxx xxxxx"
          />
        </div>
      </Modal>
    </>
  );
};

export default PersonalDetailsCard;
