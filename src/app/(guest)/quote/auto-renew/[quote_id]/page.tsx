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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { PaymentSummary } from "@/components/PaymentSummary";
import { QuoteSaveResponseData, RAPAutoRenewalData, RAPAutoRenewalFormValues } from "@/lib/models";
import { RAPAutoRenewalFormSchema } from "@/lib/formschemas";
import { submitAutoRenewal } from '@/lib/api';
import { AUTO_RENEWAL_TEXTS, QUOTE_CACHE_KEY } from '@/lib/const';

import { Checkbox } from '@/components/ui/checkbox';
import { stringToBoolean } from '@/lib/utils';
import { useData } from '@/lib/context';
import { ReviewApplication } from '@/components/ReviewApplication';

export default function RAPAutoRenew() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<RAPAutoRenewalData | null>(null);
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

  const form = useForm<z.infer<typeof RAPAutoRenewalFormSchema>>({
    resolver: zodResolver(RAPAutoRenewalFormSchema),
		
    defaultValues: {
      policy_payment_type: 'auto_renewal',
      policy_num: '',
      quote_id: '',
      quote_type:'',
      state: '',
      email: '',
      e_sign: '',
      no_changes: {
        address_contact: false,
        new_firms_additional: false,
        limit_changes: false
      },
      policy_data: {
        price_limit: '',
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
		let data : RAPAutoRenewalData | null = null;
    
		if (typeof window !== 'undefined') {

			const cachedQuoteId = localStorage.getItem('quote_id');
			const cachedQuoteString = localStorage.getItem(QUOTE_CACHE_KEY);

			if (cachedQuoteId && cachedQuoteString) {
					const cachedRAPFormData = localStorage.getItem(`RAPAutoRenwalform_${cachedQuoteId}`);
					if (cachedRAPFormData) {
						try {
							const cachedRAPFormDataObject = JSON.parse(cachedRAPFormData);
							//const parsedQualifierResponse = JSON.parse(cachedQuoteString);
							data = {
								...cachedRAPFormDataObject,
								
							} as RAPAutoRenewalData;
						} catch (error) {
							console.error("Error parsing cached data:", error);
						}
					}
			}
			if (!data && cachedQuoteString) {
				try {
          const parsedQuote = JSON.parse(cachedQuoteString);
          if(parsedQuote.quoteResponse)
					  data = parsedQuote.quoteResponse as RAPAutoRenewalData;
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
						policy_payment_type: 'auto_renewal',
						policy_num: data.autoRenewal_data.policy_num,
            quote_id: data.quote_id,
            quote_type: data.quote_type,
						state: data.state,
						//email: data.email,
            email: 'ashvhowell@gmail.com',
						e_sign: '',
						no_changes: {
								address_contact: false,
								new_firms_additional: false,
								limit_changes: false
						},
						policy_data: {
								price_limit: data.autoRenewal_data.current_limit_option,
								annual_premium_selected: Number(data.autoRenewal_data.annual_premium),
								annual_premium: Number(data.autoRenewal_data.annual_premium),
								limit_claim_id: data.autoRenewal_data.limit_claim_id, 
								convenience_fee: Number(data.autoRenewal_data.convenience_fees),
								total_amount: Number(data.autoRenewal_data.total_amount_with_tax)
						},
            t_and_c: false,
					});

					// Initialize premium data
					setPremiumData({
					annualPremium: Number(data.autoRenewal_data.annual_premium),
					tax: 0,
					taxAmount: Number(data.autoRenewal_data.tax_amount),
					isConvenienceFeeChecked: false,
					convenienceFee: 0,
					calculatedTotal: Number(data.autoRenewal_data.total_amount_with_tax)
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
  const onSubmit = async (data: z.infer<typeof RAPAutoRenewalFormSchema>) => {
    setIsSubmitting(true);
    setServerError(null);
  
    const formattedData = {
      policy_payment_type: 'auto_renewal' as const,
      policy_num: data.policy_num,
      quote_id:data.quote_id,
      quote_type:data.quote_type,
      state: data.state,
      email: data.email,
      e_sign: data.e_sign,
      t_and_c: data.t_and_c,
      no_changes: {
        address_contact: stringToBoolean(data.no_changes.address_contact) ,
        new_firms_additional: stringToBoolean(data.no_changes.new_firms_additional),
        limit_changes: stringToBoolean(data.no_changes.limit_changes)
      },
      policy_data: {
        price_limit: data.policy_data.price_limit,
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
      
      const response = await submitAutoRenewal(formattedData as unknown as z.infer<typeof RAPAutoRenewalFormSchema>);
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

      router.push('/auto-renewal/success');
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
            <CardTitle className="text-2xl">Auto Renewal Form</CardTitle>
            <Label>
              You have been located in our database. Please confirm the information below:
            </Label>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-gray-600">Your Name:</Label>
                  <p className="font-medium">{initialData.autoRenewal_data.firm_name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Policy Number:</Label>
                  <p className="font-medium">{initialData.autoRenewal_data.policy_num}</p>
                </div>
                <div>
                  <Label className="text-gray-600">State:</Label>
                  <p className="font-medium">{initialData.state}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Current Limit Option:</Label>
                  <p className="font-medium">{initialData.autoRenewal_data.current_limit_option}</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (errors)=>{
                  console.log(errors);
                })} className="space-y-6">
                  

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Qualification Questions</h3>
                    <FormDescription>
                      To qualify to renew your Real Estate Appraisers Errors and Ommisions Insurance policy online, 
                      the following 3 items must be checked as No:
                    </FormDescription>

                    
                    <FormField
                      control={form.control}
                      name='no_changes.address_contact'
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? true : false);
                                }}
                              />
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I confirm there are NO changes to my address or contact information
                              </FormLabel>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='no_changes.new_firms_additional'
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? true : false);
                                }}
                              />
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              I confirm there are NO new firms to list as additional insured
                              </FormLabel>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='no_changes.limit_changes'
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? true : false);
                                }}
                              />
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              I confirm there are NO changes to limits or deductibles
                              </FormLabel>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <RenewalCheckbox
                      control={form.control}
                      name="no_changes.address_contact"
                      label="I confirm there are NO changes to my address or contact information"
                    />

                    <RenewalCheckbox
                      control={form.control}
                      name="no_changes.new_firms_additional"
                      label="I confirm there are NO new firms to list as additional insureds"
                    />

                    <RenewalCheckbox
                      control={form.control}
                      name="no_changes.limit_changes"
                      label="I confirm there are NO changes to limits or deductibles"
                    /> */}
                    
                  

                  <FormDescription className="text-blue-600">
                    If there are changes to your policy, please contact our office at 800-336-5422
                  </FormDescription>

                  

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
