// Name submission form component with liquid glass design
import { useState } from 'react';
import { Send } from 'lucide-react';
import { trackNameSubmission } from '../services/apiService';
import LiquidGlass from 'liquid-glass-react';

interface NameSubmissionFormProps {
  anonymousId: string;
}

export function NameSubmissionForm({ anonymousId }: NameSubmissionFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setErrorMessage('Please enter your name');
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Simple name submission without verification
      // Store in localStorage for demo
      localStorage.setItem(`name_${anonymousId}`, name.trim());
      
      // Track name submission
      trackNameSubmission();
      
      setSubmitStatus('success');
      setName('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit your name');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <LiquidGlass
        displacementScale={50}
        blurAmount={0.0625}
        saturation={120}
        aberrationIntensity={1.5}
        elasticity={0.25}
        cornerRadius={12}
        className="w-full"
        style={{ minHeight: '240px' }}
      >
        <div className="flex flex-col justify-center min-h-[240px] px-8 py-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3 text-center">
            Share Your Name
          </h2>
          <p className="text-slate-600 mb-4 text-center">
            How would you like to be addressed?
          </p>
          
          {submitStatus === 'success' ? (
            <div className="p-4 bg-success/10 rounded-lg text-success font-medium mb-4 text-center">
              Thank you for sharing your name and we will keep you in our prayer.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitStatus === 'error' && (
                <div className="p-4 bg-error/10 rounded-lg text-error font-medium">
                  {errorMessage}
                </div>
              )}
              
              <div>
                <label htmlFor="name-input" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="name-input"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <Send size={18} />
                  <span>Submit</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </LiquidGlass>
    </div>
  );
}