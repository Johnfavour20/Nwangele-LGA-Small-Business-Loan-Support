import React, { useState, useCallback } from 'react';
import { useAuth } from '../App';
import { BusinessSector } from '../types';
import { Button } from './ui/Button';
import { Stepper } from './ui/Stepper';
import { ICONS } from '../constants';

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

export const NewApplicationForm: React.FC<NewApplicationFormProps> = ({ onSubmit, onCancel }) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    sector: BusinessSector.Retail,
    loanAmount: '',
    businessDescription: '',
    loanPurpose: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };
    
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };
  
  const isStep1Valid = formData.businessName && formData.loanAmount;
  const isStep2Valid = formData.businessDescription && formData.loanPurpose;
  const isStep3Valid = files.length > 0;

  const canProceed = () => {
      switch(currentStep) {
          case 1: return isStep1Valid;
          case 2: return isStep2Valid;
          case 3: return isStep3Valid;
          default: return true;
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Application:', { ...formData, files: files.map(f => f.name) });
    onSubmit();
  };

  const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-xl shadow-md max-w-4xl mx-auto border border-slate-200 dark:border-slate-700">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">New Loan Application</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Follow the steps below to complete your application.</p>
      
      <div className="mb-16 pt-4">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Step 1: Business Details</h3>
            <div>
              <label htmlFor="businessName" className={labelClasses}>Business Name</label>
              <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleChange} className={inputClasses} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="sector" className={labelClasses}>Business Sector</label>
                    <select name="sector" id="sector" value={formData.sector} onChange={handleChange} className={inputClasses}>
                        {Object.values(BusinessSector).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="loanAmount" className={labelClasses}>Loan Amount (₦)</label>
                    <input type="number" name="loanAmount" id="loanAmount" value={formData.loanAmount} onChange={handleChange} className={inputClasses} placeholder="e.g., 500000" required />
                </div>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Step 2: Purpose & Description</h3>
             <div>
              <label htmlFor="businessDescription" className={labelClasses}>Detailed Business Description</label>
              <textarea name="businessDescription" id="businessDescription" value={formData.businessDescription} onChange={handleChange} rows={5} className={inputClasses} placeholder="Describe what your business does..." required></textarea>
            </div>
             <div>
              <label htmlFor="loanPurpose" className={labelClasses}>Purpose of the Loan</label>
              <textarea name="loanPurpose" id="loanPurpose" value={formData.loanPurpose} onChange={handleChange} rows={3} className={inputClasses} placeholder="How will you use the funds?" required></textarea>
            </div>
          </div>
        )}

        {currentStep === 3 && (
            <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Step 3: Upload Documents</h3>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center bg-slate-50 dark:bg-slate-700/50 hover:border-green-500 transition">
                    <div className="text-green-600 mx-auto h-12 w-12">{ICONS.upload}</div>
                    <label htmlFor="file-upload" className="mt-4 text-sm font-semibold text-green-700 cursor-pointer">
                        <span>Click to upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, PNG, JPG accepted</p>
                </div>
                {files.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold dark:text-slate-200">Uploaded files:</h4>
                        <ul className="mt-2 space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm">
                                <span className="">{file.name}</span>
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
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Step 4: Review Your Application</h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><p className="text-sm text-slate-500 dark:text-slate-400">Business Name</p><p className="font-semibold">{formData.businessName}</p></div>
                        <div><p className="text-sm text-slate-500 dark:text-slate-400">Business Sector</p><p className="font-semibold">{formData.sector}</p></div>
                        <div><p className="text-sm text-slate-500 dark:text-slate-400">Loan Amount</p><p className="font-semibold">₦{Number(formData.loanAmount).toLocaleString()}</p></div>
                    </div>
                     <div className="pt-4 border-t dark:border-slate-600"><p className="text-sm text-slate-500 dark:text-slate-400">Business Description</p><p>{formData.businessDescription}</p></div>
                     <div className="pt-4 border-t dark:border-slate-600"><p className="text-sm text-slate-500 dark:text-slate-400">Loan Purpose</p><p>{formData.loanPurpose}</p></div>
                     <div className="pt-4 border-t dark:border-slate-600">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Documents</p>
                        <ul className="list-disc list-inside text-sm">
                            {files.map(f => <li key={f.name}>{f.name}</li>)}
                        </ul>
                     </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">By submitting this application, you confirm that all information provided is accurate and complete.</p>
            </div>
        )}

        <div className="mt-10 flex justify-between items-center border-t dark:border-slate-700 pt-6">
          <div>
            {currentStep > 1 && <Button type="button" variant="outline" onClick={handleBack}>Back</Button>}
          </div>
          <div className="flex items-center space-x-4">
            <button type="button" onClick={onCancel} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">Cancel</button>
            {currentStep < steps.length && <Button type="button" onClick={handleNext} disabled={!canProceed()}>Next</Button>}
            {currentStep === steps.length && <Button type="submit">Submit Application</Button>}
          </div>
        </div>
      </form>
    </div>
  );
};