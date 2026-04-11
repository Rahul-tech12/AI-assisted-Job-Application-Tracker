// CSV Export Utility
export const exportToCSV = (applications: any[], filename: string = "job_applications.csv") => {
  const headers = ["Company", "Position", "Status", "Date Applied", "Skills", "Notes"];
  
  const rows = applications.map(app => [
    app.company || "",
    app.role || "",
    app.status || "",
    app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : "",
    app.skills ? app.skills.join("; ") : "",
    app.notes || ""
  ]);

  // Create CSV content
  let csvContent = headers.join(",") + "\n";
  rows.forEach(row => {
    // Escape quotes and wrap fields with commas
    const escapedRow = row.map(cell => {
      const cellStr = String(cell);
      if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    });
    csvContent += escapedRow.join(",") + "\n";
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
