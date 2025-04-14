// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the function directly

/**
 * Triggers a browser download for the given content.
 * @param {string} content The content to download.
 * @param {string} filename The desired filename.
 * @param {string} mimeType The MIME type of the content.
 */
function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Converts an array of objects to a CSV string.
 * Handles basic quoting for commas and newlines.
 * @param {Array<Object>} data Array of data objects.
 * @param {Array<string>} headers Array of header strings (keys).
 * @param {Array<string>} headerTitles Array of display titles for headers.
 * @returns {string} CSV formatted string.
 */
function arrayToCsv(data, headers, headerTitles) {
  const escapeCsvCell = (cellData) => {
    const stringData = cellData === null || cellData === undefined ? '' : String(cellData);
    // Quote if it contains comma, quote, or newline
    if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
      return `"${stringData.replace(/"/g, '""')}"`; // Escape quotes by doubling them
    }
    return stringData;
  };

  const csvRows = [];
  // Add header row
  csvRows.push(headerTitles.map(escapeCsvCell).join(','));

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => escapeCsvCell(row[header]));
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

// --- Export Functions ---

/**
 * Exports data to a CSV file.
 * @param {Array<Object>} data The data array.
 * @param {Array<string>} headers The object keys to include.
 * @param {Array<string>} headerTitles The display titles for columns.
 * @param {string} filename The desired filename (e.g., 'equipements.csv').
 */
export function exportToCsv(data, headers, headerTitles, filename) {
  if (!data || data.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }
  try {
    const csvContent = arrayToCsv(data, headers, headerTitles);
    // Add BOM for Excel compatibility with UTF-8 special characters
    const bom = '\uFEFF';
    triggerDownload(bom + csvContent, filename, 'text/csv;charset=utf-8;');
  } catch (error) {
     console.error("Erreur lors de la génération CSV:", error);
     alert("Une erreur est survenue lors de la génération du fichier CSV.");
  }
}

/**
 * Exports data to an XLSX (Excel) file.
 * @param {Array<Object>} data The data array.
 * @param {Array<string>} headers The object keys to include.
 * @param {Array<string>} headerTitles The display titles for columns.
 * @param {string} filename The desired filename (e.g., 'hotels.xlsx').
 * @param {string} sheetName The name for the Excel sheet.
 */
export function exportToXlsx(data, headers, headerTitles, filename, sheetName = 'Données') {
  if (!data || data.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }
  try {
    // Map data to match header order and titles
    const mappedData = data.map(row => {
      const newRow = {};
      headers.forEach((header, index) => {
        newRow[headerTitles[index]] = row[header] ?? ''; // Use display title as key, handle null/undefined
      });
      return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(mappedData, { header: headerTitles }); // Use headerTitles directly
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error("Erreur lors de la génération XLSX:", error);
    alert("Une erreur est survenue lors de la génération du fichier Excel.");
  }
}

/**
 * Exports data to a PDF file using jspdf and jspdf-autotable.
 * @param {Array<Object>} data The data array.
 * @param {Array<string>} headers The object keys to include.
 * @param {Array<string>} headerTitles The display titles for columns.
 * @param {string} filename The desired filename (e.g., 'lignes_bus.pdf').
 * @param {string} title The title to display at the top of the PDF.
 */
export function exportToPdf(data, headers, headerTitles, filename, title) {
  if (!data || data.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }
  try {
    const doc = new jsPDF({
        orientation: 'landscape', // Use landscape for potentially wide tables
    });

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15); // Adjust position as needed

    // Prepare data for autoTable
    const tableData = data.map(row => headers.map(header => row[header] ?? '')); // Get values in header order

    autoTable(doc, { // Call autoTable as a function, passing 'doc'
      startY: 22, // Position below the title
      head: [headerTitles], // Header row expects an array of arrays
      body: tableData,
      theme: 'grid', // Options: 'striped', 'grid', 'plain'
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak', // Handle long text
      },
      headStyles: {
        fillColor: [62, 140, 170], // Primary color approx.
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: { // Optional: Adjust column widths if needed
          // 0: { cellWidth: 30 }, // Example: Set width for the first column
      }
      // didDrawPage: function (data) { // Optional: Add page numbers or other footers
      //   doc.setFontSize(10);
      //   doc.text('Page ' + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
      // }
    });

    doc.save(filename);
  } catch (error) {
    console.error("Erreur lors de la génération PDF:", error);
    alert(`Une erreur est survenue lors de la génération du fichier PDF: ${error.message}`);
  }
}
