
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Template, Placeholder } from '../types';
import { MOCK_TEMPLATES, DEFAULT_PLACEHOLDERS } from '../constants';

interface TemplatesContextType {
  templates: Template[];
  getTemplateById: (id: string) => Template | undefined;
  addTemplate: (templateData: Omit<Template, 'id' | 'uploadDate' | 'placeholders'>, file: File) => Promise<Template>;
  updateTemplate: (id: string, updates: Partial<Template>) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [isLoading, setIsLoading] = useState(false);

  const getTemplateById = useCallback((id: string) => {
    return templates.find(t => t.id === id);
  }, [templates]);

  const addTemplate = useCallback(async (templateData: Omit<Template, 'id' | 'uploadDate' | 'placeholders'>, file: File): Promise<Template> => {
    setIsLoading(true);
    // Simulate API call and placeholder extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock placeholder extraction based on file name or use default
        let detectedPlaceholders: Placeholder[] = [...DEFAULT_PLACEHOLDERS];
        const knownTemplate = MOCK_TEMPLATES.find(t => t.fileName.toLowerCase() === file.name.toLowerCase());
        if (knownTemplate) {
            detectedPlaceholders = knownTemplate.placeholders;
        }

        const newTemplate: Template = {
          ...templateData,
          id: `template-${Date.now()}`,
          uploadDate: new Date().toISOString(),
          fileName: file.name,
          placeholders: detectedPlaceholders 
        };
        setTemplates(prev => [newTemplate, ...prev]);
        setIsLoading(false);
        resolve(newTemplate);
      }, 1500);
    });
  }, []);

  const updateTemplate = useCallback(async (id: string, updates: Partial<Template>): Promise<Template> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates, version: updates.version || t.version } : t));
        const updatedTemplate = templates.find(t => t.id === id);
        setIsLoading(false);
        if (updatedTemplate) resolve({ ...updatedTemplate, ...updates }); // ensure returning the fully updated object
        else reject(new Error("Template not found for update"));
      }, 1000);
    });
  }, [templates]);

  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  }, []);

  return (
    <TemplatesContext.Provider value={{ templates, getTemplateById, addTemplate, updateTemplate, deleteTemplate, isLoading }}>
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = (): TemplatesContextType => {
  const context = useContext(TemplatesContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};
