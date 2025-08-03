
import React from 'react';
import { Template } from '../../types';
import { DocumentTextIcon, TagIcon, EyeIcon, PencilIcon, TrashIcon, CollectionIcon } from '../ui/Icons';
import Button from '../ui/Button';

interface TemplateCardProps {
  template: Template;
  onViewDetails: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onViewDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-sky-700 truncate" title={template.name}>
                {template.name}
            </h3>
            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
                v{template.version}
            </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden">{template.description || 'No description available.'}</p>
        
        <div className="mb-4 space-y-2 text-xs text-gray-500">
            <div className="flex items-center">
                <CollectionIcon className="w-4 h-4 mr-2 text-gray-400" />
                Category: <span className="font-medium text-gray-700 ml-1">{template.category}</span>
            </div>
            <div className="flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-400" />
                File: <span className="font-medium text-gray-700 ml-1 truncate" title={template.fileName}>{template.fileName}</span>
            </div>
             <div className="flex items-center">
                <TagIcon className="w-4 h-4 mr-2 text-gray-400" />
                Placeholders: <span className="font-medium text-gray-700 ml-1">{template.placeholders.length}</span>
            </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(template)} leftIcon={<EyeIcon className="w-4 h-4" />}>
            Details
          </Button>
          {/* <Button variant="secondary" size="sm" onClick={() => onEdit(template)} leftIcon={<PencilIcon className="w-4 h-4" />}>
            Edit
          </Button> */}
          <Button variant="danger" size="sm" onClick={() => onDelete(template)} leftIcon={<TrashIcon className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
