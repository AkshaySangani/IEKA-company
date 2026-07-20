import React from "react";
import { config } from "../../../utils/config";
import NoImage from "../../../assets/images/no-image.jpg";

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

const BACKEND_URL = config.BACKEND_API_URL || "";

const Image: React.FC<ImageProps> = ({
  src,
  alt = "Image",
  fallbackSrc = NoImage,
  ...props
}) => {
  const getImageUrl = () => {
    if (!src) {
      return fallbackSrc;
    }

    // Absolute URLs
    if (
      src.startsWith("blob:") ||
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("data:")
    ) {
      return src;
    }

    // Relative API path
    return `${BACKEND_URL}${src}`;
  };

  return (
    <img
      {...props}
      src={getImageUrl()}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallbackSrc;
      }}
    />
  );
};

export default Image;
