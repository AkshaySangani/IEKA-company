import toast from "react-hot-toast";

export const copyToClipboard = async (
  text: string,
  successMessage = "Copied to clipboard!"
): Promise<boolean> => {
  try {
    if (!text) {
      toast.error("Nothing to copy");
      return false;
    }

    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error("Copy failed:", error);
    toast.error("Failed to copy");
    return false;
  }
};