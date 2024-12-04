import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from 'date-fns';


import { FieldValues, UseFormReturn,Path, PathValue } from 'react-hook-form';

import { useEffect } from "react";
import programFullNames, { ProgramCode } from "./const";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (dateString:string, formatString = 'MM/dd/yyyy') => {
  if (!dateString) return 'N/A';
  console.log(dateString);

  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  console.log(date);
  
  return isValid(date) ? format(date, formatString) : 'Invalid Date';
};


export function saveFormValues<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  key: string,
  initialData: Partial<TFieldValues>
) {
  
    // Load saved data on initial render
    const savedData = localStorage.getItem(key);
    if (savedData) {
      const parsedData = JSON.parse(savedData) as Partial<TFieldValues>;
      Object.keys(parsedData).forEach((field) => {
        form.setValue(field as Path<TFieldValues>, parsedData[field] as PathValue<TFieldValues, Path<TFieldValues>>);
      });
    } else {
      // If no saved data, set initial data
      Object.keys(initialData).forEach((field) => {
        form.setValue(field as Path<TFieldValues>, initialData[field as keyof TFieldValues] as PathValue<TFieldValues, Path<TFieldValues>>);
      });
    }

    // Save form data on every change
    const subscription = form.watch((formData) => {
      localStorage.setItem(key, JSON.stringify(formData));
    });

    return () => subscription.unsubscribe();
  
};


// Helper function to convert string to boolean
export const stringToBoolean = (value: any): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase();
    if (lowercased === 'true' || lowercased === '1' || lowercased === 'yes') return true;
    if (lowercased === 'false' || lowercased === '0' || lowercased === 'no') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return undefined;
}

// Helper function to safely parse date strings
export const parseDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};



export const getLineOfBusiness = (policyNumber: string) => {
  const prefix = policyNumber.substring(0, 3).toUpperCase() as ProgramCode;
  const fullName = programFullNames[prefix] || 'Unknown Program';
  return fullName;
};