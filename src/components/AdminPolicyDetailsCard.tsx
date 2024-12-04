import React from 'react';
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PolicyData } from '@/lib/models';
import { getLineOfBusiness } from '@/lib/utils';

interface PolicyDetailsProps {
  policy: PolicyData;
  isOpen: boolean;
  onClose: () => void;
}

const PolicyDetailsCard: React.FC<PolicyDetailsProps> = ({
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
          Policy Details for {policy.policynumnew}
        </DialogTitle>
        <Card className="border-0 shadow-none">
          <CardHeader className="rounded-t-lg pb-3">
           
              <CardTitle className="text-lg font-semibold text-green-800">
                Policy Information: {policy.policynumnew} ({policy.firstname1} {policy.lastname1})
              </CardTitle>
              {/* <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button> */}
            
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <DetailRow label="Transaction ID" value={policy.transid} />
                <DetailRow label="Error Code" value={policy.assoc || '-'} />
                <DetailRow label="Payment Status" value={policy.payment_status} />
                <DetailRow label="Policy Status" value={policy.carrier1} />
                <DetailRow label="Payment Type" value={policy.cardnum} />
                <DetailRow label="Line of Business" value={getLineOfBusiness(policy.policynumnew)} />
              </div>
              <div className="space-y-1">
                <DetailRow label="State" value={policy.state} />
                <DetailRow label="Policy No" value={policy.policynumnew} />
                <DetailRow 
                  label="Premium" 
                  value={`Premium: $${(policy.premium/100).toFixed(2)}\nTax 0%: $0.00`} 
                />
                <DetailRow label="Effective Date" value={policy.effective_date || '-'} />
                <DetailRow label="Expiration Date" value={policy.expDate} />
                <DetailRow 
                  label="Mailing Address" 
                  value={`${policy.firstname1},\n${policy.state},\n${policy.city},\n${policy.zipcode}`} 
                />
              </div>
            </div>
            <div className="col-span-2">
              <DetailRow label="Email ID" value={policy.email} />
              <DetailRow label="Renewal Warranty" value={policy.is_renew_eligible ? 'yes' : 'no'} />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyDetailsCard;