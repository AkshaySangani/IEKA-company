import { PunchInOutPayload } from "../apis/performance/attendance.api";
import { AttendanceMethodEnum } from "../types/common-types";
import { toastMessage } from "./toast-message";

/**
 * Detect whether the current device is mobile/tablet
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  // Modern browsers
  if ("userAgentData" in navigator) {
    const userAgentData = navigator.userAgentData as {
      mobile?: boolean;
    };

    if (typeof userAgentData.mobile === "boolean") {
      return userAgentData.mobile;
    }
  }

  // Fallback for browsers that don't support userAgentData
  const userAgent = navigator.userAgent || "";

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent,
  );
};

/**
 * Get attendance method based on device
 *
 * Mobile / Tablet -> MOBILE
 * Desktop          -> WEB
 */
export const getAttendanceMethod = (): AttendanceMethodEnum => {
  return isMobileDevice()
    ? AttendanceMethodEnum.MOBILE
    : AttendanceMethodEnum.WEB;
};

/**
 * Get browser location
 */
export const getCurrentLocation = (): Promise<{
  latitude: number | null;
  longitude: number | null;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toastMessage.info("Geolocation is not supported by your browser.");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "Unable to get your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission is required to punch in/out.";
            break;

          case error.POSITION_UNAVAILABLE:
            message = "Your current location is unavailable.";
            break;

          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }

        // toastMessage.error(message);
        resolve({
          latitude: null,
          longitude: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
};

/**
 * Get address from coordinates
 */
export const getAddressFromLocation = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
  );

  if (!response.ok) {
    console.log("Address fetch error:-", "Unable to get location address.");
  }

  const data = await response.json();

  return data?.display_name || "";
};

/**
 * Create Punch Payload
 */
export const getLocationPayload = async (): Promise<PunchInOutPayload> => {
  const { latitude, longitude } = await getCurrentLocation();

  const address = (latitude && longitude) ? await getAddressFromLocation(latitude, longitude) : "";

  return {
    latitude,
    longitude,
    address,
    method: getAttendanceMethod(),
  };
};
