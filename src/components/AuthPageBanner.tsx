import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthMessageBanner = ({ message }: { message: string | null }) => {
  return message ? (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          {message}
        </AlertDescription>
      </Alert>
    </div>
  ) : null;
};

export default AuthMessageBanner;