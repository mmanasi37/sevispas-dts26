import {
    ColumnType,
    Generated,
    GeneratedAlways,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    person: PersonTable
    pet: PetTable
    audit: AuditTable
    borrowers: BorrowerTable
    loan_applications: LoanApplicationTable
    repayments: RepaymentTable
    // toy: ToyTable
    // wine: WineTable
    // wine_stock_change: WineStockChangeTable
}

export interface BorrowerTable {
    id: Generated<number>
    sevispass_id: string
    first_name: string
    last_name: string
    email: string | null
    credit_score: number
    member_since: string
    created_at: Generated<string>
}

export type Borrower = Selectable<BorrowerTable>
export type NewBorrower = Insertable<BorrowerTable>
export type BorrowerUpdate = Updateable<BorrowerTable>

export interface LoanApplicationTable {
    id: Generated<number>
    reference: string
    borrower_id: number
    amount: number
    term: string
    purpose: string
    status: string
    rejection_reason: string | null
    submitted_at: Generated<string>
    decided_at: string | null
}

export type LoanApplication = Selectable<LoanApplicationTable>
export type NewLoanApplication = Insertable<LoanApplicationTable>
export type LoanApplicationUpdate = Updateable<LoanApplicationTable>

export interface RepaymentTable {
    id: Generated<number>
    loan_application_id: number
    due_date: string
    amount: number
    status: string
    paid_at: string | null
}

export type Repayment = Selectable<RepaymentTable>
export type NewRepayment = Insertable<RepaymentTable>
export type RepaymentUpdate = Updateable<RepaymentTable>

interface AuditTable {
    id: Generated<number>
    action: string
}

export interface PersonTable {
    id: Generated<number>
    first_name: string
    last_name: string | null
    gender: 'male' | 'female' | 'other' | null
    metadata: JSONColumnType<{
        login_at: string
        ip: string | null
        agent: string | null
        plan: 'free' | 'premium'
    }> | null
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
    // marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>

export interface PetTable {
    id: Generated<number>
    name: string
    owner_id: number
    species: 'dog' | 'cat'
}

export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>

