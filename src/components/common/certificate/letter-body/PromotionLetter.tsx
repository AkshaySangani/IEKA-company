import { LetterData } from "..";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Draggable from "../../draggable";

interface PromotionLetterProps {
    data: LetterData;
}

export default function PromotionLetter({
    data
}: PromotionLetterProps){
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
            <p>
              To{" "}
              <span className="font-bold">
                {data.candidateName || "Employee Name"},
              </span>
            </p>
            <p>
              We are pleased to inform you that in recognition of your
              performance, dedication, and contribution to the organization, you
              have been promoted from
              <b>{" "}{data.promotionFrom}{" "}</b>
              to
              <b>{" "}{data.promotionTo}{" "}</b>, effective from
              <b>{" "}{formatDate(data.effectiveDate, DateFormat.MONTH_YEAR)}</b>.
            </p>

            <p>
              Your consistent efforts, professional conduct, and commitment to
              excellence have been instrumental in achieving team and
              organizational goals.
            </p>

            <p>
              In your new role, you will assume additional responsibilities
              aligned with the promoted designation. You are expected to
              continue demonstrating leadership, accountability, and high
              standards of performance.
            </p>

            <p>
              Details regarding your revised compensation and updated
              responsibilities will be communicated separately as per company
              policy.
            </p>

            <p>
              We congratulate you on this well-deserved promotion and look
              forward to your continued growth with the organization.
            </p>
          </div>
        </Draggable>
    )
}