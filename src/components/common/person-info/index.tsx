import Image from "../image";
import NoImage from "../../../assets/images/User-Image.png";
import { statusEnum } from "../../../types/common-types";
import { statusBgColor } from "../../../constants/constants";

export interface IPersonInfo {
  profileImage: string;
  firstName: string;
  lastName: string;
  description: string;
  status?: statusEnum;
}

interface IPersonInfoProps {
  personInfo: IPersonInfo;
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  personClassName?: string;
  descriptionClassName?: string;
}

const PersonInfo: React.FC<IPersonInfoProps> = ({
  personInfo,
  onClick = () => {},
  className = "",
  imageClassName = "",
  personClassName = "",
  descriptionClassName = "",
}: IPersonInfoProps) => {
  return (
    <div className={`flex gap-3 items-center ${className}`} onClick={onClick}>
      <div className={personInfo.status ? "relative":""}>
        <Image
          src={personInfo.profileImage}
          alt={personInfo.firstName}
          fallbackSrc={NoImage}
          className={`w-9 h-9 object-cover rounded-full ring-1 ring-gray-200 ${imageClassName}`}
        />
        {personInfo.status && (
          <span
            className={`absolute top-0 right-1 w-2.5 h-2.5 rounded-full ring-1 ring-gray-200 ${statusBgColor[personInfo.status]}`}
          ></span>
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={`text-primary font-medium text-sm cursor-pointer ${personClassName}`}
        >
          {personInfo.firstName} {personInfo.lastName}
        </span>
        {personInfo?.description && (
          <span className="text-[#6c6c6c] text-xs font-[400]">
            {personInfo?.description}
          </span>
        )}
      </div>
    </div>
  );
};

export default PersonInfo;
