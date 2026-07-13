import { db } from '../database/index.js';

export async function findBorrowerBySevisPassId(sevispassId: string) {
    return await db.selectFrom('borrowers')
        .where('sevispass_id', '=', sevispassId)
        .selectAll()
        .executeTakeFirst();
}

export async function createLoanApplication(borrowerId: number, input: {
    amount: number;
    term: string;
    purpose: string;
}) {
    const { count } = await db
        .selectFrom('loan_applications')
        .select(({ fn }) => fn.count<number>('id').as('count'))
        .executeTakeFirstOrThrow();

    const reference = `MIJ-${new Date().getFullYear()}-${String(Number(count) + 1).padStart(3, '0')}`;

    return await db.insertInto('loan_applications')
        .values({
            reference,
            borrower_id: borrowerId,
            amount: input.amount,
            term: input.term,
            purpose: input.purpose,
            status: 'pending',
        })
        .returningAll()
        .executeTakeFirstOrThrow();
}

export async function getBorrowerLoanApplications(borrowerId: number) {
    return await db.selectFrom('loan_applications')
        .where('borrower_id', '=', borrowerId)
        .selectAll()
        .orderBy('submitted_at', 'desc')
        .execute();
}

export async function getLoanRepayments(loanApplicationId: number) {
    return await db.selectFrom('repayments')
        .where('loan_application_id', '=', loanApplicationId)
        .selectAll()
        .orderBy('due_date', 'asc')
        .execute();
}
