import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Certificate, {
  initialLetterData,
  LetterData,
} from "../../../common/certificate";

import { DateFormat, formatDate } from "../../../../utils/date-format";
import PageLoader from "../../../common/loader/PageLoader";
import { getResignedEmployeeById } from "../../../../apis/workforce/resigned.api";

interface ResignCertificatesProps {
  title: string;
}

const ResignCertificates = ({
  title,
}: ResignCertificatesProps) => {
  const { id } = useParams();

  const [data, setData] = useState<LetterData>(initialLetterData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchResignDetails();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchResignDetails = async () => {
    try {
      setLoading(true);

      const response = await getResignedEmployeeById(String(id));

      if (!response?.success) return;

      const termination = response.data;

      const candidateName = [
        termination?.userId?.firstName,
        termination?.userId?.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      const lastWorkingDate = formatDate(
        termination?.lastWorkingDate,
        DateFormat.ISO_DATE
      );

      setData((prev) => ({
        ...prev,

        candidateName,

        jobTitle: termination?.designationId?.name,

        terminationDate: formatDate(
          new Date().toISOString(),
          DateFormat.ISO_DATE
        ),

        lastWorkingDate,

        effectiveDate: lastWorkingDate,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageLoader loading={loading} />

      <Certificate
        letterData={data}
        title={title}
      />
    </>
  );
};

export default ResignCertificates;