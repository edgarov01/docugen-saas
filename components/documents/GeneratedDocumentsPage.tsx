
import React, { useState, useMemo, useEffect } from 'react';
import { useGeneration } from '../../hooks/useGeneration';
import PageHeader from '../ui/PageHeader';
import GeneratedDocumentRow from './GeneratedDocumentRow';
import JobProgressCard from './JobProgressCard';
import Tabs from '../ui/Tabs';
import { DocumentTextIcon, CogIcon } from '../ui/Icons';
import { useLocation, useNavigate } from 'react-router-dom';

const GeneratedDocumentsPage: React.FC = () => {
  const { jobs, generatedDocuments, isLoading } = useGeneration();
  const location = useLocation();
  const navigate = useNavigate();

  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  
  const initialTab = location.hash === '#jobs' ? 1 : 0;
  
  useEffect(() => {
    if (location.hash && location.hash.startsWith('#job-')) {
        const element = document.getElementById(location.hash.substring(1)); // Remove #
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
             element.classList.add('ring-2', 'ring-sky-500', 'ring-offset-2', 'transition-all', 'duration-300');
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-sky-500', 'ring-offset-2');
            }, 2000);
        }
    }
  }, [location.hash, jobs]); // Re-run if jobs list changes, as new jobs might get added

  const filteredDocuments = useMemo(() => {
    return generatedDocuments
      .filter(doc => 
        doc.fileName.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
        doc.templateName.toLowerCase().includes(docSearchTerm.toLowerCase())
      )
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [generatedDocuments, docSearchTerm]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => 
        job.templateName.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(jobSearchTerm.toLowerCase())
      )
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs, jobSearchTerm]);

  const handleViewJobDocuments = (jobId: string) => {
    setDocSearchTerm(jobId); // This is a bit of a hack, assumes job ID might be in filename or we filter differently
    // Or navigate to a specific view if we had one: navigate(`/documents?jobFilter=${jobId}`);
    // For now, just set the search term to filter the main document list or switch tab
    navigate("#documents"); // Switch to documents tab
    alert(`Filtering documents for Job ID: ${jobId} (Simulated - set search term if applicable)`);
  };

  const tabs = [
    {
      label: 'Generated Documents',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      content: (
        <div className="bg-white shadow-xl rounded-lg">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search documents by name or template..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              value={docSearchTerm}
              onChange={(e) => setDocSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <p className="p-4 text-center text-gray-500">Loading documents...</p>}
          {!isLoading && filteredDocuments.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              {generatedDocuments.length > 0 ? "No documents match your search." : "No documents have been generated yet."}
            </p>
          )}
          {!isLoading && filteredDocuments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated Date</th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map(doc => <GeneratedDocumentRow key={doc.id} doc={doc} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Generation Jobs',
      icon: <CogIcon className="w-5 h-5" />,
      content: (
        <div>
           <div className="p-4 border-b bg-white shadow-lg rounded-t-lg mb-6">
            <input
              type="text"
              placeholder="Search jobs by template name or ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              value={jobSearchTerm}
              onChange={(e) => setJobSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <p className="text-center text-gray-500 py-4">Loading jobs...</p>}
          {!isLoading && filteredJobs.length === 0 && (
            <p className="text-center text-gray-500 py-6 bg-white shadow rounded-lg">
               {jobs.length > 0 ? "No jobs match your search." : "No generation jobs have been started yet."}
            </p>
          )}
          {!isLoading && filteredJobs.length > 0 && (
            <div className="space-y-6">
              {filteredJobs.map(job => (
                <JobProgressCard key={job.id} job={job} onViewDocuments={() => handleViewJobDocuments(job.id)} />
              ))}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="My Documents & Jobs"
        breadcrumbs={[{ name: 'Dashboard', path: '/' }, { name: 'My Documents & Jobs' }]}
      />
      <Tabs tabs={tabs} initialTab={initialTab} />
    </div>
  );
};

export default GeneratedDocumentsPage;
