import { add } from "date-fns";
import { boolean, z } from "zod";

export const RASformSchema = z.object({
    quote_id: z.string(),
    quote_type: z.string(),
    program: z.string(),
    program_code: z.string(),
    state: z.string(),
    currently_insurance: z.boolean(),
    ga_insurance: z.boolean(),
  
  
    fullname: z.string().min(2, {
      message: "Full Name must be at least 2 characters.",
    }).default(''),
    // firmname: z.string().min(2, {
    //   message: "Firm Name must be at least 2 characters.",
    // }).default(''),
    firm_name: z.string().min(2, {
        message: "Firm Name must be at least 2 characters.",
      }).default(''),
  
  
    has_predecessor_coverage: z.boolean().default(false),
  
    predecessor_name: z.string().optional(),
    predecessor_retroactive_date: z.date().optional(),
    predecessor_dissolution_date: z.date().optional(),
  
  
    address: z.object({
      address_line1: z.string().min(2, { message: "Address line 1 is required" }),
      address_line2: z.string().optional(),
      city: z.string().min(2, { message: "City is required" }),
      county: z.string().optional(),
      state: z.string().min(2, { message: "State is required" }),
      zipcode: z.string().min(5, { message: "Zip code is required" }),
    }),
    isMailingSame: z.boolean().default(false),
    mailing_address: z.object({
      address_line1: z.string().min(2, { message: "Address line 1 is required" }),
      address_line2: z.string().optional(),
      city: z.string().min(2, { message: "City is required" }),
      county: z.string().optional(),
      state: z.string().min(2, { message: "State is required" }),
      zipcode: z.string().min(5, { message: "Zip code is required" }),
    }).optional(),
  
  
    phone_no: z.string().min(10, {
      message: "Phone Number must be at least 10 digits.",
    }),
    fax_no: z.string().optional(),
    website_url: z.union([
      z.string().url({ message: "Please enter a valid URL." }),
      z.string().max(0)
    ]).optional(),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }).min(1, { message: "Email is required" }),
    confirmEmail: z.string().email({
      message: "Please confirm your email address.",
    }).min(1, { message: "Please confirm your email address." }),
    
    effective_date: z.date({
      required_error:"Effective Date is required."
    }),
    firm_date: z.date(),
    applicant_is: z.string()
    .min(1, { message: "Applicant is required" }),

    no_of_professional_more_than_20k: z
      .string()
      .min(1, 'Number of professionals is required')
      .default('')
      .refine(     
        (val) => !isNaN(Number(val)),
        { message: 'Please enter a valid value.' }
      ),
    no_of_professional_less_than_20k: z
      .string()
      .min(1, 'Number of professionals is required')
      .default('')
      .refine(     
        (val) => !isNaN(Number(val)),
        { message: 'Please enter a valid value.' }
      ),
      no_of_transactions: z
      .string()
      .min(1, 'Number of transactions is required')
      .default('')
      .refine(     
        (val) => !isNaN(Number(val)),
        { message: 'Please enter a valid value.' }
      ),


    
    gross_annual_income: z.string()
      .min(1, { message: "Gross Annual Income is required" })
      .refine((val) => {
        const number = parseFloat(val.replace(/[^0-9.-]+/g,""));
        return !isNaN(number) && number > 0;
      }, { message: "Please enter a valid amount" }),
  
      questions:z.object({
        question1: z.string(),
        question2: z.string(),
        question3: z.string(),
        question4: z.string(),
        question5: z.string(),
        question6: z.string(),
        question7: z.string(),

      }),
      // }).refine((data) => Object.values(data).every(value => value !== null), {
      //   message: "All qualifier questions need to be answered",
      //   path: [], // This will make the error appear at the top level of the questions object
      // }),
    
      answers:z.object({
        question1: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),
        question2: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),
        question3: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),
        question4: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),
        question5: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),
        question6: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),
        question7: z.boolean().refine(val => val === true, {
          message: "You must answer 'True' to this question to be eligible for this insurance."
        }),  
      }).refine((data) => Object.values(data).every(value => value !== null), {
        message: "All qualifier questions need to be answered",
        path: [], // This will make the error appear at the top level of the questions object
      }),
  
    policy_data: z.object({
      deductible: z.string(),
      license_no: z.string(),
      price_limit: z.string(),
      year_policy: z.number(),
      annual_premium_selected: z.number(),
      annual_premium: z.number(),
      limit_claim_id: z.string(),
      convenience_fee: z.number(),
      tax_percent: z.number().optional(),
      state_tax: z.number(),
      total_amount: z.number(),
      bill_term: z.number(),
      policy_term: z.number().min(1, {
        message: "Please select a policy term"
      }),
    }),
    
    premium_table: z.string().min(1, "Please select a coverage option"),
  
    convenience_fees:z.boolean().refine(val => val === true, {
      message: "You must accept the convenience fee to proceed."
    }),
    google_address:z.string().optional(),
    e_sign: z.string().min(1, { message: "E-Signature is required" }),
    t_and_c: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms and conditions"
    }),
    additional_instructions:z.string().optional(),
    fraud_warning:z.string().optional(),
  }).refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
    
  }).superRefine((data, ctx) => {
    if (data.has_predecessor_coverage) {
      if (data.predecessor_name === undefined || data.predecessor_name.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Predecessor firm name is required when have predecessor coverage.",
          path: ['predecessor_name'],
        });
      }
      if (!data.predecessor_retroactive_date || data.predecessor_retroactive_date === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Retroactive date is required when have predecessor coverage.",
          path: ['predecessor_retroactive_date'],
        });
      }
      if (!data.predecessor_dissolution_date || data.predecessor_dissolution_date === null) { 
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Dissolution date is required when have predecessor coverage.",
          path: ['predecessor_dissolution_date'],
        });
      }
    }
  });

export const RAPformSchema = z.object({
    quote_id: z.string(),
    quote_type: z.string(),
    program: z.string(),
    program_code: z.string(),
    state: z.string(),
    currently_insurance: z.boolean(),
    ga_insurance: z.boolean(),
  
  
    fullname: z.string().min(2, {
      message: "Full Name must be at least 2 characters.",
    }).default(''),
    // firmname: z.string().min(2, {
    //   message: "Firm Name must be at least 2 characters.",
    // }).default(''),
    firm_name: z.array( 
      z.string().transform(val => val.trim()) // Trim whitespace
      .refine(val => val === '' || val.length >= 2, {
        message: "Firm Name must be at least 2 characters."
      })
      ).max(4)  // Make the entire array optional
      .default(['']),  // Set the default to an empty array
  
    address: z.object({
      address_line1: z.string().min(2, { message: "Address line 1 is required" }),
      address_line2: z.string().optional(),
      city: z.string().min(2, { message: "City is required" }),
      county: z.string().optional(),
      state: z.string().min(2, { message: "State is required" }),
      zipcode: z.string().min(5, { message: "Zip code is required" }),
    }),
    isMailingSame: z.boolean().default(false),
    mailing_address: z.object({
      address_line1: z.string().min(2, { message: "Address line 1 is required" }),
      address_line2: z.string().optional(),
      city: z.string().min(2, { message: "City is required" }),
      county: z.string().optional(),
      state: z.string().min(2, { message: "State is required" }),
      zipcode: z.string().min(5, { message: "Zip code is required" }),
    }).optional(),
  
  
  
  
    phone_no: z.string().min(10, {
      message: "Phone Number must be at least 10 digits.",
    }),
    fax_no: z.string().optional(),
    website_url: z.union([
      z.string().url({ message: "Please enter a valid URL." }),
      z.string().max(0)
    ]).optional(),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }).min(1, { message: "Email is required" }),
    confirmEmail: z.string().email({
      message: "Please confirm your email address.",
    }).min(1, { message: "Please confirm your email address." }),
    
    no_of_professional: z
      .string()
      .min(1, 'Number of professionals is required')
      .default('')
      .refine(     
        (val) => !isNaN(Number(val)),
        { message: 'Please enter a valid value.' }
      ),
    
    effective_date: z.date({
      required_error:"Effective Date is required."
    }),
    firm_date: z.date(),
    gross_annual_income: z.string()
      .min(1, { message: "Gross Annual Income is required" })
      .refine((val) => {
        const number = parseFloat(val.replace(/[^0-9.-]+/g,""));
        return !isNaN(number) && number > 0;
      }, { message: "Please enter a valid amount" }),
  
    questions:z.object({
      question1: z.string().optional(),
      question2: z.string().optional(),
      question3: z.string().optional(),
      question4: z.string().optional(),
      question5: z.string().optional(),
      question6: z.string().optional(),
      question7: z.string().optional(),
    }),
    // }).refine((data) => Object.values(data).every(value => value !== null), {
    //   message: "All qualifier questions need to be answered",
    //   path: [], // This will make the error appear at the top level of the questions object
    // }),
  
    answers:z.object({
      question1: z.boolean().refine(val => val === true, {
        message: "You must answer 'True' to this question to be eligible for this insurance."
      }),
      question2: z.boolean().refine(val => val === true, {
        message: "You must answer 'True' to this question to be eligible for this insurance."
      }),
      question3: z.boolean().refine(val => val === true, {
        message: "You must answer 'True' to this question to be eligible for this insurance."
      }),
      question4: z.boolean().refine(val => val === true, {
        message: "You must answer 'True' to this question to be eligible for this insurance."
      }),
      question5: z.boolean(),
      question6: z.boolean(),
      question7: z.boolean(),
  
      
  
    }).refine((data) => Object.values(data).every(value => value !== null), {
      message: "All qualifier questions need to be answered",
      path: [], // This will make the error appear at the top level of the questions object
    }),
    
    policy_data: z.object({
      deductible: z.string(),
      license_no: z.string(),
      price_limit: z.string(),
      year_policy: z.number().optional(),
      annual_premium_selected: z.number(),
      annual_premium: z.number(),
      limit_claim_id: z.string(),
      convenience_fee: z.number(),
      tax_percent: z.number().optional(),
      state_tax: z.number(),
      total_amount: z.number(),
    }),
    
    premium_table: z.string().min(1, "Please select a coverage option"),
  
    convenience_fees:z.boolean().refine(val => val === true, {
      message: "You must accept the convenience fee to proceed."
    }),
    google_address:z.string().optional(),
    e_sign: z.string().min(1, { message: "E-Signature is required" }),
    t_and_c: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms and conditions"
    }),

    fraud_warning:z.string().optional(), //not reqd but for consistency sake
    additional_instructions:z.string().optional(), //not reqd but for consistency sake
  
  }).refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
    
  });


  export const registrationFormSchema = z.object({
    policy_num: z.string()
      .min(1, "Policy number is required")
      .regex(/^[A-Za-z0-9-]+$/, "Policy number can only contain letters, numbers, and hyphens"),
    zipcode: z.string()
      .min(5, "ZIP code must be 5 digits")
      .max(5, "ZIP code must be 5 digits")
      .regex(/^\d{5}$/, "ZIP code must be exactly 5 digits"),
    email: z.string()
      .email("Please enter a valid email address"),
    otp: z.string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
    password: z.string()
      .min(8, "Password must be at least 8 characters"),
      // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      // .regex(/[0-9]/, "Password must contain at least one number")
      // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    role:z.string().default("user"),
    name:z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }).default(''),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
  
  
  

  export const loginFormSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8,{
      message:"Password needs to atleast 8 characters"
    }),
    remember: z.boolean(),
    role:z.string().default("user"),
  });
  
  export const producerFormSchema = z.object({
    agent_code: z.string().min(6),
    password: z.string().min(8),
    remember: z.boolean(),
    role:z.string().default("producer"),
  });



  export const achFormSchema = z.discriminatedUnion("ownershipType", [
    z.object({
      accountNumber: z.string().length(10, "Account number must be exactly 10 digits"),
      routingNumber: z.string().length(9, "Routing number must be exactly 9 digits"),
      accountType: z.enum(["CHECKING", "SAVINGS"], {
        required_error: "Please select an account type",
      }),
      ownershipType: z.literal("PERSONAL"),
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      businessName: z.string().optional(),  // Optional for PERSONAL
      billingAddress: z.object({
        address1: z.string().min(1, "Street address is required"),
        address2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(2, "State is required"),
        zipcode: z.string().min(5, "ZIP code is required"),
      }),
      mandateText: z.string().optional()
    }),
    z.object({
      accountNumber: z.string().length(10, "Account number must be exactly 10 digits"),
      routingNumber: z.string().length(9, "Routing number must be exactly 9 digits"),
      accountType: z.enum(["CHECKING", "SAVINGS"], {
        required_error: "Please select an account type",
      }),
      ownershipType: z.literal("BUSINESS"),
      firstName: z.string().optional(),  // Optional for BUSINESS
      lastName: z.string().optional(),   // Optional for BUSINESS
      businessName: z.string().min(1, "Business name is required"),
      billingAddress: z.object({
        address1: z.string().min(1, "Street address is required"),
        address2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(2, "State is required"),
        zipcode: z.string().min(5, "ZIP code is required"),
      }),
      mandateText: z.string().optional()
    })
  ]);
  
  
  
  export type AchFormData = z.infer<typeof achFormSchema>;
  
  export interface BraintreeTokenizePayload {
    nonce: string;
    details: {
      accountType: string;
      bankAccountType: string;
      lastName: string;
      firstName: string;
    };
    description: string;
    type: string;
  }


  
  export const PolicyNoChangesSchema = z.object({
    address_contact: z.boolean().refine(val => val === true, {
      message: "You must agree to continue with auto renewal"
    }),
    new_firms_additional: z.boolean().refine(val => val === true, {
      message: "You must agree to continue with auto renewal"
    }),
    limit_changes: z.boolean().refine(val => val === true, {
      message: "You must agree to continue with auto renewal"
    }),
  });
  
  export const PolicyDataSchema = z.object({
    price_limit: z.string(),
    annual_premium_selected: z.number(),
    annual_premium: z.number(),
    limit_claim_id: z.string(),
    convenience_fee: z.number(),
    total_amount: z.number()
  });
  
  export const RAPAutoRenewalFormSchema = z.object({
    policy_payment_type: z.literal('auto_renewal'),
    policy_num: z.string(),
    quote_id:z.string(),
    quote_type:z.string(),
    state: z.string(),
    email: z.string().email("Invalid email address"),
    e_sign: z.string().min(1, "E-signature is required"),
    no_changes: PolicyNoChangesSchema,
    policy_data: PolicyDataSchema,
    t_and_c: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to continue"
    }),
  });

  //Second year payment

  export const SecondYearPaymentFormSchema = z.object({
    policy_payment_type: z.literal('second_year_payment'),
    policy_num: z.string(),
    quote_id:z.string(),
    quote_type:z.string(),
    state: z.string(),
    email: z.string().email("Invalid email address"),
    e_sign: z.string().min(1, "E-signature is required"),
    fullname: z.string(),
    policy_data: z.object({
      annual_premium_selected: z.number(),
      annual_premium: z.number(),
      limit_claim_id: z.string(),
      tax_amount:z.number(),
      convenience_fee: z.number(),
      total_amount: z.number()
    }),
    t_and_c: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to continue"
    }),
  });

  // New schema for producer registration
export const producerRegistrationSchema = z.object({
  producer_name: z.string().min(1, 'Producer name is required'),
  zipcode: z.string().min(5, 'ZIP code must be 5 digits').max(5),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});



export const adminCreateUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  agent_code: z.string().regex(/^[A-Za-z]{4}\d{3}$/, "Producer code must be 4 letters followed by 3 numbers"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

export type AdminCreateUserFormValues = z.infer<typeof adminCreateUserFormSchema>