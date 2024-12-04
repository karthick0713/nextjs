//./src/app/(guest)/quote/pay/page.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import dropin, { Dropin } from 'braintree-web-drop-in';
import { useData } from '@/lib/context';
import { processPayment } from '@/lib/api';
import braintree from 'braintree-web';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { AchPaymentForm } from '@/components/AchPaymentForm';
import { AchFormData } from '@/lib/formschemas';

const paymentMethodSchema = z.object({
  paymentMethod: z.enum(['card', 'ach', 'none']).default('none')
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [clientToken, setClientToken] = useState('');
  const [braintreeInstance, setBraintreeInstance] = useState<Dropin>();
  const [serverError, setServerError] = useState<string | null>(null);
  const dropinContainerRef = useRef<HTMLDivElement>(null);
  const braintreeInitialized = useRef(false);
  const { paymentDetails, setPaymentSuccessData } = useData();

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethod: 'none'
    },
  });

  useEffect(() => {
    const id = searchParams.get('quote_id');
    const tk = searchParams.get('token');
    const quote_id = id ? decodeURIComponent(id) : '';
    const token = tk ? decodeURIComponent(tk) : '';

    if (quote_id === paymentDetails.quoteId && token === paymentDetails.clientToken) {
      setQuoteId(quote_id);
      setClientToken(token);
      setAmount(paymentDetails.amount);
    }
  }, [searchParams, paymentDetails]);

  const paymentMethod = form.watch('paymentMethod');
  const initializeBraintreeDropin = async () => {
    if (clientToken && dropinContainerRef.current && !braintreeInitialized.current) {
      try {
        if (dropinContainerRef.current.hasChildNodes()) {
          dropinContainerRef.current.innerHTML = '';
        }

        const instance = await dropin.create({
          authorization: clientToken,
          container: dropinContainerRef.current,
          card: {
            cardholderName: {
              required: true
            }
          }
        });
        
        setBraintreeInstance(instance);
        braintreeInitialized.current = true;
      } catch (error) {
        console.error("Error initializing Braintree:", error);
        setServerError("Failed to initialize payment form.");
      }
    }
  };
  
  useEffect(() => {
    if (form.watch('paymentMethod') === 'card') {
      initializeBraintreeDropin();
    }
    else{
      if (braintreeInstance) {
        braintreeInstance.teardown().then(() => {
          setBraintreeInstance(undefined);
          braintreeInitialized.current = false;
        });
      }
    };
    return;
  }, [paymentMethod,braintreeInstance,initializeBraintreeDropin]);



  const handleCardSubmit = async () => {
    setIsLoading(true);
    setServerError(null);

    try {
      if (!braintreeInstance) {
        throw new Error("Payment form not initialized");
      }
      const btResponsePaymentMethod = await braintreeInstance.requestPaymentMethod();
      const response = await processPayment(quoteId, "card", 'purchase', btResponsePaymentMethod);
      
      if (response.status === 'success') {
        setPaymentSuccessData(response.data);
        console.log("payment success data", response.data);
        router.push('/payment-success');
      }
    } catch (error) {
      console.error("Error processing card payment:", error);
      setServerError("There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAchSubmit = async (achData: AchFormData) => {
    console.log("handleAchSubmit:", achData);
    setIsLoading(true);
    setServerError(null);

    try {
      const clientInstance = await new Promise<any>((resolve, reject) => {
        braintree.client.create({
          authorization: clientToken
        }, (createErr, instance) => {
          if (createErr) {
            reject(createErr);
          }
          resolve(instance);
        });
      });

      const bankAccountInstance = await new Promise<any>((resolve, reject) => {
        braintree.usBankAccount.create({
          client: clientInstance
        }, (bankAccountErr, instance) => {
          if (bankAccountErr) {
            reject(bankAccountErr);
          }
          resolve(instance);
        });
      });

      const tokenizedData = await new Promise<any>((resolve, reject) => {
        bankAccountInstance.tokenize({
          bankDetails: {
            routingNumber: achData.routingNumber,
            accountNumber: achData.accountNumber,
            accountType: achData.accountType.toLowerCase(),
            ownershipType: achData.ownershipType.toLowerCase(),
            billingAddress: {
              streetAddress: achData.billingAddress.address1,
              extendedAddress: achData.billingAddress.address2,
              locality: achData.billingAddress.city,
              region: achData.billingAddress.state,
              postalCode: achData.billingAddress.zipcode
            },
            ...(achData.ownershipType === 'BUSINESS' && {
              businessName: achData.businessName
            }),
            ...(achData.ownershipType === 'PERSONAL' && {
              firstName: achData.firstName,
              lastName: achData.lastName
            })
          },
          mandateText: achData.mandateText
        }, (tokenizeErr: any, data: any) => {
          if (tokenizeErr) {
            reject(tokenizeErr);
          }
          resolve(data);
        });
      });

      const achResponseData = {
        nonce: tokenizedData.nonce,
        description: `US bank account ending in - ${achData.accountNumber.slice(-4)}`,
        type: 'us_bank_account',
      }

      const response = await processPayment(quoteId, "ach_direct", 'purchase', achResponseData);
      
      if (response.status === 'success') {
        setPaymentSuccessData(response.data);
        router.push('/payment-success');
      }
    } catch (error) {
      console.error("Error processing ACH payment:", error);
      setServerError("There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  
  };

  if (!quoteId || !clientToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading checkout information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Complete your purchase securely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
            )}

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input value={amount} disabled />
          </div>

          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Debit or Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ach" id="ach" />
                          <Label htmlFor="ach">ACH Direct Debit</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          { form.watch('paymentMethod') === 'none' ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Please select a payment method to continue.</p>
              </div>
            ) : form.watch('paymentMethod') === 'card' ? (
              <div ref={dropinContainerRef} className="min-h-[200px] border rounded-md p-4" />
            ) : (
              <AchPaymentForm 
                onSubmit={handleAchSubmit}
                amount={amount}
                isLoading={isLoading}
              />
            )}
        </CardContent>
        
        {form.watch('paymentMethod') === 'card' && (
          <CardFooter>
            
            <Button 
              className="w-full" 
              onClick={handleCardSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Submit Payment'
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
