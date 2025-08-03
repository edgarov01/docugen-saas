
import React from 'react';
import { Template, Placeholder } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { TagIcon } from '../ui/Icons';

interface TemplateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
}

const PlaceholderDisplay: React.FC<{ placeholder: Placeholder }> = ({ placeholder }) => (
  <div className="flex items-center space-x-2 bg-slate-100 p-2 rounded">
    <TagIcon className="w-4 h-4 text-slate-500" />
    <code className="text-sm text-indigo-600 bg-indigo-50 px-1 rounded">{placeholder.key}</code>
    <span className="text-sm text-gray-600">({placeholder.label}, type: {placeholder.type})</span>
  </div>
);

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({ isOpen, onClose, template }) => {
  if (!template) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Details for "${template.name}"`} size="lg">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Description</h4>
          <p className="text-gray-800">{template.description || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Category</h4>
          <p className="text-gray-800">{template.category}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Version</h4>
          <p className="text-gray-800">{template.version}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Original File Name</h4>
          <p className="text-gray-800">{template.fileName}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Upload Date</h4>
          <p className="text-gray-800">{new Date(template.uploadDate).toLocaleDateString()}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Recognized Placeholders ({template.placeholders.length})</h4>
          {template.placeholders.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto p-1">
              {template.placeholders.map(p => <PlaceholderDisplay key={p.key} placeholder={p} />)}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No placeholders recognized for this template.</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Placeholder recognition is simulated. The system would typically parse the .docx file content to identify patterns like <code className="bg-gray-200 px-1 rounded">{"{variable}"}</code>, <code className="bg-gray-200 px-1 rounded">{'[VARIABLE]'}</code>, or <code className="bg-gray-200 px-1 rounded">{'_VARIABLE_'}</code>.
          </p>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-500">
        <p><strong>Note:</strong> In a real system, .docx files would be processed on the backend (e.g., using Cloud Functions with libraries like python-docx or docxtemplater) to accurately extract placeholders.</p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="primary">Close</Button>
      </div>
    </Modal>
  );
};

export default TemplateDetailsModal;
