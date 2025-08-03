
import React, { useState, useMemo } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import TemplateCard from './TemplateCard';
import TemplateUploadForm from './TemplateUploadForm';
import TemplateDetailsModal from './TemplateDetailsModal';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import { PlusCircleIcon, CollectionIcon } from '../ui/Icons';
import { Template } from '../../types';
import { TEMPLATE_CATEGORIES } from '../../constants';

const TemplateManagementPage: React.FC = () => {
  const { templates, deleteTemplate, isLoading: templatesLoading } = useTemplates();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);


  const handleViewDetails = (template: Template) => {
    setSelectedTemplate(template);
    setIsDetailsModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    // For now, re-uses upload modal or a new edit modal could be built
    alert(`Editing template: ${template.name} (Edit functionality not fully implemented in this mock)`);
    // setSelectedTemplate(template);
    // setIsUploadModalOpen(true); // Or an edit modal
  };

  const handleDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteTemplate = async () => {
    if (selectedTemplate) {
      try {
        await deleteTemplate(selectedTemplate.id);
        setFeedbackMessage({type: 'success', message: `Template "${selectedTemplate.name}" deleted successfully.`});
      } catch (error) {
         setFeedbackMessage({type: 'error', message: `Failed to delete template "${selectedTemplate.name}".`});
      } finally {
        setIsDeleteConfirmModalOpen(false);
        setSelectedTemplate(null);
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    }
  };
  
  const handleUploadSuccess = (template: Template) => {
    setIsUploadModalOpen(false);
    setFeedbackMessage({type: 'success', message: `Template "${template.name}" uploaded successfully.`});
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearchTerm = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  return (
    <div>
      <PageHeader
        title="Template Management"
        breadcrumbs={[{ name: 'Dashboard', path: '/' }, { name: 'Templates' }]}
        actions={
          <Button onClick={() => setIsUploadModalOpen(true)} leftIcon={<PlusCircleIcon className="w-5 h-5" />}>
            Upload New Template
          </Button>
        }
      />

      {feedbackMessage && <Alert type={feedbackMessage.type} message={feedbackMessage.message} className="mb-4" />}

      <div className="mb-6 p-4 bg-white shadow rounded-lg flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {TEMPLATE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {templatesLoading && <p className="text-center text-gray-500 py-4">Loading templates...</p>}
      {!templatesLoading && filteredTemplates.length === 0 && (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <CollectionIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No Templates Found</h3>
          <p className="text-gray-500 mt-1">
            {templates.length > 0 ? "Try adjusting your search or filter criteria." : "Get started by uploading your first template."}
          </p>
           {templates.length === 0 && (
             <Button onClick={() => setIsUploadModalOpen(true)} leftIcon={<PlusCircleIcon className="w-5 h-5" />} className="mt-4">
                Upload Template
            </Button>
           )}
        </div>
      )}

      {!templatesLoading && filteredTemplates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onViewDetails={handleViewDetails}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title={selectedTemplate ? "Edit Template" : "Upload New Template"} size="xl">
        <TemplateUploadForm
          onUploadSuccess={handleUploadSuccess}
          onCancel={() => { setIsUploadModalOpen(false); setSelectedTemplate(null); }}
          // Pass selectedTemplate if implementing edit
        />
      </Modal>

      <TemplateDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        template={selectedTemplate}
      />

      <Modal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteConfirmModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDeleteTemplate} isLoading={templatesLoading}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete the template "{selectedTemplate?.name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default TemplateManagementPage;
