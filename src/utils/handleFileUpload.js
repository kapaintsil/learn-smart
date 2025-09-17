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
  // Get the file name and extract the file extension
  const fileName = file.name;
  const ext = fileName.split(".").pop().toLowerCase();

  try {
    // Handle plain text files
    if (ext === "txt") {
      const text = await file.text();
      return text;

    // Handle CSV files
    } else if (ext === "csv") {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true }); // Parse CSV content
      return JSON.stringify(parsed.data, null, 2); // Return parsed data as a formatted JSON string

    // Handle Excel files (XLSX)
    } else if (ext === "xlsx") {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" }); // Read the workbook
      const sheetName = workbook.SheetNames[0]; // Get the first sheet name
      const sheet = workbook.Sheets[sheetName]; // Get the first sheet
      return XLSX.utils.sheet_to_csv(sheet); // Convert the sheet to CSV format

    // Handle PDF files
    } else if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise; // Load the PDF document
      let text = "";
      // Iterate through each page and extract text content
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n"; // Concatenate text from all items
      }
      return text;

    // Handle Word documents (DOCX)
    } else if (ext === "docx") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer }); // Extract raw text using Mammoth
      return result.value;

    // Handle unsupported file type (PPTX)
    } else if (ext === "pptx") {
      throw new Error("PPTX file support is not available. Please upload as PDF or DOCX instead.");

    // Handle unsupported file formats
    } else {
      throw new Error(`Unsupported file format: .${ext}`);
    }

  } catch (err) {
    // Log and rethrow errors
    console.error("Error processing file:", err);
    throw new Error("Failed to process the uploaded file.");
  }
}
