import React from 'react';
import { Control, useFieldArray, Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BasicInformationProps {
  control: Control<any>;
  data: {
    fullname: string;
    firm_name: string;
  };
}

export function BasicInformation({ control, data }: BasicInformationProps) {
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
      <div className="flex-1">
          
            <FormField
              
              name= "firm_name"
              control={control}
              defaultValue={data.firm_name}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Firm Name</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input placeholder="Enter Firm Name" {...field} />
                    </FormControl>
                    
                  </div>
                  {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
              )}
            />
          
          
        </div>

        <div className="flex-1">
          <FormField
            name="fullname"
            control={control}
            defaultValue={data.fullname}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex-1">
                <FormLabel>Enter your Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Full Name" {...field} />
                </FormControl>
                {error && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
          />
        </div>

        
      </CardContent>
    </Card>
  );
}