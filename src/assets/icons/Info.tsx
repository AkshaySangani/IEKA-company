import { Info } from "lucide-react";
import Image from "../../components/common/image";
import InfoImage from "../images/info.png"

interface IInfoProps {
  onClick?: () => void;
  className?: string;
  size?: number;
}
export default function InfoIcon({ onClick = () => {}, className = "", size = 18 }: IInfoProps) {
  // return (
  //   <Image onClick={onClick} src={InfoImage} width={size} height={size}/>
  // )
  return (
    <Info onClick={onClick} size={size} className={`text-grayText/70 cursor-pointer  ${className}`}/>
  );
}
