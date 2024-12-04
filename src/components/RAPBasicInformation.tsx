import React, { useEffect } from 'react';
import { Control, useFieldArray, Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BasicInformationProps {
  control: Control<any>;
  initialData: {
    fullname: string;
    firm_name: string[];
  };
}

export function RAPBasicInformation({ control, initialData }: BasicInformationProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "firm_name",
  });
  useEffect(() => {
    // If there are no fields and no initial data, add an empty field
    if (fields.length === 0 && (!initialData.firm_name || initialData.firm_name.length === 0)) {
      append('');
    }
  }, [fields, initialData?.firm_name, append]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <Controller
            name="fullname"
            control={control}
            defaultValue={initialData?.fullname||''}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex-1">
                <FormLabel>Enter your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Full Name" {...field} />
                </FormControl>
                {error && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
          />
        </div>

        <div className="flex-1">
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              name={`firm_name.${index}`}
              control={control}
              defaultValue={initialData?.firm_name ? initialData?.firm_name[index]||'':'' }
              render={({ field: firmField, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>{index === 0 ? 'Firm Name' : `Additional Firm Name ${index + 1}`}</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input {...firmField} placeholder="Enter Firm Name" />
                    </FormControl>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
              )}
            />
          ))}
          {fields.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append('')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Another Firm Name
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}