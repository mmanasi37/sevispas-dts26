import type { Selectable, Insertable, Updateable } from "kysely";
import type {
    AuditTable,
    PermissionRoleTable,
    PermissionTable,
    RoleTable,
    RoleStaffTable,
    StaffTable,
    BorrowerTable,
    BorrowerAccountTable,
    MainAccountTable,
    LoanApplicationTable,
    LoanApplicationStatusTable,
    LoanTable,
    LoanRepaymentTable
} from "./schema.ts";

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

export type Audit = Selectable<AuditTable>;
export type NewAudit = Insertable<AuditTable>;
export type AuditUpdate = Updateable<AuditTable>;

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

export type LoanRepayment = Selectable<LoanRepaymentTable>;
export type NewLoanRepayment = Insertable<LoanRepaymentTable>;
export type LoanRepaymentUpdate = Updateable<LoanRepaymentTable>;

export type BorrowerAccount = Selectable<BorrowerAccountTable>;
export type NewBorrowerAccount = Insertable<BorrowerAccountTable>;
export type BorrowerAccountUpdate = Updateable<BorrowerAccountTable>;

export type MainAccount = Selectable<MainAccountTable>;
export type NewMainAccount = Insertable<MainAccountTable>;
export type MainAccountUpdate = Updateable<MainAccountTable>;
