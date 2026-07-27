import React from "react";
import RadioButton from "../radio-button";

interface BackgroundStyleProps {
  backGround: string;
  setBackGround: React.Dispatch<React.SetStateAction<string>>;
}

const BackgroundStyle: React.FC<BackgroundStyleProps> = ({
  backGround,
  setBackGround,
}) => {
  const options = Array.from({ length: 9 }, (_, index) => ({
    label: String(index + 1),
    value: String(index + 1),
  }));
  return (
    <div className="content-card p-4">
      <RadioButton
        name="backgroundStyle"
        value={backGround}
        options={options}
        label={"Background Style"}
        onChange={(value) => setBackGround(value)}
      />
    </div>
  );
};

export default BackgroundStyle;
