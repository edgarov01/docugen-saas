
import { Template, Placeholder } from './types';

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'template-001',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Standard mutual non-disclosure agreement.',
    category: 'Legal Agreements',
    version: '1.2',
    fileName: 'nda_v1.2.docx',
    uploadDate: new Date(2023, 0, 15).toISOString(),
    placeholders: [
      { key: '{{PartyAName}}', label: 'Party A Name', type: 'text' },
      { key: '{{PartyBName}}', label: 'Party B Name', type: 'text' },
      { key: '{{EffectiveDate}}', label: 'Effective Date', type: 'date' },
      { key: '{{Term}}', label: 'Term (e.g., 5 years)', type: 'text' },
      { key: '{{GoverningLaw}}', label: 'Governing Law (e.g., State of California)', type: 'text' },
    ],
  },
  {
    id: 'template-002',
    name: 'Service Contract',
    description: 'Contract for providing services to a client.',
    category: 'Client Contracts',
    version: '2.0',
    fileName: 'service_contract_v2.0.docx',
    uploadDate: new Date(2023, 2, 10).toISOString(),
    placeholders: [
      { key: '{{ClientName}}', label: 'Client Name', type: 'text' },
      { key: '{{ServiceProviderName}}', label: 'Service Provider Name', type: 'text' },
      { key: '{{ServiceDescription}}', label: 'Description of Services', type: 'text' },
      { key: '{{StartDate}}', label: 'Start Date', type: 'date' },
      { key: '{{EndDate}}', label: 'End Date (Optional)', type: 'date' },
      { key: '{{PaymentTerms}}', label: 'Payment Terms', type: 'text' },
      { key: '{{TotalFee}}', label: 'Total Fee', type: 'number' },
    ],
  },
  {
    id: 'template-003',
    name: 'Public Deed of Sale',
    description: 'Template for a public deed of sale for property.',
    category: 'Real Estate',
    version: '1.0',
    fileName: 'deed_of_sale_v1.0.docx',
    uploadDate: new Date(2023, 4, 20).toISOString(),
    placeholders: [
      { key: '{{VendorName}}', label: 'Vendor Name', type: 'text' },
      { key: '{{VendeeName}}', label: 'Vendee Name', type: 'text' },
      { key: '{{PropertyDescription}}', label: 'Property Description', type: 'text' },
      { key: '{{SalePrice}}', label: 'Sale Price', type: 'number' },
      { key: '{{NotaryPublic}}', label: 'Notary Public Name', type: 'text' },
      { key: '{{DateOfNotarization}}', label: 'Date of Notarization', type: 'date' },
    ],
  },
];

export const DEFAULT_PLACEHOLDERS: Placeholder[] = [
  { key: '{{DocumentTitle}}', label: 'Document Title', type: 'text' },
  { key: '{{PreparedFor}}', label: 'Prepared For', type: 'text' },
  { key: '{{PreparedBy}}', label: 'Prepared By', type: 'text' },
  { key: '{{Date}}', label: 'Date', type: 'date' },
];

export const TEMPLATE_CATEGORIES = ['Legal Agreements', 'Client Contracts', 'Real Estate', 'Internal Memos', 'Other'];
