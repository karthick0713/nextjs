import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { types } from "util";

// types/ApiResponse.ts
export interface SupportedState {
    program: string;
    stateCode: string;
    state: string;
}
export interface QualifierApiResponse {
    type_of_message: string;
    message: string;
    status: number;
    data: QualifierPolicyDetail[];
  }
  type RateTable = {
    [deductible: string]: {
      [limit: string]: string;
    };
  };
  
  type Rates = {
    one_year: {
      table1_rate: RateTable;
      table2_rate: RateTable;
    };
  };

  type TaxFees = {
    tax: string;
    stamping_fee: string;
    tax_w_e_f: string;
    effective_date: string | null;
    effective_end_date: string | null;
    fraud_warning: string;
    additional_instructions: string | null;
    additional_instructions_w_e_f: string | null;
    convenience_fees: string;
    license_no: string;
  };

  export type QualifierPolicyDetail = {
    predecessor_dissolution_date: string | undefined;
    predecessor_name: string;
    predecessor_retroactive_date: string | undefined;
    has_predecessor_coverage: boolean;
    applicant_is: string;
    t_and_c(t_and_c: any): boolean | undefined;
    currently_insurance(currently_insurance: any): boolean | undefined;
    address: any;
    isMailingSame: boolean;
    mailing_address: any;
    phone_no: string;
    fax_no: string;
    website_url: string;
    email: string;
    confirmEmail: any;
    no_of_professional: string;
    firm_date: string | undefined;
    gross_annual_income: string;
    policy_data: any;
    google_address: string;
    e_sign: string;
    quote_id: string;
    quote_type: string;
    program: string;
    program_code: string;
    already_insurance: string | null;
    ga_insurance: number;
    state: string;
    fullname: string; 
    firm_name: string[];
    questions: {
      [key: string]: string;
    };
    answers: {
      [key: string]: boolean;
    };
    effective_date: string;
    policy_term: number;
    bill_term: number;
    rates: Rates;
    tax_fees: TaxFees;
    additional_instructions: string;
    fraud_warning: string;
  };
  
  export type QualifierRASPolicyDetail = {
    predecessor_dissolution_date: string | undefined;
    predecessor_name: string;
    predecessor_retroactive_date: string | undefined;
    has_predecessor_coverage: boolean;
    applicant_is: string;
    t_and_c(t_and_c: any): boolean | undefined;
    currently_insurance(currently_insurance: any): boolean | undefined;
    address: any;
    isMailingSame: boolean;
    mailing_address: any;
    phone_no: string;
    fax_no: string;
    website_url: string;
    email: string;
    confirmEmail: any;
    no_of_professional: string;
    firm_date: string ;
    gross_annual_income: string;
    policy_data: any;
    google_address: string;
    e_sign: string;
    quote_id: string;
    quote_type: string;
    program: string;
    program_code: string;
    already_insurance: string | null;
    ga_insurance: number;
    state: string;
    fullname: string; 
    firm_name: string;
    questions: {
      [key: string]: string;
    };
    answers: {
      [key: string]: boolean;
    };
    effective_date: string;
    policy_term: number;
    bill_term: number;
    rates: Rates;
    tax_fees: TaxFees;
    additional_instructions: string;
    fraud_warning: string;
  };
 export interface ContactFormData {
  address?: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    county?: string;
    state?: string;
    zipcode?: string;
  };
  isMailingSame: boolean;
  mailing_address?: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    county?: string;
    state?: string;
    zipcode?: string;
  };
  phone_no?: string;
  fax_no?: string;
  website_url?: string;
  email?: string;
  confirmEmail?: string;
}

  //Form save/ Quote save reponse API types

  export interface QuoteSaveResponse {
    status: string;
    message: string;
    data: QuoteSaveResponseData;
  }
  
  export interface QuoteSaveResponseData {
    quote_id: string;
    quote_type: string;
    program: string;
    state: string;
    effective_date: string;
    fullname: string;
    firm_name: string[];
    address: string;
    mailing_address: string;
    phone_no: string;
    fax_no: string;
    email: string;
    website_url: string;
    questions: {
      [key: string]: boolean;
    };
    e_sign: string;
    t_and_c: boolean;
    policy_data: QuoteSavePolicyData;
    payment_client_token: string;
  }
  
  export interface QuoteSavePolicyData {
    table_rate: null | string;
    price_limit: string;
    policy_term_year: number;
    policy_bill_term: number;
    convenience_fee: string;
    state_tax: string;
    limit_claim_id: string;
    license_no: null | string;
    annual_premium: string;
    total_amount: string;
    deductible: string;
    annual_premium_selected: string;
  }


  


  export interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
  };


  export interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
  };


  // types/policy.ts

export interface PolicyFile {
  name?: string;
  url?: string;
}

export interface PolicyData {
  sessionid: string;
  firstname1: string;
  lastname1:string;
  streetline1: string;
  streetline2: string;
  city: string;
  state: string;
  zipcode: string | null;
  zipcode2: string | null;
  mailstreet: string;
  mailcity: string;
  mailstate: string | null;
  mailzip1: string | null;
  mailzip2: string | null;
  email: string;
  deseffdatemm: string;
  deseffdatedd: string;
  deseffdateyyyy: string;
  limitclaim: string;
  premium: number;
  phonearea: string | null;
  phoneexch: string | null;
  phoneext: string | null;
  faxarea: string | null;
  faxexch: string | null;
  faxext: string | null;
  q5: string | null;
  q6: string | null;
  q7: string | null;
  r2: string;
  policynumnew: string;
  prem_w_terr: number;
  prem_w_terrtax: number;
  datemm: string;
  datedd: string;
  dateyyyy: string;
  needprioracts: string;
  cardnum: string;
  esigapp: string;
  transid: string;
  processed: string;
  statelic: string;
  currentins: string;
  ins1: string | null;
  ins2: string | null;
  ins3: string;
  ins4: string;
  ins5: string;
  ins6: string;
  ins7: string;
  ins8: string;
  ins9: string;
  ins10: string;
  ins11: string;
  ins12: string;
  convfee: number;
  policynumold: string;
  county: string | null;
  assoc: string;
  accountname: string | null;
  bankaccntnum: string | null;
  routenum: string;
  pymnttype: string | null;
  carrier1: string;
  autorenew: string;
  id: number;
  payment_status: string;
  is_new: string;
  tax_per: string;
  tax_value: string;
  total_amount: string | null;
  insurance_file: string | null;
  effective_date: string;
  expDate: string;
  risknum: string;
  line_of_bussiness: string;
  is_renew_eligible: string;
  is_renew: string;
  policy: string;
  files: PolicyFile[];
}

export interface PolicyResponse {
  status: string;
  message: string;
  data:{
    policies: PolicyData[];
    renewal: PolicyData;
    second_year_payment: 0|1;
  }
}

export interface UserType {
  id: number
  email: string
  name: string
  email_verified_at?: Date
  created_at: Date
  updated_at: Date
  role: number
};



export interface QualifierRenewalResponse {
  quote_id: string;
  login_status: "logged_in" | "not_logged_in";
  registration_status: "registered" | "not_registered";
  quote_type: "renewal";
  state: string;
  currently_insurance: boolean;
  ga_insurance: boolean;
  renewal: {
    claim: string;
    policynum1: string;
    policynum2: string;
    prodcode: string;
    state: string;
    currentins: string;
    renewed: string;
    inceptdate: string;
    expdate: string;
    priordate: string;
    prodname: string;
    direct: string;
    agentallow: string;
    inforce: string;
    prodphone: string;
    firmname: string;
    policynum3: string;
    firm1: string;
    firm2: string;
    firm3: string;
    firmname2: string;
    zipcode: string;
    newfiling: string;
    company1: string;
    company2: string;
    company3: string;
    company4: string;
    appraiser: string;
    insuredphone: string;
    risknum: string;
    limit1: string;
    maxlimit: string;
    firm4: string;
    firm5: string;
    firm6: string;
    firm7: string;
    firm8: string;
    firm9: string;
    firm10: string;
    bor: string;
    nkl: string;
    select2yr: string;
    paid2yr: string;
    ded: string;
    express: string;
    autorenew: string;
    commrate: string;
    iscyber: string;
  };
  questions: {
    [key: string]: string;
  };
  rates: {
    table_rate: RateTable,
  };
}


export interface QualifierAutoRenewalResponse {
  quote_id: string;
  login_status: "logged_in" | "not_logged_in";
  registration_status: "registered" | "not_registered";
  state: string;
  currently_insurance: boolean;
  ga_insurance: boolean;
  quote_type: "auto_renewal";
  autoRenewal_data: {
    firm_name: string;
    state: string;
    policy_num: string;
    current_limit_option: string;
    convenience_fees: string;
    annual_premium: string;
    total_amount_without_tax: number;
    tax_amount: string;
    total_amount_with_tax: number;
  };
}




// types/contact.ts
export interface AddressData {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  county?: string;
  state?: string;
  zipcode?: string;
}

export interface ContactFormData {
  address?: AddressData;
  isMailingSame: boolean;
  mailing_address?: AddressData;
  phone_no?: string;
  fax_no?: string;
  website_url?: string;
  email?: string;
  confirmEmail?: string;
}

export interface ContactInformationProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  // Spread out the properties
  address?: AddressData;
  isMailingSame: boolean;
  mailing_address?: AddressData;
  phone_no?: string;
  fax_no?: string;
  website_url?: string;
  email?: string;
  confirmEmail?: string;
}



export interface PolicyNoChanges {
  address_contact: boolean;
  new_firms_additional: boolean;
  limit_changes: boolean;
}



export interface RAPAutoRenewalFormValues {
  policy_payment_type: 'auto_renewal';
  policy_num: string;
  state: string;
  email: string;
  e_sign: string;
  no_changes: PolicyNoChanges;
  policy_data: QuoteSavePolicyData;
}

// For the initial data loaded from cache or API
export interface AutoRenewalData {
  firm_name: string;
  state: string;
  policy_num: string;
  current_limit_option: string;
  limit_claim_id: string;
  convenience_fees: number;
  annual_premium: number;
  total_amount_without_tax: number;
  tax_amount: number;
  total_amount_with_tax: number;
}

export interface RAPAutoRenewalData {
  quote_id: string;
  email: string;
  login_status: string;
  registration_status: string;
  state: string;
  currently_insurance: boolean;
  ga_insurance: boolean;
  quote_type: string;
  autoRenewal_data: AutoRenewalData;
}



export interface SecondYearPaymentResponseData{
  quote_id: string;
  quote_type: string;
  login_status: string;
  registration_status: string;
  policy_num: string;
  
  state: string;
  email: string;
  
  secondYear_payment:{
    fullname: string,
    firm_name: string,
    current_limit_option: string,
    limit_claim_id: string,
    annual_premium: number,
    total_amount_without_tax: number,
    tax_amount: number,
    convenience_fee: number,
    total_amount_with_tax: number
  }
}



export interface PDFDownloadResponse {
  headers: Headers;
  blob: () => Promise<Blob>;
  ok: boolean;
}


export interface QualifierFormData {
  program?: string;
  state?: string;
  currently_insurance?: string;
  ga_insurance?: string;
  effective_date?: string;
  policy_num?: string;
  expiry_date?: string;
}


export interface AdminQueueResponse{
  status: string;
  message: string;
  data: {
    unprocessed_data: PolicyData[];
    failed_data: PolicyData[];
    total_unprocessed_data:number;
    total_failed_data:number;
    total_unprocessed_display_data:number;
    total_failed_display_data:number;
  }
  
}


export interface AdminUserDetail {
  id: number;
  email: string;
  role: number;
  phone_number: number;
  name: string;
  agent_code: string;
  status: string;
}

export interface AdminProducerData {
  TotalRecords: number;
  TotalDisplayRecords: number;
  usersDetails: AdminUserDetail[];
}

export interface AdminProducerResponse {
  status: string;
  message: string;
  data: AdminProducerData;
}



export interface AdminCreateUserRequest {
  name: string;
  email: string;
  phone_number: string;
  agent_code: string;
  password: string;
  role: number;
}

export interface AdminCreateUserResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    producer_code: string;
    role: number;
    phone_number: string;
  }
}


export interface ServerErrors {
  [key: string]: string[];
}


export interface RenewalPolicyData {
  claim: string;
  policynum1: string;
  policynum2: string;
  prodcode: string;
  state: string;
  currentins: string;
  renewed: string;
  inceptdate: string;
  expdate: string;
  priordate: string;
  prodname: string;
  direct: string;
  agentallow: string;
  inforce: string;
  prodphone: string;
  firmname: string;
  policynum3: string;
  firm1: string;
  firm2: string;
  firm3: string;
  firmname2: string;
  zipcode: string;
  newfiling: string;
  company1: string;
  company2: string;
  company3: string;
  company4: string;
  appraiser: string;
  insuredphone: string;
  risknum: string;
  limit1: string;
  maxlimit: string;
  firm4: string;
  firm5: string;
  firm6: string;
  firm7: string;
  firm8: string;
  firm9: string;
  firm10: string;
  bor: string;
  nkl: string;
  select2yr: string;
  paid2yr: string;
  ded: string;
  express: string;
  autorenew: string;
  commrate: string;
  iscyber: string;
  lob: string;
  effective_date: string;
  policy_date: string;
}

export interface ProducerDashBoardPolicyResponse {
  status: string;
  message: string;
  data:{
    TotalRecords: number;
    TotalDisplayRecords: number;
    policies: RenewalPolicyData[];
  }
}
