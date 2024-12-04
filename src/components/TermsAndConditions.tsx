import React from 'react';
import { Control, UseFormTrigger } from "react-hook-form";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TermsAndConditionsProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
}

export function TermsAndConditions({ control, trigger }: TermsAndConditionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="e_sign"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Signature</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Type your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="t_and_c"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    trigger('t_and_c');
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-medium">
                  By checking, I agree to accept an electronic version of my application with my policy as well as agreeing to all other terms and conditions of this transaction.
                </FormLabel>
                <FormMessage />
                <div className="text-sm font-medium mt-2">
                  Date: {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </div>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}