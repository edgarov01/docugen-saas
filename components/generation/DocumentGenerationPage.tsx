
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTemplates } from '../../hooks/useTemplates';
import { useGeneration } from '../../hooks/useGeneration';
import { Template, DataRow, GenerationJob } from '../../types';
import DynamicForm from './DynamicForm';
import BulkUploadForm from './BulkUploadForm';
import PageHeader from '../ui/PageHeader';
import Tabs from '../ui/Tabs';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { DocumentDuplicateIcon, DocumentTextIcon, CollectionIcon } from '../ui/Icons';

type GenerationMode = 'single' | 'bulk';

const DocumentGenerationPage: React.FC = () => {
  const { templates, isLoading: templatesLoading } = useTemplates();
  const { createSingleDocumentJob, createBulkDocumentJob, isLoading: generationLoading } = useGeneration();
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>((queryParams.get('mode') as GenerationMode) || 'single');
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error', message: string, job?: GenerationJob} | null>(null);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  useEffect(() => {
    // If templates load and none is selected, select the first one if available
    if (!templatesLoading && templates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [templates, templatesLoading, selectedTemplateId]);
  
  useEffect(() => {
    const modeFromQuery = queryParams.get('mode') as GenerationMode;
    if (modeFromQuery && (modeFromQuery === 'single' || modeFromQuery === 'bulk')) {
      setGenerationMode(modeFromQuery);
    }
  }, [location.search]);


  const handleSingleSubmit = async (data: DataRow) => {
    if (!selectedTemplate) return;
    setFeedbackMessage(null);
    try {
      const job = await createSingleDocumentJob(selectedTemplate, data);
      setFeedbackMessage({type: 'success', message: `Document based on "${selectedTemplate.name}" generated successfully!`, job});
      // Potentially clear form or redirect
    } catch (err: any) {
      setFeedbackMessage({type: 'error', message: err.message || 'Failed to generate document.'});
    }
  };

  const handleBulkSubmit = async (dataRows: DataRow[]) => {
    if (!selectedTemplate) return;
    setFeedbackMessage(null);
    try {
      const job = await createBulkDocumentJob(selectedTemplate, dataRows);
      setFeedbackMessage({type: 'success', message: `Bulk generation job for "${selectedTemplate.name}" (${dataRows.length} documents) started successfully!`, job});
      // Potentially clear form or redirect
    } catch (err: any) {
      setFeedbackMessage({type: 'error', message: err.message || 'Failed to start bulk generation.'});
    }
  };

  const PlaceholderSelectionPrompt: React.FC = () => (
    <div className="text-center py-10 bg-white shadow rounded-lg">
      <CollectionIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">No Template Selected or Available</h3>
      <p className="text-gray-500 mt-1">
        {templatesLoading ? "Loading templates..." : "Please select a template from the dropdown above, or upload one if none exist."}
      </p>
      {!templatesLoading && templates.length === 0 && (
          <Button onClick={() => navigate('/templates')} className="mt-4">Manage Templates</Button>
      )}
    </div>
  );

  const tabs = [
    { label: 'Single Document', icon: <DocumentTextIcon className="w-5 h-5"/>, content: (
        selectedTemplate ? (
          <DynamicForm template={selectedTemplate} onSubmit={handleSingleSubmit} isLoading={generationLoading} />
        ) : <PlaceholderSelectionPrompt />
      )
    },
    { label: 'Bulk Generation', icon: <DocumentDuplicateIcon className="w-5 h-5"/>, content: (
        selectedTemplate ? (
          <BulkUploadForm template={selectedTemplate} onSubmit={handleBulkSubmit} isLoading={generationLoading} />
        ) : <PlaceholderSelectionPrompt />
      )
    },
  ];
  
  const activeTabIndex = generationMode === 'bulk' ? 1 : 0;

  return (
    <div>
      <PageHeader
        title="Generate Documents"
        breadcrumbs={[{ name: 'Dashboard', path: '/' }, { name: 'Generate Documents' }]}
      />

      {feedbackMessage && (
        <div className="mb-4">
        <Alert type={feedbackMessage.type} message={feedbackMessage.message} />
        {feedbackMessage.job && (
            <div className="mt-2 text-right">
                <Button variant="outline" size="sm" onClick={() => navigate(`/documents#job-${feedbackMessage.job?.id}`)}>
                    View Job Status
                </Button>
            </div>
        )}
        </div>
      )}

      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <label htmlFor="templateSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Select Template
        </label>
        {templatesLoading ? <p>Loading templates...</p> : 
          templates.length > 0 ? (
          <select
            id="templateSelect"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
            disabled={templatesLoading || templates.length === 0}
          >
            <option value="" disabled>{templates.length === 0 ? "No templates available" : "Select a template"}</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>)}
          </select>
        ) : (
             <Alert type="info" title="No Templates Available" message="Please upload a template in the 'Templates' section before generating documents." />
        )}
      </div>
      
      {templates.length > 0 && (
         <Tabs 
            tabs={tabs} 
            initialTab={activeTabIndex} 
        />
      )}
      {!templatesLoading && templates.length === 0 && !selectedTemplateId && (
          <PlaceholderSelectionPrompt />
      )}
    </div>
  );
};

export default DocumentGenerationPage;
