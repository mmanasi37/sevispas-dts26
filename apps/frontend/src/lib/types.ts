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

export type TMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | null;
export type TEmploymentStatus = 'employed' | 'unemployed' | 'self-employed' | 'retired' | null;
export type TRepaymentStatus = ERepaymentStatus;
export type TLoanApplicationStatus = ELoanApplicationStatus;
export type TLoanTerm = ELoanTerm;
export type TAccountStatus = EBorrowerStatus;

export interface UserSession {
  username: string;
  password: string;
  cookieName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  sevispassId: string;
  verified: boolean;
}

export interface NewLoanApplicationInput {
  amount: number;
  term: string;
  purpose: string;
}

export interface BorrowerDashboard {
  borrower: Borrower;
  loans: LoanApplication[];
  repayments: LoanRepayment[];
}

export type Timestamp = Date | string | number;
export type DateTime = string | number;
export type Decimal = number;

export interface Staff {
  id: number;
  staff_number: string | null;
  first_name: string;
  last_name: string | null;
  gender: 'male' | 'female' | 'other' | null;
  phone_number: number | null;
  email: string | null;
  password: string;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
  deleted_by: number | null;
}

export interface Borrower {
  id: number;
  borrower_number: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: Timestamp | null;
  marital_status: TMaritalStatus;
  id_type_id: number | null;
  id_number: string | null;
  sevispass_id: string;
  credit_score: number;
  member_since: string;
  phone_number: number | null;
  email: string | null;
  physical_address: string | null;
  employment_status: TEmploymentStatus;
  employer: string | null;
  monthly_income: Decimal | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
  deleted_by: number | null;
  memberSince: string;
  creditScore: number;
  totalBorrowed: number;
  repaymentRate: number;
}

export interface Loan {
  id: number;
  borrower_id: number | null;
  loan_number: string | null;
  amount: Decimal | null;
  interest_rate: Decimal | null;
  term_months: number | null;
  purpose: string | null;
  applied_date: Timestamp | null;
  approved_date: Timestamp | null;
  disbursement_date: Timestamp | null;
  created_by: number | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
  deleted_by: number | null;
}

export interface LoanApplication {
  id: number;
  userId: string;
  loan_id: number;
  loan_officer_id: number;
  loan_amount: number;
  application_date: Timestamp;
  term: string;
  borrower_id: number;
  reviewed_by: number | null;
  review_date: Timestamp | null;
  review_notes: string | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
  deleted_by: number | null;
  reference: string;
  purpose: string;
  status: LoanApplicationStatus;
  rejection_reason: string | null;
  submitted_at: DateTime;
  decided_at: DateTime | null;
  repayments: LoanRepayment[];
}

export interface LoanStatusType {
  id: number;
  status_name: string;
  status_code: string;
  status_description: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface LoanApplicationStatus {
  id: number;
  loan_application_id: number | null;
  loan_status_type_id: number | null;
  is_active: boolean | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
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
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface LoanRepayment {
  id: number;
  loan_application_id: number;
  due_date: Timestamp;
  next_due_date: Timestamp;
  amount: number;
  status: string;
  paid_at: Timestamp | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
  deleted_by: number | null;
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
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp;
  deleted_by: number;
}

export interface BorrowerAccount {
  id: number;
  account_name: string;
  account_balance: number;
  account_owner_id: number;
  account_type: string;
  date_opened: Date;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
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
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
}

export interface Permission {
  id: number;
  name: string | null;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  deleted_at: Timestamp | null;
}

// Pivot tables
export interface RoleStaff {
  role_id: number;
  staff_id: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
}

export interface PermissionRole {
  permission_id: number;
  role_id: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
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