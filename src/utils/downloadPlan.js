import jsPDF from "jspdf";

/**
 * Generates and downloads a multi-page PDF from a given text string.
 * @param {string} plan - The AI-generated study plan content.
 * @param {string} fileName - The desired name of the downloaded PDF.
 */
export const downloadPlan = (plan, fileName, title = "AI Study Plan") => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  const margin = 10;
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;

  let cursorY = 20;

  // Title
  doc.setFontSize(18);
  doc.text(title, margin, cursorY);
  cursorY += 10;

  // Date
  doc.setFontSize(10);
  doc.text(`Generated on: ${date}`, margin, cursorY);
  cursorY += 12;

  // Plan content
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(plan, 180);

  lines.forEach((line) => {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(line, margin, cursorY);
    cursorY += lineHeight;
  });

  // Save file
  doc.save(fileName);
};
