export type EmploymentStatus =
  | 'unemployed'
  | 'daily_wage'
  | 'salaried'
  | 'self_employed'
  | 'farmer'
  | 'govt_employee';

export type ElectricityBracket = 'under_200' | '200_500' | 'above_500';

export type ResidentialArea = 'urban' | 'rural';

export type Gender = 'male' | 'female' | 'other';

export type MaritalStatus = 'single' | 'married' | 'widowed_divorced';

export interface CitizenData {
  // Step 1: Household & Financial Metrics
  monthlyIncome: number;
  householdSize: number;
  areaType: ResidentialArea;
  electricityUnits: ElectricityBracket;
  ownsSmallPlot: boolean; // 5 marla urban / 10 marla rural
  ownsAgriLand: boolean; // Agricultural land up to 12.5 acres

  // Step 2: Citizen Demographics & Profile
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  employmentStatus: EmploymentStatus;
  isPunjabResident: boolean; // Domicile / NADRA Punjab record

  // Step 3: Targeted Needs & Eligibility Indicators
  isStudent: boolean; // Enrolled in College / BS Degree
  hasLearnerPermit: boolean; // Motorcycle Learner Permit / Driving License
  isBispRegistered: boolean; // Enrolled in BISP or NSER Survey
  hasDisability: boolean; // Special CNIC / Disabled Person
  hasPregnantOrInfant: boolean; // Pregnant/lactating mother or child under 2 yrs
  hasDaughterMarriage: boolean; // Planning daughter's marriage (Dhee Rani Scheme)
  isYouthEntrepreneur: boolean; // Small business / skilled trades seeking loans
}

export type SchemeCategory = 'direct' | 'survey' | 'pending' | 'ineligible';

export type SchemeStatus =
  | 'eligible'
  | 'check_officially'
  | 'not_eligible_yet'
  | 'disqualified';

export type SchemeDomain =
  | 'healthcare'
  | 'social_safety'
  | 'education'
  | 'housing'
  | 'energy'
  | 'agriculture'
  | 'youth_employment'
  | 'special_welfare';

export interface Scheme {
  id: string;
  title: string;
  titleUrdu: string;
  department: string;
  departmentUrdu: string;
  domain: SchemeDomain;
  tag: string;
  tagUrdu: string;
  category: SchemeCategory;
  status: SchemeStatus;
  statusText: string;
  statusTextUrdu: string;
  description: string;
  descriptionUrdu: string;
  matchReason: string;
  matchReasonUrdu: string;
  whereToApplyLabel: string;
  whereToApplyLabelUrdu: string;
  whereToApply: string;
  whereToApplyUrdu: string;
  icon: string;
  portalUrl: string;
  helpline: string;
  benefitAmount: string;
  benefitAmountUrdu: string;
  requiredDocuments: string[];
  requiredDocumentsUrdu: string[];
  officialCriteriaSummary: string;
  officialCriteriaSummaryUrdu: string;
  maxIncomeThreshold?: number;
}

export interface EvaluationResult {
  eligibleDirect: Scheme[];
  surveyCheck: Scheme[];
  pendingReq: Scheme[];
  totalReviewed: number;
}

export type Language = 'en' | 'ur';
