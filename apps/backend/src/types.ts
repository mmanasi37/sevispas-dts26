import { Selectable, Insertable, Updateable } from "kysely";
import { UserTable, PetTable, AuditTable, AuthProviderTable, AuthTokenTable, BorrowerTable, LoanApplicationTable, LoanBorrowerTable, LoanHistoryTable, LoanStatusTable, LoanTable, PermissionRoleTable, PermissionTable, RoleTable, RoleUserTable, StaffTable } from "./database/schema.js";

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

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

export type LoanStatus = Selectable<LoanStatusTable>;
export type NewLoanStatus = Insertable<LoanStatusTable>;
export type LoanStatusUpdate = Updateable<LoanStatusTable>;

export type LoanHistory = Selectable<LoanHistoryTable>;
export type NewLoanHistory = Insertable<LoanHistoryTable>;
export type LoanHistoryUpdate = Updateable<LoanHistoryTable>;

export type LoanBorrower = Selectable<LoanBorrowerTable>;
export type NewLoanBorrower = Insertable<LoanBorrowerTable>;
export type LoanBorrowerUpdate = Updateable<LoanBorrowerTable>;

export type Role = Selectable<RoleTable>;
export type NewRole = Insertable<RoleTable>;
export type RoleUpdate = Updateable<RoleTable>;

export type Permission = Selectable<PermissionTable>;
export type NewPermission = Insertable<PermissionTable>;
export type PermissionUpdate = Updateable<PermissionTable>;

export type RoleUser = Selectable<RoleUserTable>;
export type NewRoleUser = Insertable<RoleUserTable>;
export type RoleUserUpdate = Updateable<RoleUserTable>;

export type PermissionRole = Selectable<PermissionRoleTable>;
export type NewPermissionRole = Insertable<PermissionRoleTable>;
export type PermissionRoleUpdate = Updateable<PermissionRoleTable>;

export type Audit = Selectable<AuditTable>;
export type NewAudit = Insertable<AuditTable>;
export type AuditUpdate = Updateable<AuditTable>;

export type Pet = Selectable<PetTable>;
export type NewPet = Insertable<PetTable>;
export type PetUpdate = Updateable<PetTable>;
