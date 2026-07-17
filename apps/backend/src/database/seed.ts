import { db } from './index.ts';

async function main() {
    // await db.deleteFrom('Loan').execute();
    // await db.deleteFrom('LoanApplication').execute();
    // await db.deleteFrom('LoanApplicationApproval').execute();
    // await db.deleteFrom('LoanApplicationStatus').execute();
    // await db.deleteFrom('LoanStatusType').execute();
    // await db.deleteFrom('LoanRepayment').execute();
    // await db.deleteFrom('LoanDocument').execute();
    // await db.deleteFrom('BorrowerAccount').execute();
    // await db.deleteFrom('Borrower').execute();
    // await db.deleteFrom('Staff').execute();

    // loan_officer_id: 1 / loan_id: 1 are hardcoded in createLoanApplication, so at
    // least one Staff and one Loan row must exist or every submission 500s on the FK.
    // StaffTable in schema.ts still declares email/password/gender/phone_number, which
    // don't exist on the live table (pre-existing drift, staff auth is separately broken) —
    // cast past it here rather than touching auth.controller.ts's staff login.
    const staff = await db.insertInto('Staff').values({
        staff_number: 'STAFF-2024-001',
        first_name: 'John',
        last_name: 'Doe',
    } as any).returningAll().executeTakeFirstOrThrow();

    const loan = await db.insertInto('Loan').values({
        loan_name: 'MIJOE Personal Loan',
        loan_description: 'General-purpose microfinance loan for MIJOE borrowers',
        max_amount: 20000,
        min_amount: 500,
        max_term: 10,
        min_term: 1,
        interest_rate: 15,
        created_by: staff.id,
    }).returningAll().executeTakeFirstOrThrow();

    const borrower = await db.insertInto('Borrower').values({
        sevispass_id: 'SP-2024-001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        // gender: 'female',
        date_of_birth: '1990-01-01',
        id_type_id: 1,
        id_number: '123456789',
        credit_score: 720,
        member_since: '2023-06-01',
        borrower_number: 'BORROWER-2024-001',
    }).returningAll().executeTakeFirstOrThrow();

    // const activeLoan = await db.insertInto('LoanApplication').values({
    //     reference: 'MIJ-2024-001',
    //     borrower_id: borrower.id,
    //     loan_amount: 5000,
    //     term: 'short',
    //     purpose: 'business',
    //     status: 'approved',
    //     submitted_at: '2024-01-15T10:30:00Z',
    //     decided_at: '2024-01-16T09:00:00Z',
    //     loan_id: 1,
    //     loan_officer_id: staff.id,
    //     application_date: '2024-01-15T10:30:00Z',
    // }).returningAll().executeTakeFirstOrThrow();

    // const pastLoan1 = await db.insertInto('LoanApplication').values({
    //     reference: 'MIJ-2023-014',
    //     borrower_id: borrower.id,
    //     loan_amount: 2000,
    //     term: 'short',
    //     purpose: 'business',
    //     status: 'approved',
    //     submitted_at: '2023-10-01T09:00:00Z',
    //     decided_at: '2023-10-02T09:00:00Z',
    //     loan_id: 1,
    //     loan_officer_id: staff.id,
    //     application_date: '2023-10-01T09:00:00Z',
    // }).returningAll().executeTakeFirstOrThrow();

    // const pastLoan2 = await db.insertInto('LoanApplication').values({
    //     reference: 'MIJ-2023-007',
    //     borrower_id: borrower.id,
    //     loan_amount: 1500,
    //     term: 'short',
    //     purpose: 'business',
    //     status: 'approved',
    //     submitted_at: '2023-06-01T09:00:00Z',
    //     decided_at: '2023-06-02T09:00:00Z',
    //     loan_id: 1,
    //     loan_officer_id: staff.id,
    //     application_date: '2023-06-01T09:00:00Z',
    // }).returningAll().executeTakeFirstOrThrow();

    // const activeLoanSchedule: Array<{ due_date: string; status: string; paid_at: string | null }> = [
    //     { due_date: '2024-01-30', status: 'paid', paid_at: '2024-01-30' },
    //     { due_date: '2024-02-13', status: 'paid', paid_at: '2024-02-13' },
    //     { due_date: '2024-02-27', status: 'pending', paid_at: null },
    //     { due_date: '2024-03-12', status: 'pending', paid_at: null },
    //     { due_date: '2024-03-26', status: 'pending', paid_at: null },
    //     { due_date: '2024-04-09', status: 'pending', paid_at: null },
    //     { due_date: '2024-04-23', status: 'pending', paid_at: null },
    //     { due_date: '2024-05-07', status: 'pending', paid_at: null },
    //     { due_date: '2024-05-21', status: 'pending', paid_at: null },
    //     { due_date: '2024-06-04', status: 'pending', paid_at: null },
    // ];
    // for (const r of activeLoanSchedule) {
    //     await db.insertInto('LoanRepayment').values({
    //         // loan_application_id: activeLoan.id,
    //         loan_application_id: 1,
    //         due_date: r.due_date,
    //         amount: 500,
    //         status: r.status,
    //         paid_at: r.paid_at,
    //     }).execute();
    // }

    // const pastLoan1Schedule = ['2023-10-15', '2023-10-29', '2023-11-12', '2023-11-26'];
    // for (const due_date of pastLoan1Schedule) {
    //     await db.insertInto('LoanRepayment').values({
    //         // loan_application_id: pastLoan1.id,
    //         loan_application_id: 2,
    //         due_date,
    //         amount: 500,
    //         status: 'paid',
    //         paid_at: due_date,
    //     }).execute();
    // }

    // const pastLoan2Schedule = ['2023-06-15', '2023-06-29', '2023-07-13'];
    // for (const due_date of pastLoan2Schedule) {
    //     await db.insertInto('LoanRepayment').values({
    //         // loan_application_id: pastLoan2.id,
    //         loan_application_id: 3,
    //         due_date,
    //         amount: 500,
    //         status: 'paid',
    //         paid_at: due_date,
    //     }).execute();
    // }

    // console.log('Seed complete:', {
    //     // borrower: borrower.sevispass_id,
    //     // loans: [activeLoan.reference, pastLoan1.reference, pastLoan2.reference],
    //     borrower: await db.selectFrom('Borrower').selectAll().execute(),
    //     loans: await db.selectFrom('Loan').selectAll().execute(),
    //     loanApplications: await db.selectFrom('LoanApplication').selectAll().execute(),
    //     loanRepayments: await db.selectFrom('LoanRepayment').selectAll().execute(),
    // });
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
