import type {
    ColumnType,
    Generated,
    JSONColumnType,
} from 'kysely';

export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type DateTime = string;
export type Decimal = ColumnType<number, number | string, number | string>;

export interface Database {
    Role: RoleTable;
    Permission: PermissionTable;
    RoleStaff: RoleStaffTable;
    PermissionRole: PermissionRoleTable;
    Staff: StaffTable;
    Borrower: BorrowerTable;
    Loan: LoanTable;
    LoanApplication: LoanApplicationTable;
    LoanApplicationStatus: LoanApplicationStatusTable;
    LoanStatusType: LoanStatusTypeTable;
    LoanDocument: LoanDocumentTable;
    LoanRepayment: LoanRepaymentTable;
    LoanApplicationApproval: LoanApplicationApprovalTable;
    BorrowerAccount: BorrowerAccountTable;
    MainAccount: MainAccountTable;
}

export interface StaffTable {
    id: Generated<number>;
    staff_number: string | null;
    first_name: string
    last_name: string | null
    gender: 'male' | 'female' | 'other' | null
    phone_number: number | null;
    email: string | null;
    password: string;
    // marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
    // address: { city: string } | null
    // age: number | null
    // birthdate: ColumnType<Date | null, string | null | undefined, string | null>
    // experience: { role: string }[] | null
    // has_pets: Generated<'Y' | 'N'>
    // middle_name: string | null
    // nicknames: string[] | null
    // nullable_column: string | null
    // profile: {
    //     addresses: { city: string }[]
    //     website: { url: string }
    // } | null
    // updated_at: ColumnType<Date | null, string | null | undefined, string | null>
    // // created_at: ColumnType<Date, string | undefined, never>
    // created_at: GeneratedAlways<Date>
    // deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
    metadata: JSONColumnType<{
        login_at: string
        ip: string | null
        agent: string | null
        plan: 'free' | 'premium'
    }> | null
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface BorrowerTable {
    id: Generated<number>;
    borrower_number: string | null;
    first_name: string | null;
    last_name: string | null;
    date_of_birth: ColumnType<Date, Date | string, Date | string> | null;
    id_type_id: number | null;
    id_number: string | null;
    sevispass_id: string;
    credit_score: Generated<number>;
    member_since: string;
    phone_number: number | null;
    email: string | null;
    physical_address: string | null;
    employment_status: string | null;
    employer: string | null;
    monthly_income: Decimal | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface LoanTable {
    id: Generated<number>;
    borrower_id: number | null;
    loan_number: string | null;
    amount: Decimal | null;
    interest_rate: Decimal | null;
    term_months: number | null;
    purpose: string | null;
    applied_date: ColumnType<Date, Date | string, Date | string> | null;
    approved_date: ColumnType<Date, Date | string, Date | string> | null;
    disbursement_date: ColumnType<Date, Date | string, Date | string> | null;
    created_by: number | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface LoanApplicationTable {
    id: Generated<number>;
    loan_id: number;
    loan_officer_id: number;
    loan_amount: number;
    loan_application_status_id: number;
    application_date: ColumnType<Date, Date | string, Date | string>;
    borrower_id: number;
    reviewed_by: number | null;
    review_date: ColumnType<Date, Date | string, Date | string> | null;
    review_notes: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
    reference: string;
    amount: number;
    term: string;
    purpose: string;
    status: Generated<'pending' | 'approved' | 'rejected' | 'under_review'>;
    rejection_reason: string | null;
    submitted_at: Generated<DateTime>;
    decided_at: DateTime | null;
}

export interface LoanStatusTypeTable {
    id: Generated<number>;
    status_name: string;
    status_code: string;
    status_description: string | null;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface LoanApplicationStatusTable {
    id: Generated<number>;
    loan_application_id: number | null;
    loan_status_type_id: number | null;
    is_active: boolean | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
}

export interface LoanApplicationApprovalTable {
    id: Generated<number>;
    loan_application_id: number | null;
    loan_status_type_id: number | null;
    is_active: boolean;
    reviewed_by: number;
    review_date: Date;
    review_notes: string;
    is_reviewd: boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface LoanRepaymentTable {
    id: Generated<number>;
    loan_application_id: number;
    due_date: Timestamp;
    amount: number;
    status: Generated<string>;
    // status: Generated<'pending' | 'paid' | 'overdue' | 'partially_paid'>;
    paid_at: Timestamp | null;
    // paid_at: DateTime | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface LoanDocumentTable {
    id: Generated<number>;
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

export interface RoleTable {
    id: Generated<number>;
    name: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
}

export interface PermissionTable {
    id: Generated<number>;
    name: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
}

// Pivot tables
export interface RoleStaffTable {
    role_id: number;
    staff_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

export interface PermissionRoleTable {
    permission_id: number;
    role_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
}

// Combined Database
export interface Database {
    Role: RoleTable;
    Permission: PermissionTable;
    RoleStaff: RoleStaffTable;
    PermissionRole: PermissionRoleTable;
}

export interface AuditTable {
    id: Generated<number>
    action: string
}

export interface BorrowerAccountTable {
    id: Generated<number>;
    account_name: string;
    account_balance: number;
    account_owner_id: number;
    date_opened: Date;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
}
export interface MainAccountTable {
    id: Generated<number>;
    account_name: string;
    account_balance: number;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
}
