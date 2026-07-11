import type { Selectable, Insertable, Updateable } from "kysely";
import type {
    AuditTable,
    AuthProviderTable,
    AuthTokenTable,
    BorrowerTable,
    LoanApplicationTable,
    LoanApplicationStatusTable,
    LoanTable,
    PermissionRoleTable,
    PermissionTable,
    RoleTable,
    RoleStaffTable,
    StaffTable,
    BorrowerAccountTable,
    MainAccountTable
} from "./database/schema.ts";

export type AuthProvider = Selectable<AuthProviderTable>;
export type NewAuthProvider = Insertable<AuthProviderTable>;
export type AuthProviderUpdate = Updateable<AuthProviderTable>;

export type AuthToken = Selectable<AuthTokenTable>;
export type NewAuthToken = Insertable<AuthTokenTable>;
export type AuthTokenUpdate = Updateable<AuthTokenTable>;

export type Staff = Selectable<StaffTable>;
export type NewStaff = Insertable<StaffTable>;
export type StaffUpdate = Updateable<StaffTable>;

export type Borrower = Selectable<BorrowerTable>;
export type NewBorrower = Insertable<BorrowerTable>;
export type BorrowerUpdate = Updateable<BorrowerTable>;

export type Loan = Selectable<LoanTable>;
export type NewLoan = Insertable<LoanTable>;
export type LoanUpdate = Updateable<LoanTable>;

export type LoanApplication = Selectable<LoanApplicationTable>;
export type NewLoanApplication = Insertable<LoanApplicationTable>;
export type LoanApplicationUpdate = Updateable<LoanApplicationTable>;

export type LoanApplicationStatus = Selectable<LoanApplicationStatusTable>;
export type NewLoanApplicationStatus = Insertable<LoanApplicationStatusTable>;
export type LoanApplicationStatusUpdate = Updateable<LoanApplicationStatusTable>;

export type Role = Selectable<RoleTable>;
export type NewRole = Insertable<RoleTable>;
export type RoleUpdate = Updateable<RoleTable>;

export type Permission = Selectable<PermissionTable>;
export type NewPermission = Insertable<PermissionTable>;
export type PermissionUpdate = Updateable<PermissionTable>;

export type RoleStaff = Selectable<RoleStaffTable>;
export type NewRoleStaff = Insertable<RoleStaffTable>;
export type RoleStaffUpdate = Updateable<RoleStaffTable>;

export type PermissionRole = Selectable<PermissionRoleTable>;
export type NewPermissionRole = Insertable<PermissionRoleTable>;
export type PermissionRoleUpdate = Updateable<PermissionRoleTable>;

export type Audit = Selectable<AuditTable>;
export type NewAudit = Insertable<AuditTable>;
export type AuditUpdate = Updateable<AuditTable>;

export type BorrowerAccount = Selectable<BorrowerAccountTable>;
export type NewBorrowerAccount = Insertable<BorrowerAccountTable>;
export type BorrowerAccountUpdate = Updateable<BorrowerAccountTable>;

export type MainAccount = Selectable<MainAccountTable>;
export type NewMainAccount = Insertable<MainAccountTable>;
export type MainAccountUpdate = Updateable<MainAccountTable>;
