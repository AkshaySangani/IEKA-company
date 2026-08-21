import { LetterData } from "..";
import { formatDate } from "../../../../utils/date-format";
import Draggable from "../../draggable";

interface FNFLetterBodyProps {
  data: LetterData;
}

export default function FNFLetterBody({ data }: FNFLetterBodyProps) {
  return (
    <Draggable
      id="body"
      defaultPosition={{
        x: 60,
        y: 330,
      }}
      className="w-[670px]"
    >
      <div className="space-y-3 text-[15px] leading-8 text-slate-700">
        {data.showCandidateName && <p>
          To{" "}
          <span className="font-bold">
            {data.candidateName || "Employee Name"},
          </span>
        </p>}
        <p>
          This is to certify that <b> {data.candidateName} </b> was employed
          with our organization as
          <b> {data.jobTitle} </b>, from
          <b> {(data.showJoiningDate && data.joiningDate) ? formatDate(data.joiningDate) : ""} </b> to
          <b> {(data.showLastWorkingDate && data.lastWorkingDate) ? formatDate(data.lastWorkingDate) : ""} </b>.
        </p>

        <p>
          We hereby confirm that all dues, settlements, and financial
          obligations of
          <b> {data.candidateName} </b> towards the organization have been duly
          cleared and settled in full as on the last working date. There are no
          pending liabilities, outstanding claims, or recoveries due from or
          against the employee.
        </p>

        <p>
          All company assets, access credentials, and documents assigned during
          the course of employment have been returned and accounted for
          satisfactorily. The Full &amp; Final Settlement has been reviewed,
          verified, and mutually accepted by both parties.
        </p>

        <p>
          This letter serves as a formal confirmation of the Full &amp; Final
          Settlement and a No-Dues Certificate. We wish{" "}
          <b> {data.candidateName} </b> every success in all
          future professional endeavors.
        </p>
      </div>
    </Draggable>
  );
}
