
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTemplates } from '../../hooks/useTemplates';
import { useGeneration } from '../../hooks/useGeneration';
import PageHeader from '../ui/PageHeader';
import { CollectionIcon, DocumentTextIcon, CogIcon, UserCircleIcon } from '../ui/Icons';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; linkTo?: string; linkText?: string; bgColor?: string }> = ({ title, value, icon, linkTo, linkText, bgColor = 'bg-white' }) => (
  <div className={`${bgColor} shadow-lg rounded-xl p-6 flex flex-col justify-between`}>
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-sky-100 rounded-full text-sky-600">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>
    </div>
    {linkTo && linkText && (
      <Link to={linkTo} className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-800">
        {linkText} &rarr;
      </Link>
    )}
  </div>
);


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { templates } = useTemplates();
  const { jobs, generatedDocuments } = useGeneration();

  const activeJobs = jobs.filter(job => job.status === 'Processing' || job.status === 'Pending').length;

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.email?.split('@')[0] || 'User'}!`} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Total Templates" 
          value={templates.length} 
          icon={<CollectionIcon className="w-6 h-6" />}
          linkTo="/templates"
          linkText="Manage Templates"
        />
        <StatCard 
          title="Documents Generated" 
          value={generatedDocuments.length} 
          icon={<DocumentTextIcon className="w-6 h-6" />}
          linkTo="/documents"
          linkText="View Documents"
        />
        <StatCard 
          title="Active Generation Jobs" 
          value={activeJobs} 
          icon={<CogIcon className="w-6 h-6" />}
          linkTo="/documents#jobs"
          linkText="View Jobs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/templates" className="block w-full text-left px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition-colors duration-200">
              Upload New Template
            </Link>
            <Link to="/generate" className="block w-full text-left px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200">
              Generate Single Document
            </Link>
             <Link to="/generate?mode=bulk" className="block w-full text-left px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors duration-200">
              Start Bulk Generation
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity (Simulated)</h3>
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {jobs.slice(0, 3).map(job => (
                 <li key={job.id} className="p-3 bg-gray-50 rounded-md text-sm">
                    Generation job <span className="font-semibold text-sky-600">#{job.id.substring(0,6)}</span> for template <span className="font-medium">"{job.templateName}"</span> is <span className={`font-semibold ${job.status === 'Completed' ? 'text-green-600' : job.status === 'Failed' ? 'text-red-600' : 'text-yellow-600'}`}>{job.status.toLowerCase()}</span>.
                 </li>
            ))}
            {generatedDocuments.slice(0,2).map(doc => (
                 <li key={doc.id} className="p-3 bg-gray-50 rounded-md text-sm">
                    Document <span className="font-semibold text-sky-600">"{doc.fileName}"</span> was successfully generated.
                 </li>
            ))}
            {jobs.length === 0 && generatedDocuments.length === 0 && (
                <li className="p-3 bg-gray-50 rounded-md text-sm text-gray-500">No recent activity.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
