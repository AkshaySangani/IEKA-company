import TopBar from "../../common/topbar/TopBar";
import { useEffect, useState } from "react";
import PageLoader from "../../common/loader/PageLoader";
import { getEmployeeDetails } from "../../../apis/workforce/onboardings.api";
import { useAuthStore } from "../../../store/auth-store";
import { GenderEnum, statusEnum } from "../../../types/common-types";
import EmployeeOtherDetails from "../workforce/all-employees/employee-details/EmployeeOtherDetails";
import { IEmployeeDetails } from "../workforce/onboarding/employee-details";
import {
  initialEmployee,
  initialEmployeeOtherDetails,
  initialEmployeeResponse,
} from "../workforce/all-employees/employee-details";
import CompanyDetailsCard from "../my-profile/CompanyDetailsCard";

export interface ICompanyDetails {
  companyName: string;
  gstin: string;
  companyEmail: string;
  companyPhone: number;
  companyAddress: string;
  companyLogo: string;
}

export interface IUserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: GenderEnum;
  profileImage: string;
  address: string;
  status: statusEnum;
  userId: string;
}

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<IUserProfile>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: "",
    status: statusEnum.ACTIVE,
    userId: "",
    address: "",
    gender: GenderEnum.MALE,
  });

  const [employeeDetails, setEmployeeOtherDetails] = useState<IEmployeeDetails>(
    initialEmployeeOtherDetails,
  );

  const [companyDetails, setCompanyDetails] = useState<ICompanyDetails>({
    companyName: "",
    gstin: "",
    companyEmail: "",
    companyPhone: 0,
    companyAddress: "",
    companyLogo: "",
  });

  useEffect(() => {
    if (user._id) {
      getAdminProfile(true);
    }
    // eslint-disable-next-line
  }, [user._id]);

  const getAdminProfile = async (loader: boolean = false) => {
    setLoading(loader);
    const response = await getEmployeeDetails(user._id);
    if (response?.data) {
      const profileData = response?.data?.user;
      const companyData = response?.data?.company;
      const userDetails = response?.data?.userDetails;
      setProfile(profileData);
      setCompanyDetails(companyData);
      if (userDetails) {
        setEmployeeOtherDetails(userDetails);
      } else {
        setEmployeeOtherDetails(initialEmployeeOtherDetails);
      }
      if (!loader) {
        setUser({
          ...user,
          company: { ...user.company, companyLogo: companyData?.companyLogo },
          email: profileData.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          profileImage: profileData.profileImage,
        });
      }
    }
    setLoading(false);
  };
  return (
    <>
      <PageLoader loading={loading} />
      {!loading && (
        <>
          <TopBar title={companyDetails?.companyName} />
          <div className="content-area ">
            <div className="grid grid-cols-1 sm:grid-cols-[3fr_4fr] gap-4">
              <CompanyDetailsCard
                companyDetails={companyDetails}
                getAdminProfile={() => getAdminProfile(false)}
              />

              <EmployeeOtherDetails
                employee={{
                  ...initialEmployeeResponse,
                  user: { ...initialEmployee, ...profile },
                }}
                employeeDetails={employeeDetails}
                fetchEmployeeOtherDetails={() => getAdminProfile(false)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
