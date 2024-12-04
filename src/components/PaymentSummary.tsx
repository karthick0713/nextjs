import React from 'react';
import { Control, UseFormTrigger } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PremiumData {
  annualPremium: number;
  tax: number;
  taxAmount: number;
  isConvenienceFeeChecked: boolean;
  convenienceFee: number;
  calculatedTotal: number;
  isTwoYear?: boolean;
  payFullTwoYear?: boolean;
}

interface PaymentSummaryProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
  premiumData: PremiumData;
  onConvenienceFeeChange: (checked: boolean) => void;
  onPaymentTermChange?: (payFullTwoYear: boolean) => void;
}

export function PaymentSummary({ 
  control, 
  trigger, 
  premiumData, 
  onConvenienceFeeChange,
  onPaymentTermChange 
}: PaymentSummaryProps) {
  const twoYearPremium = premiumData.annualPremium * 2;
  const displayPremium = premiumData.isTwoYear && premiumData.payFullTwoYear 
    ? twoYearPremium 
    : premiumData.annualPremium;
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {premiumData.isTwoYear && (
          <div className="bg-gray-50 p-4 rounded-md">
            
            <FormField
              control={control}
              name="policy_data.bill_term"
              render={({ field }) => (
                <FormItem>
                  <Label>Having selected the (2) Two Year Policy Term, I prefer to pay for</Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        onPaymentTermChange?.(value === 'two');
                        trigger('payment_term');
                      }}
                      defaultValue="one"
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one" id="one-year-payment" />
                        <Label htmlFor="one-year-payment">One Year</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="two" id="two-year-payment" />
                        <Label htmlFor="two-year-payment">Two Years</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-2">
                <Label>Annual Premium Selected</Label>
              </td>
              <td className="py-2 text-right">
                ${premiumData.annualPremium.toFixed(2)}
              </td>
            </tr>
            {premiumData.isTwoYear && premiumData.payFullTwoYear && (
              <tr>
                <td className="py-2">
                  <Label>Two Year Premium</Label>
                </td>
                <td className="py-2 text-right">${twoYearPremium.toFixed(2)}</td>
              </tr>
            )}
            <tr>
              <td className="py-2">
                <Label>State Tax/Surcharges ({premiumData.tax}%)</Label>
              </td>
              <td className="py-2 text-right">${premiumData.taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2">
                <FormField
                  control={control}
                  name="convenience_fees"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              onConvenienceFeeChange(checked as boolean);
                              trigger('convenience_fees');
                            }}
                          />
                        </FormControl>
                        <Label>Convenience Fee</Label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
              <td className="py-2 text-right">
                ${premiumData.convenienceFee > 0 ? premiumData.convenienceFee.toFixed(2) : 0.00}
              </td>
            </tr>
            <tr className="font-bold border-t">
              <td className="pt-4">
                <Label>Total Amount Due</Label>
              </td>
              <td className="pt-4 text-right">
                ${(displayPremium + premiumData.taxAmount + premiumData.convenienceFee).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}