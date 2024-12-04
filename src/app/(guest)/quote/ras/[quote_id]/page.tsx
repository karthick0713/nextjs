//./src/app/(guest)/quote/ras/[quote_id]/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'


import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"


import { submitForReview } from "@/lib/api";
import { ReviewApplication } from "@/components/ReviewApplication";

import { ContactInformation } from "@/components/ContactInformation";
import { RAPQualifierQuestions } from "@/components/RAPQualifierQuestions";
import { RAPCoverageOptions } from "@/components/RAPCoverageOptions";
import { PaymentSummary } from "@/components/PaymentSummary";
import { TermsAndConditions } from "@/components/TermsAndConditions";

import { useData } from "@/lib/context";
import { QualifierPolicyDetail, QualifierRASPolicyDetail, QuoteSaveResponseData } from "@/lib/models";
import { BasicInformation } from "@/components/BasicInformation";
import { RASPredecessorFirmInformation } from "@/components/RASPredecessorFirmInformation";
import { RASFirmInformation } from "@/components/RASFirmInformation";

import { RASformSchema } from "@/lib/formschemas";
import { parseDate, stringToBoolean, saveFormValues } from '@/lib/utils';
import { QUOTE_CACHE_KEY } from '@/lib/const';


export default function Page({ params }: { params: { quote_id: string } }) {
  const router = useRouter();
  const premiumTableRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const { setPaymentDetails } = useData();  
  let qualifierResponse;
  let data;  let parsedQualifierResponse;let cachedQuoteId;
  const [formData, setFormData] = useState<QualifierRASPolicyDetail | null>(null);
  const [defaultConvFee, setDefaultConvFee] = useState(0);
  const [defaultTax, setDefaultTax] = useState(0);

  const form = useForm<z.infer<typeof RASformSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(RASformSchema),
  });
  useEffect(() => {
    let data: QualifierRASPolicyDetail | null = null;
    
    // First try to get data from localStorage
    if (typeof window !== 'undefined') {
      const cachedQuoteId = localStorage.getItem('quote_id');
      const cachedQuoteString = localStorage.getItem(QUOTE_CACHE_KEY);
      
      if (cachedQuoteId && cachedQuoteString) {
        const cachedRAPFormData = localStorage.getItem(`RAPform_${cachedQuoteId}`);
        if (cachedRAPFormData) {
          try {
            const cachedRAPFormDataObject = JSON.parse(cachedRAPFormData);
            const parsedQualifierResponse = JSON.parse(cachedQuoteString);
            data = {
              ...cachedRAPFormDataObject,
              tax_fees: parsedQualifierResponse.quoteResponse.tax_fees,
              rates: parsedQualifierResponse.quoteResponse.rates
            } as QualifierRASPolicyDetail;
          } catch (error) {
            console.error("Error parsing cached data:", error);
          }
        }
      }

      // If no cached form data, try to use the cached quote
      if (!data && cachedQuoteString) {
        try {
          const cachedQuote = JSON.parse(cachedQuoteString);
          if (cachedQuote.quoteResponse.quote_id === params.quote_id) {
            data = cachedQuote.quoteResponse as QualifierRASPolicyDetail;
          } else {
            localStorage.removeItem(QUOTE_CACHE_KEY);
          }
        } catch (error) {
          console.error("Error parsing cached quote:", error);
        }
      }
    }
  //Set Initial values
  setFormData(data);
  // Reset form with new values
  if(data){
    
    form.reset({
        quote_id: data?.quote_id || '',
        quote_type: data?.quote_type || 'purchase',
        program: data?.program || '',
        program_code: data?.program_code || 'RAS',
        state: data?.state || '',
        currently_insurance: stringToBoolean(data?.currently_insurance) || false,
        ga_insurance: stringToBoolean(data?.ga_insurance) || false,  
        fullname: data?.fullname || '',
        firm_name: data?.firm_name ? data.firm_name : '',
        address: {
          address_line1: data?.address?.address_line1 || '',
          address_line2: data?.address?.address_line2 || '',
          city: data?.address?.city || '',
          county: data?.address?.county || '',
          state: data?.address?.state || '',
          zipcode: data?.address?.zipcode || '',
        },
        isMailingSame: stringToBoolean(data?.isMailingSame) || false,
        mailing_address: {
          address_line1: data?.mailing_address?.address_line1 || '',
          address_line2: data?.mailing_address?.address_line2 || '',
          city: data?.mailing_address?.city || '',
          county: data?.mailing_address?.county || '',
          state: data?.mailing_address?.state || '',
          zipcode: data?.mailing_address?.zipcode || '',
        },
        phone_no: data?.phone_no || '',
        fax_no: data?.fax_no || '',
        website_url: data?.website_url || '',
        email: data?.email || '',
        confirmEmail: data?.confirmEmail || data?.email || '',
  
        applicant_is: data?.applicant_is || '',
        no_of_professional_more_than_20k: '',
        no_of_professional_less_than_20k: '',
        no_of_transactions: '',
        
        has_predecessor_coverage: stringToBoolean(data?.has_predecessor_coverage) || false,
        predecessor_name: data?.predecessor_name || '',
        predecessor_retroactive_date: parseDate(data?.predecessor_retroactive_date) || undefined,
        predecessor_dissolution_date: parseDate(data?.predecessor_dissolution_date) || undefined,
  
        
        //gross_annual_income:0,
        effective_date: parseDate(data?.effective_date),
        firm_date: parseDate(data?.firm_date),
        premium_table: '',
        policy_data: {
          deductible: data?.policy_data?.deductible || '',
          license_no: !data.policy_data?.license_no ? 
            (data.tax_fees?.license_no || '') : data.policy_data.license_no,
          price_limit: data?.policy_data?.price_limit || '',
          year_policy: Number(data?.policy_data?.year_policy) || 0,
          annual_premium_selected: Number(data?.policy_data?.annual_premium_selected) || 0,
          annual_premium: Number(data?.policy_data?.annual_premium) || 0,
          limit_claim_id: data?.policy_data?.limit_claim_id || '',
          convenience_fee: 0,
          tax_percent: !data.policy_data?.tax_percent ? 
            (data.tax_fees?.tax || '') : data.policy_data.tax_percent,
          state_tax: Number(data?.policy_data?.state_tax) || 0,
          total_amount: Number(data?.policy_data?.total_amount) || 0,
          policy_term: Number(data?.policy_data?.policy_term) || 1,
          bill_term: Number(data?.policy_data?.bill_term) || 1,
        },
        convenience_fees: false, //make them select conv fee everytime
        google_address: data?.google_address || '',
        e_sign: data?.e_sign || '',
        t_and_c: stringToBoolean(data?.t_and_c),
        additional_instructions: !data.policy_data?.additional_instructions ? 
          (data.tax_fees?.additional_instructions || '') : data.policy_data.additional_instructions,
        fraud_warning: !data.policy_data?.fraud_warning ? 
          (data.tax_fees?.fraud_warning || '') : data.policy_data.fraud_warning,
        questions: {
          question1: (data?.questions?.question1),
          question2: (data?.questions?.question2),
          question3: (data?.questions?.question3),
          question4: (data?.questions?.question4),
          question5: (data?.questions?.question5),
          question6: (data?.questions?.question6),
          question7: (data?.questions?.question7),
        },
        answers:{
          question1: stringToBoolean(data?.answers?.question1)|| undefined,
          question2: stringToBoolean(data?.answers?.question2)|| undefined,
          question3: stringToBoolean(data?.answers?.question3)|| undefined,
          question4: stringToBoolean(data?.answers?.question4)|| undefined,
          question5: stringToBoolean(data?.answers?.question5)|| undefined,
          question6: stringToBoolean(data?.answers?.question6)|| undefined,
          question7: stringToBoolean(data?.answers?.question7)|| undefined,
        }
      });
  }
  }, [params.quote_id, form]);

  const { control, watch, trigger, setValue } = form;

  
  const onSubmit = async (data: z.infer<typeof RASformSchema>)=> {
    console.log("On Submit");
    localStorage.setItem('quote_id', data.quote_id);
    
    //saveFormValues(form, `RAP_form_${data.quote_id}`, data);
    saveFormValues(form, `RASform_${data.quote_id}`, data);
    
    const formData = {
      ...data,
      gross_annual_income: parseFloat(data.gross_annual_income.replace(/[^0-9.-]+/g,"")),
      
    };

    if (Object.values(formData.questions).some(value => value === null)) {
      form.setError('questions', { 
        type: 'manual',   
        message: 'All qualifier questions need to be answered' 
      });
      return;
    }
    if (premiumData.annualPremium===0) {
      form.setError('premium_table', { 
        type: 'manual',   
        message: 'Please select a coverage option' 
      });
      return;
    }
    if (formData.isMailingSame) {
      formData.mailing_address = { ...formData.address };
    }
    console.log(formData);
    setIsSubmitting(true);
    try {
        const response = await submitForReview(JSON.stringify(formData)); // Make a POST request
        console.log("submitted", response);
        const typedResponse = response as unknown as QuoteSaveResponseData;
        setReviewApplicationData(typedResponse);
        setPaymentDetails({
          quoteId: typedResponse.quote_id,
          amount: typedResponse.policy_data.total_amount.toString(),
          clientToken: typedResponse.payment_client_token
        });
        setIsSubmitting(false);
        setReviewDrawerOpen(true);
    }
    catch(error){
      
        alert("Submitting form failed!" + error);
      
    }finally{
      setIsSubmitting(false);
    }
  }

  const focusFirstError = (errors: any) => {
    console.log("Focus First Error", errors);
    if (errors) {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        if(firstErrorKey === 'predecessor_retroactive_date'){
          const element = document.getElementById('retroactive-date-button');
          if (element) {
            window.scrollTo({
              top: element.offsetTop - 100,
              behavior: 'smooth'
            });
            element.click();
          }
        }else if(firstErrorKey === 'predecessor_dissolution_date'){
          const element = document.getElementById('dissolution-date-button');
          if (element) {
            window.scrollTo({
              top: element.offsetTop - 100,
              behavior: 'smooth'
            });
            element.click();
          }
        }else if (firstErrorKey === 'effective_date') {
          const element = document.getElementById('effective-date-button');
          if (element) {
            window.scrollTo({
              top: element.offsetTop - 100,
              behavior: 'smooth'
            });
            element.click();
          }
        }else if(firstErrorKey === 'firm_date'){
          const element = document.getElementById('established-date-button');
          if (element) {
            window.scrollTo({
              top: element.offsetTop - 100,
              behavior: 'smooth'
            });
            element.click();
          }
        }else if (firstErrorKey === 'premium_table') {
          if (premiumTableRef.current) {
            premiumTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }else if (firstErrorKey === 'answers'|| firstErrorKey.startsWith('answers.')) {
          if (questionsRef.current) {
            questionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
         else {
          const errorElement = document.getElementsByName(firstErrorKey)[0] as HTMLElement;
          if (errorElement) {
            errorElement.focus();
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  };

  const [premiumData, setPremiumData] = useState({
    annualPremium: 0.00,
    tax: parseFloat(formData?.tax_fees?.tax?.toString() || "0"), //TODO
    //tax:0,
    taxAmount: 0.00,
    isConvenienceFeeChecked: false,
    convenienceFee: 0.00,
    calculatedTotal: 0.00,
    isTwoYear: false,
    payFullTwoYear: false
  });
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [reviewApplicationData, setReviewApplicationData] = useState<QuoteSaveResponseData | null>(null);
  //const [selectedPremium, setSelectedPremium] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePremiumSelect = (premium: number|null, selectedValue: string, isTwoYear: boolean) => {

    //Something changes and premium gets reset, reset the bill term flag also.
    if(premium === null){
      setPremiumData({
        ...premiumData,
        payFullTwoYear:false
      })
    }

    
    const tax_percent = form.getValues("policy_data.tax_percent");
    const tax_amount= (premium?premium*(Number(tax_percent)/100||0):0); 
    
    let calculatedTotal=0;

    //let tax=premium?premium*(premiumData.tax||0):0;
    let tax = 0;
    if (premiumData.payFullTwoYear) {
      calculatedTotal = premium ? premium * 2 : 0;
      tax = tax_amount ? tax_amount * 2 : 0;
    }else{
      calculatedTotal = premium ? premium  : 0;
      tax = tax_amount ? tax_amount : 0;
    }
    
    calculatedTotal = premium? calculatedTotal + tax + premiumData.convenienceFee:0;
    
    setPremiumData({
      ...premiumData,
      annualPremium: premium ? premium : 0,
      tax: Number(tax_percent),
      taxAmount: tax,
      calculatedTotal: calculatedTotal,
      isTwoYear: isTwoYear,
    });
    form.setValue("premium_table", selectedValue, { shouldValidate: true });
    form.setValue("policy_data.annual_premium", premium?premium:0);
    form.setValue("policy_data.state_tax",Number(tax_amount.toFixed(2)));
    form.setValue("policy_data.convenience_fee", premiumData.convenienceFee);
    form.setValue("policy_data.total_amount", Number(calculatedTotal.toFixed(2)));
    form.setValue("policy_data.policy_term", premiumData.isTwoYear?2:1);
    form.setValue("policy_data.tax_percent", Number(tax_percent));
    console.log(selectedValue);

  //{`${tableName}-${limit}-${deductible}-${premium[0]}-${premium[1]}`}
    const parts = selectedValue.split('-');
    
    if (parts.length >= 5) {
      const limit = parts[1].trim();
      form.setValue("policy_data.price_limit", limit);

      const deductible = parts[2].trim();
      form.setValue("policy_data.deductible", deductible);

      const limitclaim_id = parts[4].trim();
      form.setValue("policy_data.limit_claim_id", limitclaim_id);

    }
    console.log("policy_data", form.getValues("policy_data"));
    
  };

  const handleConvenienceFee = (convenienceFee: boolean) => {

    console.log("convenienceFee", convenienceFee);
    const newConvFee = convenienceFee ? Number(formData?.tax_fees?.convenience_fees) : 0.00;  
    const calculatedTotal = convenienceFee ? 
      premiumData.annualPremium + premiumData.taxAmount + newConvFee : 
      premiumData.annualPremium + premiumData.taxAmount;

    setPremiumData({
      ...premiumData,
      isConvenienceFeeChecked: convenienceFee,
      convenienceFee: newConvFee,
      calculatedTotal: calculatedTotal
    });
    console.log("Premium Data", newConvFee,calculatedTotal );
    form.setValue("policy_data.convenience_fee", newConvFee);
    form.setValue("policy_data.total_amount", calculatedTotal);
  };
  const handlePaymentTermChange = (payFullTwoYear: boolean) => {
    const baseAmount = premiumData.isTwoYear && payFullTwoYear 
      ? premiumData.annualPremium * 2 
      : premiumData.annualPremium;
    const newTaxAmount = (baseAmount * premiumData.tax) / 100;
    const newTotal = baseAmount + newTaxAmount + premiumData.convenienceFee;
  
    setPremiumData({
      ...premiumData,
      payFullTwoYear,
      taxAmount:newTaxAmount,
      calculatedTotal: newTotal
    });
    form.setValue("policy_data.state_tax", newTaxAmount);
    form.setValue("policy_data.total_amount", newTotal);
    form.setValue("policy_data.bill_term", payFullTwoYear ? 2 : 1);
    form.setValue("policy_data.year_policy", payFullTwoYear ? 2 : 1);
  };

  useEffect(() => {
    const isMailingSame = form.watch('isMailingSame');
    if (isMailingSame) {
      const address = form.getValues('address');
      form.setValue('mailing_address', address);
    }
  }, [form]);
  
  if (!formData || !formData.questions ||  !formData.rates) {
    // You can either show an error UI
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold mb-4">Error Loading Data</h1>
        <p>Unable to load form data. Please try again later.</p>
      </div>
    );
    
    // Or throw an error which will be caught by your error boundary
    // throw new Error("Required form data is missing");
  }
  return(
    <div className="flex flex-col ">
      <div className="flex justify-center items-center">
          <Image src="/landy_logo.png" alt="Landy Header" width={200} height={200}/>  
      </div>
      <div className="text-xs md:text-sm flex justify-center items-center text-black bg-green-400">
        Errors and Omissions | Professional Liability Insurance For Great American Real Estate Appraisers, Real Estate Agents/Brokers and Accountants
      </div>
      <div>
        <div className="text-xs md:text-lg flex justify-center items-center bg-gray-100 text-black">
          Real Estate Appraisers Errors & Omissions Online Application
        </div>
        <div className="text-xs md:text-lg flex justify-center items-center bg-gray-100 text-black">
          Herbert Landy Insurance {formData?.state} License #: {/*formData?.tax_fees.license_no*/}
        </div>
      </div>
      <div>
        <div className="mx-20 text-xs md:text-lg flex text-black">
          Quote ID:&nbsp;<span className="text-green-500">{formData?.quote_id}</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => focusFirstError(errors))} className="space-y-8">
            
          <BasicInformation control={control} data={{
            fullname: formData?.fullname || '',
            firm_name: formData?.firm_name || ''
          }} />

          <RASPredecessorFirmInformation control={control} watch={watch} trigger={trigger} data={{
            has_predecessor_coverage: formData?.has_predecessor_coverage,
            predecessor_name: formData?.predecessor_name,
            predecessor_retroactive_date: formData?.predecessor_retroactive_date,
            predecessor_dissolution_date: formData?.predecessor_dissolution_date
            }} />

          <ContactInformation
            control={control} 
            watch={watch}
            setValue={setValue} 
            address={formData?.address}
            isMailingSame={formData?.isMailingSame ?? false}
            mailing_address={formData?.mailing_address}
            phone_no={formData?.phone_no}
            fax_no={formData?.fax_no}
            website_url={formData?.website_url}
            email={formData?.email}
            confirmEmail={formData?.confirmEmail || formData?.email}
            />
          
          <RASFirmInformation control={control} trigger={trigger} />
          
          <RAPQualifierQuestions 
              ref={questionsRef}
              control={control} 
              trigger={trigger} 
              questions={formData.questions}
              answers={formData.answers}
            />
          <RAPCoverageOptions
            ref={premiumTableRef}
            control={control}
            trigger={trigger}
            rates={formData?.rates || { one_year: { table1_rate: {}, table2_rate: {} } }}
            onPremiumSelect={handlePremiumSelect}
          />
          <PaymentSummary
            control={control}
            trigger={trigger}
            premiumData={premiumData}
            onConvenienceFeeChange={handleConvenienceFee}
            onPaymentTermChange={handlePaymentTermChange}
          />
          <TermsAndConditions
            control={control}
            trigger={trigger}
          />
          
          
          {/* <button type="submit" className="px-4 py-2 font-bold text-white rounded-lg bg-gradient-to-b opacity-100 from-[#747474] via-[#1E1E1E] to-[#1E1E1E] hover:opacity-90 transition-opacity duration-300 disabled={isSubmitting}"> */}
          <div className="flex justify-center sm:justify-start">
            <Button 
              type="submit" 
              className="w-full sm:w-40"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Review'}
            </Button>
          </div>
          
          </form>
        </Form>
      </div>
      {reviewApplicationData && (
        <ReviewApplication 
          open={isReviewDrawerOpen} 
          onOpenChange={setReviewDrawerOpen} 
          response={reviewApplicationData}
        />
      )}
    </div>
  )
}