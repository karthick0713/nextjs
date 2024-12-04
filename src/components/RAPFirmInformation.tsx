import React, { useRef } from 'react';
import { Control, UseFormTrigger } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import CurrencyInput from 'react-currency-input-field';

interface RAPFirmInformationProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
}

export function RAPFirmInformation({ control, trigger }: RAPFirmInformationProps) {
  const effectiveDateRef = useRef<HTMLButtonElement>(null);
  const establishedDateRef = useRef<HTMLButtonElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm Related Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <FormField
          control={control}
          name="effective_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Effective Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      ref={effectiveDateRef}
                      id="effective-date-button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      effectiveDateRef.current?.click();
                      trigger('effective_date');
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="firm_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Established Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      ref={establishedDateRef}
                      id="established-date-button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      establishedDateRef.current?.click();
                      trigger('firm_date');
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="no_of_professional"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Number of Professionals</FormLabel>
              <FormControl>           
                <Input 
                  placeholder="Number of Professionals" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('no_of_professional');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gross_annual_income"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Gross Annual Income</FormLabel>
              <FormControl>
                <CurrencyInput
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="gross_annual_income"
                  name="gross_annual_income"
                  placeholder="Please enter a number"
                  allowDecimals={true}
                  decimalSeparator="."
                  groupSeparator=","
                  prefix="$"
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value || "");
                    trigger('gross_annual_income');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}