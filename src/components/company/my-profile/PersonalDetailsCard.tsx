import React, { useEffect, useState } from "react";
import Modal from "../../common/modal/Modal";
import ImageUpload from "../../common/image-upload";
import TextField from "../../common/text-field/TextField";
import { useAuthStore } from "../../../store/auth-store";
import { IAdminProfile } from ".";
import { regex } from "../../../constants/validation-regex";
import { updateProfile } from "../../../apis/admin/my-profile";
import Image from "../../common/image";
import { statusColor, statusMessage } from "../../../constants/constants";

interface PersonalDetailsProps {
  profile: IAdminProfile;
  getAdminProfile: () => void;
}

interface ProfileForm {
  profileImage: File | string | null;
  email: string;
  phone: string;
}

interface FormErrors {
  profileImage?: string;
  email?: string;
  phone?: string;
}

const PersonalDetailsCard: React.FC<PersonalDetailsProps> = ({
  profile,
  getAdminProfile,
}: PersonalDetailsProps) => {
  const {setUser} = useAuthStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [profileDetail, setUserDetail] = useState<ProfileForm>({
    profileImage: profile?.profileImage || null,
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setUserDetail({
        profileImage: profile?.profileImage || null,
        email: profile?.email || "",
        phone: profile?.phone || "",
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
    const newErrors: FormErrors = {};

    // if (!profileDetail.email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!regex.email.test(profileDetail.email)) {
    //   newErrors.email = "Enter a valid email address";
    // }

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

    // formData.append("email", profileDetail.email);

    formData.append("phone", profileDetail.phone);

    if (profileDetail.profileImage) {
      formData.append("profileImage", profileDetail.profileImage);
    }

    const response = await updateProfile(formData);

    if (response?.success) {
      getAdminProfile();
      setIsOpen(false);
      setUser(response?.data)
    }

    setLoading(false);
  };

  return (
    <>
      <div className="companyDetailsCard secondcard content-card border">
        <div className="employebody">
          <div className="employeedetail_parts">
            <div className="titlelabel">
              Personal Details{" "}
              <div
                className="action_btn ml_10"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
            </div>
            <div className="flex justify-center py-[10px] bg-gray-200">
              <Image src={profile?.profileImage} alt="UserProfile" width="80" />
            </div>

            <div className="employee_detailsitems">
              {/* <div className="employee_detail_single">
                <div className="label">User Id.</div>
                <div className="labelvalue curruntmultidiv">
                  <div className="curruntvalue">589845</div>
                </div>
              </div> */}
              <div className="employee_detail_single">
                <div className="label">Name</div>
                <div className="labelvalue curruntmultidiv">
                  <div className="curruntvalue">
                    {profile?.firstName} {profile?.lastName}
                  </div>
                </div>
              </div>
              <div className="employee_detail_single">
                <div className="label">Status</div>
                <div className="labelvalue curruntmultidiv">
                  <div className="curruntvalue">
                    <span className={`status font-medium ${statusColor[profile?.status]}`}>{statusMessage[profile?.status]}</span>
                  </div>
                </div>
              </div>
              <div className="employee_detail_single">
                <div className="label">Email</div>
                <div className="labelvalue">{profile?.email}</div>
              </div>
              <div className="employee_detail_single">
                <div className="label">Phone No.</div>
                <div className="labelvalue">{profile?.phone}</div>
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Email */}
            {/* <TextField label="Email" placeholder="Enter your email" /> */}

            {/* Phone No. */}
            <TextField label="Phone No." type="number" error={errors.phone} onChange={(e) => handleChange(e.target.value, "phone")} value={profileDetail?.phone} placeholder="Phone No. xxxxx xxxxx" />
          </div>
      </Modal>
    </>
  );
};

export default PersonalDetailsCard;
