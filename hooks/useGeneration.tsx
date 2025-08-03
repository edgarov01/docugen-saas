
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { GenerationJob, GeneratedDocument, JobStatus, Template, DataRow } from '../types';

interface GenerationContextType {
  jobs: GenerationJob[];
  generatedDocuments: GeneratedDocument[];
  createSingleDocumentJob: (template: Template, data: DataRow) => Promise<GenerationJob>;
  createBulkDocumentJob: (template: Template, dataRows: DataRow[]) => Promise<GenerationJob>;
  isLoading: boolean;
  getJobById: (id: string) => GenerationJob | undefined;
  getDocumentsByJobId: (jobId: string) => GeneratedDocument[];
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export const GenerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate job processing
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.status === JobStatus.PROCESSING && job.progress < 100) {
            const newProgress = Math.min(100, job.progress + Math.floor(Math.random() * 20) + 10);
            if (newProgress === 100) {
              // Simulate document creation on completion
              const newDocs: GeneratedDocument[] = [];
              if (job.generatedDocumentIds) { // Already has some docs from initial creation
                 job.generatedDocumentIds.forEach(docId => {
                    const existingDoc = generatedDocuments.find(d => d.id === docId);
                    if(existingDoc) newDocs.push(existingDoc);
                 });
              } else { // Create new docs for this job
                const createdDocIds : string[] = [];
                for (let i = 0; i < job.itemCount; i++) {
                    const docId = `doc-${Date.now()}-${job.id}-${i}`;
                    createdDocIds.push(docId);
                    newDocs.push({
                    id: docId,
                    jobId: job.id,
                    templateName: job.templateName,
                    fileName: `${job.templateName.replace(/\s+/g, '_')}_Item${i+1}_${new Date().toISOString().split('T')[0]}.docx`,
                    createdAt: new Date().toISOString(),
                    downloadUrl: `/mock-download/${docId}.docx`, // Mock URL
                    });
                }
                job.generatedDocumentIds = createdDocIds;
              }

              setGeneratedDocuments(prevDocs => [...prevDocs, ...newDocs.filter(nd => !prevDocs.find(pd => pd.id === nd.id))]); // Add only new ones
              return { ...job, progress: 100, status: JobStatus.COMPLETED };
            }
            return { ...job, progress: newProgress };
          }
          return job;
        })
      );
    }, 2000); // Update progress every 2 seconds

    return () => clearInterval(interval);
  }, [generatedDocuments]); // Added generatedDocuments to dependency array to avoid stale closures if it's modified outside

  const createJob = useCallback(async (template: Template, itemCount: number, isBulk: boolean): Promise<GenerationJob> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newJob: GenerationJob = {
          id: `job-${Date.now()}`,
          templateId: template.id,
          templateName: template.name,
          status: JobStatus.PENDING,
          progress: 0,
          createdAt: new Date().toISOString(),
          itemCount: itemCount,
        };
        
        // Simulate immediate start for some jobs
        if (Math.random() > 0.3) {
            newJob.status = JobStatus.PROCESSING;
        }

        setJobs(prev => [newJob, ...prev]);
        setIsLoading(false);
        resolve(newJob);
      }, 500 + Math.random() * 1000); // Simulate network delay
    });
  }, []);

  const createSingleDocumentJob = useCallback(async (template: Template, data: DataRow): Promise<GenerationJob> => {
    const job = await createJob(template, 1, false);
    // Simulate immediate document generation for single item for simplicity of demo
    // In reality, this might also go through a PENDING -> PROCESSING -> COMPLETED flow
    const docId = `doc-${Date.now()}-${job.id}-0`;
    const newDoc: GeneratedDocument = {
        id: docId,
        jobId: job.id,
        templateName: template.name,
        fileName: `${template.name.replace(/\s+/g, '_')}_${(data['{{ClientName}}'] || data['{{PartyAName}}'] || 'Single').toString().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`,
        createdAt: new Date().toISOString(),
        downloadUrl: `/mock-download/${docId}.docx`,
    };
    setGeneratedDocuments(prevDocs => [newDoc, ...prevDocs]);
    setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? {...j, status: JobStatus.COMPLETED, progress: 100, generatedDocumentIds: [docId]} : j));
    return {...job, status: JobStatus.COMPLETED, progress: 100, generatedDocumentIds: [docId]};
  }, [createJob]);

  const createBulkDocumentJob = useCallback(async (template: Template, dataRows: DataRow[]): Promise<GenerationJob> => {
    return createJob(template, dataRows.length, true);
  }, [createJob]);


  const getJobById = useCallback((id: string) => {
    return jobs.find(j => j.id === id);
  }, [jobs]);

  const getDocumentsByJobId = useCallback((jobId: string) => {
    return generatedDocuments.filter(doc => doc.jobId === jobId);
  }, [generatedDocuments]);


  return (
    <GenerationContext.Provider value={{ jobs, generatedDocuments, createSingleDocumentJob, createBulkDocumentJob, isLoading, getJobById, getDocumentsByJobId }}>
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = (): GenerationContextType => {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
};
