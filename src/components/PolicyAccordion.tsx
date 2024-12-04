// components/PolicyAccordion.tsx
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "./ui/accordion"

import { Badge } from "@/components/ui/badge"
import { PolicyData } from "@/lib/models";
import { format } from 'date-fns';
  
  
  interface PolicyAccordionProps {
    policies: PolicyData[];
  }
  
  const PolicyAccordion = ({ policies }: PolicyAccordionProps) => {
    const formatDate = (dateStr: string) => {
      try {
        return format(new Date(dateStr), 'MMM dd, yyyy');
      } catch {
        return dateStr;
      }
    };
  
    return (
      <Accordion type="single" collapsible className="w-full">
        {policies.map((policy, index) => (
          <AccordionItem key={policy.id} value={`item-${index}`}>
            <AccordionTrigger className="hover:bg-gray-50 px-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-2/3">
                  <div className="">{formatDate(policy.effective_date)}</div>
                  <div className="font-medium">{policy.policynumnew}</div>
                  <div className="text-sm text-left text-gray-500">{policy.line_of_bussiness}</div>
                  
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4 sm:mr-2">
                  <Badge variant={policy.payment_status === 'success' ? 'default' : 'destructive'}
                  className="capitalize">
                    {policy.payment_status}
                  </Badge>
                  {policy.is_renew_eligible === 'yes' && (
                    <Badge variant="outline">
                      <div className="text-sm bg-blue-600 text-white px-2 py-1 rounded-md font-medium">
                      Eligible for Renew
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Policy Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Name:</span>
                    <span>{policy.firstname1} {policy.lastname1}</span>
                    <span className="text-gray-500">Address:</span>
                    <span>
                      {policy.streetline1}
                      {policy.streetline2 && `, ${policy.streetline2}`}
                      {policy.city && `, ${policy.city}`}
                      {policy.state && `, ${policy.state}`}
                      {policy.zipcode && `, ${policy.zipcode}`}
                    </span>
                    <span className="text-gray-500">Effective Date:</span>
                    <span>{formatDate(policy.effective_date)}</span>
                    <span className="text-gray-500">Expiry Date:</span>
                    <span>{formatDate(policy.expDate)}</span>
                    <span className="text-gray-500">Premium:</span>
                    <span>${(policy.premium / 100).toFixed(2)}</span>
                    <span className="text-gray-500">State:</span>
                    <span>{policy.state}</span>
                    <span className="text-gray-500">License:</span>
                    <span>{policy.statelic}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span>{policy.email}</span>
                    <span className="text-gray-500">Phone:</span>
                    <span>
                      {policy.phonearea && policy.phoneexch && policy.phoneext
                        ? `${policy.phonearea}-${policy.phoneexch}-${policy.phoneext}`
                        : 'N/A'}
                    </span>
                    <span className="text-gray-500">Transaction ID:</span>
                    <span>{policy.transid}</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  
  export default PolicyAccordion;