
import React, { useState } from 'react';
import { Template, DataRow } from '../../types';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface BulkUploadFormProps {
  template: Template;
  onSubmit: (dataRows: DataRow[]) => void; // Simulate parsed data
  isLoading?: boolean;
}

const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ template, onSubmit, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv') || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    } else {
      setError('Invalid file type. Please upload a CSV or XLSX file.');
      setFile(null);
      setFileName(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError('Please select a data file to upload.');
      return;
    }

    // Simulate parsing the file and creating DataRow[]
    // In a real app, this would involve a library like PapaParse (CSV) or SheetJS (XLSX)
    // and validation against template placeholders.
    const mockDataRows: DataRow[] = [];
    const numRowsToSimulate = Math.floor(Math.random() * 20) + 5; // Simulate 5-24 rows
    
    for (let i = 0; i < numRowsToSimulate; i++) {
      const row: DataRow = {};
      template.placeholders.forEach(p => {
        // Generate some mock data based on placeholder type
        if (p.type === 'date') {
          row[p.key] = new Date(Date.now() - Math.random() * 1e10).toISOString().split('T')[0];
        } else if (p.type === 'number') {
          row[p.key] = Math.floor(Math.random() * 10000);
        } else {
          row[p.key] = `${p.label} Value ${i + 1}`;
        }
      });
      mockDataRows.push(row);
    }
    
    console.log(`Simulated parsing of ${file.name}. Generated ${mockDataRows.length} data rows.`);
    onSubmit(mockDataRows);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-1">Bulk Upload Data for "{template.name}"</h3>
      <p className="text-sm text-gray-600 mb-4">
        Upload a CSV or XLSX file. Each row should correspond to a document to be generated.
        The columns should match the placeholders in the selected template:
      </p>
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm font-medium text-gray-700">Expected Placeholders (columns):</p>
        <div className="flex flex-wrap gap-2 mt-2">
            {template.placeholders.map(p => (
                <span key={p.key} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{p.label} (<code className="text-xs">{p.key}</code>)</span>
            ))}
        </div>
         {template.placeholders.length === 0 && <p className="text-xs text-gray-500">No placeholders defined for this template.</p>}
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
      
      <FileUpload
        onFileSelect={handleFileSelect}
        acceptedFileTypes=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx"
        label={fileName ? `Selected: ${fileName}` : "Drag & drop CSV/XLSX or click to select"}
      />
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={!file || template.placeholders.length === 0}>
          Start Bulk Generation
        </Button>
      </div>
       <p className="mt-4 text-xs text-gray-500">
        File parsing and data mapping are simulated. In a real system, the uploaded file would be processed on the backend, data validated, and documents generated for each row.
      </p>
    </form>
  );
};

export default BulkUploadForm;
