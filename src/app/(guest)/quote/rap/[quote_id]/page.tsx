//./src/app/(guest)/quote/rap/[quote_id]/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import { useRouter } from 'next/navigation'



import { Button } from "@/components/ui/button"
import {
  Form,
  
} from "@/components/ui/form"

import { submitForReview } from "@/lib/api";
import { ReviewApplication } from "@/components/ReviewApplication";

import { RAPBasicInformation } from '@/components/RAPBasicInformation';
import { ContactInformation } from "@/components/ContactInformation";
import { RAPQualifierQuestions } from "@/components/RAPQualifierQuestions";
import { RAPCoverageOptions } from "@/components/RAPCoverageOptions";
import { PaymentSummary } from "@/components/PaymentSummary";
import { TermsAndConditions } from "@/components/TermsAndConditions";
import { RAPFirmInformation } from "@/components/RAPFirmInformation";
import { useData } from "@/lib/context";
import { ContactFormData, QualifierPolicyDetail, QuoteSaveResponseData } from "@/lib/models";
import { RAPformSchema } from '@/lib/formschemas';
import { z } from 'zod';
import { parseDate, stringToBoolean, saveFormValues } from '@/lib/utils';

const QUOTE_CACHE_KEY = 'cachedQuote';


export default function Page({ params }: { params: { quote_id: string } }) {
  const router = useRouter();
  const effectiveDateRef = useRef<HTMLButtonElement>(null);
  const establishedDateRef = useRef<HTMLButtonElement>(null);
  const premiumTableRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  //const { qualifierResponse } = useData();
  //console.log("Raw qualifierResponse:", qualifierResponse);
  //const { qualifierResponse, setQualifierResponse } = useData();
  //const [initialData, setInitialData] = useState<any>(null);
  const { setPaymentDetails } = useData();  
  let qualifierResponse;
  let data;  let parsedQualifierResponse;let cachedQuoteId;
  let cachedQuoteString;
  // Initialize data using proper type handling
  const [formData, setFormData] = useState<QualifierPolicyDetail | null>(null);

  const form = useForm<z.infer<typeof RAPformSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(RAPformSchema),
  });
  useEffect(() => {
    let data: QualifierPolicyDetail | null = null;
    
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
            } as QualifierPolicyDetail;
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
            data = cachedQuote.quoteResponse as QualifierPolicyDetail;
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
      quote_id: data.quote_id || '',
      quote_type: data.quote_type || 'purchase',
      program: data.program || '',
      program_code: data.program_code || '',
      state: data.state || '',
      currently_insurance: stringToBoolean(data.currently_insurance) || false,
      ga_insurance: stringToBoolean(data.ga_insurance) || false,
      fullname: data.fullname || '',
      firm_name: Array.isArray(data.firm_name) ? data.firm_name : [],
      address: {
        address_line1: data.address?.address_line1 || '',
        address_line2: data.address?.address_line2 || '',
        city: data.address?.city || '',
        county: data.address?.county || '',
        state: data.address?.state || '',
        zipcode: data.address?.zipcode || '',
      },
      isMailingSame: stringToBoolean(data.isMailingSame) || false,
      mailing_address: {
        address_line1: data.mailing_address?.address_line1 || '',
        address_line2: data.mailing_address?.address_line2 || '',
        city: data.mailing_address?.city || '',
        county: data.mailing_address?.county || '',
        state: data.mailing_address?.state || '',
        zipcode: data.mailing_address?.zipcode || '',
      },
      phone_no: data.phone_no || '',
      fax_no: data.fax_no || '',
      website_url: data.website_url || '',
      email: data.email || '',
      confirmEmail: data.confirmEmail || data.email || '',
      no_of_professional: data.no_of_professional || '',
      effective_date: parseDate(data.effective_date),
      firm_date: parseDate(data.firm_date),
      gross_annual_income: data.gross_annual_income || '',
      premium_table: '',
      questions: {
        question1: data.questions?.question1 || '',
        question2: data.questions?.question2 || '',
        question3: data.questions?.question3 || '',
        question4: data.questions?.question4 || '',
        question5: data.questions?.question5 || '',
        question6: data.questions?.question6 || '',
        question7: data.questions?.question7 || '',
      },
      answers: {
        question1: stringToBoolean(data.answers?.question1),
        question2: stringToBoolean(data.answers?.question2),
        question3: stringToBoolean(data.answers?.question3),
        question4: stringToBoolean(data.answers?.question4),
        question5: stringToBoolean(data.answers?.question5),
        question6: stringToBoolean(data.answers?.question6),
        question7: stringToBoolean(data.answers?.question7),
      },
      policy_data: {
        deductible: data.policy_data?.deductible || '',
        license_no: !data.policy_data?.license_no ? 
          (data.tax_fees?.license_no || '') : data.policy_data.license_no,

        //license_no: data.policy_data?.license_no || '',
        price_limit: data.policy_data?.price_limit || '',
        
        annual_premium_selected: Number(data.policy_data?.annual_premium_selected) || 0,
        annual_premium: Number(data.policy_data?.annual_premium) || 0,
        limit_claim_id: data.policy_data?.limit_claim_id || '',
        convenience_fee: !data.policy_data?.convenience_fee ? 
          (data.tax_fees?.convenience_fees || '') : data.policy_data.convenience_fee,
        tax_percent: Number(data.tax_fees?.tax) ,
        state_tax: Number(data.policy_data?.state_tax) || 0,
        total_amount: Number(data.policy_data?.total_amount) || 0,

      },
      additional_instructions: !data.policy_data?.additional_instructions ? 
        (data.tax_fees?.additional_instructions || '') : data.policy_data.additional_instructions,
      fraud_warning: !data.policy_data?.fraud_warning ? 
        (data.tax_fees?.fraud_warning || '') : data.policy_data.fraud_warning,
      convenience_fees: false,
      google_address: data.google_address || '',
      e_sign: data.e_sign || '',
      t_and_c: stringToBoolean(data.t_and_c),
    });
  }
  }, [params.quote_id, form]);
  


  const { control, watch, trigger } = form;

  
  const onSubmit = async (data: z.infer<typeof RAPformSchema>)=> {
    console.log("On Submit");
    localStorage.setItem('quote_id', data.quote_id);
    
    //saveFormValues(form, `RAP_form_${data.quote_id}`, data);
    saveFormValues(form, `RAPform_${data.quote_id}`, data);
    const formData = {
      ...data,
      gross_annual_income: parseFloat(data.gross_annual_income.replace(/[^0-9.-]+/g,"")),
      
    };

    if (Object.values(formData.answers).some(value => value === null)) {
      form.setError('answers', { 
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
        if (firstErrorKey === 'effective_date') {
          // Handle focus for effective date field
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
          console.log("Final else", errorElement);
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
    tax: parseFloat(formData?.policy_data?.tax_percent?.toString() || "0"),
    taxAmount: 0.00,
    isConvenienceFeeChecked: false,
    convenienceFee: 0.00,
    calculatedTotal: 0.00
  });
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [reviewApplicationData, setReviewApplicationData] = useState<QuoteSaveResponseData | null>(null);
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePremiumSelect = (premium: number|null, selectedValue: string) => {
    const tax_percent = form.getValues("policy_data.tax_percent");
    const tax_amount= (premium?premium*(Number(tax_percent)/100||0):0); 
    
    const calculatedTotal=premium?premium+tax_amount+premiumData.convenienceFee:0;
    setPremiumData({
      ...premiumData,
      tax: Number(tax_percent),
      annualPremium: premium?premium:0,
      taxAmount: Number(tax_amount.toFixed(2)),
      calculatedTotal: Number(calculatedTotal.toFixed(2)), 
    });
    form.setValue("premium_table", selectedValue, { shouldValidate: true });
    form.setValue("policy_data.annual_premium", premium?premium:0);
    form.setValue("policy_data.state_tax",Number(tax_amount.toFixed(2))); 
    form.setValue("policy_data.convenience_fee", Number(premiumData.convenienceFee.toFixed(2)));
    form.setValue("policy_data.total_amount", Number(calculatedTotal.toFixed(2)));
    form.setValue("policy_data.tax_percent", Number(tax_percent));
    form.setValue("policy_data.year_policy", Number(1));

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

      console.log("parts", parts);
    }
    
    
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [showTable1, setShowTable1] = useState(true);

  useEffect(() => {
    const question5Value = form.watch('answers.question5');
    const question6Value = form.watch('answers.question6');
    const question7Value = form.watch('answers.question7');
  
    const shouldShowTable1 = !(question5Value && question6Value && question7Value);
      
    if (showTable1 !== shouldShowTable1) {
      setShowTable1(shouldShowTable1);
      setSelectedOption(null);
      handlePremiumSelect(null, "");
    }
  }, [form, 
    handlePremiumSelect, 
    showTable1,
    form.watch('answers.question5'), 
    form.watch('answers.question6'), 
    form.watch('answers.question7')]);

  

  useEffect(() => {
    const isMailingSame = form.watch('isMailingSame');
    if (isMailingSame) {
      const address = form.getValues('address');
      form.setValue('mailing_address', address);
    }
  }, [form]);


  

  const handleQuestionChange = (key: string, value: boolean) => {

    
    if (key === 'question5' || key === 'question6' || key === 'question7') {
      const question5Value = key === 'question5' ? value : form.getValues('questions.question5');
      const question6Value = key === 'question6' ? value : form.getValues('questions.question6');
      const question7Value = key === 'question7' ? value : form.getValues('questions.question7');
      
      const shouldShowTable1 = Boolean(question5Value) && Boolean(question6Value) && Boolean(question7Value);
      setShowTable1(shouldShowTable1);
      setSelectedOption(null);
      handlePremiumSelect(null, "");
    }
  };
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
        Herbert Landy Insurance {formData?.state} License #: {formData?.tax_fees?.license_no}
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
          <RAPBasicInformation control={control} initialData={formData} />
          
          {/* <ContactInformation control={control} watch={watch} initialData={formData} /> */}

          <ContactInformation 
            control={control} 
            watch={watch}
            setValue={form.setValue}  // Add this
            address={formData?.address}
            isMailingSame={formData?.isMailingSame}
            mailing_address={formData?.mailing_address}
            phone_no={formData?.phone_no}
            fax_no={formData?.fax_no}
            website_url={formData?.website_url}
            email={formData?.email}
            confirmEmail={formData?.confirmEmail || formData?.email}
          />
          
          <RAPFirmInformation control={control} trigger={trigger} />
          
          <RAPQualifierQuestions 
              ref={questionsRef}
              control={control} 
              trigger={trigger} 
              questions={formData.questions} 
              answers={formData.answers}
              //onQuestionChange={handleQuestionChange}
            />
          <RAPCoverageOptions
            ref={premiumTableRef}
            control={control}
            trigger={trigger}
            //rates={data.rates}
            rates={formData?.rates || { one_year: { table1_rate: {}, table2_rate: {} } }}
            showTable1={showTable1}
            onPremiumSelect={handlePremiumSelect}
          />
          <PaymentSummary
            control={control}
            trigger={trigger}
            premiumData={premiumData}
            onConvenienceFeeChange={handleConvenienceFee}
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