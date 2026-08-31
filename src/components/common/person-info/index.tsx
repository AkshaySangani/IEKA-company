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
    <div
      className={`
        flex
        gap-2
        sm:gap-3
        items-center
        min-w-0
        w-full
        ${className}
      `}
      onClick={onClick}
    >
      {/* Image */}
      <div
        className={`
          shrink-0
          ${personInfo.status ? "relative" : ""}
        `}
      >
        <Image
          src={personInfo.profileImage}
          alt={personInfo.firstName}
          fallbackSrc={NoImage}
          className={`
            w-9
            h-9
            min-w-9
            min-h-9
            shrink-0
            object-cover
            rounded-full
            ring-1
            ring-gray-200
            ${imageClassName}
          `}
        />

        {personInfo.status && (
          <span
            className={`
              absolute
              top-0
              right-0
              w-2.5
              h-2.5
              rounded-full
              ring-1
              ring-gray-200
              ${statusBgColor[personInfo.status]}
            `}
          />
        )}
      </div>

      {/* Person Details */}
      <div
        className="
          flex
          flex-col
          min-w-0
          flex-1
          overflow-hidden
        "
      >
        <span
          className={`
            text-primary
            font-medium
            text-sm
            cursor-pointer
            truncate
            ${personClassName}
          `}
        >
          {personInfo.firstName} {personInfo.lastName}
        </span>

        {personInfo?.description && (
          <span
            className={`
              text-[#6c6c6c]
              text-xs
              font-[400]
              truncate
              ${descriptionClassName}
            `}
          >
            {personInfo.description}
          </span>
        )}
      </div>
    </div>
  );
};

export default PersonInfo;