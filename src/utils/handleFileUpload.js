import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import mammoth from "mammoth";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import workerURL from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set the worker for PDF.js
GlobalWorkerOptions.workerSrc = workerURL;

/**
 * Extracts text content from uploaded files
 * @param {File} file - The file selected by the user
 * @returns {Promise<string>} - Extracted text content
 */
export async function handleFileUpload(file) {
  const fileName = file.name;
  const ext = fileName.split(".").pop().toLowerCase();

  try {
    if (ext === "txt") {
      const text = await file.text();
      return text;

    } else if (ext === "csv") {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      return JSON.stringify(parsed.data, null, 2);

    } else if (ext === "xlsx") {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_csv(sheet);

    } else if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
      }
      return text;

    } else if (ext === "docx") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;

    } else if (ext === "pptx") {
      throw new Error("PPTX file support is not available. Please upload as PDF or DOCX instead.");

    } else {
      throw new Error(`Unsupported file format: .${ext}`);
    }

  } catch (err) {
    console.error("Error processing file:", err);
    throw new Error("Failed to process the uploaded file.");
  }
}
