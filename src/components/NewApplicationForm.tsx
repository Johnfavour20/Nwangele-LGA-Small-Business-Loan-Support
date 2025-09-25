import React, { useState } from 'react';
import { BusinessSector } from '../types';
import { Button } from './ui/Button';
import { Stepper } from './ui/Stepper';
import { ICONS } from '../constants';
import { Spinner } from './ui/Spinner';

interface NewApplicationFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 1, name: 'Business Details' },
  { id: 2, name: 'Purpose & Description' },
  { id: 3, name: 'Upload Documents' },
  { id: 4, name: 'Review & Submit' },
];

type FormData = {
    businessName: string;
    sector: BusinessSector;
    loanAmount: string;
    businessDescription: string;
    loanPurpose: string;
};
type FormErrors = Partial<Record<keyof FormData | 'files', string>>;

export const NewApplicationForm: React.FC<NewApplicationFormProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    sector: BusinessSector.Retail,
    loanAmount: '',
    businessDescription: '',
    loanPurpose: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step: number): FormErrors => {
    const newErrors: FormErrors = {};
    switch (step) {
        case 1:
            if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
            if (!formData.loanAmount) {
                newErrors.loanAmount = 'Loan amount is required.';
            } else if (isNaN(Number(formData.loanAmount)) || Number(formData.loanAmount) <= 0) {
                newErrors.loanAmount = 'Please enter a valid, positive loan amount.';
            }
            break;
        case 2:
            if (!formData.businessDescription.trim()) {
                newErrors.businessDescription = 'Business description is required.';
            } else if (formData.businessDescription.trim().length < 20) {
                newErrors.businessDescription = 'Description must be at least 20 characters long.';
            }
            if (!formData.loanPurpose.trim()) {
                newErrors.loanPurpose = 'Purpose of the loan is required.';
            } else if (formData.loanPurpose.trim().length < 10) {
                newErrors.loanPurpose = 'Purpose must be at least 10 characters long.';
            }
            break;
        case 3:
            if (files.length === 0) newErrors.files = 'At least one document is required.';
            break;
        default:
            break;
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
      if (errors.files) {
          setErrors(prev => ({...prev, files: undefined}));
      }
    }
  };
    
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting Application:', { ...formData, files: files.map(f => f.name) });
    setTimeout(() => {
        onSubmit();
        // The component will unmount, no need to setIsSubmitting(false)
    }, 2000);
  };
  
  const getInputClasses = (fieldName: keyof FormErrors) => {
      const base = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-200";
      return errors[fieldName]
        ? `${base} border-red-500 focus:ring-red-500`
        : `${base} border-gray-300 dark:border-gray-600 focus:ring-green-500`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-md max-w-4xl mx-auto border border-slate-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">New Loan Application</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Follow the steps below to complete your application.</p>
      
      <div className="mb-16 pt-4">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Step 1: Business Details</h3>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
              <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleChange} className={getInputClasses('businessName')} required />
              {errors.businessName && <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Sector</label>
                    <select name="sector" id="sector" value={formData.sector} onChange={handleChange} className={getInputClasses('sector')}>
                        {Object.values(BusinessSector).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Amount (₦)</label>
                    <input type="number" name="loanAmount" id="loanAmount" value={formData.loanAmount} onChange={handleChange} className={getInputClasses('loanAmount')} placeholder="e.g., 500000" required />
                    {errors.loanAmount && <p className="text-sm text-red-500 mt-1">{errors.loanAmount}</p>}
                </div>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Step 2: Purpose & Description</h3>
             <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Detailed Business Description</label>
              <textarea name="businessDescription" id="businessDescription" value={formData.businessDescription} onChange={handleChange} rows={5} className={getInputClasses('businessDescription')} placeholder="Describe what your business does..." required></textarea>
              {errors.businessDescription && <p className="text-sm text-red-500 mt-1">{errors.businessDescription}</p>}
            </div>
             <div>
              <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose of the Loan</label>
              <textarea name="loanPurpose" id="loanPurpose" value={formData.loanPurpose} onChange={handleChange} rows={3} className={getInputClasses('loanPurpose')} placeholder="How will you use the funds?" required></textarea>
              {errors.loanPurpose && <p className="text-sm text-red-500 mt-1">{errors.loanPurpose}</p>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
            <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Step 3: Upload Documents</h3>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50 hover:border-green-500 dark:hover:border-green-600 transition ${errors.files ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    <div className="text-green-600 dark:text-green-400 mx-auto h-12 w-12">{ICONS.upload}</div>
                    <label htmlFor="file-upload" className="mt-4 text-sm font-semibold text-green-700 dark:text-green-400 cursor-pointer">
                        <span>Click to upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, PNG, JPG accepted</p>
                </div>
                {errors.files && <p className="text-sm text-red-500 mt-2 text-center">{errors.files}</p>}
                {files.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold dark:text-gray-200">Uploaded files:</h4>
                        <ul className="mt-2 space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                                <span className="dark:text-gray-300">{file.name}</span>
                                <button type="button" onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700">{ICONS.close}</button>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
        )}

        {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Step 4: Review Your Application</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p><p className="font-semibold dark:text-gray-200">{formData.businessName}</p></div>
                        <div><p className="text-sm text-gray-500 dark:text-gray-400">Business Sector</p><p className="font-semibold dark:text-gray-200">{formData.sector}</p></div>
                        <div><p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p><p className="font-semibold dark:text-gray-200">₦{Number(formData.loanAmount).toLocaleString()}</p></div>
                    </div>
                     <div className="pt-4 border-t dark:border-gray-600"><p className="text-sm text-gray-500 dark:text-gray-400">Business Description</p><p className="dark:text-gray-300">{formData.businessDescription}</p></div>
                     <div className="pt-4 border-t dark:border-gray-600"><p className="text-sm text-gray-500 dark:text-gray-400">Loan Purpose</p><p className="dark:text-gray-300">{formData.loanPurpose}</p></div>
                     <div className="pt-4 border-t dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Documents</p>
                        <ul className="list-disc list-inside text-sm dark:text-gray-300">
                            {files.map(f => <li key={f.name}>{f.name}</li>)}
                        </ul>
                     </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">By submitting this application, you confirm that all information provided is accurate and complete.</p>
            </div>
        )}

        <div className="mt-10 flex justify-between items-center border-t dark:border-gray-700 pt-6">
          <div>
            {currentStep > 1 && <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>Back</Button>}
          </div>
          <div className="flex items-center space-x-4">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-50">Cancel</button>
            {currentStep < steps.length && <Button type="button" onClick={handleNext} disabled={isSubmitting}>Next</Button>}
            {currentStep === steps.length && <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner size="sm" /> : 'Submit Application'}</Button>}
          </div>
        </div>
      </form>
    </div>
  );
};
