import { useTypingEffect } from "../../../hooks/useTypingEffect";
import leftBarBg from "../../../assets/images/leftbarbg.jpg";

const LeftPanel = () => {
  const text = useTypingEffect();

  return (
    <div
      className="
        relative lg:flex w-full lg:w-[65%] flex-col items-center justify-center
        bg-cover bg-center bg-no-repeat
        px-6 py-[60px] lg:px-[25px]
        text-white hidden
      "
      style={{
        backgroundImage: `url(${leftBarBg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-[1]" />

      <div className="relative z-[3] w-full max-w-[800px] pl-5">
        {/* Animated Left Border */}
        <div className="relative pl-5">
          <div
            className="
              absolute left-0 top-0 w-[3px] h-full rounded-sm
              bg-gradient-to-b from-transparent via-primary to-transparent
            "
          />

          <div
            className="
              inline-block border-b border-primary
              text-lg leading-[34px] pb-[3px]
            "
          >
            Welcome to Mysuit
          </div>

          <div className="flex flex-col mt-3">
            <span
              className="
                text-[35px] leading-[40px] font-bold
                md:text-[40px]
                xl:text-[50px]
                2xl:text-[60px]
              "
            >
              Built for
            </span>

            <span className="inline-flex items-center min-h-auto md:min-h-[50px]">
              <span
                className="
                  inline-block font-bold text-[#5396ff]
                  text-[24px] leading-[30px]
                  md:text-[40px] md:leading-[50px]
                  xl:text-[50px] xl:leading-[60px]
                  2xl:text-[60px] 2xl:leading-[70px]
                "
              >
                {text}
              </span>

              <span
                className="
                  ml-[2px] w-[3px] text-[#5396ff]
                  font-light animate-pulse
                  text-[25px]
                  md:text-[40px]
                  xl:text-[50px]
                  2xl:text-[60px]
                "
              >
                |
              </span>
            </span>
          </div>

          <div
            className="
              mt-[14px] max-w-[520px]
              text-left text-white
              text-base leading-[22px]
            "
          >
            Streamline your workforce, expense, communications and company
            assets with the power of modern technology at all in one place.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;