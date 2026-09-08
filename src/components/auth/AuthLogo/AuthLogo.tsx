import logo from "../../../assets/images/ieka_logo.png";
import Image from "../../common/image";

const AuthLogo = () => {
  return (
    <div className={"flex items-center justify-center my-0 mx-auto w-[120px]"}>
      <Image fallbackSrc={logo} alt="logo" />
    </div>
  );
};

export default AuthLogo;