// components/AchPaymentForm.tsx
import React, { useEffect } from 'react';
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { achFormSchema, type AchFormData } from '@/lib/formschemas';
import { US_STATES } from '@/lib/const';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';


interface AchPaymentFormProps {
  onSubmit: (data: AchFormData) => Promise<void>;
  amount: string;
  isLoading?: boolean;
}

export function AchPaymentForm({ onSubmit, amount, isLoading = false  }: AchPaymentFormProps) {
  
  const form = useForm<AchFormData>({
    resolver: zodResolver(achFormSchema),
    mode:"onSubmit",
    defaultValues: {
      accountNumber: '',
      routingNumber: '',
      accountType: undefined,
      ownershipType: undefined,
      firstName: '',
      lastName: '',
      businessName: '',
      billingAddress: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
      },
      mandateText: '',
    },
  });

  const getMandateText = (data: AchFormData) => {
    const accountHolder = data.ownershipType === 'PERSONAL' 
      ? `${data.firstName} ${data.lastName}`.trim() || ''
      : data.businessName?.trim() || '';

    return `By clicking "Submit", I authorize Braintree, a service of PayPal, on behalf of Landy Insurance to verify my bank account information using bank information and consumer reports and I authorize Landy Insurance to initiate an ACH/electronic debit to my ${data.accountType?.toLowerCase()} account, Depository Name: ${
      accountHolder
    }, Routing Number: ${data.routingNumber} and Account Number: ${data.accountNumber}, in the amount of $${amount} on ${new Date().toLocaleDateString()}. I agree the ACH transactions I authorize comply with all applicable laws.`;
  };

  const watchedFields = form.watch();
  // Update mandate text whenever relevant fields change
  useEffect(() => {
    const mandateText = getMandateText(watchedFields);
    if (mandateText) {
      form.setValue('mandateText', mandateText, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [
    watchedFields.accountNumber,
    watchedFields.routingNumber,
    watchedFields.accountType,
    watchedFields.ownershipType,
    watchedFields.firstName,
    watchedFields.lastName,
    watchedFields.businessName,
    amount,
    form
  ]);
  
  const handleSubmit = async (data: AchFormData) => {
    const mandateText = getMandateText(data);
    data.mandateText = mandateText;
    console.log("handle Submitting:", data);
    await onSubmit(data);
  };

  function focusFirstError(errors: FieldErrors<{ accountNumber: string; routingNumber: string; accountType: "CHECKING" | "SAVINGS"; ownershipType: "PERSONAL" | "BUSINESS"; billingAddress: { address1: string; city: string; state: string; zipcode: string; address2?: string | undefined; }; mandateText: string; firstName?: string | undefined; lastName?: string | undefined; businessName?: string | undefined; }>): unknown {
    console.log('focusFirstError:', errors);
    throw new Error('Function not implemented.');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit,(errors) => focusFirstError(errors))} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="routingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Routing Number</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={9} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CHECKING">Checking</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownershipType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PERSONAL">Personal</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch("ownershipType") === "PERSONAL" ? (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : form.watch("ownershipType") === "BUSINESS" && (
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing Address</h3>
          
          <FormField
            control={form.control}
            name="billingAddress.address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingAddress.address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="billingAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Display mandate text if it exists */}
        <div className="text-sm text-gray-600 mt-4">
          {form.getValues('mandateText') && (
            <p>{form.getValues('mandateText')}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full"
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
        {/* Add general form error display */}
        {form.formState.errors.root && (
          <p className="text-red-500 text-sm mt-2">{form.formState.errors.root.message}</p>
        )}
      </form>
    </Form>
  );
}