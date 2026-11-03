import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  Globe,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ClipboardList,
  Clock,
  Shield,
  Info,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Service-specific form field configurations
const SERVICE_FORMS = {
  'srv-01': {
    title: 'New Investment Permit Application',
    subtitle: 'Submit your investment permit application for domestic, joint venture, or foreign commercial investment in Oromia.',
    icon: Briefcase,
    color: 'emerald',
    steps: ['Personal Information', 'Business Details', 'Investment Plan', 'Documents & Submit'],
    fields: [
      // Step 0 — Personal Information
      [
        { name: 'fullName', label: 'Full Legal Name', type: 'text', placeholder: 'e.g., Abebe Chala', required: true, icon: User },
        { name: 'nationality', label: 'Nationality', type: 'select', options: ['Ethiopian', 'Foreign National', 'Dual Citizenship'], required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g., abebe.chala@gmail.com', required: true, icon: Mail },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '12345678', required: true, icon: Phone, prefix: '+2519' },
        { name: 'passportId', label: 'Passport / National ID Number', type: 'text', placeholder: 'e.g., FIN123456789012 or A12345678', required: true, icon: Shield },
        { name: 'address', label: 'Current Residential Address', type: 'text', placeholder: 'e.g., Addis Ababa, Bole Sub City', required: true }
      ],
      // Step 1 — Business Details
      [
        { name: 'companyName', label: 'Company / Organization Name', type: 'text', placeholder: 'e.g., Oromia Agro Industries PLC', required: true, icon: Building2 },
        { name: 'investorType', label: 'Investor Type', type: 'select', options: ['Domestic Private', 'Foreign Direct Investment (FDI)', 'Joint Venture', 'Diaspora Investor'], required: true },
        { name: 'businessSector', label: 'Business Sector', type: 'select', options: ['Manufacturing', 'Agriculture & Agro-Processing', 'Mining & Extraction', 'Tourism & Hospitality', 'Technology & ICT', 'Health & Pharmaceuticals', 'Construction & Real Estate', 'Energy & Renewable', 'Other'], required: true },
        { name: 'tinNumber', label: 'Tax Identification Number (TIN)', type: 'text', placeholder: 'e.g., 0012345678', required: false },
        { name: 'existingLicense', label: 'Do you have an existing business license?', type: 'select', options: ['No — First time applicant', 'Yes — License renewal / expansion', 'Yes — Re-registration'], required: true }
      ],
      // Step 2 — Investment Plan
      [
        { name: 'projectTitle', label: 'Project Title', type: 'text', placeholder: 'e.g., Integrated Dairy Processing Plant', required: true, icon: ClipboardList },
        { name: 'investmentZone', label: 'Preferred Investment Zone / Location', type: 'select', options: ['Finfinnee Surrounding Special Zone', 'East Shewa Zone', 'West Shewa Zone', 'Jimma Zone', 'East Wollega Zone', 'Arsi Zone', 'Bale Zone', 'Borena Zone', 'Guji Zone', 'Hararghe Zone', 'Ilu Ababor Zone', 'Other — Please specify in description'], required: true },
        { name: 'estimatedCapital', label: 'Estimated Investment Capital (ETB)', type: 'text', placeholder: 'e.g., 50,000,000', required: true },
        { name: 'employmentProjection', label: 'Projected Employment (Number of Jobs)', type: 'text', placeholder: 'e.g., 150', required: true },
        { name: 'projectDescription', label: 'Detailed Project Description', type: 'textarea', placeholder: 'Describe your investment project, objectives, production capacity, and market strategy...', required: true },
        { name: 'landRequirement', label: 'Land Requirement (hectares or sq. meters)', type: 'text', placeholder: 'e.g., 5000', required: false }
      ],
      // Step 3 — Documents
      [
        { name: 'businessPlan', label: 'Draft Business Plan (PDF)', type: 'file', accept: '.pdf,.doc,.docx', required: true },
        { name: 'passportCopy', label: 'Passport / ID Copy (PDF or Image)', type: 'file', accept: '.pdf,.jpg,.jpeg,.png', required: true },
        { name: 'articleOfAssociation', label: 'Notarized Articles of Association (PDF)', type: 'file', accept: '.pdf,.doc,.docx', required: false },
        { name: 'additionalNotes', label: 'Additional Notes or Special Requests', type: 'textarea', placeholder: 'Any additional information you want the Bureau to consider...', required: false },
        { name: 'consent', label: 'I confirm that all information provided is accurate and complete. I understand that false declarations may lead to permit revocation.', type: 'checkbox', required: true }
      ]
    ]
  },
  'srv-03': {
    title: 'Duty-Free Capital Goods Exemption Application',
    subtitle: 'Apply for endorsement letters to the Ethiopian Customs Commission for 100% duty-free import of machinery and capital goods.',
    icon: FileText,
    color: 'blue',
    steps: ['Applicant Information', 'Import Details', 'Documents & Submit'],
    fields: [
      // Step 0 — Applicant Information
      [
        { name: 'fullName', label: 'Full Legal Name / Authorized Representative', type: 'text', placeholder: 'e.g., Abebe Chala', required: true, icon: User },
        { name: 'companyName', label: 'Company / Organization Name', type: 'text', placeholder: 'e.g., Oromia Manufacturing PLC', required: true, icon: Building2 },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g., representative@gmail.com', required: true, icon: Mail },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '12345678', required: true, icon: Phone, prefix: '+2519' },
        { name: 'investmentPermitNo', label: 'Valid Investment Permit Number', type: 'text', placeholder: 'e.g., INV/2024/00123', required: true, icon: Shield },
        { name: 'businessSector', label: 'Business Sector', type: 'select', options: ['Manufacturing', 'Agriculture & Agro-Processing', 'Mining & Extraction', 'Priority Commercial Services', 'Other'], required: true }
      ],
      // Step 1 — Import Details
      [
        { name: 'machineryDescription', label: 'Description of Machinery / Capital Goods', type: 'textarea', placeholder: 'List all machinery items, models, and specifications...', required: true },
        { name: 'totalValue', label: 'Total Estimated Value (ETB or USD equivalent)', type: 'text', placeholder: 'e.g., 12,500,000 ETB', required: true },
        { name: 'countryOfOrigin', label: 'Country of Origin / Supplier', type: 'text', placeholder: 'e.g., China — Shandong Heavy Machinery Co.', required: true },
        { name: 'portOfEntry', label: 'Port of Entry', type: 'select', options: ['Djibouti Port (via Ethio-Djibouti Corridor)', 'Dire Dawa Dry Port', 'Modjo Dry Port', 'Addis Ababa Bole International Airport', 'Other'], required: true },
        { name: 'expectedArrival', label: 'Expected Arrival Date', type: 'date', required: true },
        { name: 'capitalAssetSchedule', label: 'Approved Capital Asset Schedule Reference', type: 'text', placeholder: 'e.g., CAS/2024/456', required: false }
      ],
      // Step 2 — Documents
      [
        { name: 'billOfLading', label: 'Bill of Lading (PDF)', type: 'file', accept: '.pdf', required: true },
        { name: 'proformaInvoice', label: 'Proforma Invoices of Machinery (PDF)', type: 'file', accept: '.pdf', required: true },
        { name: 'investmentLicenseCopy', label: 'Valid Investment License Copy (PDF)', type: 'file', accept: '.pdf', required: true },
        { name: 'assetScheduleCopy', label: 'Approved Capital Asset Schedule (PDF)', type: 'file', accept: '.pdf', required: false },
        { name: 'additionalNotes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any additional information regarding the import...', required: false },
        { name: 'consent', label: 'I confirm that all information and documents are accurate. I understand that misrepresentation may result in legal consequences and revocation of duty-free privileges.', type: 'checkbox', required: true }
      ]
    ]
  },
  'srv-04': {
    title: 'Export Trade Business License Application',
    subtitle: 'Apply for commercial registration, export license issuance, or annual renewal for trading businesses operating in Oromia.',
    icon: Globe,
    color: 'amber',
    steps: ['Applicant Information', 'Business & Trade Details', 'Documents & Submit'],
    fields: [
      // Step 0 — Applicant Information
      [
        { name: 'fullName', label: 'Full Legal Name', type: 'text', placeholder: 'e.g., Abebe Chala', required: true, icon: User },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g., exporter@gmail.com', required: true, icon: Mail },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '12345678', required: true, icon: Phone, prefix: '+2519' },
        { name: 'businessType', label: 'Business Type', type: 'select', options: ['Sole Proprietor', 'Private Limited Company (PLC)', 'Share Company', 'Agricultural Cooperative Union', 'Other'], required: true },
        { name: 'companyName', label: 'Company / Organization Name', type: 'text', placeholder: 'e.g., Oromia Coffee Export PLC', required: true, icon: Building2 }
      ],
      // Step 1 — Business & Trade Details
      [
        { name: 'applicationType', label: 'Application Type', type: 'select', options: ['New Export License', 'Annual License Renewal', 'License Amendment / Update'], required: true },
        { name: 'commercialRegNo', label: 'Commercial Registration Number', type: 'text', placeholder: 'e.g., CR/OR/2024/12345', required: true },
        { name: 'exportProducts', label: 'Primary Export Products', type: 'select', options: ['Coffee', 'Oilseeds (Sesame, Niger Seed)', 'Pulses & Grains', 'Livestock & Meat', 'Honey & Beeswax', 'Textiles & Garments', 'Horticulture & Cut Flowers', 'Minerals', 'Mixed / Multiple Products'], required: true },
        { name: 'targetMarkets', label: 'Primary Target Export Markets', type: 'text', placeholder: 'e.g., Middle East, Europe, East Asia', required: true },
        { name: 'annualExportVolume', label: 'Estimated Annual Export Volume', type: 'text', placeholder: 'e.g., 500 metric tons', required: true },
        { name: 'warehouseLocation', label: 'Warehouse / Storage Location', type: 'text', placeholder: 'e.g., Modjo, East Shewa Zone', required: true }
      ],
      // Step 2 — Documents
      [
        { name: 'commercialRegCopy', label: 'Renewed Commercial Registration (PDF)', type: 'file', accept: '.pdf', required: true },
        { name: 'warehouseCert', label: 'Warehouse Inspection Certificate (PDF)', type: 'file', accept: '.pdf', required: true },
        { name: 'taxClearance', label: 'Tax Clearance from Oromia Revenue Authority (PDF)', type: 'file', accept: '.pdf', required: true },
        { name: 'additionalNotes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any additional information regarding your trade license application...', required: false },
        { name: 'consent', label: 'I confirm that all information and documents submitted are truthful and accurate. I understand that fraudulent applications are subject to legal action.', type: 'checkbox', required: true }
      ]
    ]
  }
};

export default function ServicePortal() {
  const { serviceId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitRef, setSubmitRef] = useState('');

  const formConfig = SERVICE_FORMS[serviceId];

  // Fetch service details from API
  useEffect(() => {
    fetch(`/api/services/${serviceId}`)
      .then(res => res.json())
      .then(data => {
        setService(data.data || data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (!formConfig) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Portal Not Available</h2>
        <p className="text-slate-500 dark:text-slate-400">This service does not have an electronic portal. Please visit the Bureau desk in person.</p>
        <Link to="/services" className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Services Directory
        </Link>
      </div>
    );
  }

  const currentFields = formConfig.fields[currentStep] || [];
  const totalSteps = formConfig.steps.length;
  const IconComponent = formConfig.icon;

  const colorMap = {
    emerald: { bg: 'bg-emerald-600', bgHover: 'hover:bg-emerald-700', light: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', ring: 'ring-emerald-500' },
    blue: { bg: 'bg-blue-600', bgHover: 'hover:bg-blue-700', light: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', ring: 'ring-blue-500' },
    amber: { bg: 'bg-amber-600', bgHover: 'hover:bg-amber-700', light: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', ring: 'ring-amber-500' }
  };
  const clr = colorMap[formConfig.color] || colorMap.emerald;

  // Validate current step fields
  const validateStep = () => {
    const stepErrors = {};
    for (const field of currentFields) {
      const val = formData[field.name];

      if (field.required) {
        if (field.type === 'checkbox' && !val) {
          stepErrors[field.name] = 'You must accept this declaration to proceed.';
        } else if (field.type === 'file') {
          if (!val) stepErrors[field.name] = `${field.label} is required.`;
        } else if (!val || (typeof val === 'string' && !val.trim())) {
          stepErrors[field.name] = `${field.label} is required.`;
        }
      }

      // Full Legal Name validation (text only, no numbers allowed)
      if (field.name === 'fullName' && val && typeof val === 'string' && val.trim()) {
        if (/\d/.test(val)) {
          stepErrors[field.name] = 'Full Legal Name must contain text only, no numbers are allowed.';
        }
      }

      // Current Residential Address validation (text only, no numbers allowed)
      if (field.name === 'address' && val && typeof val === 'string' && val.trim()) {
        if (/\d/.test(val)) {
          stepErrors[field.name] = 'Current Residential Address must contain text only, no numbers are allowed.';
        }
      }

      // Company / Organization Name validation (text only, no numbers allowed)
      if (field.name === 'companyName' && val && typeof val === 'string' && val.trim()) {
        if (/\d/.test(val)) {
          stepErrors[field.name] = 'Company / Organization Name must contain text only, no numbers are allowed.';
        }
      }

      // Tax Identification Number (TIN) validation: exactly 10 digits
      if (field.name === 'tinNumber' && val && typeof val === 'string' && val.trim()) {
        if (!/^\d{10}$/.test(val.trim())) {
          stepErrors[field.name] = 'Tax Identification Number (TIN) must be exactly 10 digits.';
        }
      }

      // Project Title validation (text only, no numbers allowed)
      if (field.name === 'projectTitle' && val && typeof val === 'string' && val.trim()) {
        if (/\d/.test(val)) {
          stepErrors[field.name] = 'Project Title must contain text only, no numbers are allowed.';
        }
      }

      // Estimated Investment Capital (ETB) validation: numbers only, minimum 100,000
      if (field.name === 'estimatedCapital' && val !== undefined && val !== null && String(val).trim()) {
        const rawDigits = String(val).replace(/\D/g, '');
        const num = Number(rawDigits);
        if (!rawDigits || isNaN(num) || num < 100000) {
          stepErrors[field.name] = 'Estimated Investment Capital must be a number of at least 100,000 ETB.';
        }
      }

      // Projected Employment validation: numbers only
      if (field.name === 'employmentProjection' && val !== undefined && val !== null && String(val).trim()) {
        const rawDigits = String(val).replace(/\D/g, '');
        const num = Number(rawDigits);
        if (!rawDigits || isNaN(num) || num <= 0) {
          stepErrors[field.name] = 'Projected Employment must be a valid number.';
        }
      }

      // Detailed Project Description validation (text only, no numbers allowed)
      if (field.name === 'projectDescription' && val && typeof val === 'string' && val.trim()) {
        if (/\d/.test(val)) {
          stepErrors[field.name] = 'Detailed Project Description must contain text only, no numbers are allowed.';
        }
      }

      // Land Requirement validation: numbers only if provided
      if (field.name === 'landRequirement' && val && typeof val === 'string' && val.trim()) {
        if (!/^\d+$/.test(val.trim())) {
          stepErrors[field.name] = 'Land Requirement must contain numbers only.';
        }
      }

      // Passport / National ID Number validation
      // If starts with FIN: must be followed by exactly 12 digits
      // If starts with A: must be followed by exactly 8 digits
      if (field.name === 'passportId' && val && typeof val === 'string' && val.trim()) {
        const cleaned = val.trim().toUpperCase();
        if (cleaned.startsWith('FIN')) {
          const digits = cleaned.slice(3);
          if (digits.length !== 12 || !/^\d{12}$/.test(digits)) {
            stepErrors[field.name] = `National ID must have exactly 12 digits after FIN (${digits.length}/12 entered).`;
          }
        } else if (cleaned.startsWith('A')) {
          const digits = cleaned.slice(1);
          if (digits.length !== 8 || !/^\d{8}$/.test(digits)) {
            stepErrors[field.name] = `US Passport must have exactly 8 digits after A (${digits.length}/8 entered).`;
          }
        } else {
          stepErrors[field.name] = 'Must start with FIN (followed by 12 digits) or A (followed by 8 digits).';
        }
      }

      // Phone validation: +2519 followed by 8 digits
      if (field.type === 'tel' && val && val.trim()) {
        if (!/^\d{8}$/.test(val.trim())) {
          stepErrors[field.name] = 'Enter exactly 8 digits after +2519.';
        }
      }

      // Email validation: MUST end with @gmail.com
      if (field.type === 'email' && val && val.trim()) {
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(val.trim())) {
          stepErrors[field.name] = 'Email address must end with @gmail.com';
        }
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (name, value) => {
    let finalValue = value;
    if (name === 'passportId' && typeof value === 'string') {
      finalValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));

    // Instant feedback for text-only fields
    if (name === 'fullName') {
      if (/\d/.test(finalValue)) {
        setErrors(prev => ({ ...prev, fullName: 'Numbers are not allowed. Please enter text only.' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.fullName; return n; });
      }
      return;
    }

    if (name === 'address') {
      if (/\d/.test(finalValue)) {
        setErrors(prev => ({ ...prev, address: 'Numbers are not allowed. Please enter text only.' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.address; return n; });
      }
      return;
    }

    if (name === 'companyName') {
      if (/\d/.test(finalValue)) {
        setErrors(prev => ({ ...prev, companyName: 'Numbers are not allowed. Please enter text only.' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.companyName; return n; });
      }
      return;
    }

    if (name === 'tinNumber') {
      // Only digits allowed, max 10 digits
      const digitsOnly = (value || '').replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, tinNumber: digitsOnly }));

      if (digitsOnly.length === 10) {
        setErrors(prev => { const n = { ...prev }; delete n.tinNumber; return n; });
      } else if (digitsOnly.length > 0) {
        if (errors.tinNumber) {
          setErrors(prev => ({
            ...prev,
            tinNumber: `TIN Number must be exactly 10 digits (${digitsOnly.length}/10 entered).`
          }));
        }
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.tinNumber; return n; });
      }
      return;
    }

    if (name === 'projectTitle') {
      if (/\d/.test(finalValue)) {
        setErrors(prev => ({ ...prev, projectTitle: 'Numbers are not allowed. Please enter text only.' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.projectTitle; return n; });
      }
      return;
    }

    if (name === 'estimatedCapital') {
      // Only numbers allowed
      const digitsOnly = (value || '').replace(/\D/g, '');
      setFormData(prev => ({ ...prev, estimatedCapital: digitsOnly }));
      const num = Number(digitsOnly);
      if (digitsOnly && num < 100000) {
        if (errors.estimatedCapital) {
          setErrors(prev => ({ ...prev, estimatedCapital: 'Estimated Investment Capital must be at least 100,000 ETB.' }));
        }
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.estimatedCapital; return n; });
      }
      return;
    }

    if (name === 'employmentProjection') {
      // Only numbers allowed
      const digitsOnly = (value || '').replace(/\D/g, '');
      setFormData(prev => ({ ...prev, employmentProjection: digitsOnly }));
      setErrors(prev => { const n = { ...prev }; delete n.employmentProjection; return n; });
      return;
    }

    if (name === 'projectDescription') {
      if (/\d/.test(finalValue)) {
        setErrors(prev => ({ ...prev, projectDescription: 'Numbers are not allowed. Please enter text only.' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.projectDescription; return n; });
      }
      return;
    }

    if (name === 'landRequirement') {
      // Only numbers allowed
      const digitsOnly = (value || '').replace(/\D/g, '');
      setFormData(prev => ({ ...prev, landRequirement: digitsOnly }));
      setErrors(prev => { const n = { ...prev }; delete n.landRequirement; return n; });
      return;
    }

    if (name === 'passportId') {
      const raw = (value || '').toUpperCase().trim();
      let formatted = '';

      if (raw.startsWith('FIN')) {
        // Enforce: only digits after FIN, max 12 digits
        const digits = raw.slice(3).replace(/\D/g, '').slice(0, 12);
        formatted = 'FIN' + digits;
      } else if (raw.startsWith('FI')) {
        formatted = 'FI';
      } else if (raw.startsWith('F')) {
        formatted = 'F';
      } else if (raw.startsWith('A')) {
        // Enforce: only digits after A, max 8 digits
        const digits = raw.slice(1).replace(/\D/g, '').slice(0, 8);
        formatted = 'A' + digits;
      } else if (!raw) {
        formatted = '';
      } else {
        // Not starting with F or A -> reset and show guidance
        setFormData(prev => ({ ...prev, passportId: '' }));
        setErrors(prev => ({
          ...prev,
          passportId: 'Must start with FIN (for National ID) or A (for US Passport).'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, [name]: formatted }));

      // Live validation feedback
      if (formatted.startsWith('FIN')) {
        const digits = formatted.slice(3);
        if (digits.length === 12) {
          setErrors(prev => { const n = { ...prev }; delete n.passportId; return n; });
        } else if (errors.passportId) {
          setErrors(prev => ({
            ...prev,
            passportId: `National ID requires 12 digits after FIN (${digits.length}/12 entered).`
          }));
        }
      } else if (formatted.startsWith('A')) {
        const digits = formatted.slice(1);
        if (digits.length === 8) {
          setErrors(prev => { const n = { ...prev }; delete n.passportId; return n; });
        } else if (errors.passportId) {
          setErrors(prev => ({
            ...prev,
            passportId: `US Passport requires 8 digits after A (${digits.length}/8 entered).`
          }));
        }
      } else {
        if (errors.passportId && !formatted) {
          setErrors(prev => { const n = { ...prev }; delete n.passportId; return n; });
        }
      }
      return;
    }

    if (name === 'email') {
      if (errors.email && /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test((finalValue || '').trim())) {
        setErrors(prev => { const n = { ...prev }; delete n.email; return n; });
      }
      return;
    }

    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitting(true);

    // Build submission payload (excluding files for JSON submission)
    const payload = {
      serviceId,
      serviceTitle: formConfig.title,
      applicantName: formData.fullName || '',
      applicantEmail: formData.email || '',
      applicantPhone: formData.phone ? `+2519${formData.phone}` : '',
      companyName: formData.companyName || '',
      formData: {},
      submittedAt: new Date().toISOString()
    };

    // Include all non-file fields
    for (const stepFields of formConfig.fields) {
      for (const field of stepFields) {
        if (field.type !== 'file' && field.type !== 'checkbox') {
          payload.formData[field.name] = formData[field.name] || '';
        }
      }
    }

    // Count uploaded files
    const fileFields = formConfig.fields.flat().filter(f => f.type === 'file');
    const uploadedFiles = fileFields.filter(f => formData[f.name]).map(f => ({
      fieldName: f.name,
      fileName: formData[f.name]?.name || 'uploaded',
      label: f.label
    }));
    payload.uploadedDocuments = uploadedFiles;

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitRef(data.referenceNumber || data.id || 'APP-' + Date.now());
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrors({ _submit: data.error || 'Submission failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ _submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Application Submitted Successfully
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Your <strong>{formConfig.title}</strong> has been received by the Bureau. Our team will review your application and supporting documents.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 sm:p-6 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Reference Number</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">{submitRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Applicant</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formData.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Service</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">{service?.title || formConfig.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Expected Processing</span>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{service?.processingTime || '2-3 Working Days'}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-left">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                A confirmation email will be sent to <strong>{formData.email}</strong>. You can track your application status by contacting the <strong>{service?.responsibleOffice || 'responsible directorate'}</strong> with your reference number.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-8">
      {/* Back Link */}
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services Directory
      </Link>

      {/* Header */}
      <div className={`${clr.light} border ${clr.border} rounded-2xl p-6 sm:p-8 space-y-3`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${clr.bg} flex items-center justify-center`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {formConfig.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{formConfig.subtitle}</p>
          </div>
        </div>

        {/* Service Info Bar */}
        {service && (
          <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Processing:</span>
              <strong className={clr.text}>{service.processingTime}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Office:</span>
              <strong className="text-slate-700 dark:text-slate-300">{service.responsibleOffice}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {formConfig.steps.map((step, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => { if (i < currentStep) { setCurrentStep(i); setErrors({}); } }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                i === currentStep
                  ? `${clr.bg} text-white shadow-sm`
                  : i < currentStep
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                i < currentStep ? 'bg-emerald-600 text-white' : i === currentStep ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </button>
            {i < formConfig.steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {formConfig.steps[currentStep]}
          </h2>
          <span className="text-xs text-slate-400 font-mono">Step {currentStep + 1} of {totalSteps}</span>
        </div>

        {/* Submit Error */}
        {errors._submit && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-300">{errors._submit}</p>
          </div>
        )}

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentFields.map((field) => {
            const isFullWidth = field.type === 'textarea' || field.type === 'checkbox' || field.type === 'file';
            return (
              <div key={field.name} className={isFullWidth ? 'md:col-span-2' : ''}>
                {field.type === 'checkbox' ? (
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className={`mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 ${errors[field.name] ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </span>
                  </label>
                ) : field.type === 'file' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 ${
                      errors[field.name] ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20' : formData[field.name] ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <input
                        type="file"
                        accept={field.accept}
                        onChange={(e) => handleChange(field.name, e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {formData[field.name] ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold">{formData[field.name].name}</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-500">Click to upload or drag file here</p>
                          <p className="text-[10px] text-slate-400">{field.accept?.replace(/\./g, '').toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 ${clr.ring} transition-all ${
                          errors[field.name] ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="">— Select —</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${clr.ring} resize-none transition-all ${
                          errors[field.name] ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      />
                    ) : field.type === 'tel' ? (
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl bg-slate-200 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {field.prefix || '+2519'}
                        </span>
                        <input
                          type="text"
                          maxLength={8}
                          value={formData[field.name] || ''}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                            handleChange(field.name, v);
                          }}
                          placeholder={field.placeholder}
                          className={`flex-1 px-3 py-2.5 rounded-r-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${clr.ring} transition-all ${
                            errors[field.name] ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        {field.icon && (
                          <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        )}
                        <input
                          type={field.type}
                          value={formData[field.name] || ''}
                          maxLength={
                            field.name === 'passportId'
                              ? formData.passportId?.startsWith('A')
                                ? 9
                                : 15
                              : field.name === 'tinNumber'
                              ? 10
                              : undefined
                          }
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className={`w-full ${field.icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${clr.ring} transition-all ${
                            errors[field.name] ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>
                    )}
                    {field.name === 'passportId' && formData.passportId && (
                      <div className="mt-1 flex items-center justify-between text-[11px] px-1">
                        {formData.passportId.startsWith('FIN') ? (
                          <span className={formData.passportId.length === 15 ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-500 dark:text-slate-400'}>
                            {formData.passportId.length === 15 && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            National ID: {formData.passportId.slice(3).length} / 12 digits
                          </span>
                        ) : formData.passportId.startsWith('A') ? (
                          <span className={formData.passportId.length === 9 ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-500 dark:text-slate-400'}>
                            {formData.passportId.length === 9 && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            US Passport: {formData.passportId.slice(1).length} / 8 digits
                          </span>
                        ) : null}
                      </div>
                    )}
                    {field.name === 'tinNumber' && formData.tinNumber && (
                      <div className="mt-1 flex items-center justify-between text-[11px] px-1">
                        <span className={formData.tinNumber.length === 10 ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-500 dark:text-slate-400'}>
                          {formData.tinNumber.length === 10 && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          TIN: {formData.tinNumber.length} / 10 digits
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl ${clr.bg} ${clr.bgHover} text-white font-bold text-sm shadow-sm transition-colors`}
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl ${clr.bg} ${clr.bgHover} text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
          <p className="font-bold">Important Notice</p>
          <p>All submitted applications are reviewed by the designated directorate. Processing times are indicative and subject to document completeness. Ensure all uploaded documents are clear, legible, and in the accepted formats. The Bureau reserves the right to request additional documentation.</p>
        </div>
      </div>
    </div>
  );
}
