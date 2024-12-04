//./src/components/RAPQualifierQuestions.tsx
import React, { forwardRef, useEffect } from 'react';
import { Control, UseFormTrigger } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import programFullNames from '@/lib/const';

interface Question {
  key: string;
  text: string;
}

interface RAPQualifierQuestionsProps {
  control: Control<any>;
  trigger: UseFormTrigger<any>;
  questions: Record<string, string>;
  answers: Record<string, boolean>;
  onQuestionChange?: (key: string, value: boolean) => void;
}
export const RAPQualifierQuestions = forwardRef<HTMLDivElement, RAPQualifierQuestionsProps>(
  function RAPQualifierQuestions({ control, trigger, questions = {}, answers = {}, onQuestionChange }, ref) {

  useEffect(() => {
    Object.entries(answers).forEach(([key, value]) => {
      if (value !== undefined) {
        control._defaultValues[`answers.${key}`] = value;
        control._formValues[`answers.${key}`] = value;
      }
    });
  }, [answers, control]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{programFullNames['RAP']}</CardTitle> 
        <CardDescription>
          Please answer the following questions to help us understand your business and provide a more accurate quote.
        </CardDescription>
      </CardHeader>
      <CardContent ref={ref}>
        {Object.entries(questions).map(([key, question], index) => (
          <div key={key} className="mb-4 flex flex-row items-start">
            <div className="w-1/15 pr-2 text-sm md:text-base md:font-medium">
              <Label className="">{index + 1}.</Label>
            </div>
            <div className="w-3/5 pr-2 text-sm md:w-4/5 md:text-base md:font-medium">
              <Label className="">{question}</Label>
            </div>
            <div className="w-1/6">
              <FormField
                control={control}
                name={`answers.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const boolValue = value === 'true';
                          field.onChange(boolValue);
                          trigger(`answers.${key}`);
                          //onQuestionChange(key, boolValue);
                        }}
                        value={field.value === true ? 'true' : field.value === false ? 'false' : undefined}
                        name={`${key}`}
                        defaultValue={answers[key]?.toString()}
                        className="flex items-center gap-2 space-x-1"
                      >
                        <label htmlFor={`${key}-true`} className="space-x-2 cursor-pointer flex items-center">
                          <RadioGroupItem value="true" id={`${key}-true`} />
                          <span>True</span>
                        </label>
                        <label htmlFor={`${key}-false`} className="space-x-2 cursor-pointer flex items-center">
                          <RadioGroupItem value="false" id={`${key}-false`} />
                          <span>False</span>
                        </label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
);