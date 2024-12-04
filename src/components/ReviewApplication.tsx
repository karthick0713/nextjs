'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DownloadIcon, ExternalLinkIcon, CheckCircleIcon } from "lucide-react"
import { QuoteSaveResponseData } from '@/lib/models';
import { downloadPDF } from '@/lib/api';
const PDF_DOWNLOAD_URL = 'https://api.axylerate.com/api/pdf-download';
interface ReviewApplicationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: QuoteSaveResponseData;
}

export function ReviewApplication({ open, onOpenChange, response }: ReviewApplicationProps) {


  console.log('Response in ReviewApplication:', response);
  console.log('Firm Name type:', typeof response.firm_name);
  console.log('Firm Name value:', response.firm_name);
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!response.quote_id) {
      console.error('Quote ID is missing');
      return;
    }
  
    try {
      downloadPDF(response.quote_id);
    } catch (error) {
      console.error('Error initiating download:', error);
    }
  };
  
  const handleOpenApplication = () => {
    if (!response.quote_id) {
      console.error('Quote ID is missing');
      return;
    }
  
    try {
      window.open(`${PDF_DOWNLOAD_URL}?quote_id=${encodeURIComponent(response.quote_id)}&response=inline`, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const quoteId = response.quote_id;
    const paymentClientToken = response.payment_client_token;
    
    if (quoteId) {
      const url = `/quote/pay?token=${encodeURIComponent(paymentClientToken)}&quote_id=${encodeURIComponent(quoteId.toString())}`;
      router.push(url);
    } else {
      console.error('Quote ID is null');
      // Handle the case where quoteId is null, e.g., show an error message to the user
    }
    setIsSubmitting(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-gray-50">
        <DrawerHeader className="bg-blue-500 text-white">
          <DrawerTitle className="text-2xl font-bold">Application Review</DrawerTitle>
          <DrawerDescription className="text-blue-100">
            Please review your application details carefully before proceeding to payment.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-200px)] px-4 py-6">
          <div className="space-y-8 px-2">
            <Section title="Quote Details" icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}>
              <DataItem label="Program" value={response.program} />
              <DataItem label="State" value={response.state} />
              
              <DataItem label="Effective Date" value={response.effective_date} />
            </Section>

            <Section title="Personal Information" icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}>
              <DataItem label="Full Name" value={response.fullname} />
              <DataItem 
                label="Firm Name" 
                value={
                  Array.isArray(response.firm_name) 
                    ? response.firm_name.join(', ')
                    : typeof response.firm_name === 'string'
                    ? response.firm_name
                    : ''
                } 
              />
              <DataItem label="Phone" value={response.phone_no} />
              <DataItem label="Fax" value={response.fax_no} />
              <DataItem label="Email" value={response.email} />
              <DataItem label="Website" value={response.website_url} />
            </Section>

            <Section title="Address Information" icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}>
              <DataItem label="Address" value={response.address} />
              <DataItem label="Mailing Address" value={response.mailing_address} />
            </Section>

            <Section title="Eligibility Questions" icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}>
              {Object.entries(response.questions).map(([key, value], index) => (
                <DataItem key={key} label={`${index + 1}. ${key}`} value={value ? 'True' : 'False'} />
              ))}
            </Section>

            <Section title="Policy Data" icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}>
              <DataItem label="Price Limit" value={response.policy_data.price_limit} />
              <DataItem label="Deductible" value={`$${response.policy_data.deductible}`} />
              <FinancialSummary policyData={response.policy_data} />
            </Section>
          </div>
        </ScrollArea>
        <DrawerFooter className="bg-white border-t border-gray-200">
          <div className="w-full space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:space-x-4">
            <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
              <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto">
                <DownloadIcon className="mr-2 h-4 w-4" /> 
                Download Application
              </Button>
              {/* <Button variant="outline" onClick={handleOpenApplication} className="w-full sm:w-auto">
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                Open Application
              </Button> */}
            </div>
            <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full sm:w-auto "
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Go Back & Modify
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


interface FinancialSummaryProps {
  policyData: {
    annual_premium: string;
    state_tax: string;
    convenience_fee: string;
    total_amount: string;
  };
}

function FinancialSummary({ policyData }: FinancialSummaryProps) {
  return (
    <div className="w-full max-w-md mt-4">
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between py-1">
          <span>Annual Premium:</span>
          <span>${policyData.annual_premium}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>State Tax:</span>
          <span>${policyData.state_tax}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Convenience Fee:</span>
          <span>${policyData.convenience_fee}</span>
        </div>
        <div className="flex justify-between py-2 font-bold border-t border-gray-200 mt-2">
          <span>Total Amount:</span>
          <span>${policyData.total_amount}</span>
        </div>
      </div>
    </div>
  );
}
interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function Section({ title, children, icon }: SectionProps) {
  return (
    <div className="space-y-3 bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold flex items-center text-blue-00">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

interface DataItemProps {
  label: string;
  value: string | number | boolean;
}

function DataItem({ label, value }: DataItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value?value.toString():""}</span> 
    </div>
  )
}