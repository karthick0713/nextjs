import React from 'react';
import { Control, UseFormTrigger } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RateTable {
  [key: string]: {
    [limit: string]: string;
  };
}

interface CoverageOptionsProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
  rates: {
    one_year: {
      table1_rate: RateTable;
      table2_rate: RateTable;
    };
  };
  isTable1Disabled: boolean;
  onPremiumSelect: (premium: number | null, selectedValue: string) => void;
}

export function CoverageOptions({ 
  control, 
  trigger, 
  rates, 
  isTable1Disabled, 
  onPremiumSelect 
}: CoverageOptionsProps) {
  const renderTable = (table: RateTable, tableName: string, isDisabled: boolean) => {
    const deductible = Object.keys(table)[0];
    const limits = Object.entries(table[deductible]);

    return (
      <div className="md:w-1/2 px-2">
        <h3 className="text-lg font-semibold mb-4">{tableName}</h3>
        <div className="border p-2">
          <div className="flex justify-between font-bold mb-4">
            <span>Per Claim/Annual Aggregate</span>
            <span>Premium</span>
          </div>
        </div>
        {limits.map(([limit, premium], index) => (
          <div key={`${tableName}-${index}`} 
               className={`flex items-center justify-between mb-4 border p-2 ${isDisabled ? "opacity-50" : ""}`}>
            <Label htmlFor={`${tableName}-${index}`} className="flex-grow">
              {limit}
            </Label>
            <RadioGroupItem 
              value={`${tableName}-${limit}-${premium}`}
              id={`${tableName}-${index}`}
              onClick={() => onPremiumSelect(Number(premium), `${tableName}-${limit}-${premium}`)}
              disabled={isDisabled}
            />
            <span className="ml-2">${parseFloat(premium).toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Coverage Limit</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex md:space-x-4 space-y-4 md:space-y-0">
        <FormField
          control={control}
          name="premium_table"
          render={({ field }) => (
            <FormItem>  
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    const [, , , premium] = value.split('-');
                    onPremiumSelect(Number(premium), value);
                    field.onChange(value);
                    trigger('premium_table');
                  }} 
                  className="md:flex md:space-x-4"
                >
                  {renderTable(rates.one_year.table1_rate, "Table 1", isTable1Disabled)}
                  {renderTable(rates.one_year.table2_rate, "Table 2", false)}
                </RadioGroup>
              </FormControl>  
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}