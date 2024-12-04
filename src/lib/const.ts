export type ProgramCode = 'RAS' | 'RAP' | 'ACS';

const programFullNames = {
    "RAS": "Real Estate Express Agent & Broker Express Application", 
    "RAP": "Individual Real Estate Appraiser Application",
    "ACS": "Accountants Express Application"
  };
  export default programFullNames;

export const QUOTE_CACHE_KEY = 'cachedQuote';
export const QUOTE_CACHE_EXPIRY = 36 * 60 * 60 * 1000; // 36 hours in milliseconds



export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];


export const AUTO_RENEWAL_TEXTS = {
  PAGE_TITLE: "Auto Renewal Form",
  PAGE_SUBTITLE: "You have been located in our database. Please confirm the information below:",
  HEADER_BANNER: "Errors and Omissions | Professional Liability Insurance For Great American Real Estate Appraisers",
  
  QUALIFICATION_SECTION: {
    TITLE: "Qualification Questions",
    DESCRIPTION: "To qualify to renew your Real Estate Appraisers Errors and Ommisions Insurance policy online, the following 3 items must be checked as No:",
    CONTACT_OFFICE: "If there are changes to your policy, please contact our office at 800-336-5422",
    
    CHECKBOXES: {
      ADDRESS: "I confirm there are NO changes to my address or contact information",
      FIRMS: "I confirm there are NO new firms to list as additional insureds",
      LIMITS: "I confirm there are NO changes to limits or deductibles"
    }
  },

  EMAIL_SECTION: {
    LABEL: "E-Mail Address"
  },

  SIGNATURE_SECTION: {
    LABEL: "Electronic Signature",
    DESCRIPTION: "The Electronic Signature Process (E-signature) provides you with a faster and more convenient way to process your application. Filling out this text box is the equivalent of signing your name."
  },

  TERMS_AND_CONDITIONS: {
    LABEL: "By checking \"YES\" I agree to the non-refundable convenience fee, as well as agreeing to all other terms and conditions of this transaction. I agree to accept an electronic copy of this application."
  },

  BUTTONS: {
    CANCEL: "Cancel",
    SUBMIT: "Submit Renewal",
    PROCESSING: "Processing..."
  }
};