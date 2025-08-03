
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from './Icons';
import { BreadcrumbItem } from '../../types';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, actions }) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 text-sm text-gray-500 flex items-center" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRightIcon className="h-4 w-4 mx-1 text-gray-400" />}
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-sky-600 hover:underline">
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-700">{crumb.name}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">{title}</h2>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
