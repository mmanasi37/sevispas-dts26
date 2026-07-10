import type {
    ColumnType,
    Generated,
    JSONColumnType,
} from 'kysely';

// export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
//     ? ColumnType<S, I | undefined, U>
//     : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Decimal = ColumnType<number, number | string, number | string>;

export interface Database {
    User: UserTable;
    AuthProvider: AuthProviderTable;
    AuthToken: AuthTokenTable;
    Staff: StaffTable;
    Borrower: BorrowerTable;
    Loan: LoanTable;
    LoanApplication: LoanApplicationTable;
    LoanStatus: LoanStatusTable;
    LoanHistory: LoanHistoryTable;
    LoanBorrower: LoanBorrowerTable;
    Role: RoleTable;
    Permission: PermissionTable;
    RoleUser: RoleUserTable;
    PermissionRole: PermissionRoleTable;
}

export interface UserTable {
    id: Generated<number>;
    first_name: string
    last_name: string | null
    gender: 'male' | 'female' | 'other' | null
    phone_number: number | null;
    email: string | null;
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

export interface AuthProviderTable {
    id: Generated<number>;
    phone_number: number | null;
    email: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface AuthTokenTable {
    id: Generated<number>;
    user_id: number | null;
    auth_provider_id: number | null;
    token: string | null;
    token_type: string | null;
    expires_at: Timestamp | null;
    is_revoked: boolean | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface StaffTable {
    id: Generated<number>;
    user_id: number | null;
    staff_number: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    department: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface BorrowerTable {
    id: Generated<number>;
    user_id: number | null;
    borrower_number: string | null;
    first_name: string | null;
    last_name: string | null;
    date_of_birth: ColumnType<Date, Date | string, Date | string> | null;
    national_id: string | null;
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
    loan_id: number | null;
    borrower_id: number | null;
    application_date: ColumnType<Date, Date | string, Date | string> | null;
    application_status: string | null;
    reviewed_by: number | null;
    review_date: ColumnType<Date, Date | string, Date | string> | null;
    review_notes: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface LoanStatusTable {
    id: Generated<number>;
    loan_id: number | null;
    status_code: string | null;
    status_name: string | null;
    status_description: string | null;
    is_active: boolean | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface LoanHistoryTable {
    id: Generated<number>;
    loan_id: number | null;
    status_id: number | null;
    changed_by: number | null;
    old_status: string | null;
    new_status: string | null;
    change_date: Timestamp | null;
    change_notes: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
}

export interface LoanBorrowerTable {
    id: Generated<number>;
    loan_id: number | null;
    borrower_id: number | null;
    is_primary: boolean | null;
    relationship_type: string | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
    deleted_by: number | null;
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

export interface RoleUserTable {
    permission_id: number | null;
    user_id: number | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
}

export interface PermissionRoleTable {
    permission_id: number | null;
    role_id: number | null;
    created_at: Timestamp | null;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
}

export interface AuditTable {
    id: Generated<number>
    action: string
}

export interface PetTable {
    id: Generated<number>
    name: string
    owner_id: number
    species: 'dog' | 'cat'
}
