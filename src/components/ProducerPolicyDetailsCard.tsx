import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import { RenewalPolicyData } from '@/lib/models';
import { getLineOfBusiness } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

interface PolicyDetailsProps {
  policy: RenewalPolicyData;
  isOpen: boolean;
  onClose: () => void;
}

const ProducerPolicyDetailsCard: React.FC<PolicyDetailsProps> = ({
  policy,
  isOpen,
  onClose
}) => {
  const DetailRow = ({ label, value }: { label: string; value: string | number | null }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 py-3 border-b last:border-b-0">
      <div className="text-sm font-medium text-blue-700">{label}</div>
      <div className="sm:col-span-2 text-sm mt-1 sm:mt-0">
        {value || '-'}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">
          Policy Details for {policy.policynum2}
        </DialogTitle>
        <Card className="border-0 shadow-none">
          <CardHeader className="rounded-t-lg pb-3">
              <CardTitle className="text-lg font-semibold text-green-800">
                Policy Information: {policy.policynum2} ({policy.firmname})
              </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <DetailRow label="Line of Business" value={getLineOfBusiness(policy.policynum2)} />
              </div>
              <div className="space-y-1">
                <DetailRow label="State" value={policy.state} />
                <DetailRow label="Policy No" value={policy.policynum2} />
                
                <DetailRow label="Effective Date" value={policy.effective_date || '-'} />
                <DetailRow label="Expiration Date" value={policy.expdate} />
                <DetailRow 
                  label="Mailing Address" 
                  value={`${policy.state},\n${policy.zipcode}`}
                />
              </div>
            </div>
            <div className="col-span-2">
              <DetailRow label="Email ID" value={"EMAIL ID"} />
              <DetailRow label="Renewal Warranty" value={policy.claim? 'No' : 'Yes'} />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ProducerPolicyDetailsCard;