import { useEffect, useState } from "react";
import Certificate, {
  initialLetterData,
  LetterData,
} from "../../../common/certificate";
import { useParams } from "react-router-dom";
import { getPromotionById } from "../../../../apis/workforce/promotion.api";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import PageLoader from "../../../common/loader/PageLoader";

export default function PromotionLetter() {
  const params = useParams();
  const promotionId = params.id;
  const [data, setData] = useState<LetterData>(initialLetterData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (promotionId) {
      fetchPromotionDetails();
    }
  }, [promotionId]);

  const fetchPromotionDetails = async () => {
    setLoading(true);
    const response = await getPromotionById(String(promotionId));
    if (response?.success) {
      const promotion = response?.data;
      setData((prev) => ({
        ...prev,
        candidateName: `${promotion?.userId?.firstName} ${promotion?.userId?.lastName}`,
        jobTitle: promotion?.designationId?.name,
        terminationDate: formatDate(promotion?.createdAt,DateFormat.ISO_DATE),
        lastWorkingDate: "",
        promotionFrom: promotion?.designationId?.name,
        promotionTo: promotion?.designationId?.name,
        effectiveDate: formatDate(
          promotion?.effectiveDate,
          DateFormat.ISO_DATE,
        ),
      }));
    }
    setLoading(false);
  };
  return <><PageLoader loading={loading}/><Certificate letterData={data} title={"Promotion Letter"} /></>;
}
