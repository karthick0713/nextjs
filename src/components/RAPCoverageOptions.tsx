//./src/components/RAPCoverageOptions.tsx
import React, { forwardRef } from 'react';
import { Control, UseFormTrigger } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from '@radix-ui/react-label';

interface NormalizedRate {
  tableName: string;
  rates: any;
  isMultiDeductible: boolean;
}

interface RAPCoverageOptionsProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
  rates: any;
  showTable1?: boolean;
  onPremiumSelect: (premium: number | null, selectedValue: string, isMultiYear: boolean) => void;
}

const normalizeRates = (rates: any): NormalizedRate[] => {
  const normalizedRates: NormalizedRate[] = [];

  if (rates && rates.table_rate) {
    const isMultiDeductible = Object.keys(rates.table_rate).length > 1;
    normalizedRates.push({ tableName: 'Coverage Options', rates: rates.table_rate, isMultiDeductible });
  } else if (rates.table1_rate || rates.table2_rate) {
    // ['table1_rate', 'table2_rate'].forEach(tableName => {
    //   if (rates.tableName) {  
    //     const isMultiDeductible = Object.keys(rates.tableName).length > 1;
    //     normalizedRates.push({ tableName: `Table ${tableName.slice(-1)}`, rates: rates.tableName, isMultiDeductible }); 
    //   }
    // });
    
      normalizedRates.push({
      tableName: 'Table 1',
      rates: rates.table1_rate[0] || {},
      isMultiDeductible: false
    });
 

    // normalizedRates.push({
    //   tableName: 'Table 2',
    //   rates: rates.table2_rate[0] || {},
    //   isMultiDeductible: false
    // });
  
  } else {
    const isMultiDeductible = Object.keys(rates).length > 1;
    normalizedRates.push({ tableName: 'Coverage Options', rates, isMultiDeductible });
  }

  return normalizedRates;
};
export const RAPCoverageOptions = forwardRef<HTMLDivElement, RAPCoverageOptionsProps>(
  function RAPCoverageOptions({ control, trigger, rates, showTable1, onPremiumSelect }, ref) {
  const normalizedRates = normalizeRates(rates);
  const [isMultiYear, setIsMultiYear] = React.useState(false);
  const hasMultiDeductible = normalizedRates.some(table => table.isMultiDeductible);

  const renderSingleDeductibleTable = (table: NormalizedRate) => {
    const deductible = Object.keys(table)[0];
    const limits = Object.entries(table[deductible as keyof NormalizedRate]);
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">{table.tableName}</h3>
        <div className="grid grid-cols-1 gap-4">
          {limits.map(limit => {
            const premium = limit[1];
            const premiumValue = Array.isArray(premium) ? premium[0] : premium;
            const limitClaimId = Array.isArray(premium) ? premium[1] : `${deductible},${limit}`;
            return (
              <div key={limit[0]} className="flex items-center justify-between p-2 border rounded">
                <span>{limit[0]}</span>
                <div>
                  <RadioGroupItem 
                    value={`${table.tableName}-${limit[0]}-${deductible}-${premiumValue}-${limitClaimId}`}
                    id={`${table.tableName}-${deductible}-${limit}`}
                    onClick={() => onPremiumSelect(Number(premiumValue), `${table.tableName}-${limit[0]}-${deductible}-${premiumValue}-${limitClaimId}`, false)}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`${table.tableName}-${deductible}-${limit}`}
                  >
                    ${parseFloat(premiumValue).toFixed(2)}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMultiDeductibleTable = (table: NormalizedRate) => {
    const deductibles = Object.keys(table.rates);
    const limits = Object.keys(table.rates[deductibles[0]]);

    // Filter out $0 deductible if multi-year is selected
    const filteredDeductibles = isMultiYear 
      ? deductibles.filter(d => d !== '0')
      : deductibles;

    return (
      <div className="mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">{table.tableName}</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Deductible</th>
              {limits.map(limit => (
                <th key={limit} className="border p-2 text-center whitespace-nowrap">${limit}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDeductibles.map(deductible => (
              <tr key={deductible}>
                <td className="border p-2 font-medium whitespace-nowrap">${deductible}</td>
                {limits.map(limit => {
                  const premium = table.rates[deductible][limit];
                  const premiumValue = Array.isArray(premium) ? premium[0] : premium;
                  const limitClaimId = Array.isArray(premium) ? premium[1] : `${deductible},${limit}`;
                  return (
                    <td key={`${deductible}-${limit}`} className="border p-2 text-center">
                      <RadioGroupItem 
                        value={`${table.tableName}-${limit}-${deductible}-${premiumValue}-${limitClaimId}`}
                        id={`${table.tableName}-${deductible}-${limit}`}
                        onClick={() => onPremiumSelect(Number(premiumValue), `${table.tableName}-${limit}-${deductible}-${premiumValue}-${limitClaimId}`,isMultiYear)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`${table.tableName}-${deductible}-${limit}`}
                        
                      >
                        ${parseFloat(premiumValue).toFixed(2)}
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Coverage Limit</CardTitle>
      </CardHeader>
      <CardContent ref={ref}>
      
      {hasMultiDeductible && (
        <FormField
          control={control}
          name="policy_term"
          render={({ field }) => (
            <FormItem className="mb-6">
              <Label>Policy Term</Label>
              <FormControl>
                <RadioGroup
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const isMultiYear = value === "2";
                    setIsMultiYear(isMultiYear);
                    field.onChange(parseInt(value));
                    onPremiumSelect(null, "", isMultiYear);
                    trigger('policy_data.policy_term');
                  }}
                  className="flex space-x-4"
                  name="policy_data.policy_term"  // Add this name attribute
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="one-year" />
                    <Label htmlFor="one-year">One Year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="two-year" />
                    <Label htmlFor="two-year">Two Year</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
        <FormField
          control={control}
          name="premium_table"
          render={({ field }) => (
            <FormItem>  
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    const [, , , premium] = value.split('-');
                    onPremiumSelect(Number(premium), value, isMultiYear);
                    field.onChange(value);
                    trigger('premium_table');
                  }} 
                  className="space-y-4"
                >
                  {normalizedRates.map((table, index) => (
                    <div key={`table-${index}`}>
                      {table.isMultiDeductible
                        ? renderMultiDeductibleTable(table)
                        : renderSingleDeductibleTable(showTable1 ? rates.table2_rate : rates.table1_rate)}
                    </div>
                  ))}
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
);