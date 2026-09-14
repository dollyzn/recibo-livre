import { snapdom } from "@zumer/snapdom";
import { jsPDF } from "jspdf";
import type { ReceiptData } from "@/lib/receipt";
import { receiptFileName } from "@/lib/receipt";

export type ReceiptExportFormat = "pdf" | "png";

const SNAPSHOT_OPTIONS = {
  scale: 2,
  dpr: 1,
  embedFonts: true,
  backgroundColor: "#f8faf8",
  outerShadows: false,
  reconcile: true,
} as const;

async function captureSheet(element: HTMLElement) {
  return snapdom(element, SNAPSHOT_OPTIONS);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadReceiptExport(
  element: HTMLElement,
  data: ReceiptData,
  format: ReceiptExportFormat,
) {
  const result = await captureSheet(element);

  if (format === "png") {
    await result.download({
      format: "png",
      filename: receiptFileName(data, "png").replace(/\.png$/i, ""),
    });
    return;
  }

  const canvas = await result.toCanvas();
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  pdf.addImage(canvas, "PNG", 0, 0, 210, 297, undefined, "FAST");
  const blob = pdf.output("blob");
  triggerBlobDownload(blob, receiptFileName(data, "pdf"));
}
