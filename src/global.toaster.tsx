import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "react-hot-toast";

export function GlobalToaster() {
  const [dialogElement, setDialogElement] =
    useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const updateDialog = () => {
      const dialog = document.querySelector<HTMLDialogElement>(
        "dialog[open]",
      );

      setDialogElement(dialog);
    };

    // Initial check
    updateDialog();

    // Watch for dialog open/close changes
    const observer = new MutationObserver(() => {
      updateDialog();
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (dialogElement) {
    return createPortal(
      <Toaster position="top-center" />,
      dialogElement,
    );
  }

  return <Toaster position="top-center" />;
}