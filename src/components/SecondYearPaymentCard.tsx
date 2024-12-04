import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CreditCard } from "lucide-react";
import { format } from 'date-fns';

interface SecondYearPaymentCardProps {
  policy: {
    policynumnew: string;
    expDate: string;
    premium: number;
  };
  onPayClick: () => void;
}

const SecondYearPaymentCard = ({ policy, onPayClick }: SecondYearPaymentCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <CreditCard className="h-8 w-8 text-emerald-500" />
        <div>
          <CardTitle className="text-xl text-emerald-900">Second Year Payment Due</CardTitle>
          <p className="text-sm text-emerald-700 mt-1">
            Complete your second year payment for policy {policy.policynumnew}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Policy Expiry Date</p>
            <p className="font-medium text-gray-900">
              {format(new Date(policy.expDate), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Premium Due</p>
            <p className="font-medium text-gray-900">
              ${(policy.premium / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onPayClick}
          className="ml-12 gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          Pay Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SecondYearPaymentCard;
