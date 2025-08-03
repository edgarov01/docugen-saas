
import React, { useState, useEffect } from 'react';
import { Template, Placeholder, DataRow } from '../../types';
import Button from '../ui/Button';

interface DynamicFormProps {
  template: Template;
  onSubmit: (data: DataRow) => void;
  isLoading?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ template, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<DataRow>({});

  useEffect(() => {
    // Initialize form data with empty strings for each placeholder
    const initialData: DataRow = {};
    template.placeholders.forEach(p => {
      initialData[p.key] = '';
    });
    setFormData(initialData);
  }, [template]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!template || template.placeholders.length === 0) {
    return <p className="text-gray-500">This template has no configurable placeholders.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Fill in data for "{template.name}"</h3>
      {template.placeholders.map((placeholder: Placeholder) => (
        <div key={placeholder.key}>
          <label htmlFor={placeholder.key} className="block text-sm font-medium text-gray-700 mb-1">
            {placeholder.label} (<code className="text-xs bg-gray-100 p-0.5 rounded">{placeholder.key}</code>)
          </label>
          <input
            type={placeholder.type === 'number' ? 'number' : placeholder.type === 'date' ? 'date' : 'text'}
            id={placeholder.key}
            value={formData[placeholder.key] as string || ''}
            onChange={(e) => handleChange(placeholder.key, e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      ))}
      <div className="pt-4 flex justify-end">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Generate Document
        </Button>
      </div>
       <p className="mt-4 text-xs text-gray-500">
        This form is dynamically generated based on the placeholders recognized in the selected template (<span className="font-semibold">{template.name}</span>).
        The actual document generation with this data is simulated.
      </p>
    </form>
  );
};

export default DynamicForm;
