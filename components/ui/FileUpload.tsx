
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string; // e.g., ".docx,.dotx,.csv"
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, acceptedFileTypes, label = "Drag and drop a file here, or click to select" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      onFileSelect(file);
      setFileName(file.name);
    }
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${dragActive ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-gray-400"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleChange}
      />
      <UploadIcon className={`w-12 h-12 mx-auto mb-3 ${dragActive ? "text-sky-600" : "text-gray-400"}`} />
      <p className={`text-sm ${dragActive ? "text-sky-700" : "text-gray-600"}`}>{label}</p>
      {fileName && <p className="mt-2 text-xs text-gray-500">Selected file: {fileName}</p>}
      {acceptedFileTypes && <p className="mt-1 text-xs text-gray-400">Accepted types: {acceptedFileTypes}</p>}
    </div>
  );
};

export default FileUpload;
