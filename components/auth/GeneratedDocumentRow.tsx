
import React from 'react';
import { GeneratedDocument } from '../../types';
import { DocumentTextIcon, DownloadIcon } from '../ui/Icons';
import Button from '../ui/Button';

interface GeneratedDocumentRowProps {
  doc: GeneratedDocument;
}

const GeneratedDocumentRow: React.FC<GeneratedDocumentRowProps> = ({ doc }) => {
  const handleDownload = () => {
    // In a real app, this would initiate a download from doc.downloadUrl
    // For this mock, we can just log or alert
    alert(`Simulating download of ${doc.fileName} from ${doc.downloadUrl}`);
    // window.open(doc.downloadUrl, '_blank'); // This would work if URL was real
  };

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center">
          <DocumentTextIcon className="w-5 h-5 text-sky-600 mr-2" />
          {doc.fileName}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.templateName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.jobId ? `Bulk Job (${doc.jobId.substring(0,6)}...)` : 'Single'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button size="sm" variant="primary" onClick={handleDownload} leftIcon={<DownloadIcon className="w-4 h-4"/>}>
          Download
        </Button>
      </td>
    </tr>
  );
};

export default GeneratedDocumentRow;
