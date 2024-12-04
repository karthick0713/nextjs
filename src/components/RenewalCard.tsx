import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { format } from 'date-fns';

interface RenewalCardProps {
  renewal: {
    policynumnew: string;
    expDate: string;
    premium: number;
  };
  onRenewClick: () => void;
}

const RenewalCard = ({ renewal, onRenewClick }: RenewalCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <CalendarCheck className="h-8 w-8 text-blue-500" />
        <div>
          <CardTitle className="text-xl text-blue-900">Ready for Renewal</CardTitle>
          <p className="text-sm text-blue-700 mt-1">
            Your policy {renewal.policynumnew} is eligible for renewal
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current Expiry Date</p>
            <p className="font-medium text-gray-900">
              {format(new Date(renewal.expDate), 'MMMM dd, yyyy')}
            </p>
          </div>
          
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onRenewClick}
          className="ml-12 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Renew Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RenewalCard;