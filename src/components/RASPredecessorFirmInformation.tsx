import React from 'react';
import { Control, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RASPredecessorFirmInformationProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  data: {
    has_predecessor_coverage?: boolean;
    predecessor_name?: string;
    predecessor_retroactive_date?: string | Date;
    predecessor_dissolution_date?: string | Date;
  };
}

export function RASPredecessorFirmInformation({ control, watch, trigger, data }: RASPredecessorFirmInformationProps) {
  const hasPredecessorCoverage = watch("has_predecessor_coverage");

  const handleDateChange = (field: any, value: string) => {
    if (value) {
      field.onChange(new Date(value));
    } else {
      field.onChange(undefined);
    }
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predecessor Firm Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="has_predecessor_coverage"
          defaultValue={data.has_predecessor_coverage}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have coverage for any predecessor firms on your current policy?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value === 'yes');
                    trigger(['predecessor_name', 'predecessor_retroactive_date', 'predecessor_dissolution_date']);
                  }}
                  value={field.value ? 'yes' : 'no'}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasPredecessorCoverage && (
          <>
            <FormField
              control={control}
              name="predecessor_name"
              defaultValue={data.predecessor_name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Predecessor Firm Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter predecessor firm name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="predecessor_retroactive_date"
              defaultValue={data.predecessor_retroactive_date}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retroactive Date</FormLabel>
                  <FormControl>
                    <Input 
                      id="retroactive-date-button"
                      type="date" 
                      value={field.value ? formatDate(field.value) : formatDate(data.predecessor_retroactive_date)}
                      onChange={(e) => handleDateChange(field, e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="predecessor_dissolution_date"
              defaultValue={data.predecessor_dissolution_date}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dissolution Date</FormLabel>
                  <FormControl>
                    <Input 
                      id="dissolution-date-button"
                      type="date" 
                      value={field.value ? formatDate(field.value) : formatDate(data.predecessor_dissolution_date)}
                      onChange={(e) => handleDateChange(field, e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm">
              If you have coverage for any predecessor firm(s) on your current policy please provide a copy of the
              endorsement showing coverage for the firm. Please FAX to 1-800-344-5422 or EMAIL to
              landy_insurance@landy.com
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}