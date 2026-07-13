import '../env.js';
import { db } from './index.js';

async function main() {
    await db.deleteFrom('repayments').execute();
    await db.deleteFrom('loan_applications').execute();
    await db.deleteFrom('borrowers').execute();

    const borrower = await db.insertInto('borrowers').values({
        sevispass_id: 'SP-2024-001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        credit_score: 720,
        member_since: '2023-06-01',
    }).returningAll().executeTakeFirstOrThrow();

    const activeLoan = await db.insertInto('loan_applications').values({
        reference: 'MIJ-2024-001',
        borrower_id: borrower.id,
        amount: 5000,
        term: 'short',
        purpose: 'business',
        status: 'approved',
        submitted_at: '2024-01-15T10:30:00Z',
        decided_at: '2024-01-16T09:00:00Z',
    }).returningAll().executeTakeFirstOrThrow();

    const pastLoan1 = await db.insertInto('loan_applications').values({
        reference: 'MIJ-2023-014',
        borrower_id: borrower.id,
        amount: 2000,
        term: 'short',
        purpose: 'business',
        status: 'approved',
        submitted_at: '2023-10-01T09:00:00Z',
        decided_at: '2023-10-02T09:00:00Z',
    }).returningAll().executeTakeFirstOrThrow();

    const pastLoan2 = await db.insertInto('loan_applications').values({
        reference: 'MIJ-2023-007',
        borrower_id: borrower.id,
        amount: 1500,
        term: 'short',
        purpose: 'business',
        status: 'approved',
        submitted_at: '2023-06-01T09:00:00Z',
        decided_at: '2023-06-02T09:00:00Z',
    }).returningAll().executeTakeFirstOrThrow();

    const activeLoanSchedule: Array<{ due_date: string; status: string; paid_at: string | null }> = [
        { due_date: '2024-01-30', status: 'paid', paid_at: '2024-01-30' },
        { due_date: '2024-02-13', status: 'paid', paid_at: '2024-02-13' },
        { due_date: '2024-02-27', status: 'pending', paid_at: null },
        { due_date: '2024-03-12', status: 'pending', paid_at: null },
        { due_date: '2024-03-26', status: 'pending', paid_at: null },
        { due_date: '2024-04-09', status: 'pending', paid_at: null },
        { due_date: '2024-04-23', status: 'pending', paid_at: null },
        { due_date: '2024-05-07', status: 'pending', paid_at: null },
        { due_date: '2024-05-21', status: 'pending', paid_at: null },
        { due_date: '2024-06-04', status: 'pending', paid_at: null },
    ];
    for (const r of activeLoanSchedule) {
        await db.insertInto('repayments').values({
            loan_application_id: activeLoan.id,
            due_date: r.due_date,
            amount: 500,
            status: r.status,
            paid_at: r.paid_at,
        }).execute();
    }

    const pastLoan1Schedule = ['2023-10-15', '2023-10-29', '2023-11-12', '2023-11-26'];
    for (const due_date of pastLoan1Schedule) {
        await db.insertInto('repayments').values({
            loan_application_id: pastLoan1.id,
            due_date,
            amount: 500,
            status: 'paid',
            paid_at: due_date,
        }).execute();
    }

    const pastLoan2Schedule = ['2023-06-15', '2023-06-29', '2023-07-13'];
    for (const due_date of pastLoan2Schedule) {
        await db.insertInto('repayments').values({
            loan_application_id: pastLoan2.id,
            due_date,
            amount: 500,
            status: 'paid',
            paid_at: due_date,
        }).execute();
    }

    console.log('Seed complete:', {
        borrower: borrower.sevispass_id,
        loans: [activeLoan.reference, pastLoan1.reference, pastLoan2.reference],
    });
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
