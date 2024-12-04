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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface RASFirmInformationProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
}

export function RASFirmInformation({ control, trigger }: RASFirmInformationProps) {
  const effectiveDateRef = useRef<HTMLButtonElement>(null);
  const establishedDateRef = useRef<HTMLButtonElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm Related Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-col md:space-x-0 space-y-4 md:space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
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
        </div>
        <FormField
            control={control}
            name="applicant_is"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Applicant is</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                    name="applicant_is"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="IC" id="applicant-ic" />
                      <FormLabel htmlFor="applicant-ic" className="font-normal">
                        Independent Contractor
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SP" id="applicant-sp" />
                      <FormLabel htmlFor="applicant-sp" className="font-normal">
                        Sole Proprietor
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PART" id="applicant-part" />
                      <FormLabel htmlFor="applicant-part" className="font-normal">
                        Partnership/LLP
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CORP" id="applicant-corp" />
                      <FormLabel htmlFor="applicant-corp" className="font-normal">
                        Corporation/LLC
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="space-y-2 sm:space-y-4">
        <Label>Note: The professional count includes yourself. There must be at least 1 full or 1 part time professional indicated. Neither question can be left blank. Please enter “0” if applicable in one of the two fields.</Label>
        <FormField
          control={control}
          name="no_of_professional_more_than_20k"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Total number of professionals earning $20,000/year or more :</FormLabel>
              <FormControl>           
                <Input 
                  placeholder="Number of Professionals" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('no_of_professional_more_than_20k');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField 
          control={control}
          name="no_of_professional_less_than_20k"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Total number of professionals earning less than $20,000/year</FormLabel>
              <FormControl>           
                <Input 
                  placeholder="Number of Professionals" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('no_of_professional_less_than_20k');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={control}
          name="no_of_transactions"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Annual Number of transaction sides (on closed real estate sales)</FormLabel>
              <FormControl>           
                <Input 
                  placeholder="Number of Transactions" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('no_of_transactions');
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
              <FormLabel>Total Gross Revenue for prior 12 months</FormLabel>
              <FormControl>
                <CurrencyInput
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="gross_annual_income"
                  name="gross_annual_income"
                  placeholder="Gross Reveneue (Prior 12 months)"
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
        </div>
      </CardContent>
    </Card>
  );
}