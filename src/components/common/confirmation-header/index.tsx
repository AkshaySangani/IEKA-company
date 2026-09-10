import Image from "../image";
import excliMinate from "../../../assets/images/excliminate.png";

interface ConfirmationHeaderProps {
  title: string;
  imageUrl?: string;
}

export default function ConfirmationHeader({
  title,
  imageUrl = excliMinate,
}: ConfirmationHeaderProps) {
  return (
    <div className="mb-4 flex flex-col items-center gap-2 text-center">
      <Image
        src={imageUrl}
        fallbackSrc={excliMinate}
        alt="excliMinate"
        className="w-20
            h-20
            min-w-20
            min-h-20
            shrink-0
            object-cover
            rounded-full
            ring-1
            ring-gray-200"
      />

      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
}
