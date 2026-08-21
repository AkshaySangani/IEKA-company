import { LetterData } from "..";
import { formatDate } from "../../../../utils/date-format";
import Draggable from "../../draggable";

interface ExperienceLetterBodyProps {
  data: LetterData;
}

export default function ExperienceLetterBody({
  data,
}: ExperienceLetterBodyProps) {
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
            {data.candidateName},
          </span>
        </p>}
        <p>
          This is to certify that <b> {data.candidateName} </b> was employed
          with our organization as
          <b> {data.jobTitle} </b>.
        </p>

        <p>
          He was associated with the organization from{" "}
          <b> {(data.showJoiningDate && data.joiningDate) ? formatDate(data.joiningDate) : ""} </b> to
          <b> {(data.showLastWorkingDate && data.lastWorkingDate) ? formatDate(data.lastWorkingDate) : ""} </b>.
        </p>

        <p>
          During the tenure, <b> {data.candidateName} </b> exhibited strong
          professional acumen, technical proficiency, and a consistent
          commitment to excellence in all assigned responsibilities. The quality
          of work delivered was commendable and in full alignment with
          organizational objectives and standards.
        </p>

        <p>
          The conduct, attitude, and work ethic maintained throughout the period
          of employment were found to be exemplary. All duties were performed
          with sincerity, integrity, and adherence to company policies.
        </p>

        <p>
          We sincerely appreciate the dedication and contributions made during
          the association with our organization and wish{" "}
          <b> {data.candidateName} </b> great success and continued growth in
          all future endeavors.
        </p>
      </div>
    </Draggable>
  );
}
