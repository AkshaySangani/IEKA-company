import { LetterData } from "..";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Draggable from "../../draggable";

interface TerminationLetterProps {
  data: LetterData;
}

export default function TerminationLetter({ data }: TerminationLetterProps) {
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
          This is to formally inform you that your employment with our
          organization as
          <b>{" "}{data.jobTitle}{" "}</b> has been terminated with effect from
          <b>{" "}{(data.showTerminationDate && data.terminationDate) ? formatDate(data.terminationDate) : ""}</b> and last working day is<b>{" "}{(data.showLastWorkingDate && data.lastWorkingDate) ? formatDate(data.lastWorkingDate) : ""}</b>.
        </p>

        <p>
          This decision has been taken after careful consideration and in
          accordance with company policies and employment terms. Your services
          are no longer required by the organization effective from the
          above-mentioned date.
        </p>

        <p>
          You are requested to return all company property, documents, access
          credentials, and any confidential information in your possession
          immediately. Final settlement of dues, if applicable, will be
          processed as per company policy.
        </p>

        <p>
          We expect you to maintain confidentiality regarding company matters
          even after the termination of your employment.
        </p>

        <p>We wish you the best in your future endeavors.</p>
      </div>
    </Draggable>
  );
}
