
import React, { useState } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { TEMPLATE_CATEGORIES } from '../../constants';
import { Template } from '../../types';

interface TemplateUploadFormProps {
  onUploadSuccess: (template: Template) => void;
  onCancel: () => void;
}

const TemplateUploadForm: React.FC<TemplateUploadFormProps> = ({ onUploadSuccess, onCancel }) => {
  const { addTemplate, isLoading } = useTemplates();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(TEMPLATE_CATEGORIES[0]);
  const [version, setVersion] = useState('1.0');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError('Please select a template file to upload.');
      return;
    }
    if (!templateName.trim()) {
      setError('Please provide a name for the template.');
      return;
    }

    try {
      const newTemplate = await addTemplate({ name: templateName, description, category, version, fileName: file.name }, file);
      onUploadSuccess(newTemplate);
    } catch (err: any) {
      setError(err.message || 'Failed to upload template.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} />}
      <div>
        <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
        <input
          type="text"
          id="templateName"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
          >
            {TEMPLATE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">Version</label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="e.g., 1.0, 2.1b"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Template File (.docx, .dotx)</label>
        <FileUpload
          onFileSelect={(selectedFile) => setFile(selectedFile)}
          acceptedFileTypes=".docx,.dotx"
        />
         <p className="mt-1 text-xs text-gray-500">
           Note: Placeholder recognition is simulated. For known templates (e.g., 'nda_v1.2.docx'), specific placeholders are used. Otherwise, default placeholders are assigned.
         </p>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Upload Template
        </Button>
      </div>
    </form>
  );
};

export default TemplateUploadForm;
