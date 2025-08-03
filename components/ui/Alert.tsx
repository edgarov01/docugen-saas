
import React from 'react';
import { InformationCircleIcon, CheckCircleIcon, ExclamationCircleIcon } from './Icons';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, className = '' }) => {
  const typeConfig = {
    info: {
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-400',
      textColor: 'text-sky-700',
      icon: <InformationCircleIcon className="h-5 w-5 text-sky-400" />,
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-400" />,
    },
  };

  const config = typeConfig[type];

  return (
    <div className={`p-4 border-l-4 rounded-md ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${config.textColor}`}>{title}</h3>}
          <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
