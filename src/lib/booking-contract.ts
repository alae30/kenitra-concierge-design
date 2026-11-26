import { jsPDF } from "jspdf";
import { contractLogo } from "./contract-logo.ts";
import { demoTerms, houseRules, houseRulesContact } from "./house-rules.ts";

export type ContractImage = { data: string | Uint8Array; width: number; height: number };

export async function readContractPhoto(file: File): Promise<ContractImage> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image indisponible");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL("image/jpeg", 0.9), width: canvas.width, height: canvas.height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function createBookingContract({
  bookingId, details, signedAt, recto, verso, signature, live = false,
}: {
  bookingId: string;
  details: string[];
  signedAt: Date;
  recto: ContractImage;
  verso: ContractImage;
  signature: string | Uint8Array;
  live?: boolean;
}) {
  const pdf = new jsPDF();
  pdf.setProperties({ title: live ? "Contrat de séjour" : "Contrat de séjour — Démonstration" });
  const center = pdf.internal.pageSize.getWidth() / 2;
  const timeZone = "Africa/Casablanca";
  const date = new Intl.DateTimeFormat("fr-FR", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).format(signedAt);
  const reference = `CWS-${bookingId.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  pdf.addImage(contractLogo, "PNG", center - 7.5, 10, 15, 13.3);
  pdf.setTextColor("#79412e");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("CENTER WARM STAY", center, 29, { align: "center" });
  pdf.setDrawColor("#d8bbab");
  pdf.line(18, 34, 192, 34);
  pdf.setTextColor("#29201a");
  pdf.setFontSize(21);
  pdf.text("Contrat de séjour", 18, 44);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(live ? "DEMANDE SOUMISE À CONFIRMATION" : "DÉMONSTRATION", 18, 51);
  pdf.setTextColor("#79412e");
  pdf.text(`Réf. ${reference} · ${date}`, 18, 57);
  pdf.setTextColor("#29201a");

  let y = 65;
  function writeParagraph(text: string, size: number, bold = false) {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines: string[] = pdf.splitTextToSize(text, 174);
    const lineHeight = size * 0.41;
    if (y + (lines.length - 1) * lineHeight > 278) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(lines, 18, y);
    y += lines.length * lineHeight;
  }

  writeParagraph(details.join("\n"), 10);
  y += 3;
  writeParagraph(live ? "Le séjour est confirmé après validation du logement par la conciergerie." : demoTerms, 10);
  y += 5;
  writeParagraph("Conditions générales du séjour", 14, true);
  y += 2;
  for (const [index, rule] of houseRules.entries()) {
    writeParagraph(`${index + 1}. ${rule.title}`, 10, true);
    writeParagraph(rule.text, 10);
    y += 2;
  }
  writeParagraph(`Contact pour un besoin spécifique : ${houseRulesContact}`, 10);

  pdf.addPage();
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Pièce d’identité", 18, 23);
  pdf.setFontSize(12);
  pdf.text("Recto", 18, 37);
  pdf.text("Verso", 18, 125);

  function addPhoto(photo: ContractImage, top: number) {
    const scale = Math.min(174 / photo.width, 72 / photo.height);
    const width = photo.width * scale;
    const height = photo.height * scale;
    pdf.addImage(photo.data, "JPEG", 18 + (174 - width) / 2, top, width, height);
  }
  addPhoto(recto, 42);
  addPhoto(verso, 130);

  pdf.text("Signature du voyageur", 18, 223);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const dateAndTime = signedAt.toLocaleString("fr-MA", { timeZone }).replace(/\s/g, " ");
  pdf.text(`Règlement accepté et signé le ${dateAndTime}`, 18, 231);
  pdf.addImage(signature, "PNG", 18, 239, 128, 40);
  return pdf;
}
