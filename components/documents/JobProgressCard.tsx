
import React from 'react';
import { GenerationJob, JobStatus } from '../../types';
import { CheckCircleIcon, ExclamationCircleIcon, CogIcon, DocumentDuplicateIcon, DownloadIcon } from '../ui/Icons';
import Button from '../ui/Button';

interface JobProgressCardProps {
  job: GenerationJob;
  onViewDocuments?: (jobId: string) => void;
}

const JobProgressCard: React.FC<JobProgressCardProps> = ({ job, onViewDocuments }) => {
  const getStatusColor = () => {
    switch (job.status) {
      case JobStatus.COMPLETED: return 'bg-green-500';
      case JobStatus.PROCESSING: return 'bg-sky-500';
      case JobStatus.PENDING: return 'bg-yellow-500';
      case JobStatus.FAILED: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (job.status) {
      case JobStatus.COMPLETED: return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case JobStatus.PROCESSING: return <CogIcon className="w-5 h-5 text-sky-600 animate-spin" />;
      case JobStatus.PENDING: return <CogIcon className="w-5 h-5 text-yellow-600" />;
      case JobStatus.FAILED: return <ExclamationCircleIcon className="w-5 h-5 text-red-600" />;
      default: return <CogIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div id={`job-${job.id}`} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-sky-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate" title={job.templateName}>
          Job for: {job.templateName}
        </h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor()}`}>
          {job.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-1">
        {getStatusIcon()}
        <span className="ml-2">Status: {job.status}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">Job ID: {job.id} | Items: {job.itemCount}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full ${getStatusColor()} transition-all duration-500 ease-out`}
          style={{ width: `${job.progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-right text-gray-500 mb-4">{job.progress}% complete</p>

      {job.status === JobStatus.FAILED && job.errorMessage && (
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-md mb-3">Error: {job.errorMessage}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
        {job.status === JobStatus.COMPLETED && onViewDocuments && (
          <Button size="sm" variant="outline" onClick={() => onViewDocuments(job.id)} leftIcon={<DocumentDuplicateIcon className="w-4 h-4"/>}>
            View {job.itemCount} Doc(s)
          </Button>
        )}
         {job.status === JobStatus.COMPLETED && job.itemCount > 1 && (
             <Button size="sm" variant="primary" onClick={() => alert(`Simulating download of ZIP for job ${job.id}`)} leftIcon={<DownloadIcon className="w-4 h-4"/>}>
                Download All (.zip)
            </Button>
         )}
      </div>
    </div>
  );
};

export default JobProgressCard;
