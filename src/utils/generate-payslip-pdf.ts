import html2pdf from "html2pdf.js";

export const generatePayslipPdf = async (
  element: HTMLElement,
  fileName: string,
): Promise<File> => {
  const options = {
    margin: 0,
    filename: fileName,
    image: {
      type: "jpeg"  as const,
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"  as const,
    },
  };

  const pdfBlob = await html2pdf()
    .set(options)
    .from(element)
    .outputPdf("blob");
    await html2pdf()
    .set(options)
    .from(element)
    .save();

  return new File(
    [pdfBlob],
    fileName,
    {
      type: "application/pdf",
    },
  );
};