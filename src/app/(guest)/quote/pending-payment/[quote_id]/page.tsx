'use client';

import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Label } from "@/components/ui/label";


import { PaymentSummary } from "@/components/PaymentSummary";
import { QuoteSaveResponseData,  SecondYearPaymentResponseData } from "@/lib/models";
import { SecondYearPaymentFormSchema } from "@/lib/formschemas";
import { submitAutoRenewal, submitSecondYearPayment } from '@/lib/api';
import { AUTO_RENEWAL_TEXTS, QUOTE_CACHE_KEY } from '@/lib/const';

import { Checkbox } from '@/components/ui/checkbox';
import { stringToBoolean } from '@/lib/utils';
import { useData } from '@/lib/context';
import { ReviewApplication } from '@/components/ReviewApplication';

export default function PendingPaymentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<SecondYearPaymentResponseData | null>(null);
  const [reviewApplicationData, setReviewApplicationData] = useState<QuoteSaveResponseData | null>(null);
  const { setPaymentDetails } = useData();
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  
  const [premiumData, setPremiumData] = useState({
    annualPremium: 0,
    tax: 0,
    taxAmount: 0,
    isConvenienceFeeChecked: false,
    convenienceFee: 0,
    calculatedTotal: 0
  });

  const form = useForm<z.infer<typeof SecondYearPaymentFormSchema>>({
    resolver: zodResolver(SecondYearPaymentFormSchema),
		
    defaultValues: {
      policy_payment_type: 'second_year_payment',
      policy_num: '',
      quote_id: '',
      quote_type:'',
      state: '',
      email: '',
      e_sign: '',
      
      policy_data: {
        
        annual_premium_selected: 0,
        annual_premium: 0,
        limit_claim_id: '',
        convenience_fee: 0,
        total_amount: 0
      },
      t_and_c: false,
    }
  });

  useEffect(() => {
		let data : SecondYearPaymentResponseData | null = null;
    
		if (typeof window !== 'undefined') {

			const cachedQuoteId = localStorage.getItem('quote_id');
			const cachedQuoteString = localStorage.getItem(QUOTE_CACHE_KEY);

			
			if (cachedQuoteString) {
				try {
                    const parsedQuote = JSON.parse(cachedQuoteString);
                    if(parsedQuote.quoteResponse)
					  data = parsedQuote.quoteResponse as SecondYearPaymentResponseData;
                    } catch (error) {
                        console.error("Error parsing cached quote data:", error);
                    }
			}
      
		}
    
		setInitialData(data);
		if (data) {
			try {
					// Initialize form with cached data
					form.reset({
						policy_payment_type: 'second_year_payment',
						//policy_num: data.policy_num,
                        policy_num: 'RAS4885410-24',
                        quote_id: data.quote_id,
                        quote_type: data.quote_type,
                        state: data.state,
                        email: data.email,
                        fullname: data.secondYear_payment.fullname,
                        //email: 'ashvhowell@gmail.com',
						e_sign: '',
						
						policy_data: {
								
								annual_premium_selected: Number(data.secondYear_payment.annual_premium),
								annual_premium: Number(data.secondYear_payment.annual_premium),
								limit_claim_id: data.secondYear_payment.limit_claim_id, 
                                tax_amount: data.secondYear_payment.tax_amount,
								convenience_fee: Number(data.secondYear_payment.convenience_fee),
								total_amount: Number(data.secondYear_payment.total_amount_with_tax)
						},
                        t_and_c: false,
					});

					// Initialize premium data
					setPremiumData({
					annualPremium: Number(data.secondYear_payment.annual_premium),
					tax: 0,
					taxAmount: Number(data.secondYear_payment.tax_amount),
					isConvenienceFeeChecked: false,
					convenienceFee: 0,
					calculatedTotal: Number(data.secondYear_payment.total_amount_with_tax)
					});

			} catch (error) {
					console.error("Error parsing cached data:", error);
					setServerError("Error loading saved data");
			}
		}
    
  }, [form]);

  const handleConvenienceFeeChange = (checked: boolean) => {
    const fee = checked ? 25 : 0;
    const newTotal = premiumData.annualPremium + premiumData.taxAmount + fee;

    setPremiumData({
      ...premiumData,
      isConvenienceFeeChecked: checked,
      convenienceFee: fee,
      calculatedTotal: newTotal
    });

    form.setValue('policy_data.convenience_fee', fee);
    form.setValue('policy_data.total_amount', newTotal);
  };

  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
        <p>Please wait while we load your renewal information.</p>
      </div>
    );
  }
  const onSubmit = async (data: z.infer<typeof SecondYearPaymentFormSchema>) => {
    setIsSubmitting(true);
    setServerError(null);
  
    const formattedData = {
      policy_payment_type: data.policy_payment_type,
      policy_num: data.policy_num,
      quote_id:data.quote_id,
      quote_type:data.quote_type,
      fullname: data.fullname,
      state: data.state,
      email: data.email,
      e_sign: data.e_sign,
      t_and_c: data.t_and_c,
      policy_data: {
        annual_premium_selected: premiumData.annualPremium,
        annual_premium: premiumData.annualPremium,
        limit_claim_id: data.policy_data.limit_claim_id,
        convenience_fee: premiumData.convenienceFee,
        total_amount: premiumData.calculatedTotal
      }
    };
  
    try {
      localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify({
        
        formData: formattedData
      }));
      
      const response = await submitSecondYearPayment(formattedData as unknown as z.infer<typeof SecondYearPaymentFormSchema>);
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
    } catch (error) {
      console.error('Submission error:', error);
      setServerError("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex justify-center items-center p-4">
        <Image 
          src="/landy_logo.png" 
          alt="Landy Logo" 
          width={200} 
          height={200}
          priority
        />
      </div>
      
      <div className="text-xs md:text-sm flex justify-center items-center text-black bg-green-400 p-2">
        Errors and Omissions | Professional Liability Insurance For Great American Real Estate Appraisers
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Second Year Payment</CardTitle>
            <Label>
              You have been located in our database. Please confirm the information below:
            </Label>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-gray-600">Your Name:</Label>
                  <p className="font-medium">{initialData.secondYear_payment.firm_name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Policy Number:</Label>
                  <p className="font-medium">{initialData.policy_num}</p>
                </div>
                <div>
                  <Label className="text-gray-600">State:</Label>
                  <p className="font-medium">{initialData.state}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Current Limit Option:</Label>
                  <p className="font-medium">{initialData.secondYear_payment.current_limit_option}</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (errors)=>{
                  console.log(errors);
                })} className="space-y-6">
                  

                  <div className="space-y-4">

                    <PaymentSummary
                        control={form.control}
                        trigger={form.trigger}
                        premiumData={premiumData}
                        onConvenienceFeeChange={handleConvenienceFeeChange}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-Mail Address</FormLabel>
                            <div className="font-medium">
                            {initialData.email}
                            </div>
                            <FormControl>
                            <input type="hidden" {...field} value={initialData.email} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="e_sign"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Electronic Signature</FormLabel>
                            <FormDescription>
                            The Electronic Signature Process (E-signature) provides you with a faster and more convenient way 
                            to process your application. Filling out this text box is the equivalent of signing your name.
                            </FormDescription>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                    control={form.control}
                    name="t_and_c"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            {AUTO_RENEWAL_TEXTS.TERMS_AND_CONDITIONS.LABEL}
                            </FormLabel>
                            <FormMessage />
                        </div>
                        </FormItem>
                    )}
                    />
									</div>
                  {serverError && (
                    <Alert variant="destructive">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-start gap-4">
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Renewal'}
                    </Button>
                  
                  
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard')}
                      >
                        Cancel
                      </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
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
