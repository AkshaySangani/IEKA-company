import { LetterData } from "..";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Draggable from "../../draggable";

interface RelievingLetterBodyProps {
  data: LetterData;
}

export default function RelievingLetterBody({
  data,
}: RelievingLetterBodyProps) {
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
          This is to certify that <b> {data.candidateName} </b> was appointed as
          <b> {data.jobTitle} </b> in our organization, with effect from{" "}
          <b> {(data.showJoiningDate && data.joiningDate) ? formatDate(data.joiningDate) : ""} </b>.
        </p>

        <p>
          As per the resignation submitted by <b> {data.candidateName} </b>, we
          hereby confirm that the last working day with the organization was
          <b> {(data.showLastWorkingDate && data.lastWorkingDate) ? formatDate(data.lastWorkingDate) : ""} </b>. All exit formalities, including the
          handover of duties, return of company assets, and settlement of
          pending obligations, have been duly completed.
        </p>

        <p>
          During the tenure with our organization, <b> {data.candidateName} </b>
          has demonstrated professionalism and sincerity in carrying out the
          assigned responsibilities. We confirm that there are no dues or
          liabilities outstanding as on the date of relieving.
        </p>

        <p>
          This letter is being issued at the request of the individual as a
          formal confirmation of relieving from the services of the
          organization.
        </p>

        <p>
          We wish <b> {data.candidateName} </b> the very best in all future
          professional endeavors.
        </p>
      </div>
    </Draggable>
  );
}
