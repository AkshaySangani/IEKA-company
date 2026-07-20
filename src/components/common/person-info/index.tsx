import Image from "../image";
import NoImage from "../../../assets/images/User-Image.png";

export interface IPersonInfo {
  profileImage: string;
  firstName: string;
  lastName: string;
  description: string;
}

interface IPersonInfoProps {
  personInfo: IPersonInfo;
  onClick?: () => void;
}

const PersonInfo: React.FC<IPersonInfoProps> = ({
  personInfo,
  onClick = () => {},
}: IPersonInfoProps) => {
  return (
    <div className="flex gap-3 items-center" onClick={onClick}>
      <Image
        src={personInfo.profileImage}
        alt={personInfo.firstName}
        fallbackSrc={NoImage}
        className="w-9 h-9 object-cover rounded-full ring-1 ring-gray-200"
      />
      <div className="flex flex-col">
        <span className="text-primary font-medium text-sm cursor-pointer">
          {personInfo.firstName} {personInfo.lastName}
        </span>
        {personInfo?.description && <span className="text-gray-400 text-xs">{personInfo?.description}</span>}
      </div>
    </div>
  );
};

export default PersonInfo;
