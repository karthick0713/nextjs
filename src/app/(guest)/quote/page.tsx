//./src/app/(guest)/quote/page.tsx

"use client";
import { useEffect, useRef, useState } from "react";
import { getQuote, getSupportedStates } from "@/lib/api";

import Image from "next/image";

import { useRouter } from 'next/navigation'
import { useData } from "@/lib/context";

import programFullNames from "@/lib/const";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn, parseDate, stringToBoolean } from "@/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod" 
import { Switch } from "@/components/ui/switch"

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link";

import { toast } from "@/components/ui/use-toast"


import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { QualifierAutoRenewalResponse, QualifierPolicyDetail, QualifierRenewalResponse, SupportedState } from "@/lib/models";
import { RAPformSchema } from "@/lib/formschemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const FormSchema = z.object({
    program: z
      .string({
        required_error: "Please select an program.",
      }),
    state:z
      .string({
        required_error: "Please select a state.",
      }),
    currently_insurance: z
      .boolean().default(false),
    ga_insurance: z
      .boolean().default(false).optional(),
    effective_date: z
        .date().optional(),
    policy_num: z
      .string().optional(),
    expiry_date:z
      .date().optional(),
  }).
    superRefine((data, ctx) => {
        if(data.currently_insurance && !data.ga_insurance){
            if(data.effective_date===undefined){
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Date is required",
                    path: ["effective_date"],
                })
                }
        }
        if (!data.currently_insurance) {
            if(data.effective_date===undefined){
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Date is required",
                    path: ["effective_date"],
                })
            }
        }
        if(data.currently_insurance && data.ga_insurance){
          if(data.expiry_date===undefined){
              ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Date is required",
                  path: ["expiry_date"],
              })
              }
      }
    })
  const QUOTE_CACHE_KEY = 'cachedQuote';
  const QUOTE_CACHE_EXPIRY = 36 * 60 * 60 * 1000; // 36 hours in milliseconds

  interface CachedQuote {
    formData: z.infer<typeof FormSchema>;
    quoteResponse: QualifierPolicyDetail;
    
    timestamp: number;
  }
  function getSafeLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('qualifierForm') || '{}');
      } catch (e) {
        return {};
      }
    }
    return {};
  }
  
export default function Quote() {
  const router = useRouter();
  const [error, setError] = useState("");  
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  const effectiveDateRef = useRef<HTMLButtonElement>(null);
  const expiryDateRef = useRef<HTMLButtonElement>(null);

  const [formDefaults, setFormDefaults] = useState<Partial<z.infer<typeof FormSchema>>>({
    program: '',
    state: '',
    currently_insurance: false,
    ga_insurance: false,
    effective_date: undefined,
    policy_num: '',
    expiry_date: undefined,
  });

  // Initialize form with empty defaults first
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: formDefaults,
    resolver: zodResolver(FormSchema),
  });
  
  // Load local storage data on client side only
  useEffect(() => {
    const localData = getSafeLocalStorage();
    if (localData) {
      const newDefaults = {
        program: localData.program || '',
        state: localData.state || '',
        currently_insurance: stringToBoolean(localData.currently_insurance) || false,
        ga_insurance: stringToBoolean(localData.ga_insurance) || false,
        effective_date: parseDate(localData.effective_date) || undefined,
        policy_num: localData.policy_num || '',
        expiry_date: parseDate(localData.expiry_date) || undefined,
      };
      setFormDefaults(newDefaults);
      // Reset form with new defaults
      form.reset(newDefaults);
    }
  }, [form]);
  
  const [supportedStates, setSupportedStates] = useState<SupportedState[]>([]);
  //const {setQualifierResponse} = useData();
  const CACHE_KEY = 'supportedStates';
  const CACHE_EXPIRY = 7* 24 * 60 * 60 * 1000; // 7 days

  useEffect(() => {
    const fetchSupportedStates = async () => {
      setIsLoadingStates(true);

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setSupportedStates(data);
          setIsLoadingStates(false);

          return;
        }
      }

      try {
        const states = await getSupportedStates();
        setSupportedStates(states);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: states, timestamp: Date.now() }));
      } catch (error) {
        console.error("Failed to fetch supported states:", error);
        toast({
          title: "Error",
          description: "Failed to load supported states. Please try again later.",
          variant: "destructive",
        });
      }finally{
        setIsLoadingStates(false);
      }
    };
  
    fetchSupportedStates();
  }, []);
  
  const onSubmit = async (data: z.infer<typeof FormSchema>)=> {
    setError(""); // Clear any previous errors
      try{
        console.log("onsubmit")
        console.log(data);       
        //localStorage.setItem('qualifierForm', JSON.stringify(data));
        
        // Check if there's a cached quote
        
        let parsedResult;
        
        const cachedQuoteString = localStorage.getItem(QUOTE_CACHE_KEY);
        if (cachedQuoteString) {
          const cachedQuote: CachedQuote = JSON.parse(cachedQuoteString);
          const isExpired = Date.now() - cachedQuote.timestamp > QUOTE_CACHE_EXPIRY;
          const isSameFormData = JSON.stringify(cachedQuote.formData) === JSON.stringify(data);

          if (!isExpired && isSameFormData) {
            console.log("Using cached quote");
            //setQualifierResponse(JSON.stringify(cachedQuote.quoteResponse));
            localStorage.setItem("quote_id", cachedQuote.quoteResponse.quote_id);
            //router.push(`/quote/${data.program?.toLowerCase()}/${cachedQuote.quoteResponse.quote_id}`);
            //return;
            //No need to get new quote from server, just use the cached one
            console.log("Cached quote result:", cachedQuote.quoteResponse);
            parsedResult = cachedQuote.quoteResponse;

          }
          else{
            localStorage.setItem("qualifierForm", JSON.stringify(data));
            const result = await getQuote(
              data.program, 
              data.state, 
              data.currently_insurance ? true : false, 
              data.ga_insurance ? true : false, 
              data.effective_date ?  Intl.DateTimeFormat('en-US').format(data.effective_date) : '', 
              data.expiry_date ?  Intl.DateTimeFormat('en-US').format(data.expiry_date) : '',
              data.policy_num ? data.policy_num : ''
            );
            parsedResult = typeof result === 'string'? JSON.parse(result): result;
            if (result && parsedResult && parsedResult.quote_id) {
              localStorage.setItem("quote_id", parsedResult.quote_id);
              const newCachedQuote: CachedQuote = {
                formData: data,
                quoteResponse: parsedResult,
                timestamp: Date.now(),
              };
              localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(newCachedQuote));
              console.log("New quote result:", parsedResult);
            }
            else{
              console.log("No quote_id received in the response");
              toast({
                title: "Error",
                description: "No quote_id received in the response. Please try again later.",
                variant: "destructive",
              })
            }
          }
        }
        else {
            localStorage.setItem("qualifierForm", JSON.stringify(data));
            const result = await getQuote(
              data.program, 
              data.state, 
              data.currently_insurance ? true : false, 
              data.ga_insurance ? true : false, 
              data.effective_date ?  Intl.DateTimeFormat('en-US').format(data.effective_date) : '', 
              data.expiry_date ?  Intl.DateTimeFormat('en-US').format(data.expiry_date) : '',
              data.policy_num ? data.policy_num : ''
            );
            parsedResult = typeof result === 'string'? JSON.parse(result): result;
            if (result && parsedResult && parsedResult.quote_id) {
              const newCachedQuote: CachedQuote = {
                formData: data,
                quoteResponse: parsedResult,
                timestamp: Date.now(),
              };
              localStorage.setItem("quote_id", parsedResult.quote_id);
              localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(newCachedQuote));
              console.log("New quote result:", parsedResult);
            }
            else{
              console.log("No quote_id received in the response");
              toast({
                title: "Error",
                description: "No quote_id received in the response. Please try again later.",
                variant: "destructive",
              })
            }
          }
        
        // If no valid cached quote, request a new one

        if(parsedResult){
          if(parsedResult.quote_type === "new_business"){
            //Setting the type as new_business
            parsedResult = parsedResult as unknown as QualifierPolicyDetail;
            router.push(`/quote/${parsedResult.program_code.toLowerCase()}/${parsedResult.quote_id}`);

          }
          else if(parsedResult.quote_type === "renewal"){
            //setting the type to renewal
            parsedResult = parsedResult as unknown as QualifierRenewalResponse;
            if (parsedResult.registration_status === "not_registered") {
              
              const returnUrl = `/quote/${data.program?.toLowerCase()}/${parsedResult.quote_id}`;
              const message = encodeURIComponent("Please register to fetch your previous year policy details for pre-filling the application.");
              router.push(`/register?returnUrl=${encodeURIComponent(returnUrl)}&message=${message}`);
              return;
            }
            
            if (parsedResult.registration_status === "registered" && 
              parsedResult.login_status === "not_logged_in") {
              
              const returnUrl = `/quote/${data.program?.toLowerCase()}/${parsedResult.quote_id}`;
              const message = encodeURIComponent("Please login to fetch your previous year policy details for pre-filling the application.");
              router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&message=${message}`);
              return;
            }

            if (parsedResult.registration_status === "registered" && 
              parsedResult.login_status === "logged_in") {
                router.push(`/quote/${data.program?.toLowerCase()}/${parsedResult.quote_id}`);
              }
          }
          else if(parsedResult.quote_type === "auto_renewal"){
            parsedResult = parsedResult as unknown as QualifierAutoRenewalResponse;
            if (parsedResult.registration_status === "not_registered") {
              
              const returnUrl = `/quote/auto-renew/${parsedResult.quote_id}`;
              const message = encodeURIComponent("Please register to fetch your previous year policy details for pre-filling the application.");
              router.push(`/register?returnUrl=${encodeURIComponent(returnUrl)}&message=${message}`);
              return;
            }
            
            if (parsedResult.registration_status === "registered" && 
              parsedResult.login_status === "not_logged_in") {
              
              const returnUrl = `/quote/auto-renew/${parsedResult.quote_id}`;
              const message = encodeURIComponent("Please login to fetch your previous year policy details for pre-filling the application.");
              router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&message=${message}`);
              return;
            }

            if (parsedResult.registration_status === "registered" && 
              parsedResult.login_status === "logged_in") {
                router.push(`/quote/auto-renew/${parsedResult.quote_id}`);
              }
          }
          else if(parsedResult.quote_type === "second_year_payment"){
            //TODO
            router.push(`/quote/pending-payment/${parsedResult.quote_id}`);
          }
          else{
            //Unknown quote type
          }
        } 
      }
      catch(error) {
        console.error("Error submitting form:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");  
      }finally {
          //setIsSubmitting(false);
      }
  }
  const have_insurance =  form.watch('currently_insurance');
  const have_ga_policy = form.watch('ga_insurance');
  const effective_date_upper_limit = new Date();
  effective_date_upper_limit.setDate(effective_date_upper_limit.getDate()+135);
  const effective_date_lower_limit = new Date();
  effective_date_lower_limit.setDate(effective_date_lower_limit.getDate()-15);
  const program = form.watch('program');

    return (
        <div className="flex flex-col">
            <div className="flex justify-center items-center">
                <Image src="/landy_logo.png" alt="Landy Header" width={200} height={200}/>
            </div>
            <p className="text-xs md:text-sm flex justify-center items-center bg-green-400 text-black">
            Errors and Omissions | Professional Liability Insurance For Great American Real Estate Appraisers, Real Estate Agents/Brokers and Accountants
            </p>
            <div className="flex flex-col mx-auto sm:flex-row sm:mx-20">
                <div className="flex flex-col items-center  mx-10 mt-10 sm:w-1/2 sm:mt-15 ">
                    <ul className= "list-disc">
                        <li className="text-xs md:text-sm font-bold text-black align-text-top">This site is secure and protected.</li>
                        <li className="text-xs md:text-sm font-bold text-black align-text-top">Please Note: This program is not available in Alaska or Louisiana.</li>
                        <li className="text-xs md:text-sm font-bold text-black align-text-top">Please Note: A Non-Refundable $25.00 convenience fee will apply to all online transactions.</li>
                        <li className="text-xs md:text-sm font-bold text-black align-text-top">If you DO NOT have insurance in force now this policy will become effective the date the completed application and payment are received and approved by us or a later date if requested.</li>
                    </ul>
                </div>
                <div className="shadow rounded-xl sm:w-1/2 items-center justify-center mx-5 mt-5 sm:mx-10 sm:mt-15">
                  <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <div className="flex flex-row space-x-6">
                                <FormField
                                    
                                    control={form.control}
                                    name="program"
                                    render={({ field }) => (
                                        <FormItem className="w-4/5">
                                            <FormLabel>Programs</FormLabel>
                                            {isLoadingStates ? (
                                              <div className="w-full space-y-2">
                                                <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
                                                <p className="text-sm text-muted-foreground">Loading programs...</p>
                                              </div>
                                            ) : (
                                              <Select 
                                                onValueChange={field.onChange}
                                                defaultValue={field.value||""}
                                              >
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select a program"/>
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  {[...new Set(supportedStates.map(state => state.program))].map((program) => (
                                                    <SelectItem key={program} value={program}>
                                                      {program === "RAS" ? programFullNames["RAS"] :
                                                      program === "RAP" ? programFullNames["RAP"] :
                                                      program === "ACS" ? programFullNames["ACS"] : program}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            )}
                                            <FormDescription>
                                                Real Estate Standard and Accountant Standard are not available for purchase right now. 
                                                But you can view your policy docs.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                        
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            {isLoadingStates ? (
                                              <div className="w-full space-y-2">
                                                <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
                                                <p className="text-sm text-muted-foreground">Loading states...</p>
                                              </div>
                                            ) : (
                                              <Select 
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                              >
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select a state"/>
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  {supportedStates
                                                    .filter(state => state.program === form.watch("program"))
                                                    .map((state) => (
                                                      <SelectItem key={state.stateCode} value={state.stateCode}>
                                                        {state.state}
                                                      </SelectItem>
                                                    ))}
                                                </SelectContent>
                                              </Select>
                                            )}
                                            <FormDescription>
                                               State where your primary business is registered.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                        
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="currently_insurance"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                        Do you have insurance?
                                        </FormLabel>
                                        <FormDescription>
                                            It can be insurance for your business,from any carrier
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    </FormItem>
                                )}
                            />
                            {have_insurance && (
                            <FormField
                                
                                control={form.control}
                                name="ga_insurance"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Do you have Great American Insurance?
                                        </FormLabel>
                                        <FormDescription>
                                            Receive emails about new products, features, and more.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    </FormItem>
                                )}
                            />)}
                            {(!have_insurance || !have_ga_policy) && (
                            <FormField
                                control={form.control}
                                name="effective_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Desired Effective Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            ref={effectiveDateRef}
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
                                            }}
                                            disabled={(date) =>
                                            date > effective_date_upper_limit || date < effective_date_lower_limit
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Select the desired effective date of the policy.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                            )}
                            />)}
                            {(have_insurance && have_ga_policy) && (
                            <FormField
                                control={form.control}
                                name="expiry_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel>Policy Expiry Date</FormLabel>
                                      <Popover>
                                          <PopoverTrigger asChild>
                                          <FormControl>
                                              <Button
                                              ref={expiryDateRef}
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
                                                expiryDateRef.current?.click();
                                              }}
                                              initialFocus
                                          />
                                          </PopoverContent>
                                      </Popover>
                                      <FormDescription>
                                          Select the effective date of your existing policy.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>

                            )}
                            />
                            )}

                            {(have_insurance && have_ga_policy) && (
                              <FormField
                                control={form.control}
                                name="policy_num"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Policy Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Eg. RAP33657587-23" {...field} /> 
                                    </FormControl>
                                    <FormDescription>
                                      Enter your current policy number.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                            />

                            )}
                            {error && (
                                    <Alert variant="destructive" className="mx-auto mt-4 max-w-2xl">
                                      <AlertTitle className="flex items-center justify-between">
                                        Error
                                        <Button 
                                          variant="ghost" 
                                          className="h-4 w-4 p-0" 
                                          onClick={() => setError("")}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </AlertTitle>
                                      <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                  )}
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                    </CardContent>
                    
                  </Card>
                </div>

            </div>
        </div>
    );
}