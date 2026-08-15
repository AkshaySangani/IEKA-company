import { useEffect, useState } from "react";
import Certificate, {
  initialLetterData,
  LetterData,
} from "../../../common/certificate";
import { useParams } from "react-router-dom";
import { getTerminationById } from "../../../../apis/workforce/termination.api";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import PageLoader from "../../../common/loader/PageLoader";

export default function TerminationLetter() {
  const params = useParams();
  const terminationId = params.id;
  const [data, setData] = useState<LetterData>(initialLetterData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (terminationId) {
      fetchTerminationDetails();
    }
    // eslint-disable-next-line
  }, [terminationId]);

  const fetchTerminationDetails = async () => {
    setLoading(true);
    const response = await getTerminationById(String(terminationId));
    if (response?.success) {
      const termination = response?.data;
      setData((prev) => ({
        ...prev,
        candidateName: `${termination?.userId?.firstName} ${termination?.userId?.lastName}`,
        jobTitle: termination?.designationId?.name,
        terminationDate: formatDate(termination?.createdAt,DateFormat.ISO_DATE),
        lastWorkingDate: formatDate(termination?.lastWorkingDate,DateFormat.ISO_DATE),
        effectiveDate: formatDate(termination?.lastWorkingDate,DateFormat.ISO_DATE),
      }));
    }
    setLoading(false);
  };
  return <><PageLoader loading={loading}/><Certificate letterData={data} title={"Termination Letter"} /></>;
}