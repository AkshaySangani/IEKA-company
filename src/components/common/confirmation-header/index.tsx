import Image from "../image";
import excliMinate from "../../../assets/images/excliminate.png";

interface ConfirmationHeaderProps {
    title: string;
    imageUrl?: string;
}

export default function ConfirmationHeader({
    title,
    imageUrl = excliMinate
}: ConfirmationHeaderProps){
    return (
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <Image
            src={imageUrl}
            fallbackSrc={excliMinate}
            alt="excliMinate"
            width={50}
          />

          <h3 className="text-lg font-medium">
            {title}
          </h3>
        </div>
    )
}