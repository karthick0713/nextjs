"use client";
import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface RateTable {
    [key: string]: {
      [limit: string]: string;
    };
  }
  
  interface DualRateTableProps {
    table1_rate: RateTable;
    table2_rate: RateTable;
    selectedPremium: string | null;
    isTable1Disabled: boolean;
    onPremiumSelect: (premium: number|null) => void;
  }
  
  const RatesCard: React.FC<DualRateTableProps> = ({ table1_rate, table2_rate, selectedPremium, isTable1Disabled, onPremiumSelect  }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    useEffect(() => {
        // Clear Table 1 selection when it becomes disabled
        if (isTable1Disabled && selectedPremium?.startsWith('Table 1')) {
            console.log(isTable1Disabled);
            onPremiumSelect(null);
        }
      }, [isTable1Disabled, selectedPremium, onPremiumSelect]);
    const renderTable = (table: RateTable, tableName: string, isDisabled: boolean) => {
      const deductible = Object.keys(table)[0]; // Assuming there's only one deductible key
      const limits = Object.entries(table[deductible]);
  
      return (
        <div className="w-1/2 px-2">
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
                onClick={() => onPremiumSelect(Number(premium))}
                disabled={isDisabled}
              />
              <span className="ml-2">${parseFloat(premium).toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    };
  
    return (
      <Card >
        <CardHeader>
          <CardTitle>Select Your Coverage Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={(value) => setSelectedOption(value)}
            className="flex space-x-4"
            name="premium_table"
          >
            {renderTable(table1_rate, "Table 1", isTable1Disabled)}
            {renderTable(table2_rate, "Table 2", false)}
            
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };
  

export default RatesCard;