import { useState, useCallback } from 'react';

export function useForm(initialData = {}, validationRules = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validate = useCallback((stepFields) => {
    const newErrors = {};
    const fieldsToValidate = stepFields || Object.keys(validationRules);

    fieldsToValidate.forEach(field => {
      const rules = validationRules[field];
      if (!rules) return;

      const value = formData[field];

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field] = rules.message || `${field} is required`;
        return;
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `Minimum ${rules.minLength} characters required`;
        return;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || 'Invalid format';
      }

      if (rules.custom && value) {
        const error = rules.custom(value, formData);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  const nextStep = useCallback((stepFields) => {
    if (validate(stepFields)) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [validate]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setCurrentStep(0);
  }, [initialData]);

  return {
    formData,
    errors,
    currentStep,
    handleChange,
    setField,
    validate,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    setFormData,
    setErrors,
  };
}
