import TopBar from "../../common/topbar/TopBar";
import CompanyDetailsCard from "./CompanyDetailsCard";
import PersonalDetailsCard from "./PersonalDetailsCard";
import { useEffect, useState } from "react";
import PageLoader from "../../common/loader/PageLoader";
import { getEmployeeDetails } from "../../../apis/workforce/onboardings.api";
import { useAuthStore } from "../../../store/auth-store";
import { statusEnum } from "../../../types/common-types";

export interface ICompanyDetails {
  companyName: string;
  gstin: string;
  companyEmail: string;
  companyPhone: number;
  companyAddress: string;
  companyLogo: string;
}

export interface IAdminProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  profileImage: string;
  address: string;
  status: statusEnum;
  userId: string;
}

const MyProfile = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<IAdminProfile>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: "",
    status: statusEnum.ACTIVE,
    userId: "",
    address: "",
    gender: "",
  });

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
      setProfile(profileData);
      setCompanyDetails(companyData);
      if(!loader){
        setUser({
          ...user,
            company: {...user.company, companyLogo: companyData?.companyLogo},
            email: profileData.email,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            profileImage: profileData.profileImage,
        })
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

              <PersonalDetailsCard
                profile={profile}
                getAdminProfile={() => getAdminProfile(false)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyProfile;
