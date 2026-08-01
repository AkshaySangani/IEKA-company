import React, { useState } from "react";
import { LetterData } from ".";
import Draggable from "../draggable";
import Image from "../image";
import LatterFrameOne from "../letter-frames/LetterFrameOne";
import LatterFrameTwo from "../letter-frames/LetterFrameTwo";
import LatterFrameThree from "../letter-frames/LetterFrameThree";
import LatterFrameFour from "../letter-frames/LetterFrameFour";
import LatterFrameSeven from "../letter-frames/LetterFrameSeven";
import LatterFrameNine from "../letter-frames/LetterFrameNine";
import LatterFrameSix from "../letter-frames/LetterFrameSix";
import LatterFrameFive from "../letter-frames/LetterFrameFive";
import LatterFrameEight from "../letter-frames/LetterFrameEight";
import PromotionLetter from "./letter-body/PromotionLetter";
import { formatDate } from "../../../utils/date-format";
import TerminationLetter from "./letter-body/TerminationLetter";
import FNFLetterBody from "./letter-body/FNFLetterBody";
import RelievingLetterBody from "./letter-body/RelievingLetterBody";
import ExperienceLetterBody from "./letter-body/ExperienceLetterBody";

interface LetterPreviewProps {
  title: string;
  data: LetterData;
  backGround: string;
}

const LetterPreview: React.FC<LetterPreviewProps> = ({
  title,
  data,
  backGround,
}) => {
  return (
    <div className="flex justify-center " id="letter-preview">
      {/* A4 Sheet */}
      <div
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{
          width: "794px",
          minHeight: "1123px",
        }}
      >
        {
          {
            "1": <LatterFrameOne />,
            "2": <LatterFrameTwo />,
            "3": <LatterFrameThree />,
            "4": <LatterFrameFour />,
            "5": <LatterFrameFive />,
            "6": <LatterFrameSix />,
            "7": <LatterFrameSeven />,
            "8": <LatterFrameEight />,
            "9": <LatterFrameNine />,
          }[backGround] as any
        }

        {/* ===========================
            LOGO
        ============================ */}

        {data.showLogo && (
          <Draggable
            id="logo"
            defaultPosition={{
              x: 60,
              y: 100,
            }}
          >
            <Image
              src={data.logo}
              className="w-28 object-contain"
              alt="Company Logo"
            />
          </Draggable>
        )}

        {/* ===========================
            TITLE
        ============================ */}

        <Draggable
          id="title"
          defaultPosition={{
            x: 320,
            y: 250,
          }}
        >
          <h1 className="text-lg font-bold tracking-wide border-b border-secondary text-slate-800">
            {title}
          </h1>
        </Draggable>

        {/* ===========================
            DATE
        ============================ */}

        {data.showTerminationDate && (
          <Draggable
            id="date"
            defaultPosition={{
              x: 60,
              y: 300,
            }}
          >
            <div className="text-sm text-slate-700">
              <span className="font-medium">Date :</span>{" "}
              {formatDate(data.terminationDate) || "DD/MM/YYYY"}
            </div>
          </Draggable>
        )}
        {/* ===========================
            BODY START
        ============================ */}

        {
          {
            "Promotion Letter": <PromotionLetter data={data} />,
            "Termination Letter": <TerminationLetter data={data} />,
            "Relieving Letter": <RelievingLetterBody data={data}/>,
            "Experience Letter": <ExperienceLetterBody data={data} />,
            "Fool & Final Letter": <FNFLetterBody data={data} />
          }[title]
        }

        {/* ===========================
            AUTHORIZED PERSON
            =========================== */}

        {data.showAuthPerson && (
          <Draggable
            id="auth-person"
            defaultPosition={{
              x: 60,
              y: 845,
            }}
          >
            <div className="space-y-1">
              <p>Regards,</p>
              <h3 className="text-lg font-bold text-slate-900">
                {data.authPerson}
              </h3>

              {data.showDesignation && (
                <p className="text-sm text-slate-600">{data.designation}</p>
              )}
            </div>
          </Draggable>
        )}

        {/* ===========================
            FOOTER
            =========================== */}

        <div className="h-36 overflow-hidden">
          {/* Company Address */}

          {data.showAddress && (
            <Draggable
              id="address"
              defaultPosition={{
                x: 60,
                y: 965,
              }}
            >
              <div className="max-w-[300px] text-xs leading-5 text-secondary">
                <p>
                  <i className="fa-solid fa-location-dot" /> {data.address}
                </p>
              </div>
            </Draggable>
          )}

          {/* Contact */}

          {data.showContact && (
            <Draggable
              id="contact"
              defaultPosition={{
                x: 380,
                y: 965,
              }}
            >
              <div className="text-xs text-secondary">
                <p>
                  <i className="fa-solid fa-phone" /> {data.contact}
                </p>
              </div>
            </Draggable>
          )}

          {/* Email */}

          {data.showEmail && (
            <Draggable
              id="email"
              defaultPosition={{
                x: 515,
                y: 965,
              }}
            >
              <div className="text-xs text-secondary">
                <p>
                  <i className="fa-solid fa-envelope" /> {data.email}
                </p>
              </div>
            </Draggable>
          )}

          {/* Website */}

          {data.showWebsite && (
            <Draggable
              id="website"
              defaultPosition={{
                x: 650,
                y: 965,
              }}
            >
              <div className="text-xs text-secondary text-right">
                <p>
                  <i className="fa-solid fa-globe" /> {data.website}
                </p>
              </div>
            </Draggable>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterPreview;
