import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string;
  type?: 'field' | 'section' | 'hard-gate';
  className?: string;
}

/**
 * B2B-friendly error display component
 * - Uses calm amber tones instead of aggressive red
 * - Provides specific, actionable feedback
 * - No blame language
 */
export function FormError({ message, type = 'field', className }: FormErrorProps) {
  if (!message) return null;
  
  const styles = {
    field: "text-amber-600 dark:text-amber-500 text-sm mt-1",
    section: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-md text-sm",
    'hard-gate': "bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 p-3 rounded-md text-amber-900 dark:text-amber-100 text-sm font-medium"
  };
  
  return (
    <p className={cn(styles[type], className)} role="alert">
      {message}
    </p>
  );
}

interface FormFieldWrapperProps {
  children: React.ReactNode;
  error?: string;
  errorType?: 'field' | 'section' | 'hard-gate';
}

/**
 * Wrapper component that combines a form field with its error display
 */
export function FormFieldWrapper({ children, error, errorType = 'field' }: FormFieldWrapperProps) {
  return (
    <div className="space-y-1">
      {children}
      <FormError message={error} type={errorType} />
    </div>
  );
}
