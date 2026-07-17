export enum ERepaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
}

export enum ELoanApplicationStatus {
  PENDING = 'pending',
  REVIEW = 'review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
}

export enum ELoanTerm {
  SHORT = 'short',
  LONG = 'long',
}

export enum EBorrowerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum EMaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

export enum EEmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  SELF_EMPLOYED = 'self-employed',
  RETIRED = 'retired',
}

export type TMaritalStatus = `${EMaritalStatus}` | null;
export type TEmploymentStatus = `${EEmploymentStatus}` | null;
export type TRepaymentStatus = `${ERepaymentStatus}`;
export type TLoanApplicationStatus = `${ELoanApplicationStatus}`;
export type TLoanTerm = `${ELoanTerm}`;
export type TAccountStatus = `${EBorrowerStatus}`;

export interface User {
  id: string;
  name: string;
  email: string;
  sevispassId: string;
  verified: boolean;
}

export interface ExistingLoanDeclaration {
  lender: string;
  amount: number;
}

export type TDisbursementMethod = 'bank_transfer' | 'cash_pickup';

export interface NewLoanApplicationInput {
  amount: number;
  term: TLoanTerm;
  purpose: string;
  village: string;
  province: string;
  phoneNumber: string;
  employmentStatus: TEmploymentStatus;
  monthlyIncome: number | null;
  existingLoans: ExistingLoanDeclaration[];
  disbursementMethod: TDisbursementMethod;
  disbursementDetails: string | null;
  declarationLanguage: 'en' | 'tp';
}

export interface BorrowerDashboard {
  borrower: Borrower;
  loans: LoanApplication[];
  applications: LoanApplication[];
  repayments: LoanRepayment[];
}

export interface Staff {
  id: number;
  staff_number: string | null;
  first_name: string;
  last_name: string | null;
  gender: 'male' | 'female' | 'other' | null;
  phone_number: number | null;
  email: string | null;
  password: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  deleted_by: number | null;
}

export interface Borrower {
  id: number;
  borrower_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  marital_status: TMaritalStatus;
  id_type_id: number;
  id_number: string;
  sevispass_id: string;
  credit_score: number;
  member_since: string;
  phone_number: string | null;
  email: string;
  physical_address: string | null;
  employment_status: TEmploymentStatus;
  employer_name: string | null;
  monthly_income: number | null;
  village: string | null;
  province: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  deleted_by: number | null;
}

export interface Loan {
  id: number;
  borrower_id: number | null;
  loan_number: string | null;
  amount: number | null;
  interest_rate: number | null;
  term_months: number | null;
  purpose: string | null;
  applied_date: string | null;
  approved_date: string | null;
  disbursement_date: string | null;
  created_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  deleted_by: number | null;
}

export interface LoanApplication {
  id: number;
  userId: string;
  loan_id: number;
  loan_officer_id: number;
  loan_amount: number;
  application_date: string;
  term: TLoanTerm;
  borrower_id: number;
  borrower: Borrower;
  reviewed_by: number | null;
  review_date: string | null;
  review_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  deleted_by: number | null;
  reference: string;
  purpose: string;
  status: TLoanApplicationStatus;
  rejection_reason: string | null;
  submitted_at: string;
  decided_at: string | null;
  repayments: LoanRepayment[];
  existing_loans_json: string | null;
  disbursement_method: string | null;
  disbursement_details: string | null;
  declaration_language: string | null;
  declared_at: string | null;
}

// The Loan "product" (rate/term/amount bounds) a borrower applies against —
// distinct from `Loan` above, which models a disbursed/individual loan.
export interface LoanProduct {
  id: number;
  loan_name: string;
  loan_description: string | null;
  min_amount: number;
  max_amount: number;
  min_term: number;
  max_term: number;
  interest_rate: number;
}

export type LoanApplicationWithRelations = LoanApplication & {
  borrower: Borrower;
  loan: Loan;
  staff: Staff;
  status: LoanApplicationStatus;
  loanDocuments: LoanDocument[];
}

export interface LoanStatusType {
  id: number;
  status_name: string;
  status_code: string;
  status_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoanApplicationStatus {
  id: number;
  loan_application_id: number | null;
  loan_status_type_id: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LoanApplicationApproval {
  id: number;
  loan_application_id: number | null;
  loan_status_type_id: number | null;
  is_active: boolean;
  reviewed_by: number | null;
  review_date: Date | null;
  review_notes: string | null;
  is_reviewd: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoanRepayment {
  id: number;
  loan_id: number;
  loan_application_id: number;
  loan_application: LoanApplication;
  borrower_id: number;
  borrower: Borrower;
  due_date: string;
  next_due_date: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  deleted_by: number | null;

  loan_officer_id: number;
  loan_amount: number;
  application_date: string;
  reference: string;
  term: string;
  purpose: string;
  rejection_reason: string | null;
  submitted_at: string;
  decided_at: string | null;
  reviewed_by: number | null;
  review_date: string | null;
  review_notes: string | null;
  borrower_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  id_type_id: number;
  id_number: string;
  sevispass_id: string;
  credit_score: number;
  member_since: string;
  phone_number: number;
  email: string;
  physical_address: string;
  employment_status: string;
  employer_name: string;
  monthly_income: number;
}

export interface LoanDocument {
  id: number;
  loan_application_id: number;
  document_title: string;
  document_file_path: string;
  document_description: string;
  file_format: string;
  borrower_id: number;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  deleted_by: number;
}

export interface BorrowerAccount {
  id: number;
  account_name: string;
  account_balance: number;
  account_owner_id: number;
  account_type: string;
  date_opened: Date;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  status: TAccountStatus;
}

// export type Role = Selectable<Role>;
// export type NewRole = Insertable<Role>;
// export type RoleUpdate = Updateable<Role>;

// export type Permission = Selectable<Permission>;
// export type NewPermission = Insertable<Permission>;
// export type PermissionUpdate = Updateable<Permission>;

// export type RoleStaff = Selectable<RoleStaff>;
// export type NewRoleStaff = Insertable<RoleStaff>;
// export type RoleStaffUpdate = Updateable<RoleStaff>;

// export type PermissionRole = Selectable<PermissionRole>;
// export type NewPermissionRole = Insertable<PermissionRole>;
// export type PermissionRoleUpdate = Updateable<PermissionRole>;

export interface Role {
  id: number;
  name: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Permission {
  id: number;
  name: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

// Pivot tables
export interface RoleStaff {
  role_id: number;
  staff_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PermissionRole {
  permission_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Audit {
  id: number
  action: string
}

// Extended types with relations
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface StaffWithRoles {
  staff_id: number;
  roles: RoleWithPermissions[];
}

export interface PermissionCheck {
  hasRole: boolean;
  hasPermission: boolean;
  roles: string[];
  permissions: string[];
}

// export type Audit = Selectable<Audit>;
// export type NewAudit = Insertable<Audit>;
// export type AuditUpdate = Updateable<Audit>;

// export type Staff = Selectable<Staff>;
// export type NewStaff = Insertable<Staff>;
// export type StaffUpdate = Updateable<Staff>;

// export type Borrower = Selectable<Borrower>;
// export type NewBorrower = Insertable<Borrower>;
// export type BorrowerUpdate = Updateable<Borrower>;

// export type Loan = Selectable<Loan>;
// export type NewLoan = Insertable<Loan>;
// export type LoanUpdate = Updateable<Loan>;

// export type LoanApplication = Selectable<LoanApplication>;
// export type NewLoanApplication = Insertable<LoanApplication>;
// export type LoanApplicationUpdate = Updateable<LoanApplication>;

// export type LoanApplicationStatus = Selectable<LoanApplicationStatus>;
// export type NewLoanApplicationStatus = Insertable<LoanApplicationStatus>;
// export type LoanApplicationStatusUpdate = Updateable<LoanApplicationStatus>;

// export type LoanRepayment = Selectable<LoanRepayment>;
// export type NewLoanRepayment = Insertable<LoanRepayment>;
// export type LoanRepaymentUpdate = Updateable<LoanRepayment>;

// export type BorrowerAccount = Selectable<BorrowerAccount>;
// export type NewBorrowerAccount = Insertable<BorrowerAccount>;
// export type BorrowerAccountUpdate = Updateable<BorrowerAccount>;